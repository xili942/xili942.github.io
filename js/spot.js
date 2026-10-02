/* 多图折叠：点「共 N 张」展开缩略图条；点缩略图切换主图。
 * 与样板页逻辑一致；六边图已由构建期生成，不在此处渲染。 */
(function () {
  document.querySelectorAll('.spot-card').forEach(function (card) {
    var fig = card.querySelector('.spot-photo');
    if (!fig) return;
    var btn = fig.querySelector('.ph-count');
    var strip = fig.querySelector('.ph-strip');
    var main = fig.querySelector('.ph-view img');
    if (!btn || !strip || !main) return;
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
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
        thumbs.forEach(function (o) { o.classList.toggle('on', o === th); });
      });
    });
  });
})();
