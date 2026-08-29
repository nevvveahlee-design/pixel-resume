/* 用 Universal LPC Spritesheet Generator（免费开源，CC-BY-SA/GPL，见
   assets/character/CREDITS.md）导出的真实像素画小人，替换掉早期手画的低分辨率版本。
   只用 idle 动作的正面朝向两帧，定时切换做一个简单的呼吸感待机动画。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var FRAMES = [
    'assets/character/idle_front_0.png',
    'assets/character/idle_front_1.png'
  ];
  var FRAME_INTERVAL = 500;

  function createSprite() {
    var img = document.createElement('img');
    img.className = 'character-sprite pixelated';
    img.src = FRAMES[0];
    img.alt = '';
    img.setAttribute('role', 'img');
    img.setAttribute('aria-label', '李梦媛的像素小人');

    var i = 0;
    setInterval(function () {
      i = (i + 1) % FRAMES.length;
      img.src = FRAMES[i];
    }, FRAME_INTERVAL);

    return img;
  }

  PixelResume.character = { createSprite: createSprite };
})();
