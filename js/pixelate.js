/* 像素化滤镜工具。纯 Canvas 实现，不依赖任何外部服务/API。
   目标是"星露谷风格"的干净像素画感：大色块 + 固定复古调色板做最近色匹配，
   而不是简单缩放照片产生的那种灰蒙蒙"马赛克颗粒感"（真实照片颜色连续，
   每个色块颜色都略有不同，放大后看起来脏；把颜色吸附到一套精选调色板上
   之后色块变成干净的纯色块，才会读出"游戏美术"的感觉）。

   用法：
     PixelResume.pixelate.fromImage(imgOrUrl, options).then(canvas => ...)
     PixelResume.pixelate.attachVideo(videoEl, canvasEl, options)  // 实时逐帧处理视频画面

   file:// 下本地媒体会让 canvas 被判定为"tainted"，getImageData 会抛错——
   这里全程用 try/catch 包裹"读像素做调色板匹配"这一步，失败就跳过调色板匹配，
   保留基础的降采样/放大效果（用本地服务器打开可解锁完整效果，见 README）。 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});
  var cache = new Map();

  // 精选的"温暖复古游戏"调色板：肤色 / 发色 / 中性色 / 少量高饱和点缀色，
  // 覆盖范围参考了星露谷一类温馨像素游戏的配色倾向，自己手调，不是任何商用素材。
  var GAME_PALETTE = [
    [255, 224, 194], [247, 193, 153], [232, 168, 120], [201, 134, 80], [138, 90, 59], [90, 56, 38],
    [28, 24, 38], [43, 36, 56], [74, 63, 94], [107, 79, 58], [156, 107, 66],
    [217, 185, 138], [242, 226, 182],
    [182, 201, 217], [124, 143, 166], [92, 107, 122], [20, 17, 28], [51, 44, 71],
    [107, 98, 128], [168, 159, 184], [228, 220, 200], [251, 246, 238], [255, 255, 255],
    [192, 80, 107], [255, 143, 171], [255, 209, 220], [232, 93, 117],
    [106, 90, 138], [124, 159, 217], [184, 201, 240],
    [124, 214, 196], [79, 158, 148], [159, 216, 138], [90, 158, 74],
    [255, 210, 122], [242, 166, 90], [232, 132, 60], [247, 224, 138]
  ];

  var DEFAULTS = {
    blockSize: 8, // 源图每约 8px 区域 -> 输出 1 个"像素"，块越大越有"大颗粒游戏像素"感
    maxWidth: 400,
    levels: 0, // 每通道颜色档位数；仅在没有 palette 时生效
    palette: GAME_PALETTE, // 默认用固定调色板做最近色匹配，而不是连续色阶量化
    saturate: 1.35, // 降采样时顺带提升饱和度/对比度，弥补照片本身偏灰的问题
    contrast: 1.08,
    smoothDownsample: true,
    crop: 'cover', // 'cover' | 'contain'
    aspect: null // 例如 1 表示正方形裁切
  };

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      if (src instanceof HTMLImageElement) {
        if (src.complete && src.naturalWidth) return resolve(src);
        src.onload = function () { resolve(src); };
        src.onerror = reject;
        return;
      }
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function computeSourceRect(naturalW, naturalH, aspect, crop) {
    var sw = naturalW, sh = naturalH;
    if (!aspect) return { sx: 0, sy: 0, sw: sw, sh: sh };
    var targetRatio = aspect, srcRatio = sw / sh;
    var cw = sw, ch = sh;
    if (crop === 'cover') {
      if (srcRatio > targetRatio) { cw = sh * targetRatio; } else { ch = sw / targetRatio; }
    } else {
      if (srcRatio > targetRatio) { ch = sw / targetRatio; } else { cw = sh * targetRatio; }
    }
    return { sx: (sw - cw) / 2, sy: (sh - ch) / 2, sw: cw, sh: ch };
  }

  function nearestPaletteColor(r, g, b, palette) {
    var best = palette[0], bestDist = Infinity;
    for (var p = 0; p < palette.length; p++) {
      var c = palette[p];
      var dr = r - c[0], dg = g - c[1], db = b - c[2];
      // 人眼对绿色更敏感，按经验权重加权距离，匹配结果更自然
      var dist = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
      if (dist < bestDist) { bestDist = dist; best = c; }
    }
    return best;
  }

  function quantizeToPalette(ctx, w, h, palette, levels) {
    try {
      var imgData = ctx.getImageData(0, 0, w, h);
      var d = imgData.data;
      for (var i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 8) continue; // 透明像素不处理
        var color;
        if (palette && palette.length) {
          color = nearestPaletteColor(d[i], d[i + 1], d[i + 2], palette);
        } else if (levels > 1) {
          var step = 255 / (levels - 1);
          color = [
            Math.round(Math.round(d[i] / step) * step),
            Math.round(Math.round(d[i + 1] / step) * step),
            Math.round(Math.round(d[i + 2] / step) * step)
          ];
        } else {
          continue;
        }
        d[i] = color[0]; d[i + 1] = color[1]; d[i + 2] = color[2];
      }
      ctx.putImageData(imgData, 0, 0);
      return true;
    } catch (e) {
      // file:// 下本地媒体会导致 canvas 被 taint，getImageData 抛 SecurityError。
      // 静默跳过调色板匹配，不影响基础像素化效果（块状降采样依然生效）。
      return false;
    }
  }

  // 核心一帧渲染：source(图片/视频当前帧) -> 降采样(+饱和度/对比度) -> 调色板匹配 -> 放大铺到 outCanvas
  function renderFrame(source, srcRect, small, sctx, outCanvas, octx, o) {
    var filterParts = [];
    if (o.saturate && o.saturate !== 1) filterParts.push('saturate(' + o.saturate + ')');
    if (o.contrast && o.contrast !== 1) filterParts.push('contrast(' + o.contrast + ')');
    sctx.filter = filterParts.length ? filterParts.join(' ') : 'none';
    sctx.imageSmoothingEnabled = o.smoothDownsample;
    sctx.clearRect(0, 0, small.width, small.height);
    sctx.drawImage(source, srcRect.sx, srcRect.sy, srcRect.sw, srcRect.sh, 0, 0, small.width, small.height);
    sctx.filter = 'none';

    if (o.palette || o.levels > 0) quantizeToPalette(sctx, small.width, small.height, o.palette, o.levels);

    octx.imageSmoothingEnabled = false;
    octx.drawImage(small, 0, 0, outCanvas.width, outCanvas.height);
  }

  function pixelateStatic(img, opts) {
    var o = Object.assign({}, DEFAULTS, opts || {});
    var srcRect = computeSourceRect(img.naturalWidth, img.naturalHeight, o.aspect, o.crop);
    var outW = Math.min(o.maxWidth, Math.round(srcRect.sw));
    var outH = o.aspect ? Math.round(outW / o.aspect) : Math.round(outW * (srcRect.sh / srcRect.sw));

    var sw = Math.max(1, Math.round(outW / o.blockSize));
    var sh = Math.max(1, Math.round(outH / o.blockSize));

    var small = document.createElement('canvas');
    small.width = sw; small.height = sh;
    var sctx = small.getContext('2d', { willReadFrequently: true });

    var out = document.createElement('canvas');
    out.width = outW; out.height = outH;
    var octx = out.getContext('2d');

    renderFrame(img, srcRect, small, sctx, out, octx, o);

    out.style.imageRendering = 'pixelated';
    out.className = 'pixelated';
    return out;
  }

  PixelResume.pixelate = {
    GAME_PALETTE: GAME_PALETTE,

    fromImage: function (imgOrUrl, options) {
      var key = (typeof imgOrUrl === 'string' ? imgOrUrl : imgOrUrl.src) + '|' + JSON.stringify(options || {});
      if (cache.has(key)) return Promise.resolve(cache.get(key));
      return loadImage(imgOrUrl).then(function (img) {
        var canvas = pixelateStatic(img, options);
        cache.set(key, canvas);
        return canvas;
      });
    },

    fromFile: function (file, options) {
      var url = URL.createObjectURL(file);
      return this.fromImage(url, options).then(function (canvas) {
        URL.revokeObjectURL(url);
        return canvas;
      });
    },

    apply: function (imgEl, options) {
      return this.fromImage(imgEl.src, options).then(function (canvas) {
        canvas.setAttribute('aria-label', imgEl.alt || '');
        canvas.setAttribute('role', 'img');
        imgEl.replaceWith(canvas);
        return canvas;
      });
    },

    // 把 <video> 的实时画面持续像素化画到 canvasEl 上（星露谷风格的"动图预览"效果）。
    // 用 setTimeout 而不是每帧 requestAnimationFrame 节流到约 10fps ——
    // 一是省性能，二是低帧率本身也更有复古游戏的味道。
    attachVideo: function (videoEl, canvasEl, options) {
      var o = Object.assign({}, DEFAULTS, options || {});
      var small = document.createElement('canvas');
      var sctx = small.getContext('2d', { willReadFrequently: true });
      var octx = canvasEl.getContext('2d');
      var timer = null;
      var ready = false;

      function setup() {
        var srcRect = computeSourceRect(videoEl.videoWidth, videoEl.videoHeight, o.aspect, o.crop);
        var outW = Math.min(o.maxWidth, Math.round(srcRect.sw));
        var outH = o.aspect ? Math.round(outW / o.aspect) : Math.round(outW * (srcRect.sh / srcRect.sw));
        canvasEl.width = outW; canvasEl.height = outH;
        canvasEl.style.imageRendering = 'pixelated';
        canvasEl.classList.add('pixelated');
        small.width = Math.max(1, Math.round(outW / o.blockSize));
        small.height = Math.max(1, Math.round(outH / o.blockSize));
        ready = true;
        loop();
      }

      function loop() {
        if (!ready) return;
        if (!videoEl.paused && !videoEl.ended) {
          var srcRect = computeSourceRect(videoEl.videoWidth, videoEl.videoHeight, o.aspect, o.crop);
          renderFrame(videoEl, srcRect, small, sctx, canvasEl, octx, o);
        }
        timer = setTimeout(loop, 100); // ~10fps
      }

      videoEl.addEventListener('loadedmetadata', setup);
      videoEl.addEventListener('play', function () { if (ready && !timer) loop(); });
      videoEl.addEventListener('seeked', function () {
        if (ready && videoEl.paused) {
          var srcRect = computeSourceRect(videoEl.videoWidth, videoEl.videoHeight, o.aspect, o.crop);
          renderFrame(videoEl, srcRect, small, sctx, canvasEl, octx, o);
        }
      });

      return function destroy() {
        clearTimeout(timer);
        ready = false;
      };
    }
  };
})();
