/* 入口：初始化房间/面板，渲染顶部姓名牌，支持简历模式切换和 #hash 深链 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  function renderHud() {
    var meta = window.RESUME_DATA.meta;
    document.getElementById('hudName').textContent = meta.name;
    document.getElementById('hudTagline').textContent = meta.tagline;
  }

  function renderResumeMode() {
    var root = document.getElementById('resumeMode');
    var meta = window.RESUME_DATA.meta;

    var header = document.createElement('div');
    header.className = 'resume-header';
    var h1 = document.createElement('h1');
    h1.textContent = meta.name + '（' + meta.nameEn + '）';
    var tagline = document.createElement('p');
    tagline.className = 'resume-tagline';
    tagline.textContent = meta.tagline;
    var intro = document.createElement('p');
    intro.className = 'resume-intro';
    intro.textContent = meta.intro;
    header.appendChild(h1);
    header.appendChild(tagline);
    header.appendChild(intro);
    root.appendChild(header);

    window.RESUME_DATA.sections.forEach(function (section) {
      var block = document.createElement('section');
      block.className = 'resume-section';

      var h2 = document.createElement('h2');
      h2.textContent = section.title;
      block.appendChild(h2);

      if (section.isContact) {
        block.appendChild(PixelResume.contact.renderPanel());
      } else {
        section.tabs.forEach(function (tab) {
          if (section.tabs.length > 1) {
            var h3 = document.createElement('h3');
            h3.textContent = tab.label;
            block.appendChild(h3);
          }
          block.appendChild(PixelResume.render.renderBlocks(tab.blocks));
        });
      }
      root.appendChild(block);
    });
  }

  // 简历模式的开关按钮搬进桌角好物里了（原来的"闲书"，现在叫"简历"），
  // 房间和桌角好物现在是合并在一起的同一个板块，所以进简历模式时只需要
  // 藏 .room-frame 这一个容器；退出的入口是下面这个常驻的"回到房间"按钮
  // ——它必须在简历模式下也能点到，不能塞进跟着房间一起被隐藏的地方。
  function initResumeMode() {
    var roomFrame = document.querySelector('.room-frame');
    var itemBar = document.getElementById('itemBar');
    var resumeMode = document.getElementById('resumeMode');
    var backBtn = document.getElementById('backToRoom');

    function setResumeMode(showResume) {
      resumeMode.hidden = !showResume;
      roomFrame.hidden = showResume;
      itemBar.hidden = showResume;
      backBtn.hidden = !showResume;
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
