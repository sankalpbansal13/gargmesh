/**
 * GARG INDUSTRIAL MESH — nav + TOC behaviour
 * - Mobile menu toggle
 * - Mobile TOC collapse
 * - aria-current="page" on active nav link
 * - Optional in-page TOC active section highlight
 */
(function () {
  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Mark current page in site nav */
  if (nav) {
    var page = window.location.pathname.split("/").pop() || "index.html";
    if (page === "") page = "index.html";

    var links = nav.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href) continue;
      var linkPage = href.split("/").pop().split("#")[0];
      if (linkPage === page || (linkPage === "" && page === "index.html")) {
        links[i].setAttribute("aria-current", "page");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  /* Mobile TOC toggle */
  var toc = document.querySelector(".toc");
  var tocToggle = document.querySelector(".toc-toggle");
  if (toc && tocToggle) {
    tocToggle.addEventListener("click", function () {
      var open = toc.classList.toggle("is-open");
      tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
      tocToggle.textContent = open ? "Hide" : "Show";
    });
  }

  /* Close mobile nav after in-page anchor click */
  if (nav && btn) {
    nav.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.tagName === "A" && t.getAttribute("href") && t.getAttribute("href").charAt(0) === "#") {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Highlight TOC link for section in view */
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && "IntersectionObserver" in window) {
    var sections = [];
    for (var j = 0; j < tocLinks.length; j++) {
      var id = tocLinks[j].getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: tocLinks[j] });
    }

    if (sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            for (var k = 0; k < sections.length; k++) {
              if (sections[k].id === id) {
                sections[k].link.classList.add("is-active");
              } else {
                sections[k].link.classList.remove("is-active");
              }
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );

      for (var m = 0; m < sections.length; m++) {
        observer.observe(sections[m].el);
      }
    }
  }
})();
