// Garg Industrial Mesh — interactions (vanilla, IntersectionObserver-based reveals)
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Sticky header shrink ---
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav drawer ---
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    var open = function () {
      nav.classList.add('nav-drawer', 'open');
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      if (!nav.querySelector('.drawer-close')) {
        var close = document.createElement('button');
        close.className = 'drawer-close';
        close.setAttribute('aria-label', 'Close menu');
        close.innerHTML = '&times;';
        nav.insertBefore(close, nav.firstChild);
        close.addEventListener('click', closeNav);
      }
    };
    var closeNav = function () {
      nav.classList.remove('open');
      backdrop.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () { nav.classList.contains('open') ? closeNav() : open(); });
    backdrop.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  // --- Accordion ---
  document.querySelectorAll('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var isOpen = item.classList.contains('open');
      var acc = item.closest('.accordion');
      if (acc) acc.querySelectorAll('.acc-item.open').forEach(function (i) {
        if (i !== item) { i.classList.remove('open'); i.querySelector('.acc-head').setAttribute('aria-expanded', 'false'); }
      });
      item.classList.toggle('open');
      head.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // --- Product image slider / carousel ---
  var slider = document.querySelector('.slider');
  if (slider) {
    var track = slider.querySelector('.slider-track');
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var dotsWrap = slider.querySelector('.slider-dots');
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    var thumbsWrap = document.getElementById('pdThumbs');
    var count = slides.length;
    var index = 0;
    var timer = null;
    var INTERVAL = 4500;

    function go(i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
          d.classList.toggle('active', di === index);
        });
      }
      if (thumbsWrap) {
        Array.prototype.forEach.call(thumbsWrap.children, function (t, ti) {
          var on = ti === index;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function start() { if (count > 1 && !reduceMotion) { stop(); timer = setInterval(next, INTERVAL); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (count > 1) {
      if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
          d.addEventListener('click', function () { go(di); start(); });
        });
      }
      if (thumbsWrap) {
        Array.prototype.forEach.call(thumbsWrap.children, function (t, ti) {
          t.addEventListener('click', function () { go(ti); start(); });
        });
      }
      // pause on hover (desktop)
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      // swipe / drag on touch
      var startX = 0, dragging = false, dx = 0;
      slider.addEventListener('touchstart', function (e) { stop(); startX = e.touches[0].clientX; dragging = true; }, { passive: true });
      slider.addEventListener('touchmove', function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
      slider.addEventListener('touchend', function () {
        if (dragging && Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        dragging = false; dx = 0; start();
      }, { passive: true });
      // pause when tab hidden
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      go(0);
      start();
    }
  }

  // --- Prefill enquiry message with selected variant ---
  var variant = document.getElementById('variantSelect');
  var msgField = document.querySelector('textarea[name="message"]');
  if (variant && msgField && msgField.dataset.product) {
    var baseName = msgField.dataset.product;
    variant.addEventListener('change', function () {
      msgField.value = "I'm interested in " + baseName + " (" + variant.value + "). Please share price & availability.";
    });
  }

  // --- Scroll reveal: never leave content invisible ---
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  function showAllReveals() {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  function markInView() {
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) + 80 && r.bottom > -40) {
        el.classList.add('is-visible');
      }
    });
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAllReveals();
  } else {
    markInView();
    document.documentElement.classList.add('js-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '80px 0px 80px 0px', threshold: 0.01 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety: if anything is still hidden after load/scroll settle, show it
    setTimeout(showAllReveals, 900);
    window.addEventListener('load', function () {
      setTimeout(showAllReveals, 200);
    });
  }

  // --- Mobile filter toggle ---
  var filterToggle = document.getElementById('filterToggle');
  var filterSidebar = document.getElementById('filterSidebar');
  if (filterToggle && filterSidebar) {
    var syncFilterLabel = function () {
      var open = filterSidebar.classList.contains('is-open');
      filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      filterToggle.textContent = open ? 'Hide filters' : 'Filter products';
    };
    syncFilterLabel();
    filterToggle.addEventListener('click', function () {
      filterSidebar.classList.toggle('is-open');
      syncFilterLabel();
    });
  }

  // --- Hide utility bar on scroll (mobile) ---
  var utilBar = document.querySelector('.utility-bar');
  var lastY = 0;
  if (utilBar) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      if (y > 60 && y > lastY) utilBar.classList.add('util-hidden');
      else utilBar.classList.remove('util-hidden');
      lastY = y;
    }, { passive: true });
  }
})();

