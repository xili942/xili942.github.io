/* 题外 / 首页日记浮层：开关由纯 CSS :target 完成，这里补键盘与关闭按钮体验 */
(function () {
  'use strict';
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (location.hash === '#aside' || location.hash === '#diary')) history.back();
  });
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('.aside-close, .aside-backdrop') : null;
    if (!t) return;
    e.preventDefault();
    history.back();
  });
})();
