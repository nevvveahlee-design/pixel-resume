/* 入口：初始化房间/面板，渲染顶部姓名牌，支持简历模式切换和 #hash 深链 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  function renderHud() {
    var meta = window.RESUME_DATA.meta;
    document.getElementById('hudName').textContent = meta.name;
    document.getElementById('hudTagline').textContent = meta.tagline;
  }

  // 简历文字版只放正经履历：不放"关于我"彩蛋、不放联系方式（那个板块本身是
  // 靠点按钮一步步显示手机号/邮箱的交互设计，摊成纯文字没有意义）、不放小卡
  // 板块、cosplay 只保留"账号运营"（"接委托日常"标了 resumeSkip，见 content.js）；
  // 名字下面的 slogan/自我介绍段落也一并去掉，直接从名字跳到第一个板块。
  // 每个 tab 优先用 resumeBlocks（数字揉回原句的版本），没配的就退回 tab.blocks。
  function renderResumeMode() {
    var root = document.getElementById('resumeMode');
    var meta = window.RESUME_DATA.meta;
    var SKIP_SECTIONS = { about: true, photocards: true };

    var header = document.createElement('div');
    header.className = 'resume-header';
    var h1 = document.createElement('h1');
    h1.textContent = meta.name + '（' + meta.nameEn + '）';
    header.appendChild(h1);
    root.appendChild(header);

    window.RESUME_DATA.sections.forEach(function (section) {
      if (section.isContact || SKIP_SECTIONS[section.id]) return;

      var visibleTabs = section.tabs.filter(function (tab) { return !tab.resumeSkip; });
      if (!visibleTabs.length) return;

      var block = document.createElement('section');
      block.className = 'resume-section';

      var h2 = document.createElement('h2');
      h2.textContent = section.title;
      block.appendChild(h2);

      visibleTabs.forEach(function (tab) {
        if (visibleTabs.length > 1) {
          var h3 = document.createElement('h3');
          h3.textContent = tab.label;
          block.appendChild(h3);
        }
        block.appendChild(PixelResume.render.renderBlocksForResume(tab.resumeBlocks || tab.blocks));
      });
      root.appendChild(block);
    });
  }

  // 简历模式的开关按钮搬进桌角好物里了（原来的"闲书"，现在叫"简历"），
  // 房间和桌角好物现在是合并在一起的同一个板块，所以进简历模式时只需要
  // 藏 .room-frame 这一个容器；退出+下载 PDF 的入口是下面这两个常驻按钮
  // ——它们必须在简历模式下也能点到，不能塞进跟着房间一起被隐藏的地方。
  function initResumeMode() {
    var roomFrame = document.querySelector('.room-frame');
    var itemBar = document.getElementById('itemBar');
    var resumeMode = document.getElementById('resumeMode');
    var actions = document.getElementById('resumeModeActions');
    var backBtn = document.getElementById('backToRoom');

    function setResumeMode(showResume) {
      resumeMode.hidden = !showResume;
      roomFrame.hidden = showResume;
      itemBar.hidden = showResume;
      actions.hidden = !showResume;
    }

    backBtn.addEventListener('click', function () { setResumeMode(false); });

    PixelResume.resumeMode = {
      toggle: function () { setResumeMode(resumeMode.hidden); },
      isOn: function () { return !resumeMode.hidden; }
    };
  }

  function openFromHash() {
    var hash = location.hash.replace('#', '');
    if (!hash) return;
    var parts = hash.split('/');
    var sectionId = parts[0];
    var tabIndex = parseInt(parts[1], 10) || 0;
    var exists = window.RESUME_DATA.sections.some(function (s) { return s.id === sectionId; });
    if (exists) PixelResume.panel.open(sectionId, tabIndex);
  }

  document.addEventListener('DOMContentLoaded', function () {
    PixelResume.sound.preload();
    renderHud();
    PixelResume.panel.init();
    PixelResume.room.init();
    PixelResume.curios.init();
    renderResumeMode();
    initResumeMode();
    PixelResume.bgm.armAutoResume();
    openFromHash();
  });
})();
