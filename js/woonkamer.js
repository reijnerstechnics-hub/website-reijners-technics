// =====================================================================
// "ZIE DIT TOESTEL IN EEN WOONKAMER" (Rims keuze van 3-11-2026)
// ---------------------------------------------------------------------
// Op elke toestelpagina van een wandmodel opent de kaart "Zie dit toestel in een woonkamer" dit venster:
// de binnenunit (uit de productfoto geknipt, zie uitsnede in js/zicht.js) hangt op ware grootte aan de
// muur van een woonkamer in drie stijlen: licht, donker en warm. De drie kamers zijn met Higgsfield gemaakt
// (3-11-2026, gpt_image_2_5; de bronnen en de reserves staan in voorbeeld/woonkamer-2026-11-03/, buiten git).
// Per kamer: de plek van het toestel (x, y als deel van de foto) en de schaal (deel van de fotobreedte per
// meter, gemeten aan de zetel van ± 2,2 m). Kiest de klant een kleur op de toestelpagina, dan hangt die versie.
// Niets wordt verstuurd; de klant kan meteen een offerte voor dit model vragen.
// =====================================================================
(function () {
  "use strict";
  var KAMERS = [
    { id: "licht", naam: "Licht", src: "assets/img/kamer-licht.webp", uitleg: "Lichte woonkamer, witte muur" },
    { id: "donker", naam: "Donker", src: "assets/img/kamer-donker.webp", uitleg: "Donkere muur, avondlicht" },
    { id: "warm", naam: "Warm", src: "assets/img/kamer-warm.webp", uitleg: "Warme, landelijke woonkamer" },
  ];
  // Het toestel hangt in elke kamer op precies dezelfde plek en grootte (Rim, 3-11-2026: "geen unit die
  // verspringt"): de drie kamers zijn even groot (1168 x 880) en de zetel staat er telkens even breed op.
  var PLEK = { x: 0.53, y: 0.215, m: 0.315 }; // midden (deel van de foto) en deel van de fotobreedte per meter
  var BREEDTE_M = 0.9; // de meeste wandmodellen zijn 0,8 tot 1,1 m breed
  // vierkante "schilderij"-modellen zijn smaller
  var BREEDTE_PER_MODEL = { "LG Artcool Gallery Special": 0.6, "LG Artcool LCD Gallery Premium": 0.6 };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  var box = null,
    canvas,
    ctx,
    opener = null,
    o = null,
    kamer = KAMERS[0],
    fotos = {},
    knip = null,
    knipNr = 0;

  function maakBox() {
    if (box) return box;
    box = el("div", "zb wk");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Het toestel in een woonkamer");
    box.innerHTML =
      '<div class="zb-top"><b class="zb-titel"></b><button type="button" class="zb-x" aria-label="Sluiten">&times;</button></div>' +
      '<div class="wk-stijlen"><div class="zb-seg" role="group" aria-label="Stijl van de woonkamer"></div></div>' +
      '<div class="zb-vlak"><canvas class="zb-canvas" aria-label="Het toestel aan de muur van een woonkamer"></canvas><p class="zb-hint"></p></div>' +
      '<div class="zb-balk"><div class="zb-seg wk-kleuren" role="group" aria-label="Kleur van het toestel" hidden></div>' +
      '<button type="button" class="zb-btn gold wk-offerte">Offerte voor dit model →</button>' +
      '<button type="button" class="zb-btn wk-sluit">Sluiten</button></div>';
    document.body.appendChild(box);
    canvas = box.querySelector("canvas");
    ctx = canvas.getContext("2d");
    var seg = box.querySelector(".wk-stijlen .zb-seg");
    KAMERS.forEach(function (k) {
      var b = el("button", null, k.naam);
      b.type = "button";
      b.dataset.kamer = k.id;
      b.addEventListener("click", function () {
        kies(k);
      });
      seg.appendChild(b);
    });
    box.querySelector(".zb-x").addEventListener("click", sluit);
    box.querySelector(".wk-sluit").addEventListener("click", sluit);
    box.querySelector(".wk-offerte").addEventListener("click", function () {
      // met de kleur die hier gekozen is en het vermogen van de pagina (grote controle 4-11-2026)
      var hier = o.kleurNaam && !o.kleurStandaard ? o.kleurNaam.replace(/\s*\(.*$/, "").toLowerCase() : null;
      var m = o.offerte ? o.offerte(hier) : o.model;
      sluit();
      if (window.rtGoToOffer) window.rtGoToOffer("nieuw", m);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box && !box.hidden) sluit();
    });
    window.addEventListener("hashchange", function () {
      if (box && !box.hidden) sluit();
    });
    window.addEventListener("resize", function () {
      if (box && !box.hidden) past();
    });
    return box;
  }
  function open(opts) {
    maakBox();
    o = opts;
    opener = document.activeElement;
    box.querySelector(".zb-titel").textContent = "De " + o.model + " in een woonkamer";
    // de gekozen kleur (of de eerste, de standaard) bepaalt welke foto gezocht wordt
    if (o.kleuren && o.kleuren.length) {
      var idx = 0;
      o.kleuren.forEach(function (k, i) {
        if (k.src === o.binnen) idx = i;
      });
      o.kleurNaam = o.kleuren[idx].naam;
      o.kleurStandaard = idx === 0;
    } else {
      o.kleurNaam = "";
      o.kleurStandaard = true;
    }
    // de kleuren van het toestel (de bolletjes op de toestelpagina)
    var kl = box.querySelector(".wk-kleuren");
    kl.innerHTML = "";
    kl.hidden = !(o.kleuren && o.kleuren.length > 1);
    (o.kleuren || []).forEach(function (k, i) {
      var b = el("button", null, k.naam);
      b.type = "button";
      b.setAttribute("aria-pressed", k.src === o.binnen ? "true" : "false");
      b.addEventListener("click", function () {
        kl.querySelectorAll("button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        o.binnen = k.src;
        o.kleurNaam = k.naam;
        o.kleurStandaard = i === 0;
        laadKnip();
      });
      kl.appendChild(b);
    });
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    kies(kamer);
    laadKnip();
    box.querySelector(".zb-x").focus();
  }
  function sluit() {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.documentElement.style.overflow = "";
    if (opener && opener.focus) opener.focus();
  }
  function kies(k) {
    kamer = k;
    box.querySelectorAll(".wk-stijlen button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.kamer === k.id ? "true" : "false");
    });
    box.querySelector(".zb-hint").textContent = k.uitleg + " · het toestel hangt op ware grootte, zo’n 2 m hoog boven de zetel.";
    if (fotos[k.id]) return teken();
    var im = new Image();
    im.onload = function () {
      fotos[k.id] = im;
      if (kamer === k) teken();
    };
    im.src = k.src;
  }
  // De foto die het toestel het best recht van voren toont (Rim, 3-11-2026: "alle modellen met een mooi
  // vooraanzicht"): uit de fotoreeks in js/toestel-media.js eerst "In <kleur>" (de gekozen kleur), dan
  // "Vooraanzicht", "Klep dicht", "Binnenunit wit" of "Binnenunit"; anders de kaartfoto of de kleurfoto.
  function besteFoto() {
    var m = typeof RT_MEDIA !== "undefined" ? RT_MEDIA[o.model] : null;
    var fotos = m && m.fotos ? m.fotos : [];
    function met(re) {
      var f = fotos.filter(function (x) {
        return x && x.src && re.test(x.label || "");
      })[0];
      return f ? f.src : null;
    }
    var kleur = (o.kleurNaam || "").replace(/\s*\(.*$/, "").trim().toLowerCase();
    var s = kleur ? met(new RegExp("^in " + kleur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")) : null;
    if (!s && (!kleur || o.kleurStandaard)) s = met(/^vooraanzicht/i) || met(/^klep dicht/i) || met(/^binnenunit wit/i) || met(/^binnenunit$/i);
    return s || o.binnen;
  }
  function laadKnip() {
    knip = null;
    var mijn = ++knipNr;
    if (!window.rtZicht || !window.rtZicht.uitsnede) return;
    window.rtZicht.uitsnede(besteFoto(), "boven", function (c) {
      if (mijn !== knipNr) return;
      knip = c;
      teken();
    });
  }
  function past() {
    var vlak = box.querySelector(".zb-vlak");
    var r = vlak.getBoundingClientRect();
    var hh = box.querySelector(".zb-hint").getBoundingClientRect().height + 8;
    var bw = Math.max(100, r.width - 16),
      bh = Math.max(100, r.height - hh - 16);
    var s = Math.min(bw / canvas.width, bh / canvas.height);
    canvas.style.width = Math.round(canvas.width * s) + "px";
    canvas.style.height = Math.round(canvas.height * s) + "px";
  }
  function teken() {
    var im = fotos[kamer.id];
    if (!im) return;
    var W = im.naturalWidth,
      H = im.naturalHeight;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    past();
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(im, 0, 0, W, H);
    if (!knip) return;
    var b = (BREEDTE_PER_MODEL[o.model] || BREEDTE_M) * PLEK.m * W;
    var h = (b * knip.height) / knip.width;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.translate(PLEK.x * W, PLEK.y * H);
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = b * 0.07;
    ctx.shadowOffsetY = b * 0.04;
    ctx.drawImage(knip, -b / 2, -h / 2, b, h);
    ctx.restore();
  }
  window.rtWoonkamer = { open: open, sluit: sluit };
})();
