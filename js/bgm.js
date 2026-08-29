/* 背景音乐：单曲循环，音量较低。浏览器自动播放策略会拦截带声音的自动播放，
   所以默认不自动放，等用户主动点开关按钮，或者用户之前开过就在第一次点击/按键时尝试恢复播放。
   播放状态（用户是否希望放）存 localStorage，和音效的静音开关是分开的两件事。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var SRC = 'assets/bgm/theme.ogg';
  var VOLUME = 0.22;
  var STORAGE_KEY = 'pixelResumeBgmOn';

  var audio = null;
  var wantsPlaying = localStorage.getItem(STORAGE_KEY) === '1';
  var resumeAttempted = false;

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = 'auto';
    return audio;
  }

  function play() {
    ensureAudio().play().catch(function () { /* 还没有用户交互，浏览器会拦截，忽略即可 */ });
  }

  function pause() {
    if (audio) audio.pause();
  }

  function toggle() {
    wantsPlaying = !wantsPlaying;
    localStorage.setItem(STORAGE_KEY, wantsPlaying ? '1' : '0');
    if (wantsPlaying) play(); else pause();
    return wantsPlaying;
  }

  function isPlaying() {
    return !!(audio && !audio.paused);
  }

  function isWanted() {
    return wantsPlaying;
  }

  // 上次刷新前用户开着音乐：第一次用户交互时尝试恢复播放（绕开自动播放限制）
  function armAutoResume() {
    if (!wantsPlaying || resumeAttempted) return;
    resumeAttempted = true;
    var resume = function () {
      play();
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
  }

  PixelResume.bgm = { toggle: toggle, isPlaying: isPlaying, isWanted: isWanted, armAutoResume: armAutoResume };
})();
