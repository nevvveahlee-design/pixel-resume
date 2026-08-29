/* 联系方式：拼接后再展示（不在 HTML 源码里留明文），点击显示 + 一键复制 */
(function () {
  var PixelResume = (window.PixelResume = window.PixelResume || {});

  function fullPhone() {
    return window.RESUME_DATA.contact.phoneParts.join('-');
  }
  function fullEmail() {
    var c = window.RESUME_DATA.contact;
    return c.emailUser + '@' + c.emailDomain;
  }

  function copyText(text, toastHost) {
    var done = function () { showToast(toastHost, '已复制！'); };
    var fail = function () { showToast(toastHost, '复制失败，请手动选中复制'); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text) ? done() : fail();
      });
    } else {
      fallbackCopy(text) ? done() : fail();
    }
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  var toastTimer = null;
  function showToast(host, msg) {
    var toast = host.querySelector('.contact-toast');
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 1800);
  }

  function makeRow(labelText, revealFn) {
    var row = document.createElement('div');
    row.className = 'contact-row';

    var label = document.createElement('span');
    label.className = 'contact-label';
    label.textContent = labelText;

    var revealBtn = document.createElement('button');
    revealBtn.className = 'contact-reveal-btn pixel-btn';
    revealBtn.textContent = '点击显示';

    var valueWrap = document.createElement('span');
    valueWrap.className = 'contact-value';
    valueWrap.hidden = true;

    var valueText = document.createElement('a');
    var copyBtn = document.createElement('button');
    copyBtn.className = 'contact-copy-btn pixel-btn';
    copyBtn.textContent = '📋 复制';
    copyBtn.hidden = true;

    revealBtn.addEventListener('click', function () {
      var value = revealFn();
      valueText.textContent = value.text;
      valueText.href = value.href;
      valueWrap.hidden = false;
      copyBtn.hidden = false;
      revealBtn.hidden = true;
      copyBtn.addEventListener('click', function () {
        copyText(value.text, row);
      });
    });

    row.appendChild(label);
    row.appendChild(revealBtn);
    valueWrap.appendChild(valueText);
    row.appendChild(valueWrap);
    row.appendChild(copyBtn);

    var toast = document.createElement('span');
    toast.className = 'contact-toast';
    row.appendChild(toast);

    return row;
  }

  function renderPanel() {
    var wrap = document.createElement('div');
    wrap.className = 'contact-panel';

    var intro = document.createElement('p');
    intro.className = 'block-paragraph';
    intro.textContent = '欢迎联系我 —— 点击下面的按钮显示手机号 / 邮箱。';
    wrap.appendChild(intro);

    wrap.appendChild(makeRow('手机', function () {
      return { text: fullPhone(), href: 'tel:' + fullPhone().replace(/-/g, '') };
    }));
    wrap.appendChild(makeRow('邮箱', function () {
      return { text: fullEmail(), href: 'mailto:' + fullEmail() };
    }));

    return wrap;
  }

  PixelResume.contact = { renderPanel: renderPanel };
})();
