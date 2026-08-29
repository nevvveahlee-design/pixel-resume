/* 入口：初始化房间/面板，渲染顶部姓名牌，支持简历模式切换和 #hash 深链 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  function renderHud() {
    var meta = window.RESUME_DATA.meta;
    document.getElementById('hudName').textContent = meta.name;
    document.getElementById('hudNameEn').textContent = meta.nameEn;
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

  function initModeToggle() {
    var btn = document.getElementById('modeToggle');
    var roomFrame = document.querySelector('.room-frame');
    var itemBar = document.getElementById('itemBar');
    var resumeMode = document.getElementById('resumeMode');

    btn.addEventListener('click', function () {
      var showingResume = !resumeMode.hidden;
      resumeMode.hidden = showingResume;
      roomFrame.hidden = !showingResume;
      itemBar.hidden = !showingResume;
      btn.textContent = showingResume ? '📄 简历模式' : '🏠 房间模式';
      btn.setAttribute('aria-pressed', showingResume ? 'false' : 'true');
    });
  }

  function initSoundToggle() {
    var btn = document.getElementById('soundToggle');
    function render() {
      var muted = PixelResume.sound.isMuted();
      btn.textContent = muted ? '🔇 音效' : '🔊 音效';
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      PixelResume.sound.setMuted(!PixelResume.sound.isMuted());
      render();
    });
    render();
  }

  function initBgmToggle() {
    var btn = document.getElementById('bgmToggle');
    function render() {
      var on = PixelResume.bgm.isWanted();
      btn.textContent = on ? '🎵 音乐' : '🔇 音乐';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      PixelResume.bgm.toggle();
      render();
    });
    render();
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
    renderResumeMode();
    initModeToggle();
    initSoundToggle();
    initBgmToggle();
    PixelResume.bgm.armAutoResume();
    openFromHash();
  });
})();
