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

  // ---------- 3. Rims eigen foto's komen tot leven: lucht uit het toestel op de foto ----------
  // per foto bovenaan Home: waar de uitblaasopening zit, in % van de foto (x1 tot x2, hoogte y)
  var VENT = {
    "g-s-eee01264090f": [[34, 69, 55]],
    "g-s-e5cb7ad05186": [[27, 74, 61]],
    "g-s-1feaeb8d86c5": [[6, 28, 61], [85, 93, 57]],
    "g-n76": [[17, 83, 65]],
    "g-n91": [[35, 68, 56]],
    "s-06545912d880": [[35, 69, 47]],
    "h-s-ba3f2d8e25e8": [[31, 73, 62]],
    "g-s-f8ba56652202": [[31, 70, 56]],
  };
  function naamVan(src) {
    var m = /\/([^\/]+)\.webp/.exec(src || "");
    return m ? m[1] : "";
  }
  // zet de nevel op de plaats van het toestel, rekening houdend met hoe de foto in het vak is bijgesneden (cover)
  function ademOp(vak, laag) {
    var img = vak.querySelector("img.rot.on");
    laag.innerHTML = "";
    if (!img || !img.naturalWidth) return;
    var vents = VENT[naamVan(img.getAttribute("src"))];
    if (!vents) return;
    var bw = vak.clientWidth,
      bh = vak.clientHeight,
      iw = img.naturalWidth,
      ih = img.naturalHeight;
    var s = Math.max(bw / iw, bh / ih);
    var pos = (getComputedStyle(img).objectPosition || "50% 50%").split(" ");
    var px = parseFloat(pos[0]) / 100,
      py = parseFloat(pos[1] || "50%") / 100;
    var ox = (bw - iw * s) * px,
      oy = (bh - ih * s) * py;
    vents.forEach(function (v) {
      var x1 = ox + (v[0] / 100) * iw * s,
        x2 = ox + (v[1] / 100) * iw * s,
        y = oy + (v[2] / 100) * ih * s;
      var breed = x2 - x1;
      var aantal = Math.max(3, Math.round(breed / 45));
      for (var k = 0; k < aantal; k++) {
        var b = document.createElement("i");
        b.style.setProperty("--x", (x1 + (breed * (k + 0.5)) / aantal).toFixed(0) + "px");
        b.style.setProperty("--y", y.toFixed(0) + "px");
        b.style.setProperty("--w", (Math.min(90, breed / aantal) * 1.6).toFixed(0) + "px");
        b.style.setProperty("--d", ((k % 4) * 0.7 + Math.random() * 0.4).toFixed(2) + "s");
        laag.appendChild(b);
      }
    });
  }
  var vak = document.querySelector(".nh-rot-box.v3-main-ph");
  if (vak) {
    var laag = document.createElement("div");
    laag.className = "up-adem-laag";
    vak.appendChild(laag);
    var lbl = document.createElement("span");
    lbl.className = "up-adem-lbl";
    vak.appendChild(lbl);
    function lblTekst() {
      lbl.textContent = document.body.classList.contains("rt-warm") ? "Verwarmt" : "Koelt";
    }
    lblTekst();
    var her = function () {
      ademOp(vak, laag);
      lblTekst();
    };
    // de wissel van foto's zet de class "on" om: dan de nevel verplaatsen
    new MutationObserver(function () {
      clearTimeout(her.t);
      her.t = setTimeout(her, 60);
    }).observe(vak, { attributes: true, subtree: true, attributeFilter: ["class", "src"] });
    document.addEventListener("rt-seizoen", function () {
      setTimeout(her, 400);
    });
    window.addEventListener("resize", her);
    var eerste = vak.querySelector("img.rot.on");
    if (eerste && !eerste.complete) eerste.addEventListener("load", her, { once: true });
    her();
  }

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
// DE FILMPJES BOVENAAN HOME (Higgsfield, gemaakt van Rims eigen foto's op 2-11-2026; bron en werkwijze in
// voorbeeld/higgsfield-2026-11-02/README.md, buiten git). Elke foto in het grote fotovak die een filmpje heeft,
// krijgt een <video> erbovenop dat speelt zodra die foto aan de beurt is. De foto blijft eronder staan
// (en is het stilstaand beeld voor wie "minder beweging" heeft ingesteld of een trage verbinding).
// ============================================================================
(function () {
  "use strict";
  var rustig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rustig) return;
  var MAP = "assets/video/";
  // fotobestand -> filmpje (zonder extensie); warme reeks: warm filmpje, koele reeks: koel filmpje
  var CLIPS = {
    "g-s-eee01264090f": "home-01-lg-baksteen-warm",
    "g-s-e5cb7ad05186": "home-02-daikin-balken-warm",
    "g-s-1feaeb8d86c5": "home-03-lg-gallery-haard-warm",
    "g-n76": "home-04-daikin-hout-warm",
    "g-n91": "home-05-daikin-raam-koel",
    "s-06545912d880": "home-06-lg-deluxe-planken-koel",
    "h-s-ba3f2d8e25e8": "home-07-daikin-stylish-zwart-koel",
    "g-s-f8ba56652202": "home-08-nuova-raam-koel",
  };
  var vak = document.querySelector(".nh-rot-box.v3-main-ph");
  if (!vak) return;
  var videos = {};
  function naam(img) {
    var m = /\/([^\/]+)\.webp/.exec(img.getAttribute("src") || img.dataset.src || "");
    return m ? m[1] : "";
  }
  function videoVoor(img) {
    var n = naam(img);
    var clip = CLIPS[n];
    if (!clip) return null;
    if (videos[n]) return videos[n];
    var v = document.createElement("video");
    v.className = "up-clip";
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "none";
    v.setAttribute("aria-hidden", "true");
    var s1 = document.createElement("source");
    s1.src = MAP + clip + "-web.webm";
    s1.type = "video/webm";
    var s2 = document.createElement("source");
    s2.src = MAP + clip + "-web.mp4";
    s2.type = "video/mp4";
    v.appendChild(s1);
    v.appendChild(s2);
    // zelfde uitsnede als de foto (object-position van de foto overnemen)
    v.style.objectPosition = getComputedStyle(img).objectPosition;
    vak.appendChild(v);
    videos[n] = v;
    return v;
  }
  var huidig = null;
  function wissel() {
    var img = vak.querySelector("img.rot.on");
    var v = img ? videoVoor(img) : null;
    if (v === huidig) return;
    if (huidig) {
      huidig.classList.remove("aan");
      var oud = huidig;
      setTimeout(function () {
        if (oud !== huidig) oud.pause();
      }, 900);
    }
    huidig = v;
    vak.classList.toggle("up-speelt", !!v);
    if (!v) return;
    if (v.preload === "none") v.preload = "auto";
    v.currentTime = 0;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
    v.classList.add("aan");
  }
  // de buurfoto's hun filmpje alvast laten laden
  function voorladen() {
    vak.querySelectorAll("img.rot").forEach(function (img) {
      var v = videoVoor(img);
      if (v && v.preload === "none") v.preload = "auto";
    });
  }
  new MutationObserver(function () {
    clearTimeout(wissel.t);
    wissel.t = setTimeout(wissel, 40);
  }).observe(vak, { attributes: true, subtree: true, attributeFilter: ["class", "src"] });
  // enkel spelen als het vak in beeld is (anders pauzeren: batterij en data)
  if ("IntersectionObserver" in window)
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) {
        wissel();
        if (huidig) huidig.play().catch(function () {});
        setTimeout(voorladen, 2500);
      } else if (huidig) huidig.pause();
    }).observe(vak);
  wissel();
})();
