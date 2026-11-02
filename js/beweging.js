// ============================================================================
// BEWEGING (Rims keuze van 2-11-2026). De bijbehorende opmaak staat achteraan css/style.css ("BEWEGING").
// Wordt NA js/main.js geladen (zie index.html).
// Geen video, niets over Rims foto's op Home: de foto's zelf komen tot leven.
// ============================================================================
(function () {
  "use strict";
  var rustig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rustig) return;
  var zwaar = window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;
  document.documentElement.classList.add("up-js");
  setTimeout(function () {
    document.documentElement.classList.add("up-klaar");
  }, 4000);

  // ---------- 1. de kop letter voor letter ----------
  var h1 = document.querySelector(".v3-hero h1");
  if (h1 && !h1.querySelector(".up-letter")) {
    var n = 0;
    (function splits(node) {
      if (node.nodeType === 3) {
        // elk woord in één stuk (zodat het nooit midden in een woord afbreekt), elke letter apart erin
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (deel) {
          if (!deel) return;
          if (/^\s+$/.test(deel)) return frag.appendChild(document.createTextNode(" "));
          var w = document.createElement("span");
          w.className = "up-woord";
          deel.split("").forEach(function (ch) {
            var s = document.createElement("span");
            s.className = "up-letter";
            s.style.setProperty("--i", n++);
            s.textContent = ch;
            w.appendChild(s);
          });
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        Array.prototype.slice.call(node.childNodes).forEach(splits);
      }
    })(h1);
  }

  // ---------- 2. de sfeer bovenaan: kleurwas, lichtvlek, sneeuw of warme vonkjes ----------
  var hero = document.querySelector("section.v3-hero");
  if (hero) {
    var sfeer = document.createElement("div");
    sfeer.className = "up-sfeer";
    hero.insertBefore(sfeer, hero.firstChild);
  }
  if (zwaar) {
    ["section.v3-hero", "section.v3-offer"].forEach(function (sel) {
      var sec = document.querySelector(sel);
      if (!sec) return;
      var g = document.createElement("div");
      g.className = "up-glow";
      sec.insertBefore(g, sec.firstChild);
      sec.addEventListener("mousemove", function (ev) {
        var r = sec.getBoundingClientRect();
        g.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
        g.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }
  // deeltjes: sneeuwvlokjes bij koelen, warme vonkjes bij verwarmen (enkel computer, enkel in beeld)
  if (hero && zwaar) {
    var cv = document.createElement("canvas");
    cv.className = "up-deeltjes";
    hero.insertBefore(cv, hero.firstChild);
    var ctx = cv.getContext("2d");
    var deeltjes = [],
      W = 0,
      Hh = 0,
      inBeeld = false,
      raf = 0;
    function maat() {
      var r = hero.getBoundingClientRect();
      W = cv.width = Math.round(r.width);
      Hh = cv.height = Math.round(r.height);
    }
    function nieuw(p) {
      var warm = document.body.classList.contains("rt-warm");
      p.x = Math.random() * W;
      p.y = warm ? Hh + 10 : -10;
      p.r = warm ? 0.8 + Math.random() * 1.6 : 1 + Math.random() * 2.2;
      p.vy = warm ? -(0.25 + Math.random() * 0.5) : 0.3 + Math.random() * 0.6;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.a = 0.25 + Math.random() * 0.5;
      p.w = Math.random() * Math.PI * 2;
      return p;
    }
    function teken() {
      raf = 0;
      if (!inBeeld) return;
      var warm = document.body.classList.contains("rt-warm");
      ctx.clearRect(0, 0, W, Hh);
      deeltjes.forEach(function (p) {
        p.w += 0.02;
        p.x += p.vx + Math.sin(p.w) * 0.25;
        p.y += p.vy;
        if (p.y < -12 || p.y > Hh + 12) nieuw(p);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = warm ? "rgba(255, 186, 90, " + p.a + ")" : "rgba(220, 240, 255, " + p.a + ")";
        ctx.fill();
      });
      raf = requestAnimationFrame(teken);
    }
    function start() {
      if (!raf && inBeeld) raf = requestAnimationFrame(teken);
    }
    maat();
    for (var k = 0; k < 70; k++) {
      var p = nieuw({});
      p.y = Math.random() * Hh;
      deeltjes.push(p);
    }
    window.addEventListener("resize", maat);
    new IntersectionObserver(function (e) {
      inBeeld = e[0].isIntersecting && hero.classList.contains("page-active");
      cv.classList.toggle("aan", inBeeld);
      start();
    }).observe(hero);
    document.addEventListener("rt-seizoen", function () {
      deeltjes.forEach(function (p) {
        nieuw(p);
        p.y = Math.random() * Hh;
      });
    });
  }

  // (Rim, 2-11-2026: bovenaan Home enkel de sfeerwissel; geen lucht over de foto's en geen filmpjes.)

  // ---------- 4. toestelpagina: de hoofdfoto kantelt, en het toestel leeft (klep open) ----------
  var LIVE = {
    "Daikin Perfera": { src: "assets/img/t-daikin-perfera-3.webp", x: 22, y: 52, w: 58 },
    "Daikin Stylish": { src: "assets/img/t-daikin-stylish-3.webp", x: 18, y: 58, w: 62 },
    "Daikin Perfera vloermodel": { src: "assets/img/t-daikin-perfera-vloermodel-3.webp", x: 20, y: 40, w: 60 },
  };
  function maakLive(cfg, tekst) {
    var box = document.createElement("div");
    box.className = "up-live";
    var img = document.createElement("img");
    img.src = cfg.src;
    img.alt = "";
    box.appendChild(img);
    var l = document.createElement("div");
    l.className = "up-adem-laag";
    for (var k = 0; k < 7; k++) {
      var b = document.createElement("i");
      b.style.setProperty("--x", cfg.x + (k * cfg.w) / 7 + "%");
      b.style.setProperty("--y", cfg.y + (k % 2) * 3 + "%");
      b.style.setProperty("--w", 16 + (k % 3) * 5 + "%");
      b.style.setProperty("--d", (k * 0.5).toFixed(1) + "s");
      l.appendChild(b);
    }
    box.appendChild(l);
    var s = document.createElement("span");
    s.className = "up-live-lbl";
    s.textContent = tekst;
    box.appendChild(s);
    return box;
  }
  function toestelLeeft() {
    var foto = document.querySelector('section[data-page="toestel"].page-active .td-media .device-photo');
    if (!foto || foto.dataset.upKlaar) return;
    foto.dataset.upKlaar = "1";
    var sheen = document.createElement("span");
    sheen.className = "up-sheen";
    foto.appendChild(sheen);
    if (zwaar) {
      foto.classList.add("up-tilt");
      foto.addEventListener("mousemove", function (ev) {
        var r = foto.getBoundingClientRect();
        foto.style.setProperty("--ry", (((ev.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + "deg");
        foto.style.setProperty("--rx", (-((ev.clientY - r.top) / r.height - 0.5) * 8).toFixed(2) + "deg");
      });
      foto.addEventListener("mouseleave", function () {
        foto.style.setProperty("--rx", "0deg");
        foto.style.setProperty("--ry", "0deg");
      });
    }
    var naam = (location.hash || "").slice(9),
      model = null;
    Object.keys(LIVE).forEach(function (m) {
      if (naam === m.toLowerCase().replace(/[^a-z0-9]+/g, "-")) model = m;
    });
    if (model) {
      var l = maakLive(LIVE[model], "Klep open, lucht stroomt");
      foto.appendChild(l);
      requestAnimationFrame(function () {
        l.classList.add("aan");
      });
      setTimeout(function () {
        l.classList.remove("aan");
        setTimeout(function () {
          l.remove();
        }, 1400);
      }, 6000);
    }
  }
  window.addEventListener("hashchange", function () {
    setTimeout(toestelLeeft, 80);
  });
  setTimeout(toestelLeeft, 300);

  // ---------- 5. scrollen: volgorde, tellers, parallax, de fotostrook ----------
  document.querySelectorAll(".rv").forEach(function (el) {
    var buren = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList.contains("rv");
    });
    var idx = buren.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", Math.min(idx, 6) * 80 + "ms");
  });
  if (zwaar && "IntersectionObserver" in window) {
    var tObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        tObs.unobserve(el);
        var eind = parseInt(el.getAttribute("data-count"), 10);
        if (!eind) return;
        el.classList.add("up-tel");
        var t0 = performance.now();
        (function stap(now) {
          var p = Math.min(1, (now - t0) / 900);
          el.textContent = Math.round(eind * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(stap);
          else el.textContent = eind;
        })(t0);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      tObs.observe(el);
    });
  }
  if (zwaar) {
    var kaders = [];
    [".v3-tile.big", ".ct-rim", ".dn-foto", ".rl-kijker-foto"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (k) {
        var img = k.querySelector("img");
        if (!img) return;
        k.classList.add("up-par-kader");
        img.setAttribute("data-up-par", "0.14");
        kaders.push({ k: k, img: img });
      });
    });
    var strip = document.querySelector(".v4-strip");
    var bezig = false;
    function parallax() {
      bezig = false;
      var vh = window.innerHeight;
      kaders.forEach(function (o) {
        var r = o.k.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        o.img.style.setProperty("--up-y", (-(r.top + r.height / 2 - vh / 2) * 0.14).toFixed(1) + "px");
      });
      if (strip && strip.offsetParent) {
        var sr = strip.getBoundingClientRect();
        if (sr.bottom > 0 && sr.top < vh) strip.style.setProperty("--up-strip", (-(sr.top - vh) * 0.18).toFixed(1) + "px");
      }
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!bezig) {
          bezig = true;
          requestAnimationFrame(parallax);
        }
      },
      { passive: true }
    );
    parallax();
  }

  // ---------- 6. magnetische gouden knoppen en 3D-kaarten (computer) ----------
  if (zwaar) {
    document.querySelectorAll(".btn-gold, #cta-header, .v3-tile.gold").forEach(function (b) {
      b.classList.add("up-magneet");
      b.addEventListener("mousemove", function (ev) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--mgx", (((ev.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + "px");
        b.style.setProperty("--mgy", (((ev.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + "px");
      });
      b.addEventListener("mouseleave", function () {
        b.style.setProperty("--mgx", "0px");
        b.style.setProperty("--mgy", "0px");
      });
    });
    document.addEventListener("mousemove", function (ev) {
      var card = ev.target.closest && ev.target.closest(".toestellen-main .device-card");
      if (!card) return;
      card.classList.add("up-3d");
      var r = card.getBoundingClientRect();
      card.style.setProperty("--ry", (((ev.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + "deg");
      card.style.setProperty("--rx", (-((ev.clientY - r.top) / r.height - 0.5) * 6).toFixed(2) + "deg");
    });
    document.addEventListener(
      "mouseout",
      function (ev) {
        var card = ev.target.closest && ev.target.closest(".device-card.up-3d");
        if (card && !card.contains(ev.relatedTarget)) {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
        }
      },
      true
    );
  }

  // ---------- 7. van pagina naar pagina ----------
  var balk = document.createElement("div");
  balk.className = "up-balk";
  document.body.appendChild(balk);
  var echt = window.goToPage;
  if (typeof echt === "function") {
    window.goToPage = function (pageId, doScrollTop, hash) {
      var nu = document.querySelector("section[data-page].page-active");
      var html = document.documentElement;
      if ((nu && nu.dataset.page === pageId) || html.classList.contains("up-weg")) return echt(pageId, doScrollTop, hash);
      html.classList.add("up-weg");
      setTimeout(function () {
        echt(pageId, doScrollTop, hash);
        html.classList.remove("up-weg");
        html.classList.add("up-komt");
        setTimeout(function () {
          html.classList.remove("up-komt");
          toestelLeeft();
        }, 600);
      }, 260);
    };
  }
})();

// ============================================================================
// "BEKIJK HET TOESTEL IN WERKING" OP DE TOESTELPAGINA (Rims keuze van 2-11-2026). Een filmpje per model,
// gemaakt met Higgsfield van de productfoto (klep opent, lucht stroomt). Enkel voor modellen in CLIPS;
// de bestanden staan in assets/video/ als webm en mp4. Bron en werkwijze: voorbeeld/higgsfield-2026-11-02/
// README.md (buiten git). De bezoeker kiest zelf: een knop onder de foto speelt het filmpje over de foto.
// ============================================================================
(function () {
  "use strict";
  var MAP = "assets/video/";
  // model (zoals data-model op de kaart) -> bestandsnaam zonder -web.webm/.mp4
  // Nog leeg: de filmpjes worden gemaakt zodra er Higgsfield-credits zijn (december 2026). Voeg per model toe, bv.
  //   "Daikin Perfera": "toestel-daikin-perfera",
  // zodra assets/video/toestel-daikin-perfera-web.webm en -web.mp4 bestaan.
  var CLIPS = {};
  function plaats() {
    var sec = document.querySelector('section[data-page="toestel"].page-active');
    var media = sec && sec.querySelector(".td-media");
    var foto = media && media.querySelector(".device-photo");
    if (!foto || media.querySelector(".up-werking")) return;
    var model = window.rtHuidigToestel || "";
    var clip = CLIPS[model];
    if (!clip) return;
    var knop = document.createElement("button");
    knop.type = "button";
    knop.className = "up-werking";
    knop.setAttribute("aria-pressed", "false");
    knop.innerHTML = '<span class="ic" aria-hidden="true">&#9654;</span><span class="tx">Bekijk het toestel in werking</span>';
    foto.insertAdjacentElement("afterend", knop);
    var v = null;
    knop.addEventListener("click", function () {
      var aan = knop.getAttribute("aria-pressed") !== "true";
      if (!v) {
        v = document.createElement("video");
        v.className = "up-clip";
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "");
        v.setAttribute("aria-label", "Het toestel in werking: de klep opent en de lucht stroomt");
        var s1 = document.createElement("source");
        s1.src = MAP + clip + "-web.webm";
        s1.type = "video/webm";
        var s2 = document.createElement("source");
        s2.src = MAP + clip + "-web.mp4";
        s2.type = "video/mp4";
        v.appendChild(s1);
        v.appendChild(s2);
        foto.appendChild(v);
      }
      knop.setAttribute("aria-pressed", aan ? "true" : "false");
      knop.querySelector(".tx").textContent = aan ? "Terug naar de foto" : "Bekijk het toestel in werking";
      foto.classList.toggle("up-speelt", aan);
      if (aan) {
        v.currentTime = 0;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else v.pause();
    });
  }
  window.addEventListener("hashchange", function () {
    setTimeout(plaats, 120);
  });
  setTimeout(plaats, 350);
})();
