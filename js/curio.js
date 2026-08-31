/* 桌角好物：纯装饰彩蛋，跟"已探索 X/8"的简历板块完全无关。
   目的是填一填大屏幕下房间以外空出来的那一大截，不承载任何简历数据——
   除了拍立得会去读 photocards / cosplay 板块已有的相册文件名，其它 7 个都是纯彩蛋。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var RADIO_LINES = [
    '这个频道在放……电子木鱼？',
    '换台，换台，找找有没有好听的',
    '刚好切到一首挺喜欢的',
    '信号不太好，但氛围到位'
  ];
  var BOOK_LINES = [
    '书签停在第 34 页，停了两周了',
    '买书如山倒，看书如抽丝',
    '封面好看的书，购买欲 +100',
    '翻了两页，眼皮开始打架'
  ];
  var NOTE_LINES = [
    '灵感这种东西，不记下来分分钟就没了',
    '写的时候觉得是金句，隔天看是废话',
    '贴满了才有安全感',
    '一半是待办，一半是突然冒出来的想法'
  ];

  function mugText(n) {
    if (n <= 1) return '第 ' + n + ' 杯美式，续命开始';
    if (n < 5) return '已经第 ' + n + ' 杯了，效率同步在线';
    return '第 ' + n + ' 杯，心率略快，但状态很好';
  }
  function succulentText(n) {
    if (n <= 1) return '浇水 +1，它应该感受到了';
    if (n < 5) return '第 ' + n + ' 次浇水，还活着，暂时';
    return '浇水 ' + n + ' 次，已经比工位其他植物长寿了';
  }

  var CURIOS = [
    { id: 'headphones', icon: 'sprite', src: 'assets/room/sprites/curio_headphones.png', label: '耳机', type: 'sound' },
    { id: 'gamepad', icon: 'sprite', src: 'assets/room/sprites/curio_gamepad.png', label: '手柄', type: 'bgm' },
    { id: 'camera', icon: 'sprite', src: 'assets/room/sprites/curio_camera.png', label: '拍立得', type: 'photos' },
    { id: 'radio', icon: 'sprite', src: 'assets/room/sprites/curio_radio.png', label: '收音机', type: 'cycle', lines: RADIO_LINES },
    { id: 'mug', icon: 'mug', label: '马克杯', type: 'counter', text: mugText },
    { id: 'books', icon: 'books', label: '闲书', type: 'cycle', lines: BOOK_LINES },
    { id: 'succulent', icon: 'succulent', label: '多肉', type: 'counter', text: succulentText, bounce: true },
    { id: 'notes', icon: 'notes', label: '便利贴', type: 'cycle', lines: NOTE_LINES }
  ];

  var activeTooltip = null;
  var autoCloseTimer = null;

  function closeTooltip() {
    if (autoCloseTimer) { window.clearTimeout(autoCloseTimer); autoCloseTimer = null; }
    if (activeTooltip) { activeTooltip.remove(); activeTooltip = null; }
  }

  function showTooltip(btn, text) {
    var reopening = activeTooltip && activeTooltip.parentElement === btn;
    closeTooltip();
    if (reopening) return;

    var tip = document.createElement('div');
    tip.className = 'curio-tooltip';
    tip.textContent = text;
    btn.appendChild(tip);
    activeTooltip = tip;
    autoCloseTimer = window.setTimeout(closeTooltip, 3200);
  }

  // 耳机/手柄：直接调音效/音乐已有的开关逻辑，跟顶部 HUD 是同一个状态，
  // 改完广播一个事件，两边（HUD 按钮、这两个图标本身）都监听着同步一下显示
  function renderAudioIcons() {
    var headphones = document.querySelector('.curio-item[data-id="headphones"] .curio-icon');
    var gamepad = document.querySelector('.curio-item[data-id="gamepad"] .curio-icon');
    if (headphones) headphones.classList.toggle('is-off', PixelResume.sound.isMuted());
    if (gamepad) gamepad.classList.toggle('is-off', !PixelResume.bgm.isWanted());
  }

  function handleSound(btn) {
    PixelResume.sound.setMuted(!PixelResume.sound.isMuted());
    document.dispatchEvent(new Event('pixelresume:audio-change'));
    showTooltip(btn, PixelResume.sound.isMuted() ? '戴上耳机，把音效关掉了' : '摘下耳机，音效又开着了');
  }
  function handleBgm(btn) {
    PixelResume.bgm.toggle();
    document.dispatchEvent(new Event('pixelresume:audio-change'));
    showTooltip(btn, PixelResume.bgm.isWanted() ? '按下播放，音乐放起来' : '按了暂停，先安静一下');
  }

  // 拍立得：去读 photocards / cosplay(第二个 tab) 已有的相册文件名，
  // 直接显示原始 jpg/jfif——文件本身在处理照片时就做过隐私模糊，
  // 这里只是跳过展示时额外叠加的那层像素化滤镜，不是把模糊也去掉
  function findGalleryFiles(sectionId, tabIndex) {
    var sections = (window.RESUME_DATA && window.RESUME_DATA.sections) || [];
    var section = sections.filter(function (s) { return s.id === sectionId; })[0];
    if (!section) return [];
    var tab = section.tabs && section.tabs[tabIndex || 0];
    if (!tab) return [];
    var block = tab.blocks.filter(function (b) { return b.type === 'gallery'; })[0];
    if (!block || !block.files) return [];
    return block.files.map(function (f) { return block.dir + '/' + f; });
  }

  function openLightbox() {
    // 小卡照片在处理阶段就做过真实的高斯模糊（文件本身糊的），跳过展示时
    // 额外叠加的像素化滤镜没问题。接委托那 3 张原始 jfif 完全没打过码，
    // 它们能在别处安全展示，靠的全部是这层像素化——这里绝对不能跳，
    // 否则委托对象等第三方的脸会原样露出来。两组必须分开处理，不能一视同仁。
    var clearFiles = findGalleryFiles('photocards', 0);
    var pixelatedFiles = findGalleryFiles('cosplay', 1);
    if (!clearFiles.length && !pixelatedFiles.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'curio-lightbox-overlay';

    var box = document.createElement('div');
    box.className = 'curio-lightbox';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'curio-lightbox-close';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', '关闭');

    var title = document.createElement('div');
    title.className = 'curio-lightbox-title';
    title.textContent = '拍立得洗出来的照片';

    var grid = document.createElement('div');
    grid.className = 'curio-lightbox-grid';

    clearFiles.forEach(function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.className = 'curio-lightbox-img';
      grid.appendChild(img);
    });
    pixelatedFiles.forEach(function (src) {
      var tile = document.createElement('div');
      tile.className = 'curio-lightbox-img curio-lightbox-tile';
      grid.appendChild(tile);
      PixelResume.pixelate
        .fromImage(src, { blockSize: 7, maxWidth: 320, aspect: 1, crop: 'cover' })
        .then(function (canvas) { tile.appendChild(canvas); })
        .catch(function () { /* file:// 下 canvas 被污染时静默放弃 */ });
    });

    box.appendChild(closeBtn);
    box.appendChild(title);
    box.appendChild(grid);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    if (PixelResume.sound) PixelResume.sound.play('open');
  }

  function buildItem(curio) {
    var btn = document.createElement('button');
    btn.className = 'curio-item';
    btn.dataset.id = curio.id;

    var icon = document.createElement('span');
    icon.className = 'curio-icon curio-icon-' + curio.icon;
    if (curio.src) icon.style.backgroundImage = "url('" + curio.src + "')";
    btn.appendChild(icon);

    var label = document.createElement('span');
    label.className = 'curio-label';
    label.textContent = curio.label;
    btn.appendChild(label);

    var cycleIndex = 0;
    var count = 0;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (PixelResume.sound) PixelResume.sound.play('click');

      if (curio.type === 'sound') {
        handleSound(btn);
        btn.setAttribute('aria-label', curio.label);
        return;
      }
      if (curio.type === 'bgm') {
        handleBgm(btn);
        return;
      }
      if (curio.type === 'photos') {
        openLightbox();
        return;
      }
      if (curio.type === 'cycle') {
        showTooltip(btn, curio.lines[cycleIndex % curio.lines.length]);
        cycleIndex++;
        return;
      }
      if (curio.type === 'counter') {
        count++;
        if (curio.bounce) {
          icon.classList.remove('is-bouncing');
          // 强制重排一下，不然同一个元素连续点击时动画类没被移除过、不会重新触发
          void icon.offsetWidth;
          icon.classList.add('is-bouncing');
        }
        showTooltip(btn, curio.text(count));
        return;
      }
    });

    btn.setAttribute('aria-label', curio.label);
    return btn;
  }

  function init() {
    var wrap = document.getElementById('curioItems');
    if (!wrap) return;
    CURIOS.forEach(function (curio) { wrap.appendChild(buildItem(curio)); });
    document.addEventListener('click', closeTooltip);
    document.addEventListener('pixelresume:audio-change', renderAudioIcons);
    renderAudioIcons();
  }

  PixelResume.curios = { init: init };
})();