// ============================================================
// Enquiry cart (localStorage) + GA4 hooks + back-to-top + loading state
// ============================================================
(function () {
  'use strict';
  var CART_KEY = 'gim_enquiry_cart';
  var WA = '919910238277';

  function readCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
  function writeCart(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} }

  function ga(name, data) {
    // GA4-style event hook. Wire analytics by listening for these on window.
    try { window.dispatchEvent(new CustomEvent('gim:analytics', { detail: { name: name, data: data || {} } })); } catch (e) {}
    if (typeof window.gtag === 'function') { try { window.gtag('event', name, data || {}); } catch (e) {} }
  }

  // Delegate GA4 data-ga clicks
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-ga]');
    if (el) ga(el.getAttribute('data-ga'), { label: el.getAttribute('aria-label') || el.textContent.trim().slice(0,40) });
  });

  // ---- Cart rendering ----
  var fabCart = document.getElementById('fabCart');
  var cartBadge = document.getElementById('cartBadge');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartBackdrop = document.getElementById('cartBackdrop');
  var cartBody = document.getElementById('cartBody');
  var cartEmpty = document.getElementById('cartEmpty');
  var cartFoot = document.getElementById('cartFoot');
  var cartSendWa = document.getElementById('cartSendWa');
  var cartClear = document.getElementById('cartClear');
  var cartClose = document.getElementById('cartClose');

  function renderCart() {
    var cart = readCart();
    if (cartBadge) cartBadge.textContent = cart.length;
    if (fabCart) fabCart.style.display = cart.length ? 'flex' : 'none';
    if (!cartBody) return;
    if (!cart.length) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      cartBody.innerHTML = '';
      if (cartFoot) cartFoot.style.display = 'none';
      return;
    }
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFoot) cartFoot.style.display = 'block';
    cartBody.textContent = '';
    cart.forEach(function (it) {
      var row = document.createElement('div');
      row.className = 'cart-item';
      var info = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = it.name || '';
      info.appendChild(strong);
      info.appendChild(document.createElement('br'));
      var link = document.createElement('a');
      var slug = String(it.slug || '').replace(/[^a-z0-9-]/gi, '');
      link.href = '/products/' + slug;
      link.textContent = 'view product';
      info.appendChild(link);
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'cart-rm';
      rm.setAttribute('data-rm', String(it.id));
      rm.setAttribute('aria-label', 'Remove ' + (it.name || ''));
      rm.textContent = '\u00d7';
      row.appendChild(info);
      row.appendChild(rm);
      cartBody.appendChild(row);
    });
    // Build WhatsApp message with all products
    var lines = cart.map(function (it) { return '\u2022 ' + it.name; });
    var msg = "Hi Garg Industrial Mesh, I'd like a quote for the following products:\n" + lines.join("\n") + "\n\nPlease share price & availability.";
    if (cartSendWa) cartSendWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  function openCart() { if (cartDrawer) { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); } if (cartBackdrop) cartBackdrop.classList.add('open'); }
  function closeCart() { if (cartDrawer) { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); } if (cartBackdrop) cartBackdrop.classList.remove('open'); }

  if (fabCart) fabCart.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (cartClear) cartClear.addEventListener('click', function () { writeCart([]); renderCart(); });

  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm]');
    if (rm) {
      var id = rm.getAttribute('data-rm');
      writeCart(readCart().filter(function (it) { return String(it.id) !== String(id); }));
      renderCart();
    }
  });

  // Add-to-enquiry buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-enquiry]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var name = btn.getAttribute('data-name');
    var slug = btn.getAttribute('data-slug');
    var cart = readCart();
    if (cart.some(function (it) { return String(it.id) === String(id); })) {
      // already added -> open cart
      openCart();
      return;
    }
    cart.push({ id: id, name: name, slug: slug });
    writeCart(cart);
    renderCart();
    var orig = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Added \u00b7 View Enquiry';
    ga('add_to_enquiry', { id: id, name: name });
    setTimeout(function () { btn.classList.remove('added'); btn.innerHTML = orig; }, 1800);
  });

  renderCart();

  // ---- Back to top ----
  var btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) btt.classList.add('show'); else btt.classList.remove('show');
    }, { passive: true });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ---- Loading state on enquiry form submit ----
  document.querySelectorAll('form[action="/enquiry"]').forEach(function (f) {
    f.addEventListener('submit', function () {
      var btn = f.querySelector('button[type="submit"]');
      if (btn) { btn.classList.add('is-loading'); setTimeout(function () { btn.classList.remove('is-loading'); }, 4000); }
    });
  });
})();
