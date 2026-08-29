/* 音效系统：懒加载 4 个短音效，静音状态存 localStorage，播放失败（如浏览器自动播放限制）静默忽略 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var FILES = {
    click: 'assets/sfx/click.wav',
    hover: 'assets/sfx/hover.wav',
    open: 'assets/sfx/open.wav',
    close: 'assets/sfx/close.wav'
  };
  var VOLUME = { click: 0.35, hover: 0.2, open: 0.4, close: 0.4 };
  var STORAGE_KEY = 'pixelResumeMuted';

  var sources = {};
  var muted = localStorage.getItem(STORAGE_KEY) === '1';

  function preload() {
    Object.keys(FILES).forEach(function (key) {
      var audio = new Audio(FILES[key]);
      audio.preload = 'auto';
      audio.volume = VOLUME[key];
      sources[key] = audio;
    });
  }

  function play(name) {
    if (muted) return;
    var src = sources[name];
    if (!src) return;
    // 用 cloneNode 而不是复用同一个 Audio，避免连续触发时把上一次播放截断
    var node = src.cloneNode(true);
    node.volume = src.volume;
    node.play().catch(function () {});
  }

  function isMuted() { return muted; }

  function setMuted(val) {
    muted = val;
    localStorage.setItem(STORAGE_KEY, val ? '1' : '0');
  }

  PixelResume.sound = { preload: preload, play: play, isMuted: isMuted, setMuted: setMuted };
})();
