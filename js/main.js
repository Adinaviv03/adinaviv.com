(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  document.querySelector('.theme-toggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- active nav link ---------- */
  var navMap = {};
  links.querySelectorAll('a[href^="#"]').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && navMap[entry.target.id]) {
          Object.values(navMap).forEach(function (a) { a.classList.remove('active'); });
          navMap[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section-head, .tl-card, .project, .card, .course-group, .contact-card');
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); revealer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); revealer.observe(el); });
  }

  /* ---------- oscilloscope trace in hero ---------- */
  var trace = document.querySelector('.scope-trace');
  if (trace) {
    var W = 1200, H = 400, N = 240;
    var draw = function (t) {
      var d = '';
      for (var i = 0; i <= N; i++) {
        var x = (i / N) * W;
        var p = x / W;
        // damped chirp + small harmonic — reads as a captured waveform
        var y = H * 0.72 +
          Math.sin(p * 18 + t) * 38 * (0.35 + 0.65 * Math.sin(p * Math.PI)) +
          Math.sin(p * 61 + t * 1.7) * 6;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      trace.setAttribute('d', d);
    };
    if (reduceMotion) {
      draw(0);
    } else {
      var t0 = null, running = true;
      var loop = function (ts) {
        if (!running) return;
        if (t0 === null) t0 = ts;
        draw((ts - t0) / 1400);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      // pause when hero is off-screen
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
          var vis = e[0].isIntersecting;
          if (vis && !running) { running = true; requestAnimationFrame(loop); }
          running = vis;
        }).observe(document.querySelector('.hero'));
      }
    }
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var group = [], index = 0, lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var item = group[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.caption;
  }
  function open(items, i) {
    group = items;
    lastFocus = document.activeElement;
    lb.classList.toggle('single', items.length < 2);
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lightbox], [data-lightbox-src]');
    if (!trigger) return;
    if (trigger.dataset.lightboxSrc) {
      open([{ src: trigger.dataset.lightboxSrc, alt: trigger.dataset.caption, caption: trigger.dataset.caption }], 0);
      return;
    }
    var name = trigger.dataset.lightbox;
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + name + '"]'));
    var items = nodes.map(function (n) {
      var img = n.querySelector('img');
      return { src: img.src, alt: img.alt, caption: n.dataset.caption || img.alt };
    });
    open(items, nodes.indexOf(trigger));
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && group.length > 1) show(index - 1);
    else if (e.key === 'ArrowRight' && group.length > 1) show(index + 1);
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return b.offsetParent !== null && getComputedStyle(b).visibility !== 'hidden'; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
