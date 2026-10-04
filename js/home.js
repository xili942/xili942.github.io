/* 滚动渐显：有 JS 才隐藏初始态（html.js），进入视口后逐条淡入。
 * 兜底：若 2 秒内一次回调都没发生（个别环境不支持观察器），全部直接显示。 */
document.documentElement.classList.add('js');
(function () {
  var els = document.querySelectorAll('.reveal');
  var show = function (el) { el.classList.add('in'); };
  if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
  var fired = false;
  var io = new IntersectionObserver(function (entries) {
    fired = true;
    entries.forEach(function (en) {
      if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  els.forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 70 + 'ms';
    io.observe(el);
  });
  setTimeout(function () { if (!fired) els.forEach(show); }, 2000);
})();
