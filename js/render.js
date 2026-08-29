/* 内容块 -> DOM。唯一写 HTML 结构的地方；所有正文一律用 textContent 写入，
   避免任何 innerHTML 拼接用户数据（虽然数据是自己写的，但保持这个习惯不出问题）。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  // 把 **粗体** 转成 <strong>，其余原样按 textNode 处理，不解析任何其他标记
  function inlineFormat(text) {
    var frag = document.createDocumentFragment();
    var parts = text.split(/(\*\*[^*]+\*\*)/g);
    parts.forEach(function (part) {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        var strong = document.createElement('strong');
        strong.textContent = part.slice(2, -2);
        frag.appendChild(strong);
      } else if (part) {
        frag.appendChild(document.createTextNode(part));
      }
    });
    return frag;
  }

  var renderers = {
    heading: function (b) {
      return el('h4', 'block-heading', b.text);
    },
    paragraph: function (b) {
      var p = el('p', 'block-paragraph');
      p.appendChild(inlineFormat(b.text));
      return p;
    },
    bullets: function (b) {
      var ul = el('ul', 'block-bullets');
      b.items.forEach(function (item) {
        var li = document.createElement('li');
        li.appendChild(inlineFormat(item));
        ul.appendChild(li);
      });
      return ul;
    },
    meta: function (b) {
      var dl = el('dl', 'block-meta');
      b.items.forEach(function (pair) {
        var dt = el('dt', null, pair[0]);
        var dd = el('dd', null, pair[1]);
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      return dl;
    },
    metrics: function (b) {
      var wrap = el('div', 'block-metrics');
      b.items.forEach(function (m) {
        var tile = el('div', 'metric-tile');
        tile.appendChild(el('div', 'metric-value', m.value));
        tile.appendChild(el('div', 'metric-label', m.label));
        wrap.appendChild(tile);
      });
      return wrap;
    },
    tags: function (b) {
      var wrap = el('div', 'block-tags');
      if (b.title) wrap.appendChild(el('div', 'block-tags-title', b.title));
      var list = el('div', 'tags-list');
      b.items.forEach(function (t) { list.appendChild(el('span', 'tag', t)); });
      wrap.appendChild(list);
      return wrap;
    },
    steps: function (b) {
      var wrap = el('div', 'block-steps');
      if (b.title) wrap.appendChild(el('div', 'block-steps-title', b.title));
      var ol = el('ol', 'steps-list');
      b.items.forEach(function (s) { ol.appendChild(el('li', null, s)); });
      wrap.appendChild(ol);
      return wrap;
    },
    illustration: function (b) {
      // 固定的、自己写的装饰性 SVG 预设——不是真实照片，只做视觉点缀，避免把陌生人的照片冒充成个人经历
      var presets = {
        cards:
          '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="卡片装饰图">' +
          '<g stroke="#2b2438" stroke-width="4" stroke-linejoin="round">' +
          '<rect x="18" y="34" width="78" height="98" rx="6" fill="#7cd6c4" transform="rotate(-9 57 83)"/>' +
          '<rect x="58" y="18" width="78" height="98" rx="6" fill="#ff8fab" transform="rotate(7 97 67)"/>' +
          '<rect x="92" y="38" width="78" height="98" rx="6" fill="#ffd27a"/>' +
          '</g>' +
          '<circle cx="131" cy="66" r="7" fill="#fff"/><circle cx="150" cy="92" r="4" fill="#fff"/>' +
          '<circle cx="120" cy="100" r="3" fill="#fff"/>' +
          '</svg>'
      };
      var wrap = el('div', 'block-illustration');
      wrap.innerHTML = presets[b.preset] || '';
      if (b.caption) wrap.appendChild(el('p', 'illustration-caption', b.caption));
      return wrap;
    },
    videos: function (b) {
      var wrap = el('div', 'block-videos');
      (b.items || []).forEach(function (item) {
        var tile = el('div', 'video-tile');

        // 预览层：静音循环播放的源视频（不展示原画质，只用来喂给像素化 canvas）
        var previewVideo = document.createElement('video');
        previewVideo.src = item.src;
        previewVideo.muted = true;
        previewVideo.loop = true;
        previewVideo.playsInline = true;
        previewVideo.preload = 'auto';
        previewVideo.className = 'video-source';

        var canvas = document.createElement('canvas');
        canvas.className = 'video-pixel-canvas pixelated';
        canvas.setAttribute('aria-label', item.caption || '像素风预览');

        var stage = el('div', 'video-stage');
        var badge = el('span', 'video-pixel-badge', '像素预览');
        stage.appendChild(previewVideo);
        stage.appendChild(canvas);
        stage.appendChild(badge);
        tile.appendChild(stage);

        PixelResume.pixelate.attachVideo(previewVideo, canvas, { blockSize: 6, maxWidth: 340 });
        previewVideo.play().catch(function () { /* 自动播放被拦截时静默忽略，用户点下方原片播放按钮即可 */ });

        // 原片：真实画质 + 完整播放控件，供想看清楚动作细节时使用
        var realVideo = document.createElement('video');
        realVideo.src = item.src;
        realVideo.controls = true;
        realVideo.preload = 'none';
        realVideo.className = 'video-real';
        tile.appendChild(realVideo);

        if (item.caption) tile.appendChild(el('div', 'video-caption', item.caption));
        wrap.appendChild(tile);
      });
      return wrap;
    },
    gallery: function (b) {
      var wrap = el('div', 'block-gallery');
      if (!b.files || !b.files.length) {
        wrap.appendChild(el('p', 'gallery-empty', b.caption || '暂无照片。'));
        return wrap;
      }
      var grid = el('div', 'gallery-grid');
      b.files.forEach(function (file) {
        var tile = el('div', 'gallery-tile loading', '加载中…');
        grid.appendChild(tile);
        var img = new Image();
        img.alt = file;
        img.src = b.dir + '/' + file;
        img.onload = function () {
          PixelResume.pixelate
            .fromImage(img, { blockSize: 7, maxWidth: 320, aspect: 1, crop: 'cover' })
            .then(function (canvas) {
              tile.classList.remove('loading');
              tile.textContent = '';
              tile.appendChild(canvas);
            });
        };
        img.onerror = function () {
          tile.classList.remove('loading');
          tile.classList.add('error');
          tile.textContent = '图片加载失败：' + file;
        };
      });
      wrap.appendChild(grid);
      return wrap;
    }
  };

  function renderBlocks(blocks) {
    var frag = document.createDocumentFragment();
    (blocks || []).forEach(function (b) {
      var fn = renderers[b.type];
      if (fn) frag.appendChild(fn(b));
    });
    return frag;
  }

  PixelResume.render = { renderBlocks: renderBlocks, inlineFormat: inlineFormat };
})();
