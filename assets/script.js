/* =====================================================
   中创盛京官网 · 交互脚本
   ===================================================== */
(function () {
  'use strict';

  /* ---------- 1. 导航滚动态 ---------- */
  var nav = document.getElementById('nav');

  /* ---------- 2. 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.classList.toggle('is-x', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.classList.remove('is-x');
      document.body.style.overflow = '';
    }
  });

  /* ---------- 3. 数字滚动 ---------- */
  function decimalsOf(v) {
    var s = String(v);
    return s.indexOf('.') > -1 ? s.split('.')[1].length : 0;
  }
  function runCount(el) {
    if (el.dataset.running === '1') return;
    el.dataset.running = '1';
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = decimalsOf(el.getAttribute('data-to'));
    var duration = 1500;
    el.textContent = (0).toFixed(dec);
    var start = Date.now();
    var timer = setInterval(function () {
      var p = Math.min((Date.now() - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p >= 1) {
        clearInterval(timer);
        el.textContent = target.toFixed(dec);
      }
    }, 30);
  }

  /* ---------- 4. 进场 + 数字：基于可视检测 ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count'));

  function inView(el, ratio) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.top < h * (ratio || 0.94) && r.bottom > 0;
  }
  function update() {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('is-in') && el.style.display !== 'none' && inView(el)) {
        el.classList.add('is-in');
      }
    });
    counters.forEach(function (el) {
      if (el.dataset.running !== '1' && inView(el, 0.98)) runCount(el);
    });
  }
  var lastRun = 0;
  function onScrollFrame() {
    var now = Date.now();
    if (now - lastRun < 90) return;
    lastRun = now;
    update();
  }

  /* 定时巡检，确保任何滚动方式下都能正常进场 */
  var patrol = setInterval(function () {
    update();
    var pending = revealEls.filter(function (el) { return !el.classList.contains('is-in'); }).length;
    var counting = counters.filter(function (el) { return el.dataset.running !== '1'; }).length;
    if (pending === 0 && counting === 0) clearInterval(patrol);
  }, 150);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
    onScrollFrame();
  }, { passive: true });
  window.addEventListener('resize', onScrollFrame);

  if (window.scrollY > 40) nav.classList.add('is-solid');
  update();
  window.addEventListener('load', update);
  setTimeout(update, 300);

  /* ---------- 5. 案例筛选 ---------- */
  var filters = document.querySelectorAll('.case-filter button');
  var cards = document.querySelectorAll('#caseGrid .case');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-on'); });
      btn.classList.add('is-on');
      var key = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = card.getAttribute('data-cat') || '';
        var show = key === 'all' || cats.split(' ').indexOf(key) > -1;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.classList.remove('is-in');
          void card.offsetWidth;
          card.classList.add('is-in');
        }
      });
    });
  });

})();
