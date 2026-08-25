/* ============================================================
   Renders the page from content.js.
   You should not need to edit this file — edit content.js.
   ============================================================ */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) { console.error("content.js did not load."); return; }

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var js = function (name, root) { return (root || document).querySelector('[data-js="' + name + '"]'); };

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function slate(note) {
    return '<div class="slate"><span class="slate__ratio">9:16</span>' +
           '<span class="slate__note">' + esc(note) + '</span></div>';
  }

  /* A 9:16 frame: real media if a file is given, labelled slate if not.
     A missing file falls back to the slate rather than a black rectangle. */
  function frame(item, opts) {
    var inner;
    if (item.video) {
      inner = '<video muted loop playsinline preload="metadata" data-slate="' + esc(opts.slateNote) + '"' +
              (item.poster ? ' poster="' + esc(item.poster) + '"' : "") +
              ' src="' + esc(item.video) + '"></video>';
    } else if (item.poster) {
      inner = '<img src="' + esc(item.poster) + '" alt="" loading="lazy" data-slate="' + esc(opts.slateNote) + '">';
    } else {
      inner = slate(opts.slateNote);
    }
    return '<div class="frame">' + inner +
           (item.video || item.link ? '<span class="tile__play" aria-hidden="true">▶</span>' : "") +
           '<div class="safe" aria-hidden="true"><span class="safe__box">' +
           '<b class="safe__tag">Safe zone</b></span></div></div>';
  }

  function head(title, meta, note) {
    return '<div class="section__head">' +
             '<h2 class="section__title">' + esc(title) + '</h2>' +
             (meta ? '<p class="mono section__meta">' + esc(meta) + '</p>' : "") +
           '</div>' +
           (note ? '<p class="section__note">' + esc(note) + '</p>' : "");
  }

  /* ---------------- sections ---------------- */

  var render = {

    work: function (c) {
      var items = c.items || [];
      var tiles = items.map(function (it, i) {
        var slate = it.video || "assets/work/" + String(i + 1).padStart(2, "0") + ".mp4";
        var open  = it.link
          ? '<a class="tile__btn" href="' + esc(it.link) + '" target="_blank" rel="noopener">'
          : '<button class="tile__btn" type="button" data-play="' + i + '">';
        var close = it.link ? "</a>" : "</button>";
        return '<li class="tile">' + open +
                 frame(it, { slateNote: slate }) +
                 '<span class="tile__cap">' +
                   '<span><span class="tile__brand">' + esc(it.brand) + '</span>' +
                   '<span class="tile__title">' + esc(it.title) + '</span></span>' +
                   '<span class="tile__plat">' + esc(it.platform) + '</span>' +
                 '</span>' +
               close + '</li>';
      }).join("");

      return '<ul class="work">' + tiles + '</ul>';
    },

    stats: function (c) {
      var rows = (c.platforms || []).map(function (p) {
        var handle = p.url
          ? '<a class="plat__handle" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.handle) + '</a>'
          : '<span class="plat__handle">' + esc(p.handle) + '</span>';
        return '<tr>' +
                 '<td><span class="plat__name">' + esc(p.platform) + '</span>' + handle + '</td>' +
                 '<td>' + esc(p.followers) + '</td>' +
                 '<td>' + esc(p.avgViews) + '</td>' +
                 '<td>' + esc(p.engagement) + '</td>' +
               '</tr>';
      }).join("");

      var table = '<table class="table"><thead><tr>' +
                    '<th scope="col">Platform</th><th scope="col">Followers</th>' +
                    '<th scope="col">Avg views</th><th scope="col">Engagement</th>' +
                  '</tr></thead><tbody>' + rows + '</tbody></table>';

      var aud = (c.audience && c.audience.length)
        ? '<dl class="audience">' + c.audience.map(function (a) {
            return '<div><dt>' + esc(a.label) + '</dt><dd>' + esc(a.value) + '</dd></div>';
          }).join("") + '</dl>'
        : "";

      return table + aud;
    },

    services: function (c) {
      var packs = (c.packages || []).map(function (p) {
        return '<div class="pack">' +
                 '<h3 class="pack__name">' + esc(p.name) + '</h3>' +
                 '<p class="pack__price">' + esc(p.price) + '</p>' +
                 '<ul class="pack__list">' +
                   (p.deliverables || []).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") +
                 '</ul>' +
               '</div>';
      }).join("");

      var addons = (c.addons && c.addons.length)
        ? '<div class="addons"><p class="eyebrow eyebrow--muted">Add-ons</p>' +
          '<table class="table"><tbody>' +
            c.addons.map(function (a) {
              return '<tr><td>' + esc(a.name) + '</td><td>' + esc(a.price) + '</td></tr>';
            }).join("") +
          '</tbody></table></div>'
        : "";

      return '<div class="packs">' + packs + '</div>' + addons;
    },

    brands: function (c) {
      var list = '<ul class="brands">' + (c.list || []).map(function (b) {
        var inner = b.url
          ? '<a href="' + esc(b.url) + '" target="_blank" rel="noopener">' + esc(b.name) + '</a>'
          : '<span>' + esc(b.name) + '</span>';
        return '<li>' + inner + '</li>';
      }).join("") + '</ul>';

      var quote = c.quote
        ? '<figure class="quote"><blockquote>“' + esc(c.quote.text) + '”</blockquote>' +
          '<figcaption class="mono">' + esc(c.quote.attribution) + '</figcaption></figure>'
        : "";

      return list + quote;
    }
  };

  /* ---------------- build ---------------- */

  var ORDER = [
    { key: "work",     meta: function (c) { return (c.items || []).length + " pieces"; } },
    { key: "stats",    meta: function ()  { return "Updated " + new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }); } },
    { key: "services", meta: function ()  { return "USD"; } },
    { key: "brands",   meta: function (c) { return (c.list || []).length + " partners"; } }
  ];

  var main = $("#sections");
  var navItems = [];
  var html = "";
  var washNext = false;

  /* Visit ?preview=all to see every section, including the disabled ones,
     without editing content.js. Nothing else on the page changes. */
  var previewAll = new URLSearchParams(location.search).get("preview") === "all";

  ORDER.forEach(function (def) {
    var c = S.sections[def.key];
    if (!c || (c.enabled === false && !previewAll)) return;

    navItems.push({ id: def.key, label: c.title });
    html += '<section class="section' + (washNext ? " section--wash" : "") + '" id="' + def.key + '">' +
              '<div class="wrap">' +
                head(c.title, def.meta(c), c.note) +
                render[def.key](c) +
              '</div>' +
            '</section>';
    washNext = !washNext;
  });

  /* Contact always renders last. */
  var ct = S.sections.contact;
  navItems.push({ id: "contact", label: ct.title });
  html += '<section class="section contact" id="contact"><div class="wrap">' +
            '<div class="section__head">' +
              '<h2 class="section__title">' + esc(ct.title) + '</h2>' +
              '<p class="mono section__meta">' + esc(S.location) + '</p>' +
            '</div>' +
            '<div class="contact__grid">' +
              '<div>' +
                '<a class="contact__mail" href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>' +
                '<div class="contact__socials">' +
                  (S.socials || []).map(function (s) {
                    return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>';
                  }).join("") +
                '</div>' +
              '</div>' +
              '<div>' +
                '<p class="contact__pitch">' + esc(ct.pitch) + '</p>' +
                '<a class="btn btn--lg" href="mailto:' + esc(S.email) +
                  '?subject=' + encodeURIComponent("Project inquiry — " + S.name) + '">' +
                  esc(ct.ctaLabel) + '</a>' +
              '</div>' +
            '</div>' +
          '</div></section>';

  main.innerHTML = html;

  /* Sections exist only after the line above, so the browser has already given
     up on any #hash in the URL. Re-apply it now. */
  if (location.hash.length > 1) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      var land = function () { target.scrollIntoView({ behavior: "auto", block: "start" }); };
      land();
      // Web fonts land after first paint and reflow the page under the anchor.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(land);
      window.addEventListener("load", land, { once: true });
    }
  }

  /* ---------------- masthead + chrome ---------------- */

  document.title = S.name + " — " + S.role;
  js("wordmark").textContent = S.name;
  js("hero-eyebrow").textContent = S.role + " · " + S.location;
  js("thesis").textContent = S.thesis;
  js("footer-name").textContent = S.name;
  js("year").textContent = "© " + new Date().getFullYear();

  js("masthead").innerHTML = S.name.split(" ").map(function (w) {
    return '<span class="word"><span>' + esc(w) + "</span></span>";
  }).join("");

  js("facts").innerHTML = (S.facts || []).map(function (f) {
    return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
  }).join("");

  if (S.availability && S.availability.enabled) {
    js("availability-text").textContent = S.availability.text;
    js("availability").hidden = false;
  }

  js("nav").innerHTML = navItems.map(function (n) {
    return '<li><a href="#' + n.id + '">' + esc(n.label) + "</a></li>";
  }).join("");

  /* "See the work" points at the first live section. */
  var first = navItems[0];
  js("hero-alt").setAttribute("href", "#" + first.id);
  js("hero-alt").textContent = first.id === "contact" ? "Get in touch" : "See the work";
  js("hero-cta").textContent = ct.ctaLabel;
  js("topcta").textContent = "Get in touch";

  /* A file that 404s shows the slate with its expected path, not a black box.
     Media errors don't bubble, so listen in the capture phase. */
  main.addEventListener("error", function (e) {
    var el = e.target;
    if (!el.dataset || !("slate" in el.dataset)) return;
    var f = el.closest(".frame");
    if (!f) return;
    el.remove();
    var badge = f.querySelector(".tile__play");
    if (badge) badge.remove();
    var btn = f.closest("[data-play]");
    if (btn) { btn.disabled = true; btn.style.cursor = "default"; }
    f.insertAdjacentHTML("afterbegin", slate(el.dataset.slate));
  }, true);

  /* ---------------- hover preview ---------------- */

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!calm) {
    main.addEventListener("mouseover", function (e) {
      var tile = e.target.closest(".tile");
      if (!tile) return;
      var v = tile.querySelector("video");
      if (v && v.paused) { var p = v.play(); if (p) p.catch(function () {}); }
    });
    main.addEventListener("mouseout", function (e) {
      var tile = e.target.closest(".tile");
      if (!tile || tile.contains(e.relatedTarget)) return;
      var v = tile.querySelector("video");
      if (v) { v.pause(); v.currentTime = 0; }
    });
  }

  /* ---------------- player ---------------- */

  var box     = js("lightbox");
  var stage   = js("lightbox-stage");
  var caption = js("lightbox-caption");
  var closeBtn = js("lightbox-close");
  var lastFocus = null;

  function openPlayer(item) {
    if (!item.video) return;
    lastFocus = document.activeElement;
    stage.innerHTML = '<video controls autoplay playsinline' +
      (item.poster ? ' poster="' + esc(item.poster) + '"' : "") +
      '><source src="' + esc(item.video) + '" type="video/mp4"></video>';
    caption.textContent = [item.brand, item.title, item.platform].filter(Boolean).join(" · ");
    box.hidden = false;
    document.body.classList.add("is-locked");
    closeBtn.focus();
  }

  function closePlayer() {
    box.hidden = true;
    stage.innerHTML = "";
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }

  main.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-play]");
    if (!btn) return;
    var item = S.sections.work.items[Number(btn.dataset.play)];
    if (item && item.video) openPlayer(item);
  });

  closeBtn.addEventListener("click", closePlayer);
  box.addEventListener("click", function (e) { if (e.target === box) closePlayer(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) closePlayer();
  });

  /* ---------------- nav current-section ---------------- */

  var links = {};
  js("nav").querySelectorAll("a").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var a = links[en.target.id];
      if (!a) return;
      if (en.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-55% 0px -43% 0px" });

  main.querySelectorAll("section[id]").forEach(function (s) { spy.observe(s); });

})();
