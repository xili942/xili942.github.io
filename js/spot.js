/* 多图折叠：点「共 N 张」展开缩略图条；点缩略图切换主图与图注。
 * 点照片（景点主图 / 随记小图）在页内浮层看大图：手机返回键只关浮层、不会退出文章。
 * 六边图已由构建期生成，不在此处渲染。 */
(function () {
  /* ---------- 图片浮层 ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.innerHTML =
    '<button type="button" class="lb-close" aria-label="关闭大图">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button><img alt=""><p class="lb-cap" hidden></p>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('.lb-cap');
  var lbOpen = false;      // 浮层是否打开
  var lbPushed = false;    // 是否往浏览器历史压过一条（打开时压，返回键先关浮层）
  var lbExpectPop = false; // 自己调 history.back() 收尾时，忽略这一次 popstate

  function openLb(src, alt, caption) {
    if (!src) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    if (caption) { lbCap.textContent = caption; lbCap.removeAttribute('hidden'); }
    else { lbCap.textContent = ''; lbCap.setAttribute('hidden', ''); }
    lb.removeAttribute('hidden');
    document.documentElement.classList.add('lb-open');
    if (!lbOpen) {
      lbOpen = true;
      try { history.pushState({ lb: 1 }, ''); lbPushed = true; } catch (err) { lbPushed = false; }
    }
  }
  function closeLb(fromUser) {
    if (!lbOpen) return;
    lbOpen = false;
    lb.setAttribute('hidden', '');
    document.documentElement.classList.remove('lb-open');
    lbImg.removeAttribute('src');
    if (fromUser && lbPushed) { lbExpectPop = true; history.back(); }
    lbPushed = false;
  }
  window.addEventListener('popstate', function () {
    if (lbExpectPop) { lbExpectPop = false; return; }
    closeLb(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(true); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(true); });
  lb.querySelector('.lb-close').addEventListener('click', function () { closeLb(true); });

  function plainClick(e) {
    return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  /* ---------- 随记小图：点开进浮层（href 保留：无 JS 兜底、长按仍可新标签开原图） ---------- */
  document.querySelectorAll('.note-photos .np').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!plainClick(e)) return;
      e.preventDefault();
      var im = a.querySelector('img');
      var cap = a.querySelector('.np-cap');
      openLb(a.getAttribute('href'), im ? im.alt : '', cap ? cap.textContent : '');
    });
  });

  /* ---------- 景点卡：折叠切换 + 主图点开进浮层 ---------- */
  document.querySelectorAll('.spot-card').forEach(function (card) {
    var fig = card.querySelector('.spot-photo');
    if (!fig) return;
    var main = fig.querySelector('.ph-view img');
    if (!main) return;
    var cap = fig.querySelector('.ph-cap');
    main.addEventListener('click', function () {
      var capTxt = cap && !cap.hasAttribute('hidden') ? cap.textContent : '';
      openLb(main.currentSrc || main.src, main.alt, capTxt);
    });
    var btn = fig.querySelector('.ph-count');
    var strip = fig.querySelector('.ph-strip');
    if (!btn || !strip) return;
    var txt = btn.querySelector('.ph-count-txt');
    var thumbs = strip.querySelectorAll('.ph-thumb');
    btn.addEventListener('click', function () {
      var willOpen = strip.hasAttribute('hidden');
      if (willOpen) { strip.removeAttribute('hidden'); } else { strip.setAttribute('hidden', ''); }
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      txt.textContent = willOpen ? '收起' : '共 ' + thumbs.length + ' 张';
      fig.classList.toggle('open', willOpen);
    });
    thumbs.forEach(function (th) {
      th.addEventListener('click', function () {
        if (th.classList.contains('on')) return;
        main.src = th.getAttribute('data-src');
        var alt = th.getAttribute('data-alt');
        if (alt) main.alt = alt;
        var pos = th.getAttribute('data-pos');
        if (pos) main.style.objectPosition = pos;
        if (cap) {
          var capTxt = th.getAttribute('data-cap') || '';
          cap.textContent = capTxt;
          if (capTxt) { cap.removeAttribute('hidden'); } else { cap.setAttribute('hidden', ''); }
        }
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
        thumbs.forEach(function (o) { o.classList.toggle('on', o === th); });
      });
    });
  });
})();
