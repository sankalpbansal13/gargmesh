// Garg Industrial Mesh — interactions (vanilla, IntersectionObserver-based reveals)
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero: phase 1 circle-reveal (perforated), then 5s sheet-type carousel ---
  var hero = document.getElementById('heroBrand');
  if (hero && hero.classList.contains('hero-reveal')) {
    var canvas = document.getElementById('heroMeshCanvas');
    var photoA = document.getElementById('heroPhotoA');
    var photoB = document.getElementById('heroPhotoB');
    var media = hero.querySelector('.hero-media');
    var typeEl = document.getElementById('heroType');
    var blurbEl = document.getElementById('heroBlurb');
    var cardEl = document.getElementById('heroCard');
    var dotsEl = document.getElementById('heroDots');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var slides = [];
    try { slides = JSON.parse(hero.getAttribute('data-hero-slides') || '[]'); } catch (e) { slides = []; }
    if (!slides.length) {
      slides = [{ src: '/hero-mesh.jpg', label: 'Perforated sheets', blurb: '' }];
    }

    var slideIndex = 0;
    var activeIsA = true;
    var carouselTimer = null;
    var transitioning = false;
    var HOLD_MS = 5000;
    var FADE_MS = 900;

    function coverDraw(dw, dh, iw, ih) {
      var scale = Math.max(dw / iw, dh / ih);
      var w = iw * scale;
      var h = ih * scale;
      return { x: (dw - w) / 2, y: (dh - h) / 2, w: w, h: h };
    }

    function loadImg(src) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = reject;
        img.src = src;
      });
    }

    function setSlideCopy(slide) {
      var apply = function () {
        if (typeEl) typeEl.textContent = slide.label || '';
        if (blurbEl) blurbEl.textContent = slide.blurb || '';
        if (cardEl) cardEl.classList.remove('is-swap');
      };
      if (cardEl) {
        cardEl.classList.add('is-swap');
        window.setTimeout(apply, 180);
      } else {
        apply();
      }
    }

    function syncDots() {
      if (!dotsEl) return;
      var buttons = dotsEl.querySelectorAll('.hero-dot');
      Array.prototype.forEach.call(buttons, function (btn, i) {
        btn.classList.toggle('is-on', i === slideIndex);
        btn.setAttribute('aria-selected', i === slideIndex ? 'true' : 'false');
      });
    }

    function buildDots() {
      if (!dotsEl || slides.length < 2) return;
      dotsEl.textContent = '';
      slides.forEach(function (slide, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-dot' + (i === 0 ? ' is-on' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', slide.label);
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', function () { goToSlide(i, true); });
        dotsEl.appendChild(btn);
      });
    }

    function clearCarouselTimer() {
      if (carouselTimer) {
        window.clearTimeout(carouselTimer);
        carouselTimer = null;
      }
    }

    function scheduleNext() {
      clearCarouselTimer();
      if (slides.length < 2 || reduceMotion) return;
      carouselTimer = window.setTimeout(function () {
        if (document.hidden) {
          scheduleNext();
          return;
        }
        goToSlide((slideIndex + 1) % slides.length, false);
      }, HOLD_MS);
    }

    function whenReady(imgEl) {
      if (imgEl.complete && imgEl.naturalWidth) return Promise.resolve();
      if (imgEl.decode) return imgEl.decode().catch(function () {});
      return new Promise(function (resolve) {
        imgEl.addEventListener('load', resolve, { once: true });
        imgEl.addEventListener('error', resolve, { once: true });
      });
    }

    function goToSlide(nextIndex, fromUser) {
      if (!photoA || !photoB || nextIndex === slideIndex || transitioning) {
        if (fromUser) scheduleNext();
        return;
      }
      if (reduceMotion) {
        slideIndex = nextIndex;
        var layer = activeIsA ? photoA : photoB;
        layer.src = slides[slideIndex].src;
        setSlideCopy(slides[slideIndex]);
        syncDots();
        return;
      }

      transitioning = true;
      clearCarouselTimer();
      var current = activeIsA ? photoA : photoB;
      var next = activeIsA ? photoB : photoA;
      slideIndex = nextIndex;
      next.src = slides[slideIndex].src;

      whenReady(next).then(function () {
        next.classList.remove('is-active');
        void next.offsetWidth;
        next.classList.add('is-incoming');
        setSlideCopy(slides[slideIndex]);
        syncDots();

        window.setTimeout(function () {
          current.classList.remove('is-active');
          next.classList.remove('is-incoming');
          next.classList.add('is-active');
          hero.classList.remove('hero-carousel-on');
          void hero.offsetWidth;
          hero.classList.add('hero-carousel-on');
          activeIsA = !activeIsA;
          transitioning = false;
          scheduleNext();
        }, FADE_MS);
      });
    }

    function stepSlide(dir) {
      if (slides.length < 2) return;
      var nextIndex = (slideIndex + dir + slides.length) % slides.length;
      goToSlide(nextIndex, true);
    }

    function startCarousel() {
      hero.classList.add('hero-carousel-on');
      buildDots();
      setSlideCopy(slides[0]);
      syncDots();
      if (prevBtn) prevBtn.addEventListener('click', function () { stepSlide(-1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { stepSlide(1); });
      slides.forEach(function (s, i) {
        if (i === 0) return;
        var img = new Image();
        img.src = s.src;
      });
      if (!reduceMotion) scheduleNext();
    }

    var finish = function () {
      hero.classList.remove('hero-reveal-photo');
      hero.classList.add('hero-reveal-done');
      startCarousel();
    };
    var startPhotoPhase = function () {
      hero.classList.add('hero-reveal-photo');
      window.setTimeout(finish, 1500);
    };

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearCarouselTimer();
      else if (hero.classList.contains('hero-reveal-done') && !transitioning) scheduleNext();
    });

    if (reduceMotion || !canvas || !photoA || !media) {
      if (photoA) {
        photoA.classList.add('is-active');
        photoA.style.opacity = '1';
      }
      hero.classList.add('hero-reveal-done');
      startCarousel();
    } else {
      Promise.all([
        loadImg('/hero-mesh-outline.jpg'),
        photoA.decode ? photoA.decode().catch(function () {}) : Promise.resolve()
      ]).then(function (results) {
        var outline = results[0];
        var ctx = canvas.getContext('2d');
        if (!ctx || !outline) {
          hero.classList.add('hero-reveal-done');
          startCarousel();
          return;
        }

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var resize = function () {
          var rect = media.getBoundingClientRect();
          var cssW = Math.max(1, Math.round(rect.width));
          var cssH = Math.max(1, Math.round(rect.height));
          canvas.style.width = cssW + 'px';
          canvas.style.height = cssH + 'px';
          canvas.width = Math.round(cssW * dpr);
          canvas.height = Math.round(cssH * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          return { w: cssW, h: cssH };
        };

        var size = resize();
        var fit = coverDraw(size.w, size.h, outline.naturalWidth, outline.naturalHeight);

        var full = document.createElement('canvas');
        full.width = canvas.width;
        full.height = canvas.height;
        var fctx = full.getContext('2d');
        fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        fctx.fillStyle = '#070809';
        fctx.fillRect(0, 0, size.w, size.h);
        fctx.drawImage(outline, fit.x, fit.y, fit.w, fit.h);

        var spacing = Math.max(22, Math.round(Math.min(size.w, size.h) / 28));
        var radius = spacing * 0.62;
        var cols = Math.ceil(size.w / spacing) + 3;
        var rows = Math.ceil(size.h / (spacing * 0.86)) + 3;
        var cells = [];
        var r, c, x, y;
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            x = c * spacing + (r % 2 ? spacing * 0.5 : 0) - spacing * 0.5;
            y = r * spacing * 0.86 - spacing * 0.5;
            cells.push({
              x: x,
              y: y,
              order: (x - size.w * 0.2) * 0.55 + (y - size.h * 0.75) * 0.8
            });
          }
        }
        cells.sort(function (a, b) { return a.order - b.order; });

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#070809';
        ctx.fillRect(0, 0, size.w, size.h);

        var i = 0;
        var perFrame = Math.max(6, Math.ceil(cells.length / 85));
        var drawBatch = function () {
          var end = Math.min(i + perFrame, cells.length);
          for (; i < end; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(cells[i].x, cells[i].y, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(full, 0, 0, canvas.width, canvas.height, 0, 0, size.w, size.h);
            ctx.restore();
          }
          if (i < cells.length) {
            requestAnimationFrame(drawBatch);
          } else {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.drawImage(full, 0, 0, canvas.width, canvas.height, 0, 0, size.w, size.h);
            window.setTimeout(startPhotoPhase, 320);
          }
        };
        requestAnimationFrame(drawBatch);
      }).catch(function () {
        hero.classList.add('hero-reveal-done');
        startCarousel();
      });
    }
  }

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
      nav.classList.add('open');
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      if (!nav.querySelector('.drawer-close')) {
        var close = document.createElement('button');
        close.type = 'button';
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
      document.documentElement.style.overflow = '';
    };
    toggle.addEventListener('click', function () { nav.classList.contains('open') ? closeNav() : open(); });
    backdrop.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });
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
  function markEnquiryButtons() {
    var cart = readCart();
    var ids = {};
    cart.forEach(function (it) { ids[String(it.id)] = true; });
    document.querySelectorAll('[data-add-enquiry]').forEach(function (btn) {
      var id = String(btn.getAttribute('data-id') || '');
      if (ids[id]) {
        btn.classList.add('added');
        btn.textContent = 'Added';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('added');
        if (btn.getAttribute('data-label')) btn.textContent = btn.getAttribute('data-label');
        else if (btn.classList.contains('pc-enquiry')) btn.textContent = 'Add to enquiry';
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  if (cartClear) cartClear.addEventListener('click', function () {
    writeCart([]);
    renderCart();
    markEnquiryButtons();
  });

  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm]');
    if (rm) {
      var id = rm.getAttribute('data-rm');
      writeCart(readCart().filter(function (it) { return String(it.id) !== String(id); }));
      renderCart();
      markEnquiryButtons();
    }
  });

  // Add-to-enquiry: first click adds + "Added"; later clicks open enquiry list
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-enquiry]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var name = btn.getAttribute('data-name');
    var slug = btn.getAttribute('data-slug');
    if (!btn.getAttribute('data-label')) {
      btn.setAttribute('data-label', (btn.textContent || '').trim() || 'Add to enquiry');
    }
    var cart = readCart();
    var already = cart.some(function (it) { return String(it.id) === String(id); });
    if (already || btn.classList.contains('added')) {
      openCart();
      return;
    }
    cart.push({ id: id, name: name, slug: slug });
    writeCart(cart);
    renderCart();
    btn.classList.add('added');
    btn.textContent = 'Added';
    btn.setAttribute('aria-pressed', 'true');
    ga('add_to_enquiry', { id: id, name: name });
  });

  renderCart();
  markEnquiryButtons();

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
