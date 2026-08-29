/* 弹窗生命周期：打开/关闭/tab 切换/焦点管理/#hash 深链 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var overlay, panelEl, titleEl, closeBtn, tabsEl, bodyEl;
  var currentSection = null;
  var currentTabIndex = 0;
  var lastFocusedEl = null;
  var currentReveal = null;

  function init() {
    overlay = document.getElementById('overlay');
    panelEl = document.getElementById('panel');
    titleEl = document.getElementById('panelTitle');
    closeBtn = document.getElementById('panelClose');
    tabsEl = document.getElementById('panelTabs');
    bodyEl = document.getElementById('panelBody');

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    // 点击正文任意处，跳过还没打完的逐字动画
    bodyEl.addEventListener('click', function () {
      if (currentReveal) currentReveal.skip();
    });
    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapTab(e);
    });
  }

  function trapTab(e) {
    var focusable = panelEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function findSection(id) {
    return window.RESUME_DATA.sections.find(function (s) { return s.id === id; });
  }

  function renderTabs(section) {
    tabsEl.innerHTML = '';
    if (section.tabs.length <= 1) {
      tabsEl.hidden = true;
      return;
    }
    tabsEl.hidden = false;
    tabsEl.setAttribute('role', 'tablist');
    section.tabs.forEach(function (tab, i) {
      var btn = document.createElement('button');
      btn.className = 'tab-btn';
      btn.textContent = tab.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === currentTabIndex ? 'true' : 'false');
      btn.tabIndex = i === currentTabIndex ? 0 : -1;
      btn.addEventListener('click', function () {
        PixelResume.sound.play('click');
        selectTab(i);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var next = e.key === 'ArrowRight'
            ? (i + 1) % section.tabs.length
            : (i - 1 + section.tabs.length) % section.tabs.length;
          selectTab(next);
          tabsEl.children[next].focus();
        }
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderBody(section) {
    if (currentReveal) { currentReveal.skip(); currentReveal = null; }
    bodyEl.innerHTML = '';
    bodyEl.scrollTop = 0;
    if (section.isContact) {
      bodyEl.appendChild(PixelResume.contact.renderPanel());
      return;
    }
    var tab = section.tabs[currentTabIndex];
    var frag = PixelResume.render.renderBlocks(tab.blocks);
    var blockEls = Array.prototype.slice.call(frag.children);
    blockEls.forEach(function (el) { el.classList.add('reveal-pending'); });
    bodyEl.appendChild(frag);
    currentReveal = PixelResume.typewriter.reveal(blockEls);
  }

  function selectTab(index) {
    currentTabIndex = index;
    Array.prototype.forEach.call(tabsEl.children, function (btn, i) {
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
      btn.tabIndex = i === index ? 0 : -1;
    });
    renderBody(currentSection);
    updateHash();
  }

  function updateHash() {
    history.replaceState(null, '', '#' + currentSection.id + '/' + currentTabIndex);
  }

  function open(sectionId, tabIndex, triggerEl) {
    var section = findSection(sectionId);
    if (!section) return;
    currentSection = section;
    currentTabIndex = tabIndex || 0;
    lastFocusedEl = triggerEl || document.activeElement;

    if (window.PixelResume.greeting) PixelResume.greeting.hide();
    PixelResume.sound.play('open');
    titleEl.textContent = section.title;
    panelEl.classList.toggle('is-computer', section.id === 'career');
    renderTabs(section);
    renderBody(section);
    updateHash();

    overlay.hidden = false;
    document.body.classList.add('panel-open');
    // 先让浏览器画一帧"初始态"（缩小+透明），下一帧再加 is-open 触发过渡，
    // 不然 hidden 刚摘掉和加 class 同一帧完成，浏览器会直接跳过渡，没有弹出动画
    void overlay.offsetWidth;
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });
    closeBtn.focus();

    if (window.PixelResume.room) window.PixelResume.room.markVisited(sectionId);
  }

  function close() {
    if (overlay.hidden) return;
    if (currentReveal) { currentReveal.skip(); currentReveal = null; }
    PixelResume.sound.play('close');
    overlay.classList.remove('is-open');
    document.body.classList.remove('panel-open');
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();

    var finish = function () {
      overlay.hidden = true;
      overlay.removeEventListener('transitionend', finish);
      if (window.PixelResume.room) window.PixelResume.room.celebrateIfPending();
    };
    overlay.addEventListener('transitionend', finish);
    setTimeout(finish, 260); // 兜底：万一 transitionend 没触发（比如动画被打断）
  }

  PixelResume.panel = { init: init, open: open, close: close };
})();
