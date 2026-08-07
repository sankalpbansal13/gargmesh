/**
 * GARG INDUSTRIAL MESH — shared nav behaviour
 * - Mobile menu toggle
 * - aria-current="page" on active nav link
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

  if (!nav) return;

  var page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "") page = "index.html";

  var links = nav.querySelectorAll('a[href]');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (!href) continue;
    var linkPage = href.split("/").pop().split("#")[0];
    if (linkPage === page) {
      links[i].setAttribute("aria-current", "page");
    } else {
      links[i].removeAttribute("aria-current");
    }
  }
})();
