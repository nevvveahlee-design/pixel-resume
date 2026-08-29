/* 进房间时角色头顶弹出的 NPC 引导对话框：打字机逐句显现，点气泡推进下一句，
   点右上角 ✕ 随时跳过。纯欢迎/引导用途，不影响下面家具的正常点击。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  var GREETING_LINES = [
    '你好，欢迎来到我的小屋！',
    '这里每件家具点开都是我的过往经历，感兴趣的话可以点点看哦~',
    '如果你赶时间，右上角有"简历模式"，直接看文字版更快~'
  ];
  var SHOW_DELAY_MS = 500;

  var bubble, textEl, nextEl;
  var lines = [];
  var finishLabel = '✕';
  var index = 0;
  var currentReveal = null;

  function showLine() {
    nextEl.classList.remove('is-ready');
    // typeText 读区块自身现有的文本节点来打字，所以先把这句话完整写进去再调用
    textEl.textContent = lines[index];
    var handle = PixelResume.typewriter.typeText(textEl);
    currentReveal = handle;
    handle.promise.then(function () {
      nextEl.classList.add('is-ready');
      nextEl.textContent = index < lines.length - 1 ? '▼' : finishLabel;
    });
  }

  function advance() {
    if (currentReveal && !nextEl.classList.contains('is-ready')) {
      currentReveal.skip();
      return;
    }
    index++;
    if (index >= lines.length) { hide(); return; }
    showLine();
  }

  function hide() {
    if (currentReveal) currentReveal.skip();
    if (bubble) bubble.hidden = true;
  }

  // 通用入口：换一批台词从头播一遍，供开场问候、探索完成彩蛋等场景复用
  function say(newLines, newFinishLabel) {
    if (!bubble || !newLines || !newLines.length) return;
    lines = newLines;
    finishLabel = newFinishLabel || '✕';
    index = 0;
    bubble.hidden = false;
    showLine();
  }

  function show() {
    say(GREETING_LINES, '开始探索 ✕');
  }

  function build(room) {
    bubble = document.createElement('div');
    bubble.className = 'npc-bubble';
    bubble.setAttribute('role', 'status');
    bubble.hidden = true;

    var tag = document.createElement('div');
    tag.className = 'npc-bubble-tag';
    tag.textContent = 'Miranda';
    bubble.appendChild(tag);

    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'npc-bubble-skip';
    skip.setAttribute('aria-label', '关闭对话');
    skip.textContent = '✕';
    skip.addEventListener('click', function (e) { e.stopPropagation(); hide(); });
    bubble.appendChild(skip);

    textEl = document.createElement('p');
    textEl.className = 'npc-bubble-text';
    bubble.appendChild(textEl);

    nextEl = document.createElement('span');
    nextEl.className = 'npc-bubble-next';
    nextEl.setAttribute('aria-hidden', 'true');
    bubble.appendChild(nextEl);

    bubble.addEventListener('click', advance);
    room.appendChild(bubble);
  }

  function init(room) {
    if (!room) return;
    build(room);
    setTimeout(show, SHOW_DELAY_MS);
  }

  PixelResume.greeting = { init: init, hide: hide, say: say };
})();
