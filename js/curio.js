/* 桌角好物：纯装饰彩蛋，跟"已探索 X/8"的简历板块完全无关，点一下弹一句俏皮话。
   目的是填一填大屏幕下房间以外空出来的那一大截，不承载任何简历数据。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var CURIOS = [
    { icon: 'sprite', src: 'assets/room/sprites/curio_headphones.png', label: '耳机', text: '写方案的时候单曲循环，效率 +50%（自称）' },
    { icon: 'sprite', src: 'assets/room/sprites/curio_gamepad.png', label: '手柄', text: '摸鱼 official 认证道具' },
    { icon: 'sprite', src: 'assets/room/sprites/curio_camera.png', label: '拍立得', text: '记录小卡和 cos 现场的老伙计' },
    { icon: 'sprite', src: 'assets/room/sprites/curio_radio.png', label: '收音机', text: '改稿改到很晚的时候，放点噪音陪自己' },
    { icon: 'mug', label: '马克杯', text: '美式续命，一天至少两杯' },
    { icon: 'books', label: '闲书', text: '摸鱼看的书比工作用的书还多' },
    { icon: 'succulent', label: '多肉', text: '工位上唯一没被我养死的植物' },
    { icon: 'notes', label: '便利贴', text: '灵感全靠随手记，不然分分钟忘' }
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

  function buildItem(curio) {
    var btn = document.createElement('button');
    btn.className = 'curio-item';
    btn.setAttribute('aria-label', curio.label + '：' + curio.text);

    var icon = document.createElement('span');
    icon.className = 'curio-icon curio-icon-' + curio.icon;
    if (curio.src) icon.style.backgroundImage = "url('" + curio.src + "')";
    btn.appendChild(icon);

    var label = document.createElement('span');
    label.className = 'curio-label';
    label.textContent = curio.label;
    btn.appendChild(label);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (PixelResume.sound) PixelResume.sound.play('click');
      showTooltip(btn, curio.text);
    });

    return btn;
  }

  function init() {
    var wrap = document.getElementById('curioItems');
    if (!wrap) return;
    CURIOS.forEach(function (curio) { wrap.appendChild(buildItem(curio)); });
    document.addEventListener('click', closeTooltip);
  }

  PixelResume.curios = { init: init };
})();
