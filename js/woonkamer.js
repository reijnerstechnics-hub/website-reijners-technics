// =====================================================================
// "ZIE DIT TOESTEL IN EEN WOONKAMER" (Rims keuze van 3-11-2026, uitgebreid op 4-11-2026)
// ---------------------------------------------------------------------
// Op elke toestelpagina van een wandmodel opent de kaart "Zie dit toestel in een woonkamer" dit venster:
// de binnenunit hangt op ware grootte aan de muur van een woonkamer in zes stijlen (licht, modern, zand,
// groen, warm, donker). De kamers zijn met Higgsfield gemaakt (3 en 4-11-2026, gpt_image_2_5, 2336 x 1752;
// de bronnen staan in voorbeeld/woonkamer-2026-11-03/ en -04/, buiten git).
// De klant sleept het toestel met de vinger of de muis naar de plek die hij wil (Rim, 4-11-2026); de grootte
// blijft altijd de ware grootte (Rims keuze: niet verkleinen of vergroten). De plek blijft dezelfde als hij
// van kamer of kleur wisselt ("geen unit die verspringt").
// De binnenunits zijn vooraf uitgeknipt (assets/img/wk-<slug>.webp, 1600 px breed, doorzichtige achtergrond):
// de productfoto's zijn eerst met Higgsfield vergroot (4-11-2026) en dan met dezelfde methode als op de site
// (uitsnede in js/zicht.js) geknipt via voorbeeld/woonkamer-2026-11-04/knip.html. Ontbreekt zo'n bestand,
// dan knipt de site de gewone productfoto zelf (minder scherp).
// Per kamer: de plek van het toestel (x, y als deel van de foto) en de schaal (deel van de fotobreedte per
// meter, gemeten aan de zetel van +- 2,2 m). Kiest de klant een kleur op de toestelpagina, dan hangt die versie.
// Niets wordt verstuurd; de klant kan meteen een offerte voor dit model vragen (Rim, 4-11-2026: geen
// bewaar- of deelknop, de klant kiest gewoon "Offerte voor dit model").
// =====================================================================
(function () {
  "use strict";
  var KAMERS = [
    { id: "licht", naam: "Licht", src: "assets/img/kamer-licht.webp", uitleg: "Lichte woonkamer, witte muur" },
    { id: "modern", naam: "Modern", src: "assets/img/kamer-modern.webp", uitleg: "Moderne woonkamer, grijze muur" },
    { id: "zand", naam: "Zand", src: "assets/img/kamer-zand.webp", uitleg: "Zachte zandkleur, eiken vloer" },
    { id: "groen", naam: "Groen", src: "assets/img/kamer-groen.webp", uitleg: "Groene muur met planten" },
    { id: "warm", naam: "Warm", src: "assets/img/kamer-warm.webp", uitleg: "Warme, landelijke woonkamer" },
    { id: "donker", naam: "Donker", src: "assets/img/kamer-donker.webp", uitleg: "Donkere muur, avondlicht" },
  ];
  // Het toestel hangt in elke kamer op precies dezelfde plek en grootte (Rim, 3-11-2026: "geen unit die
  // verspringt"): de zes kamers zijn even groot (2336 x 1752) en de zetel staat er telkens even breed op.
  var PLEK = { x: 0.53, y: 0.215, m: 0.315 }; // midden (deel van de foto) en deel van de fotobreedte per meter
  var BREEDTE_M = 0.9; // de meeste wandmodellen zijn 0,8 tot 1,1 m breed
  // vierkante "schilderij"-modellen zijn smaller
  var BREEDTE_PER_MODEL = { "LG Artcool Gallery Special": 0.6, "LG Artcool LCD Gallery Premium": 0.6 };
  // Vooraf uitgeknipte, scherpe binnenunits: "model|kleur" (de kleur zoals op het bolletje) -> bestandsnaam.
  var KNIP = {
    "Nuova Infinity AI Smart|Zilver": "nuova-infinity-ai-smart-zilver",
    "Nuova Infinity AI Smart|Wit": "nuova-infinity-ai-smart-wit",
    "Nuova Infinity AI Smart|Zwart": "nuova-infinity-ai-smart-zwart",
    "Nuova Premium Inverter|": "nuova-premium-inverter",
    "Nuova Stellar Inverter|Wit": "nuova-stellar-inverter-wit",
    "Nuova Stellar Inverter|Zwart mirror": "nuova-stellar-inverter-zwart-mirror",
    "Daikin Sensira|": "daikin-sensira",
    "Daikin FTXF-F|": "daikin-ftxf-f",
    "Daikin Comfora|": "daikin-comfora",
    "Daikin Perfera|": "daikin-perfera",
    "Daikin Stylish|Wit": "daikin-stylish-wit",
    "Daikin Stylish|Zwart": "daikin-stylish-zwart",
    "Daikin Stylish|Blackwood (enkel multi-split)": "daikin-stylish-blackwood",
    "Daikin Emura|Zilver": "daikin-emura-zilver",
    "Daikin Emura|Wit": "daikin-emura-wit",
    "Daikin Emura|Zwart": "daikin-emura-zwart",
    "Daikin Sensira CTXF-C multi-split binnenunit|": "daikin-sensira-ctxf-c-multi-split-binnenunit",
    "LG DualCool WZ-serie|": "lg-dualcool-wz-serie",
    "LG DualCool Comfort Special E · EZ-serie|": "lg-dualcool-comfort-special-e-ez-serie",
    "LG Standard Plus DualCool Special P · PZ-serie|": "lg-standard-plus-dualcool-special-p-pz-serie",
    "LG DualCool AI Air Special Smart Inverter|": "lg-dualcool-ai-air-special-smart-inverter",
    "LG Deluxe AI H-serie|": "lg-deluxe-ai-h-serie",
    "LG Artcool AI Air Mirror|": "lg-artcool-ai-air-mirror",
    "LG Artcool AI Matt Black|": "lg-artcool-ai-matt-black",
    "LG Artcool Gallery Special|": "lg-artcool-gallery-special",
    "LG Artcool LCD Gallery Premium|": "lg-artcool-lcd-gallery-premium",
    "LG Standard Plus Smart Inverter Multi · PM05SP / PM15SP|": "lg-standard-plus-smart-inverter-multi-pm05sp-pm15sp",
    "LG Standard 2 MS07ET multi-split binnenunit|": "lg-standard-2-ms07et-multi-split-binnenunit",
    "Mitsubishi Electric MSZ-HR instapreeks|": "mitsubishi-electric-msz-hr-instapreeks",
    "Mitsubishi Electric MSZ-AY Compact|": "mitsubishi-electric-msz-ay-compact",
    "Mitsubishi Electric MSZ-EF Premium Design|Natural white": "mitsubishi-electric-msz-ef-premium-design-natural-white",
    "Mitsubishi Electric MSZ-EF Premium Design|Silver": "mitsubishi-electric-msz-ef-premium-design-silver",
    "Mitsubishi Electric MSZ-EF Premium Design|Onyx black": "mitsubishi-electric-msz-ef-premium-design-onyx-black",
    "Mitsubishi Electric MSZ-LN Diamond|Natural white": "mitsubishi-electric-msz-ln-diamond-natural-white",
    "Mitsubishi Electric MSZ-LN Diamond|Pearl white": "mitsubishi-electric-msz-ln-diamond-pearl-white",
    "Mitsubishi Electric MSZ-LN Diamond|Onyx black": "mitsubishi-electric-msz-ln-diamond-onyx-black",
    "Mitsubishi Electric MSZ-LN Diamond|Ruby red": "mitsubishi-electric-msz-ln-diamond-ruby-red",
    "Mitsubishi Electric MSZ-LN Diamond Zubadan|": "mitsubishi-electric-msz-ln-diamond-zubadan",
    "MHI ZSP Standard|": "mhi-zsp-standard",
    "MHI ZS Premium|Wit": "mhi-zs-premium-wit",
    "MHI ZS Premium|Titanium": "mhi-zs-premium-titanium",
    "MHI ZS Premium|Zwart-wit": "mhi-zs-premium-zwart-wit",
    "MHI ZTL Standard Plus|": "mhi-ztl-standard-plus",
    "MHI ZSX Diamond Hyper|Wit": "mhi-zsx-diamond-hyper-wit",
    "MHI ZSX Diamond Hyper|Titanium": "mhi-zsx-diamond-hyper-titanium",
    "MHI ZSX Diamond Hyper|Zwart-wit": "mhi-zsx-diamond-hyper-zwart-wit",
    "Toshiba Yukai|": "toshiba-yukai",
    "Toshiba Haori|": "toshiba-haori",
    "Toshiba Daiseikai 10|Wit": "toshiba-daiseikai-10-wit",
    "Toshiba Daiseikai 10|Hout": "toshiba-daiseikai-10-hout",
    "Toshiba Shorai Edge Kazumi|": "toshiba-shorai-edge-kazumi",
    "Toshiba Wandmodel Digital Inverter|": "toshiba-wandmodel-digital-inverter",
  };

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
    knipNr = 0,
    foto = null, // de fotorealistische opname van dit toestel in deze kamer (Higgsfield, 4-11-2026), als die er is
    fotoCache = {},
    plek = null, // door de klant gekozen plek {x, y} (deel van de foto); null = de vaste plek
    sleep = null; // tijdens het slepen: {dx, dy} afstand van de vinger tot het midden van het toestel

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
      '<div class="zb-vlak"><canvas class="zb-canvas" tabindex="0" aria-label="Het toestel aan de muur van een woonkamer. Sleep het naar de plek die u wilt, of verplaats het met de pijltjestoetsen."></canvas>' +
      '<p class="zb-hint"><span class="wk-uitleg"></span> <span class="wk-sleep">Sleep het toestel naar de plek die u wilt; het hangt op ware grootte.</span><span class="wk-echt" hidden>Zo hangt hij in deze kamer, op ware grootte.</span> ' +
      '<button type="button" class="wk-terug" hidden>Zet terug in het midden</button></p></div>' +
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
    box.querySelector(".wk-terug").addEventListener("click", function () {
      plek = null;
      teken();
      canvas.focus();
    });
    box.querySelector(".wk-offerte").addEventListener("click", function () {
      // met de kleur die hier gekozen is en het vermogen van de pagina (grote controle 4-11-2026)
      // ook de eerste kleur (bv. wit) als de klant die hier zelf koos; anders bleef de kleur van de pagina staan
      // (controle 5-11-2026, klantenreis 8)
      var hier =
        o.kleurNaam && (o.kleurGekozen || !o.kleurStandaard) ? o.kleurNaam.replace(/\s*\(.*$/, "").toLowerCase() : null;
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
      if (box && !box.hidden) teken();
    });
    // Slepen met de vinger of de muis (Rim, 4-11-2026). De canvas heeft touch-action: none, dus de pagina
    // scrolt niet mee.
    canvas.addEventListener("pointerdown", function (e) {
      if (!knip || foto) return;
      var p = punt(e),
        r = rechthoek();
      if (p.x < r.x || p.x > r.x + r.b || p.y < r.y || p.y > r.y + r.h) return;
      sleep = { dx: r.x + r.b / 2 - p.x, dy: r.y + r.h / 2 - p.y };
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("is-sleep");
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (foto) return;
      if (!sleep) {
        // handje als de muis op het toestel staat
        if (knip && e.pointerType === "mouse") {
          var q = punt(e),
            rr = rechthoek();
          canvas.classList.toggle("kan-slepen", q.x >= rr.x && q.x <= rr.x + rr.b && q.y >= rr.y && q.y <= rr.y + rr.h);
        }
        return;
      }
      var p = punt(e);
      zet(p.x + sleep.dx, p.y + sleep.dy);
      e.preventDefault();
    });
    function los(e) {
      if (!sleep) return;
      sleep = null;
      canvas.classList.remove("is-sleep");
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (x) {}
    }
    canvas.addEventListener("pointerup", los);
    canvas.addEventListener("pointercancel", los);
    // ook met de pijltjestoetsen (toetsenbord), 2 cm per tik, 10 cm met Shift
    canvas.addEventListener("keydown", function (e) {
      if (!knip || foto) return;
      var stap = (e.shiftKey ? 0.1 : 0.02) * PLEK.m * canvas.width;
      var r = rechthoek(),
        cx = r.x + r.b / 2,
        cy = r.y + r.h / 2;
      if (e.key === "ArrowLeft") cx -= stap;
      else if (e.key === "ArrowRight") cx += stap;
      else if (e.key === "ArrowUp") cy -= stap;
      else if (e.key === "ArrowDown") cy += stap;
      else return;
      zet(cx, cy);
      e.preventDefault();
    });
    return box;
  }
  // van een aanraking of muisklik naar een punt op de foto (in pixels van de canvas)
  function punt(e) {
    var r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * canvas.width) / r.width, y: ((e.clientY - r.top) * canvas.height) / r.height };
  }
  // waar het toestel nu hangt (in pixels van de canvas)
  function rechthoek() {
    var W = canvas.width,
      H = canvas.height;
    var b = (BREEDTE_PER_MODEL[o.model] || BREEDTE_M) * PLEK.m * W;
    var h = knip ? (b * knip.height) / knip.width : b * 0.33;
    var p = plek || PLEK;
    return { x: p.x * W - b / 2, y: p.y * H - h / 2, b: b, h: h };
  }
  // het midden van het toestel op (cx, cy) zetten; het blijft helemaal in beeld
  function zet(cx, cy) {
    var W = canvas.width,
      H = canvas.height,
      r = rechthoek();
    cx = Math.max(r.b / 2, Math.min(W - r.b / 2, cx));
    cy = Math.max(r.h / 2, Math.min(H - r.h / 2, cy));
    plek = { x: cx / W, y: cy / H };
    teken();
  }
  function open(opts) {
    maakBox();
    o = opts;
    opener = document.activeElement;
    plek = null;
    sleep = null;
    o.kleurGekozen = false;
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
        o.kleurGekozen = true;
        // dezelfde kleur ook op de toestelpagina (foto, bolletje, WhatsApp en e-mail)
        if (o.kiesKleur) o.kiesKleur(k.src);
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
    box.querySelector(".wk-uitleg").textContent = k.uitleg + " ·";
    if (o) laadFoto();
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
  // (Enkel nog nodig als er geen vooraf uitgeknipte versie in KNIP staat.)
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
  function knipNaam() {
    return KNIP[o.model + "|" + (o.kleurNaam || "")];
  }
  // De echte foto van dit toestel in deze kamer (assets/img/wkf-<slug>-<kamer>.webp, gemaakt met Higgsfield).
  // Bestaat ze niet (nieuw toestel), dan tekent de site de uitsnede op de kamerfoto zoals vroeger.
  function laadFoto() {
    var naam = knipNaam();
    var sleutel = naam ? naam + "|" + kamer.id : "";
    foto = null;
    if (!naam) return teken();
    if (sleutel in fotoCache) {
      foto = fotoCache[sleutel] || null;
      return teken();
    }
    var im = new Image();
    im.onload = function () {
      fotoCache[sleutel] = im;
      if (box && !box.hidden && knipNaam() + "|" + kamer.id === sleutel) {
        foto = im;
        teken();
      }
    };
    im.onerror = function () {
      fotoCache[sleutel] = false;
      if (knipNaam() + "|" + kamer.id === sleutel) teken();
    };
    im.src = "assets/img/wkf-" + naam + "-" + kamer.id + ".webp";
  }
  function laadKnip() {
    knip = null;
    var mijn = ++knipNr;
    laadFoto();
    var naam = knipNaam();
    if (naam) {
      var im = new Image();
      im.onload = function () {
        if (mijn !== knipNr) return;
        knip = im;
        teken();
      };
      im.onerror = function () {
        if (mijn === knipNr) zelfKnippen(mijn);
      };
      im.src = "assets/img/wk-" + naam + ".webp";
    } else zelfKnippen(mijn);
  }
  // De uitknipfunctie zit in js/zicht.js. Dat bestand laadt niet meer bij elke bezoeker (geparkeerd tot
  // december 2026, controle 5-11-2026): enkel als het hier nodig is (een toestel zonder vooraf uitgeknipte
  // versie), één keer, en daarna wordt het meteen gebruikt.
  var zichtLaden = null;
  function metZicht(cb) {
    if (window.rtZicht && window.rtZicht.uitsnede) return cb();
    if (!zichtLaden) {
      zichtLaden = [];
      var s = document.createElement("script");
      s.src = "js/zicht.js";
      s.onload = s.onerror = function () {
        var l = zichtLaden;
        zichtLaden = null;
        if (window.rtZicht && window.rtZicht.uitsnede)
          l.forEach(function (f) {
            f();
          });
      };
      document.body.appendChild(s);
    }
    zichtLaden.push(cb);
  }
  function zelfKnippen(mijn) {
    metZicht(function () {
      if (mijn !== knipNr) return;
      window.rtZicht.uitsnede(besteFoto(), "boven", function (c) {
        if (mijn !== knipNr) return;
        knip = c;
        teken();
      });
    });
  }
  // De canvas krijgt precies zoveel pixels als ze op het scherm inneemt (maal de pixeldichtheid van het
  // toestel): zo tekent de browser de kamer en het toestel scherp, zonder nog eens te verkleinen via CSS.
  function past() {
    var im = fotos[kamer.id];
    if (!im) return false;
    var vlak = box.querySelector(".zb-vlak");
    var r = vlak.getBoundingClientRect();
    var hh = box.querySelector(".zb-hint").getBoundingClientRect().height + 8;
    var bw = Math.max(100, r.width - 16),
      bh = Math.max(100, r.height - hh - 16);
    // Op gsm groeit het vlak niet mee (CSS: flex none), zodat de kleuren en de offerteknop meteen onder de
    // foto staan in plaats van onder een groot leeg vlak (controle 5-11-2026). De ruimte die er dan is: het
    // venster min de kopbalk, de kamerknoppen en de balk onderaan.
    if (getComputedStyle(vlak).flexGrow === "0") {
      var hoog = function (sel) {
        var e = box.querySelector(sel);
        return e ? e.getBoundingClientRect().height : 0;
      };
      bh = Math.max(100, box.clientHeight - hoog(".zb-top") - hoog(".wk-stijlen") - hoog(".zb-balk") - hh - 16);
    }
    var s = Math.min(bw / im.naturalWidth, bh / im.naturalHeight);
    var cw = Math.round(im.naturalWidth * s),
      ch = Math.round(im.naturalHeight * s);
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    var dpr = Math.min(3, window.devicePixelRatio || 1);
    var W = Math.min(im.naturalWidth, Math.round(cw * dpr)),
      H = Math.min(im.naturalHeight, Math.round(ch * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
      return true;
    }
    return false;
  }
  // De uitsnede (1600 px breed) in stappen halveren tot ze hoogstens dubbel zo groot is als nodig:
  // zo blijft ze scherp en rustig, zonder korrel.
  var kleinCache = { bron: null, b: 0, c: null };
  function knipVoor(b) {
    if (kleinCache.bron === knip && kleinCache.b === b) return kleinCache.c;
    var c = knip;
    while (c.width > 2 * b && c.width > 64) {
      var k = document.createElement("canvas");
      k.width = Math.round(c.width / 2);
      k.height = Math.round(c.height / 2);
      var kx = k.getContext("2d");
      kx.imageSmoothingEnabled = true;
      kx.imageSmoothingQuality = "high";
      kx.drawImage(c, 0, 0, k.width, k.height);
      c = k;
    }
    kleinCache = { bron: knip, b: b, c: c };
    return c;
  }
  function teken() {
    var im = fotos[kamer.id];
    if (!im) return;
    past();
    var W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    box.querySelector(".wk-sleep").hidden = !!foto;
    box.querySelector(".wk-echt").hidden = !foto;
    canvas.classList.toggle("is-foto", !!foto);
    if (foto) {
      ctx.drawImage(foto, 0, 0, W, H);
      box.querySelector(".wk-terug").hidden = true;
      return;
    }
    ctx.drawImage(im, 0, 0, W, H);
    box.querySelector(".wk-terug").hidden = !plek;
    if (!knip) return;
    var r = rechthoek();
    var bron = knipVoor(Math.ceil(r.b));
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = r.b * 0.07;
    ctx.shadowOffsetY = r.b * 0.04;
    ctx.drawImage(bron, r.x, r.y, r.b, r.h);
    ctx.restore();
  }
  window.rtWoonkamer = { open: open, sluit: sluit };
})();
