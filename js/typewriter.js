/* 面板正文逐字显现（打字机效果）：文字类区块（标题/段落/列表）逐字打出，
   数据卡片/标签/插图/视频/相册等结构化区块直接淡入。点击正文任意处可跳过当前动画。
   遵循 prefers-reduced-motion：直接秒显，不做动画。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var SPEED_MS = 14;
  var PAUSE_MS = 120; // 非文字区块之间的停顿，保持整体节奏一致
  var TEXT_TAGS = { H4: 1, P: 1, UL: 1, OL: 1 };

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue) nodes.push(n);
    }
    return nodes;
  }

  // 逐字打出一个文字区块，返回 { promise, skip }
  function typeBlock(el) {
    el.classList.remove('reveal-pending');
    var textNodes = getTextNodes(el);
    var full = textNodes.map(function (n) { return n.nodeValue; });
    textNodes.forEach(function (n) { n.nodeValue = ''; });
    el.classList.add('is-typing');

    var resolveFn, timer, done = false;
    var promise = new Promise(function (resolve) { resolveFn = resolve; });

    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      textNodes.forEach(function (n, i) { n.nodeValue = full[i]; });
      el.classList.remove('is-typing');
      resolveFn();
    }

    if (reducedMotion()) { finish(); return { promise: promise, skip: finish }; }

    var ni = 0, ci = 0;
    (function tick() {
      if (ni >= textNodes.length) { finish(); return; }
      var s = full[ni];
      if (ci >= s.length) { ni++; ci = 0; tick(); return; }
      textNodes[ni].nodeValue += s[ci];
      ci++;
      timer = setTimeout(tick, SPEED_MS);
    })();

    return { promise: promise, skip: finish };
  }

  // 非文字区块：内容已完整，只是摘掉"待显现"样式，做个短暂停顿
  function passBlock(el) {
    el.classList.remove('reveal-pending');
    var resolveFn, timer, done = false;
    var promise = new Promise(function (resolve) { resolveFn = resolve; });
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolveFn();
    }
    if (reducedMotion()) { finish(); return { promise: promise, skip: finish }; }
    timer = setTimeout(finish, PAUSE_MS);
    return { promise: promise, skip: finish };
  }

  // 依次显现一组已插入 DOM、内容完整的区块元素；返回 { skip() } 立即补全剩余全部内容
  function reveal(blockEls) {
    var activeSkip = null;
    var stopped = false;

    function run(i) {
      if (stopped || i >= blockEls.length) return;
      var el = blockEls[i];
      var handle = TEXT_TAGS[el.tagName] ? typeBlock(el) : passBlock(el);
      activeSkip = handle.skip;
      handle.promise.then(function () {
        activeSkip = null;
        run(i + 1);
      });
    }
    run(0);

    return {
      skip: function () {
        stopped = true;
        if (activeSkip) activeSkip();
        blockEls.forEach(function (el) { el.classList.remove('reveal-pending'); });
      }
    };
  }

  PixelResume.typewriter = { reveal: reveal, typeText: typeBlock };
})();
