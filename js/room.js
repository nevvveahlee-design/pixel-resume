/* 由 content.js 生成房间热点按钮 + 移动端底部图标栏，处理点击/键盘交互与"未点击过"的提示动画 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});
  var VISITED_KEY = 'pixelResumeVisited';
  var visited = new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'));

  function buildHotspot(section) {
    var btn = document.createElement('button');
    btn.className = 'hotspot';
    btn.dataset.section = section.id;
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', section.prop.label + '：' + section.title);
    var rect = section.prop.rect; // [left%, top%, width%, height%]
    btn.style.left = rect[0] + '%';
    btn.style.top = rect[1] + '%';
    btn.style.width = rect[2] + '%';
    btn.style.height = rect[3] + '%';
    if (section.prop.isEasterEgg) btn.classList.add('is-easter-egg');
    if (section.prop.wallPhoto) btn.classList.add('is-framed');
    if (visited.has(section.id)) btn.classList.add('is-visited');

    if (section.prop.sprite) {
      btn.classList.add('has-sprite');
      btn.appendChild(PixelResume.character.createSprite());
    } else if (section.prop.image) {
      btn.classList.add('has-image');
      var img = document.createElement('img');
      img.className = 'hotspot-image pixelated';
      img.src = section.prop.image;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      btn.appendChild(img);
    } else {
      var icon = document.createElement('span');
      icon.className = 'hotspot-icon';
      icon.textContent = section.prop.icon;
      icon.setAttribute('aria-hidden', 'true');
      btn.appendChild(icon);
    }

    var label = document.createElement('span');
    label.className = 'hotspot-label';
    label.textContent = section.prop.label;
    btn.appendChild(label);

    btn.addEventListener('click', function () {
      PixelResume.sound.play('click');
      PixelResume.panel.open(section.id, 0, btn);
    });

    return btn;
  }

  // 照片墙第三张：不是独立板块，是"衣柜"里"接委托日常"这个 tab 的入口，
  // 单独做一个挂在墙上的相框按钮，点开直接跳到 cosplay 板块的第 2 个 tab
  function buildCosplayPhotoWallItem() {
    var btn = document.createElement('button');
    btn.className = 'hotspot has-image is-framed';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', '照片墙：接委托日常');
    btn.style.left = '32%';
    btn.style.top = '12%';
    btn.style.width = '8%';
    btn.style.height = '13%';

    var img = document.createElement('img');
    img.className = 'hotspot-image pixelated';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    btn.appendChild(img);
    PixelResume.pixelate
      .fromImage('assets/photos/raw/cos-01.jfif', { blockSize: 5, maxWidth: 200, aspect: 0.8, crop: 'cover' })
      .then(function (canvas) { img.src = canvas.toDataURL(); })
      .catch(function () { /* file:// 下 canvas 被污染时静默放弃，留空相框也不影响点击 */ });

    var label = document.createElement('span');
    label.className = 'hotspot-label';
    label.textContent = '接委托日常';
    btn.appendChild(label);

    btn.addEventListener('click', function () {
      PixelResume.sound.play('click');
      PixelResume.panel.open('cosplay', 1, btn);
    });

    return btn;
  }

  function buildItemBarButton(section) {
    var btn = document.createElement('button');
    btn.className = 'item-bar-btn';
    btn.dataset.section = section.id;
    btn.setAttribute('aria-label', section.title);
    var icon = document.createElement('span');
    icon.className = 'item-bar-icon';
    icon.textContent = section.prop.icon;
    icon.setAttribute('aria-hidden', 'true');
    var label = document.createElement('span');
    label.className = 'item-bar-label';
    label.textContent = section.prop.label;
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.addEventListener('click', function () {
      PixelResume.sound.play('click');
      PixelResume.panel.open(section.id, 0, btn);
    });
    return btn;
  }

  function updateProgress() {
    var el = document.getElementById('hudProgress');
    if (!el) return;
    var total = window.RESUME_DATA.sections.length;
    el.textContent = '已探索 ' + visited.size + ' / ' + total;
  }

  var pendingCelebration = false;

  function markVisited(sectionId) {
    if (visited.has(sectionId)) return;
    visited.add(sectionId);
    localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(visited)));
    var hotspot = document.querySelector('.hotspot[data-section="' + sectionId + '"]');
    if (hotspot) hotspot.classList.add('is-visited');
    updateProgress();

    if (visited.size === window.RESUME_DATA.sections.length) pendingCelebration = true;
  }

  // 8 个都点过之后不能马上弹——这时候内容面板正开着，气泡在它后面根本看不见，
  // 所以只登记一个"待播放"标记，等面板真正关掉（panel.js 的 close 里）再触发
  function celebrateIfPending() {
    if (!pendingCelebration) return;
    pendingCelebration = false;
    if (!PixelResume.greeting) return;
    if (PixelResume.sound) PixelResume.sound.play('open');
    PixelResume.greeting.say([
      '哇，我房间里能点的东西都被你翻了个遍！',
      '看来我们还挺投缘的，欢迎邮件或者简历模式里的联系方式找我聊聊~'
    ], '谢谢你 ✕');
  }

  function buildDecoration(room) {
    var win = document.createElement('div');
    win.className = 'room-deco room-window';
    ['mullion-v1', 'mullion-v2', 'mullion-h1', 'mullion-h2', 'sill'].forEach(function (cls) {
      var part = document.createElement('div');
      part.className = cls;
      win.appendChild(part);
    });
    room.appendChild(win);

    var rug = document.createElement('div');
    rug.className = 'room-deco room-rug';
    room.appendChild(rug);

    // 窗户投下来的一道暖光，斜着洒在地板上——让房间看着是"被设计过打光的"，
    // 不是家具沿墙摆一圈的平光效果
    var windowLight = document.createElement('div');
    windowLight.className = 'room-deco room-window-light';
    room.appendChild(windowLight);

    var wallart = document.createElement('div');
    wallart.className = 'room-deco room-wallart';
    room.appendChild(wallart);

    // 床正上方一整块软木板，接委托照片和信箱直接"钉"在上面，
    // 再顺手贴两张小便签填一填空白，看着更像真的用过的板子
    var corkboard = document.createElement('div');
    corkboard.className = 'room-deco room-corkboard';
    ['n1', 'n2'].forEach(function (cls) {
      var note = document.createElement('div');
      note.className = 'sticky-note ' + cls;
      corkboard.appendChild(note);
    });
    room.appendChild(corkboard);

    // 软木板和窗户之间那段墙太空了，补一个圆钟（之前裁好但没用上的素材）
    var wallClock = document.createElement('div');
    wallClock.className = 'room-deco room-wall-clock';
    room.appendChild(wallClock);

    // 衣柜和书桌中间那块地板也太空，补一盆小绿植
    var plant2 = document.createElement('div');
    plant2.className = 'room-deco room-plant2';
    room.appendChild(plant2);

    // 书桌前面的地板也空，再放一盆圆叶绿植
    var plant3 = document.createElement('div');
    plant3.className = 'room-deco room-plant3';
    room.appendChild(plant3);

    var mirror = document.createElement('div');
    mirror.className = 'room-deco room-mirror';
    room.appendChild(mirror);

    // 一开始认错成"置物篮"了，其实是个复古双铃闹钟——挪到收纳盒上面，跟镜子并排放
    var alarmClock = document.createElement('div');
    alarmClock.className = 'room-deco room-basket';
    room.appendChild(alarmClock);

    var floorLamp = document.createElement('div');
    floorLamp.className = 'room-deco room-floor-lamp';
    room.appendChild(floorLamp);

    var bed = document.createElement('div');
    bed.className = 'room-deco room-bed';
    room.appendChild(bed);

    var desk = document.createElement('div');
    desk.className = 'room-deco room-desk';
    room.appendChild(desk);

    var glow = document.createElement('div');
    glow.className = 'room-deco lamp-glow';
    room.appendChild(glow);

    [
      { left: 2, top: 24 }
    ].forEach(function (pos) {
      var plant = document.createElement('div');
      plant.className = 'room-deco room-plant';
      plant.style.left = pos.left + '%';
      plant.style.top = pos.top + '%';
      room.appendChild(plant);
    });

    room.appendChild(buildParticles());

    // 降饱和层：家具素材本身的颜色比木头背景鲜艳很多，用 mix-blend-mode:saturation
    // 整体往中性灰上拉一截，不用逐张素材改颜色也能让色彩跟木质背景更协调
    var desaturate = document.createElement('div');
    desaturate.className = 'room-desaturate';
    desaturate.setAttribute('aria-hidden', 'true');
    room.appendChild(desaturate);

    // 统一色调层：把不同素材包拼出来的家具用一层暖光笼罩起来，
    // 减少"各自一套色调"的拼贴感，同时给四角加一点暗角，房间看着更有进深
    var tint = document.createElement('div');
    tint.className = 'room-tint';
    tint.setAttribute('aria-hidden', 'true');
    room.appendChild(tint);
  }

  // 十来颗随机飘的像素光尘，纯装饰，随机起点/漂移方向/速度制造自然感
  function buildParticles() {
    var wrap = document.createElement('div');
    wrap.className = 'room-particles';
    wrap.setAttribute('aria-hidden', 'true');
    var COUNT = 10;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'room-particle';
      p.style.left = (5 + Math.random() * 85) + '%';
      p.style.bottom = (Math.random() * 45) + '%';
      p.style.setProperty('--drift-x', (Math.random() * 40 - 15) + 'px');
      p.style.setProperty('--drift-y', -(90 + Math.random() * 90) + 'px');
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.animationDelay = (Math.random() * -10) + 's';
      wrap.appendChild(p);
    }
    return wrap;
  }

  function init() {
    var room = document.getElementById('room');
    var itemBar = document.getElementById('itemBar');
    var sections = window.RESUME_DATA.sections;

    buildDecoration(room);

    sections.forEach(function (section) {
      room.appendChild(buildHotspot(section));
      itemBar.appendChild(buildItemBarButton(section));
    });
    room.appendChild(buildCosplayPhotoWallItem());
    updateProgress();

    PixelResume.greeting.init(room);

    // 开场自动高亮彩蛋道具几秒，引导第一次点击
    var egg = sections.find(function (s) { return s.prop.isEasterEgg; });
    if (egg) {
      var eggEl = document.querySelector('.hotspot[data-section="' + egg.id + '"]');
      if (eggEl) {
        eggEl.classList.add('is-hinting');
        setTimeout(function () { eggEl.classList.remove('is-hinting'); }, 6000);
      }
    }
  }

  PixelResume.room = { init: init, markVisited: markVisited, celebrateIfPending: celebrateIfPending };
})();
