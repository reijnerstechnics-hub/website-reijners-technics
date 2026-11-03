// =====================================================================
// "ZIE DIT TOESTEL BIJ U THUIS" (Rims keuzes van 3-11-2026)
// ---------------------------------------------------------------------
// Op elke toestelpagina opent de kaart "Zie dit toestel bij u thuis" dit venster, met twee delen:
//   1. Op uw eigen foto: de klant kiest (of neemt) een foto van zijn muur of gevel, het toestel
//      wordt uit de productfoto geknipt (witte achtergrond weg) en hij sleept het op de juiste plek,
//      maakt het groter of kleiner (knijpen, scrollen of de schuif) en spiegelt het.
//      De foto blijft op zijn gsm: er wordt niets verstuurd tot hij zelf op "Stuur naar Rim" tikt
//      (dan via het deelmenu van de gsm, bv. WhatsApp; op een computer: bewaren + WhatsApp openen).
//   2. 3D-voorbeeldhuis: een huis in 3D (three.js, laadt pas als de klant dat deel opent) waar hij de
//      buitenunit over de gevel sleept, het huis draait, inzoomt en de gevelkleur kiest.
//      De buitenunit is nu zelf getekend; zodra het 3D-model uit Higgsfield klaar is (december 2026),
//      vervangt laadModel(url) hieronder de getekende unit door dat model (GLB).
// Wordt geopend door js/main.js (toestelpagina) met window.rtZicht.open({...}).
// =====================================================================
(function () {
  "use strict";
  var WA = "https://wa.me/32491113313?text=";
  var THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  // als een model geen eigen buitenunit-foto heeft: die van het merk (de losse buitenunits in de lijst)
  var MERK_BUITEN = {
    nuova: "assets/img/s-26a8fbe66948.webp",
    daikin: "assets/img/daikin-mxm.webp",
    lg: "assets/img/s-974b4300ff04.webp",
    me: "assets/img/s-12e27b8c7948.webp",
    mhi: "assets/img/mhi-scm.webp",
    toshiba: "assets/img/toshiba-multi.webp",
  };
  // Later (december 2026): het 3D-model van de buitenunit uit Higgsfield, bv. "assets/3d/buitenunit.glb".
  // Zolang dit leeg is, tekent de site de buitenunit zelf.
  var MODEL_3D = "";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function slug(s) {
    return String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // ---------------------------------------------------------------------
  // Het toestel uit de productfoto knippen: alles wat wit is en aan de rand vastzit, wordt doorzichtig.
  // De randpixels worden zacht gemaakt zodat het niet gekarteld oogt.
  // De meeste kaartfoto's tonen een set (binnenunit boven, buitenunit en afstandsbediening eronder):
  // deel "boven" houdt enkel het bovenste grote stuk (de binnenunit), "onder" het onderste (de buitenunit;
  // geeft null als de foto maar één stuk toont), "alles" de hele foto.
  // ---------------------------------------------------------------------
  var knipCache = {};
  function uitsnede(src, deel, cb) {
    var sleutel = src + "|" + deel;
    if (sleutel in knipCache) return cb(knipCache[sleutel]);
    var im = new Image();
    im.onload = function () {
      var w = im.naturalWidth,
        h = im.naturalHeight;
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      var ctx = c.getContext("2d");
      ctx.drawImage(im, 0, 0);
      var id;
      try {
        id = ctx.getImageData(0, 0, w, h);
      } catch (e) {
        knipCache[sleutel] = c; // (zou enkel mislukken bij een foto van een ander adres)
        return cb(c);
      }
      var d = id.data;
      var n = w * h;
      var weg = new Uint8Array(n); // 1 = wordt doorzichtig
      var stapel = [];
      function wit(i) {
        var r = d[i * 4],
          g = d[i * 4 + 1],
          b = d[i * 4 + 2];
        var mn = Math.min(r, g, b),
          mx = Math.max(r, g, b);
        return mn > 234 && mx - mn < 14;
      }
      function duw(i) {
        if (!weg[i] && wit(i)) {
          weg[i] = 1;
          stapel.push(i);
        }
      }
      var x, y;
      for (x = 0; x < w; x++) {
        duw(x);
        duw((h - 1) * w + x);
      }
      for (y = 0; y < h; y++) {
        duw(y * w);
        duw(y * w + w - 1);
      }
      while (stapel.length) {
        var i = stapel.pop();
        x = i % w;
        y = (i - x) / w;
        if (x > 0) duw(i - 1);
        if (x < w - 1) duw(i + 1);
        if (y > 0) duw(i - w);
        if (y < h - 1) duw(i + w);
      }
      // doorzichtig maken en de rand verzachten (een pixel die aan "weg" grenst, wordt half doorzichtig
      // naarmate hij lichter is: zo verdwijnt ook de lichte zweem rond het toestel)
      var mnX = w,
        mnY = h,
        mxX = 0,
        mxY = 0;
      for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
          var k = y * w + x;
          if (weg[k]) {
            d[k * 4 + 3] = 0;
            continue;
          }
          var rand = (x > 0 && weg[k - 1]) || (x < w - 1 && weg[k + 1]) || (y > 0 && weg[k - w]) || (y < h - 1 && weg[k + w]);
          if (rand) {
            var lum = Math.min(d[k * 4], d[k * 4 + 1], d[k * 4 + 2]);
            d[k * 4 + 3] = Math.max(60, Math.min(255, Math.round((236 - lum) * 9)));
          }
          if (x < mnX) mnX = x;
          if (x > mxX) mxX = x;
          if (y < mnY) mnY = y;
          if (y > mxY) mxY = y;
        }
      }
      // welk stuk? de aaneengesloten stukken zoeken en het bovenste of onderste grote stuk kiezen
      if (deel !== "alles") {
        var lab = new Int32Array(n),
          stukken = [],
          st = [];
        for (var s = 0; s < n; s++) {
          if (weg[s] || lab[s]) continue;
          var nr = stukken.length + 1;
          var cp = { id: nr, a: 0, x0: w, x1: 0, y0: h, y1: 0 };
          lab[s] = nr;
          st.push(s);
          while (st.length) {
            var q = st.pop();
            cp.a++;
            var qx = q % w,
              qy = (q - qx) / w;
            if (qx < cp.x0) cp.x0 = qx;
            if (qx > cp.x1) cp.x1 = qx;
            if (qy < cp.y0) cp.y0 = qy;
            if (qy > cp.y1) cp.y1 = qy;
            if (qx > 0 && !weg[q - 1] && !lab[q - 1]) {
              lab[q - 1] = nr;
              st.push(q - 1);
            }
            if (qx < w - 1 && !weg[q + 1] && !lab[q + 1]) {
              lab[q + 1] = nr;
              st.push(q + 1);
            }
            if (qy > 0 && !weg[q - w] && !lab[q - w]) {
              lab[q - w] = nr;
              st.push(q - w);
            }
            if (qy < h - 1 && !weg[q + w] && !lab[q + w]) {
              lab[q + w] = nr;
              st.push(q + w);
            }
          }
          stukken.push(cp);
        }
        var grootste = 0;
        stukken.forEach(function (k) {
          if (k.a > grootste) grootste = k.a;
        });
        // enkel de grote stukken tellen mee (geen stofjes, geen kleine afstandsbediening)
        var kand = stukken.filter(function (k) {
          return k.a >= grootste * 0.25;
        });
        if (deel === "onder" && kand.length < 2) {
          knipCache[sleutel] = null;
          return cb(null);
        }
        // bovenste (of onderste) eerst; staan twee stukken even hoog, dan het grootste
        kand.sort(function (p, q) {
          var v = deel === "boven" ? p.y0 - q.y0 : q.y1 - p.y1;
          return Math.abs(v) < h * 0.15 ? q.a - p.a : v;
        });
        var keuze = kand[0];
        if (keuze) {
          mnX = keuze.x0;
          mxX = keuze.x1;
          mnY = keuze.y0;
          mxY = keuze.y1;
          for (y = mnY; y <= mxY; y++) for (x = mnX; x <= mxX; x++) if (lab[y * w + x] !== keuze.id) d[(y * w + x) * 4 + 3] = 0;
        }
      }
      ctx.putImageData(id, 0, 0);
      // bijsnijden tot het toestel zelf (met een kleine marge)
      var out = c;
      if (mxX > mnX && mxY > mnY) {
        var p = 2;
        mnX = Math.max(0, mnX - p);
        mnY = Math.max(0, mnY - p);
        mxX = Math.min(w - 1, mxX + p);
        mxY = Math.min(h - 1, mxY + p);
        out = document.createElement("canvas");
        out.width = mxX - mnX + 1;
        out.height = mxY - mnY + 1;
        out.getContext("2d").drawImage(c, mnX, mnY, out.width, out.height, 0, 0, out.width, out.height);
      }
      knipCache[sleutel] = out;
      cb(out);
    };
    im.onerror = function () {
      knipCache[sleutel] = null;
      cb(null);
    };
    im.src = src;
  }

  // ---------------------------------------------------------------------
  // Het beeld delen: op een gsm via het deelmenu (WhatsApp, ...), anders bewaren + WhatsApp openen.
  // ---------------------------------------------------------------------
  function bestandsnaam(model) {
    return "reijners-technics-" + slug(model) + ".jpg";
  }
  function bewaar(blob, naam) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = naam;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 2000);
  }
  function deel(blob, model, waar, melding) {
    var tekst = "Hallo Rim, zo zou de " + model + " bij mij " + waar + " staan (zie foto). Kunt u mij een offerte sturen?";
    var naam = bestandsnaam(model);
    var file = null;
    try {
      file = new File([blob], naam, { type: "image/jpeg" });
    } catch (e) {}
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], text: tekst }).catch(function () {});
      return;
    }
    bewaar(blob, naam);
    melding("De foto is bewaard (map Downloads). Voeg ze toe in het WhatsApp-gesprek dat nu opent.");
    window.open(WA + encodeURIComponent(tekst + " De foto heb ik net bewaard en stuur ik hierbij mee."), "_blank", "noopener");
  }

  // ---------------------------------------------------------------------
  // Het venster
  // ---------------------------------------------------------------------
  var box = null,
    opener = null,
    huidig = null,
    fotoDeel = null,
    drieDeel = null;

  function maakBox() {
    if (box) return box;
    box = el("div", "zb");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Zie dit toestel bij u thuis");
    box.innerHTML =
      '<div class="zb-top"><b class="zb-titel"></b><button type="button" class="zb-x" aria-label="Sluiten">&times;</button></div>' +
      '<div class="zb-tabs" role="tablist">' +
      '<button type="button" class="zb-tab" role="tab" data-deel="foto" aria-selected="true">Op uw eigen foto</button>' +
      '<button type="button" class="zb-tab" role="tab" data-deel="3d" aria-selected="false">3D-voorbeeldhuis</button></div>' +
      '<div class="zb-deel zb-foto" role="tabpanel"></div>' +
      '<div class="zb-deel zb-3d" role="tabpanel" hidden></div>' +
      '<p class="zb-melding" aria-live="polite" hidden></p>';
    document.body.appendChild(box);
    box.querySelector(".zb-x").addEventListener("click", sluit);
    box.querySelectorAll(".zb-tab").forEach(function (t) {
      t.addEventListener("click", function () {
        kiesDeel(t.dataset.deel);
      });
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Escape") sluit();
    });
    window.addEventListener("hashchange", function () {
      if (box && !box.hidden) sluit();
    });
    fotoDeel = maakFotoDeel(box.querySelector(".zb-foto"));
    drieDeel = maakDrieDeel(box.querySelector(".zb-3d"));
    return box;
  }
  function melding(t) {
    var m = box.querySelector(".zb-melding");
    m.textContent = t || "";
    m.hidden = !t;
    clearTimeout(m._t);
    if (t) m._t = setTimeout(function () { m.hidden = true; }, 7000);
  }
  function kiesDeel(naam) {
    box.querySelectorAll(".zb-tab").forEach(function (t) {
      t.setAttribute("aria-selected", t.dataset.deel === naam ? "true" : "false");
    });
    box.querySelector(".zb-foto").hidden = naam !== "foto";
    box.querySelector(".zb-3d").hidden = naam !== "3d";
    if (naam === "3d") drieDeel.start(huidig);
    else fotoDeel.toon();
  }
  function open(o) {
    maakBox();
    huidig = o;
    opener = document.activeElement;
    box.querySelector(".zb-titel").textContent = o.type === "buiten" ? "Deze buitenunit aan uw gevel" : "De " + o.model + " bij u thuis";
    melding("");
    fotoDeel.reset(o);
    kiesDeel("foto");
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".zb-x").focus();
  }
  function sluit() {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.documentElement.style.overflow = "";
    drieDeel.stop();
    if (opener && opener.focus) opener.focus();
  }

  // ---------------------------------------------------------------------
  // Deel 1: op uw eigen foto
  // ---------------------------------------------------------------------
  function maakFotoDeel(root) {
    root.innerHTML =
      '<div class="zb-start">' +
      '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/></svg>' +
      '<h3>Neem een foto van uw muur of gevel</h3>' +
      '<p class="zb-uitleg">Recht van voren en bij daglicht werkt het best. Daarna sleept u het toestel op de juiste plek.</p>' +
      '<label class="zb-btn gold zb-kies">Kies of neem een foto<input type="file" accept="image/*" hidden></label>' +
      '<p class="zb-klein">Uw foto blijft op uw gsm of computer. Er wordt niets verstuurd tot u zelf op &ldquo;Stuur naar Rim&rdquo; tikt.</p>' +
      '<p class="zb-klein">Liever dat Rim het doet? <a class="zb-wa" href="#" target="_blank" rel="noopener">Stuur uw foto via WhatsApp</a>, u krijgt een beeld terug met het toestel erin.</p>' +
      "</div>" +
      '<div class="zb-werk" hidden>' +
      '<div class="zb-vlak"><canvas class="zb-canvas" aria-label="Uw foto met het toestel erop"></canvas><p class="zb-hint">Sleep het toestel naar de juiste plek. Knijp of scrol om het groter of kleiner te maken.</p></div>' +
      '<div class="zb-balk">' +
      '<div class="zb-seg zb-welk" role="group" aria-label="Welk deel van het toestel"><button type="button" data-welk="binnen" aria-pressed="true">Binnenunit</button><button type="button" data-welk="buiten" aria-pressed="false">Buitenunit</button></div>' +
      '<label class="zb-schuif">Grootte <input type="range" min="8" max="90" value="30" aria-label="Grootte van het toestel"></label>' +
      '<button type="button" class="zb-btn zb-spiegel">Spiegelen</button>' +
      '<label class="zb-btn zb-ander">Andere foto<input type="file" accept="image/*" hidden></label>' +
      '<button type="button" class="zb-btn zb-bewaar">Bewaar</button>' +
      '<button type="button" class="zb-btn gold zb-stuur">Stuur naar Rim</button>' +
      "</div></div>";
    var start = root.querySelector(".zb-start"),
      werk = root.querySelector(".zb-werk"),
      vlak = root.querySelector(".zb-vlak"),
      canvas = root.querySelector(".zb-canvas"),
      ctx = canvas.getContext("2d"),
      welk = root.querySelector(".zb-welk"),
      schuif = root.querySelector(".zb-schuif input");
    var o = null,
      foto = null, // ImageBitmap of Image
      knip = null, // canvas met het uitgeknipte toestel
      stand = { x: 0.5, y: 0.5, b: 0.3, spiegel: false }, // midden (deel van de foto) en breedte (deel van de fotobreedte)
      welkNu = "binnen",
      blobKlaar = null,
      blobTimer = null;

    root.querySelectorAll('input[type="file"]').forEach(function (inp) {
      inp.addEventListener("change", function () {
        if (inp.files && inp.files[0]) laadFoto(inp.files[0]);
        inp.value = "";
      });
    });
    welk.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        kiesWelk(b.dataset.welk);
      });
    });
    schuif.addEventListener("input", function () {
      stand.b = schuif.value / 100;
      teken();
    });
    root.querySelector(".zb-spiegel").addEventListener("click", function () {
      stand.spiegel = !stand.spiegel;
      teken();
    });
    root.querySelector(".zb-bewaar").addEventListener("click", function () {
      maakBlob(function (blob) {
        bewaar(blob, bestandsnaam(o.model));
        melding("De foto is bewaard (map Downloads).");
      });
    });
    root.querySelector(".zb-stuur").addEventListener("click", function () {
      // het beeld staat meestal al klaar (zie teken), zodat het deelmenu meteen opent
      if (blobKlaar) deel(blobKlaar, o.model, welkNu === "buiten" ? "aan de gevel" : "in de kamer", melding);
      else
        maakBlob(function (blob) {
          deel(blob, o.model, welkNu === "buiten" ? "aan de gevel" : "in de kamer", melding);
        });
    });

    function reset(opts) {
      o = opts;
      foto = null;
      knip = null;
      blobKlaar = null;
      start.hidden = false;
      werk.hidden = true;
      var binnenKan = !!o.binnen && o.binnenKan !== false && o.type !== "buiten";
      welk.hidden = !binnenKan;
      welkNu = binnenKan ? "binnen" : "buiten";
      welk.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.welk === welkNu ? "true" : "false");
      });
      start.querySelector("h3").textContent = binnenKan ? "Neem een foto van uw muur of gevel" : "Neem een foto van uw gevel";
      root.querySelector(".zb-wa").href =
        WA + encodeURIComponent("Hallo Rim, ik wil graag zien hoe de " + o.model + " bij mij zou staan. Ik stuur u hierbij een foto van de muur.");
    }
    function toon() {
      if (foto) past();
    }
    function kiesWelk(w) {
      welkNu = w;
      welk.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.welk === w ? "true" : "false");
      });
      stand.b = w === "buiten" ? 0.22 : 0.3;
      schuif.value = Math.round(stand.b * 100);
      laadKnip();
    }
    function laadKnip() {
      knip = null;
      var mijn = ++knipNr; // een oudere, trage uitsnede mag een nieuwere niet overschrijven
      function klaar(c) {
        if (mijn !== knipNr) return;
        knip = c;
        teken();
      }
      if (welkNu === "binnen") {
        if (!o.binnen) return teken();
        return uitsnede(o.binnen, o.type === "buiten" ? "alles" : "boven", klaar);
      }
      if (o.buiten) return uitsnede(o.buiten, "alles", klaar);
      if (o.type === "buiten") return uitsnede(o.binnen, "alles", klaar);
      // geen eigen buitenunit-foto: de buitenunit uit de setfoto, anders die van het merk
      uitsnede(o.binnen || "", "onder", function (c) {
        if (c) return klaar(c);
        uitsnede(MERK_BUITEN[o.merk] || MERK_BUITEN.daikin, "alles", klaar);
      });
    }
    var knipNr = 0;
    function laadFoto(file) {
      var klaar = function (bm) {
        foto = bm;
        // de tekencanvas krijgt de grootte van de foto (hoogstens 1600 px), de css schaalt ze passend
        var s = Math.min(1, 1600 / Math.max(bm.width, bm.height));
        canvas.width = Math.round(bm.width * s);
        canvas.height = Math.round(bm.height * s);
        stand = { x: 0.5, y: 0.45, b: welkNu === "buiten" ? 0.22 : 0.3, spiegel: false };
        schuif.value = Math.round(stand.b * 100);
        start.hidden = true;
        werk.hidden = false;
        past();
        laadKnip();
      };
      if (window.createImageBitmap) {
        createImageBitmap(file, { imageOrientation: "from-image" }).then(klaar, function () {
          viaImage(file, klaar);
        });
      } else viaImage(file, klaar);
    }
    function viaImage(file, klaar) {
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () {
        klaar({ width: im.naturalWidth, height: im.naturalHeight, img: im });
        URL.revokeObjectURL(url);
      };
      im.onerror = function () {
        URL.revokeObjectURL(url);
        melding("Deze foto kon niet geopend worden. Probeer een andere foto (jpg of png).");
      };
      im.src = url;
    }
    // de canvas passend in het vlak, met dezelfde verhouding als de foto
    function past() {
      var r = vlak.getBoundingClientRect();
      var hint = vlak.querySelector(".zb-hint").getBoundingClientRect().height + 8;
      var bw = Math.max(100, r.width - 16),
        bh = Math.max(100, r.height - hint - 16);
      var s = Math.min(bw / canvas.width, bh / canvas.height);
      canvas.style.width = Math.round(canvas.width * s) + "px";
      canvas.style.height = Math.round(canvas.height * s) + "px";
    }
    window.addEventListener("resize", function () {
      if (foto && !root.hidden && !box.hidden) past();
    });
    function teken() {
      if (!foto) return;
      var W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(foto.img || foto, 0, 0, W, H);
      if (knip) {
        var b = stand.b * W;
        var h = (b * knip.height) / knip.width;
        var cx = stand.x * W,
          cy = stand.y * H;
        ctx.save();
        ctx.translate(cx, cy);
        if (stand.spiegel) ctx.scale(-1, 1);
        ctx.shadowColor = "rgba(0,0,0,0.32)";
        ctx.shadowBlur = b * 0.08;
        ctx.shadowOffsetY = b * 0.035;
        ctx.drawImage(knip, -b / 2, -h / 2, b, h);
        ctx.restore();
      }
      blobKlaar = null;
      clearTimeout(blobTimer);
      blobTimer = setTimeout(function () {
        maakBlob(function (bl) {
          blobKlaar = bl;
        });
      }, 400);
    }
    function maakBlob(cb) {
      canvas.toBlob(
        function (bl) {
          if (bl) cb(bl);
        },
        "image/jpeg",
        0.88
      );
    }
    // slepen (één vinger of de muis) en knijpen (twee vingers), scrollen op de computer
    var vingers = {},
      vorigeAfstand = 0;
    canvas.addEventListener("pointerdown", function (e) {
      vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!vingers[e.pointerId] || !foto) return;
      var ids = Object.keys(vingers);
      var r = canvas.getBoundingClientRect();
      if (ids.length === 1) {
        var v = vingers[e.pointerId];
        stand.x += (e.clientX - v.x) / r.width;
        stand.y += (e.clientY - v.y) / r.height;
        stand.x = Math.max(0, Math.min(1, stand.x));
        stand.y = Math.max(0, Math.min(1, stand.y));
        v.x = e.clientX;
        v.y = e.clientY;
        teken();
      } else if (ids.length >= 2) {
        vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
        var a = vingers[ids[0]],
          b = vingers[ids[1]];
        var af = Math.hypot(a.x - b.x, a.y - b.y);
        if (vorigeAfstand) {
          stand.b = Math.max(0.08, Math.min(0.9, stand.b * (af / vorigeAfstand)));
          schuif.value = Math.round(stand.b * 100);
          teken();
        }
        vorigeAfstand = af;
      }
    });
    function los(e) {
      delete vingers[e.pointerId];
      vorigeAfstand = 0;
    }
    canvas.addEventListener("pointerup", los);
    canvas.addEventListener("pointercancel", los);
    canvas.addEventListener(
      "wheel",
      function (e) {
        if (!foto) return;
        e.preventDefault();
        stand.b = Math.max(0.08, Math.min(0.9, stand.b * (e.deltaY < 0 ? 1.06 : 0.94)));
        schuif.value = Math.round(stand.b * 100);
        teken();
      },
      { passive: false }
    );
    return { reset: reset, toon: toon };
  }

  // ---------------------------------------------------------------------
  // Deel 2: het 3D-voorbeeldhuis (three.js laadt pas hier)
  // ---------------------------------------------------------------------
  function maakDrieDeel(root) {
    root.innerHTML =
      '<div class="zb-vlak zb-3d-vlak"><p class="zb-laden">Het 3D-huis laadt&hellip;</p>' +
      '<p class="zb-hint">Sleep de buitenunit over de gevel. Sleep ernaast om het huis te draaien, knijp of scrol om in te zoomen.</p></div>' +
      '<div class="zb-balk">' +
      '<div class="zb-seg zb-gevel" role="group" aria-label="Gevel"><button type="button" data-gevel="baksteen" aria-pressed="true">Baksteen</button><button type="button" data-gevel="wit" aria-pressed="false">Wit</button><button type="button" data-gevel="grijs" aria-pressed="false">Grijs</button></div>' +
      '<div class="zb-seg zb-plek" role="group" aria-label="Plaats van de buitenunit"><button type="button" data-plek="muur" aria-pressed="true">Aan de muur</button><button type="button" data-plek="grond" aria-pressed="false">Op de grond</button></div>' +
      '<button type="button" class="zb-btn zb-bewaar">Bewaar</button>' +
      '<button type="button" class="zb-btn gold zb-stuur">Stuur naar Rim</button>' +
      "</div>";
    var vlak = root.querySelector(".zb-3d-vlak"),
      laden = root.querySelector(".zb-laden");
    var T = null, // three
      scene,
      camera,
      renderer,
      huis,
      unit,
      muren = [],
      gevelVlak,
      bezig = false,
      actief = false,
      vuil = true,
      o = null;
    var HUIS = { b: 9, d: 7, h: 5.4 }; // breedte, diepte, hoogte van de muren (meter)
    var zicht = { yaw: 0.42, pitch: 0.3, r: 15 };
    var plek = "muur";
    var unitPos = { x: 1.9, y: 2.9 };

    root.querySelectorAll(".zb-gevel button").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll(".zb-gevel button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        zetGevel(b.dataset.gevel);
      });
    });
    root.querySelectorAll(".zb-plek button").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll(".zb-plek button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        plek = b.dataset.plek;
        zetUnit();
      });
    });
    root.querySelector(".zb-bewaar").addEventListener("click", function () {
      beeld(function (bl) {
        bewaar(bl, bestandsnaam(o.model));
        melding("Het beeld is bewaard (map Downloads).");
      });
    });
    root.querySelector(".zb-stuur").addEventListener("click", function () {
      beeld(function (bl) {
        deel(bl, o.model, "aan de gevel", melding);
      });
    });

    function laadThree(cb) {
      if (window.THREE) return cb(true);
      if (bezig) return;
      bezig = true;
      var s = document.createElement("script");
      s.src = THREE_URL;
      s.onload = function () {
        bezig = false;
        cb(true);
      };
      s.onerror = function () {
        bezig = false;
        cb(false);
      };
      document.head.appendChild(s);
    }
    function start(opts) {
      o = opts;
      actief = true;
      laden.hidden = false;
      laadThree(function (ok) {
        if (!ok) {
          laden.textContent = "Het 3D-huis kon niet laden (geen verbinding?). Probeer het straks opnieuw of gebruik uw eigen foto.";
          return;
        }
        if (!scene) bouw();
        laden.hidden = true;
        past();
        vuil = true;
        lus();
      });
    }
    function stop() {
      actief = false;
    }

    // ---- texturen, zelf getekend (geen bestanden nodig)
    function canvasTex(w, h, tekenaar) {
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      tekenaar(c.getContext("2d"), w, h);
      var t = new T.CanvasTexture(c);
      t.wrapS = t.wrapT = T.RepeatWrapping;
      return t;
    }
    function baksteenTex() {
      return canvasTex(512, 512, function (c, w, h) {
        c.fillStyle = "#cfc3b3"; // voeg
        c.fillRect(0, 0, w, h);
        var bh = 32,
          bw = 96,
          voeg = 5;
        for (var rij = 0; rij * bh < h; rij++) {
          var off = rij % 2 ? bw / 2 : 0;
          for (var x = -bw; x < w + bw; x += bw) {
            var t = Math.random();
            var r = 150 + Math.round(t * 40),
              g = 78 + Math.round(t * 22),
              b = 60 + Math.round(t * 16);
            c.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            c.fillRect(x + off + voeg / 2, rij * bh + voeg / 2, bw - voeg, bh - voeg);
          }
        }
      });
    }
    function pleisterTex(kleur) {
      return canvasTex(256, 256, function (c, w, h) {
        c.fillStyle = kleur;
        c.fillRect(0, 0, w, h);
        for (var i = 0; i < 2500; i++) {
          c.fillStyle = "rgba(0,0,0," + (Math.random() * 0.05).toFixed(3) + ")";
          c.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
      });
    }
    function dakTex() {
      return canvasTex(256, 256, function (c, w, h) {
        c.fillStyle = "#4a4541";
        c.fillRect(0, 0, w, h);
        for (var y = 0; y < h; y += 32) {
          c.fillStyle = "rgba(255,255,255,0.08)";
          c.fillRect(0, y, w, 2);
          c.fillStyle = "rgba(0,0,0,0.25)";
          c.fillRect(0, y + 28, w, 4);
          for (var x = (y / 32) % 2 ? 32 : 0; x < w; x += 64) {
            c.fillStyle = "rgba(0,0,0,0.12)";
            c.fillRect(x, y, 2, 32);
          }
        }
      });
    }
    function grasTex() {
      return canvasTex(256, 256, function (c, w, h) {
        c.fillStyle = "#86a064";
        c.fillRect(0, 0, w, h);
        for (var i = 0; i < 6000; i++) {
          c.fillStyle = Math.random() < 0.5 ? "rgba(60,90,40,0.25)" : "rgba(170,200,120,0.2)";
          c.fillRect(Math.random() * w, Math.random() * h, 2, 3);
        }
      });
    }
    // de voorkant van de buitenunit: ventilatoropening met lamellen, rechts de rooster
    function unitTex() {
      return canvasTex(512, 352, function (c, w, h) {
        c.fillStyle = "#d9d8d2";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "rgba(0,0,0,0.08)";
        c.lineWidth = 2;
        c.strokeRect(6, 6, w - 12, h - 12);
        var cx = 190,
          cy = h / 2,
          R = 130;
        c.fillStyle = "#2f3237";
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.fill();
        // ventilatorbladen
        c.fillStyle = "#4b4f55";
        for (var i = 0; i < 5; i++) {
          c.save();
          c.translate(cx, cy);
          c.rotate((i * Math.PI * 2) / 5);
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(70, -60, 110, 0);
          c.quadraticCurveTo(70, 30, 0, 0);
          c.fill();
          c.restore();
        }
        c.fillStyle = "#6b6f75";
        c.beginPath();
        c.arc(cx, cy, 22, 0, Math.PI * 2);
        c.fill();
        // beschermrooster: ringen en spaken
        c.strokeStyle = "rgba(220,220,215,0.85)";
        c.lineWidth = 3;
        for (var r = 26; r < R; r += 18) {
          c.beginPath();
          c.arc(cx, cy, r, 0, Math.PI * 2);
          c.stroke();
        }
        for (var k = 0; k < 8; k++) {
          c.beginPath();
          c.moveTo(cx, cy);
          c.lineTo(cx + Math.cos((k * Math.PI) / 4) * R, cy + Math.sin((k * Math.PI) / 4) * R);
          c.stroke();
        }
        // rechts: horizontale lamellen
        c.fillStyle = "#c9c8c1";
        for (var y = 40; y < h - 40; y += 14) c.fillRect(350, y, 130, 7);
      });
    }

    function bouw() {
      T = window.THREE;
      scene = new T.Scene();
      scene.background = new T.Color(0xdfe8ef);
      scene.fog = new T.Fog(0xdfe8ef, 30, 70);
      camera = new T.PerspectiveCamera(38, 1, 0.1, 120);
      renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.outputEncoding = T.sRGBEncoding;
      vlak.insertBefore(renderer.domElement, vlak.firstChild);
      renderer.domElement.className = "zb-canvas";
      renderer.domElement.setAttribute("aria-label", "Een huis in 3D met de buitenunit tegen de gevel");

      scene.add(new T.HemisphereLight(0xeaf2fa, 0x7f8f6a, 0.85));
      var zon = new T.DirectionalLight(0xfff4e0, 1.05);
      zon.position.set(8, 14, 12);
      zon.castShadow = true;
      zon.shadow.mapSize.set(1024, 1024);
      zon.shadow.camera.left = zon.shadow.camera.bottom = -12;
      zon.shadow.camera.right = zon.shadow.camera.top = 12;
      zon.shadow.camera.near = 1;
      zon.shadow.camera.far = 50;
      zon.shadow.bias = -0.0015;
      scene.add(zon);

      // grond en oprit
      var gras = grasTex();
      gras.repeat.set(12, 12);
      var grond = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ map: gras, roughness: 1 }));
      grond.rotation.x = -Math.PI / 2;
      grond.receiveShadow = true;
      scene.add(grond);
      var pad = new T.Mesh(new T.BoxGeometry(1.6, 0.04, 6), new T.MeshStandardMaterial({ color: 0xb9b4a8, roughness: 0.95 }));
      pad.position.set(1.0, 0.02, HUIS.d / 2 + 3);
      pad.receiveShadow = true;
      scene.add(pad);

      huis = new T.Group();
      scene.add(huis);
      // muren (een doos; de voorgevel is de +z-kant)
      var wandMat = new T.MeshStandardMaterial({ roughness: 0.95 });
      var romp = new T.Mesh(new T.BoxGeometry(HUIS.b, HUIS.h, HUIS.d), wandMat);
      romp.position.y = HUIS.h / 2;
      romp.castShadow = romp.receiveShadow = true;
      huis.add(romp);
      muren.push(wandMat);
      // dak: twee hellende vlakken met een nok in de x-richting, en twee puntgevels
      var dakH = 2.6,
        over = 0.45;
      var helling = Math.atan2(dakH, HUIS.d / 2);
      var lengte = Math.sqrt(dakH * dakH + (HUIS.d / 2) * (HUIS.d / 2)) + over;
      var dakMat = new T.MeshStandardMaterial({ map: dakTex(), roughness: 0.9 });
      dakMat.map.repeat.set(6, 2);
      [1, -1].forEach(function (z) {
        var v = new T.Mesh(new T.BoxGeometry(HUIS.b + 2 * over, 0.12, lengte), dakMat);
        v.position.set(0, HUIS.h + dakH / 2 - 0.03, (z * (HUIS.d / 2 + over)) / 2);
        v.rotation.x = z * helling;
        v.castShadow = v.receiveShadow = true;
        huis.add(v);
      });
      var gevelVorm = new T.Shape();
      gevelVorm.moveTo(-HUIS.d / 2, 0);
      gevelVorm.lineTo(HUIS.d / 2, 0);
      gevelVorm.lineTo(0, dakH);
      gevelVorm.lineTo(-HUIS.d / 2, 0);
      [1, -1].forEach(function (x) {
        var g = new T.Mesh(new T.ShapeGeometry(gevelVorm), wandMat);
        g.position.set((x * HUIS.b) / 2, HUIS.h, 0);
        g.rotation.y = (x * Math.PI) / 2;
        g.castShadow = true;
        huis.add(g);
      });
      // ramen en de deur op de voorgevel
      var glas = new T.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.25, metalness: 0.35 });
      var kozijn = new T.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.8 });
      function raam(x, y, b, h) {
        var k = new T.Mesh(new T.BoxGeometry(b + 0.16, h + 0.16, 0.08), kozijn);
        k.position.set(x, y, HUIS.d / 2 + 0.02);
        huis.add(k);
        var r = new T.Mesh(new T.BoxGeometry(b, h, 0.08), glas);
        r.position.set(x, y, HUIS.d / 2 + 0.05);
        huis.add(r);
        var dorpel = new T.Mesh(new T.BoxGeometry(b + 0.3, 0.08, 0.2), new T.MeshStandardMaterial({ color: 0x8e8a82 }));
        dorpel.position.set(x, y - h / 2 - 0.1, HUIS.d / 2 + 0.1);
        dorpel.castShadow = true;
        huis.add(dorpel);
      }
      raam(-2.6, 1.55, 2.2, 1.5);
      raam(-0.1, 1.55, 1.1, 1.5);
      raam(-2.6, 3.95, 1.3, 1.3);
      raam(-0.1, 3.95, 1.3, 1.3);
      raam(2.4, 3.95, 1.3, 1.3);
      var deur = new T.Mesh(new T.BoxGeometry(1.05, 2.25, 0.1), new T.MeshStandardMaterial({ color: 0x3a4a58, roughness: 0.6 }));
      deur.position.set(1.0, 1.125, HUIS.d / 2 + 0.04);
      huis.add(deur);
      var deurK = new T.Mesh(new T.BoxGeometry(1.25, 2.4, 0.06), kozijn);
      deurK.position.set(1.0, 1.2, HUIS.d / 2 + 0.01);
      huis.add(deurK);
      var klink = new T.Mesh(new T.BoxGeometry(0.04, 0.16, 0.04), new T.MeshStandardMaterial({ color: 0xcfcfcf, metalness: 0.8, roughness: 0.3 }));
      klink.position.set(1.4, 1.1, HUIS.d / 2 + 0.11);
      huis.add(klink);
      // het onzichtbare vlak waarop de buitenunit beweegt (net voor de gevel)
      gevelVlak = new T.Mesh(new T.PlaneGeometry(HUIS.b, HUIS.h), new T.MeshBasicMaterial({ visible: false }));
      gevelVlak.position.set(0, HUIS.h / 2, HUIS.d / 2 + 0.17);
      huis.add(gevelVlak);

      zetGevel("baksteen");
      maakUnit();
      zetUnit();
      if (MODEL_3D) laadModel(MODEL_3D);
    }
    function zetGevel(naam) {
      if (!T) return;
      var m = muren[0];
      if (naam === "baksteen") {
        m.map = baksteenTex();
        m.map.repeat.set(2.2, 2.2);
        m.color.set(0xffffff);
      } else {
        m.map = pleisterTex(naam === "wit" ? "#efece4" : "#b7b5ae");
        m.map.repeat.set(3, 3);
        m.color.set(0xffffff);
      }
      m.needsUpdate = true;
      vuil = true;
    }
    // de buitenunit: een doos met de getekende voorkant, een beugel aan de muur of voetjes op de grond
    var UNIT = { b: 0.86, h: 0.6, d: 0.32 };
    function maakUnit() {
      unit = new T.Group();
      var kant = new T.MeshStandardMaterial({ color: 0xd9d8d2, roughness: 0.7 });
      var voor = new T.MeshStandardMaterial({ map: unitTex(), roughness: 0.7 });
      var body = new T.Mesh(new T.BoxGeometry(UNIT.b, UNIT.h, UNIT.d), [kant, kant, kant, kant, voor, kant]);
      body.castShadow = body.receiveShadow = true;
      body.name = "body";
      unit.add(body);
      var staal = new T.MeshStandardMaterial({ color: 0x5c6166, roughness: 0.6, metalness: 0.4 });
      var beugel = new T.Group();
      beugel.name = "beugel";
      [-0.28, 0.28].forEach(function (x) {
        var staand = new T.Mesh(new T.BoxGeometry(0.05, 0.45, 0.05), staal);
        staand.position.set(x, -UNIT.h / 2 - 0.2, -UNIT.d / 2 + 0.025);
        staand.castShadow = true;
        beugel.add(staand);
        var ligger = new T.Mesh(new T.BoxGeometry(0.05, 0.05, UNIT.d + 0.06), staal);
        ligger.position.set(x, -UNIT.h / 2 - 0.025, 0.03);
        ligger.castShadow = true;
        beugel.add(ligger);
      });
      unit.add(beugel);
      var voeten = new T.Group();
      voeten.name = "voeten";
      [-0.3, 0.3].forEach(function (x) {
        var v = new T.Mesh(new T.BoxGeometry(0.08, 0.1, UNIT.d + 0.08), staal);
        v.position.set(x, -UNIT.h / 2 - 0.05, 0);
        v.castShadow = true;
        voeten.add(v);
      });
      unit.add(voeten);
      scene.add(unit);
    }
    // Later: het 3D-model uit Higgsfield (GLB). Vervangt de getekende doos; beugel en voetjes blijven.
    function laadModel(url) {
      if (!T || !unit) return;
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
      s.onload = function () {
        new T.GLTFLoader().load(url, function (g) {
          var m = g.scene;
          var doos = new T.Box3().setFromObject(m);
          var maat = new T.Vector3();
          doos.getSize(maat);
          var s = UNIT.b / Math.max(maat.x, 0.001);
          m.scale.setScalar(s);
          doos.setFromObject(m);
          var mid = new T.Vector3();
          doos.getCenter(mid);
          m.position.sub(mid);
          m.traverse(function (k) {
            if (k.isMesh) k.castShadow = k.receiveShadow = true;
          });
          var oud = unit.getObjectByName("body");
          if (oud) unit.remove(oud);
          m.name = "body";
          unit.add(m);
          vuil = true;
        });
      };
      document.head.appendChild(s);
    }
    function zetUnit() {
      if (!unit) return;
      var muur = plek === "muur";
      unit.getObjectByName("beugel").visible = muur;
      unit.getObjectByName("voeten").visible = !muur;
      var grens = HUIS.b / 2 - UNIT.b / 2 - 0.2;
      unitPos.x = Math.max(-grens, Math.min(grens, unitPos.x));
      if (muur) {
        unitPos.y = Math.max(UNIT.h / 2 + 0.5, Math.min(HUIS.h - UNIT.h / 2 - 0.3, unitPos.y));
        unit.position.set(unitPos.x, unitPos.y, HUIS.d / 2 + UNIT.d / 2 + 0.06);
      } else {
        unit.position.set(unitPos.x, UNIT.h / 2 + 0.1, HUIS.d / 2 + UNIT.d / 2 + 0.12);
      }
      vuil = true;
    }
    function past() {
      if (!renderer) return;
      var r = vlak.getBoundingClientRect();
      var hint = vlak.querySelector(".zb-hint").getBoundingClientRect().height + 8;
      var w = Math.max(100, Math.round(r.width)),
        h = Math.max(100, Math.round(r.height - hint));
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      vuil = true;
    }
    window.addEventListener("resize", function () {
      if (actief && !box.hidden) past();
    });
    function zetCamera() {
      var doel = new T.Vector3(0, 2.3, HUIS.d / 2);
      camera.position.set(
        doel.x + zicht.r * Math.sin(zicht.yaw) * Math.cos(zicht.pitch),
        doel.y + zicht.r * Math.sin(zicht.pitch),
        doel.z + zicht.r * Math.cos(zicht.yaw) * Math.cos(zicht.pitch)
      );
      camera.lookAt(doel);
    }
    function lus() {
      if (!actief || box.hidden) return;
      if (vuil) {
        vuil = false;
        zetCamera();
        renderer.render(scene, camera);
      }
      requestAnimationFrame(lus);
    }
    function beeld(cb) {
      if (!renderer) return;
      zetCamera();
      renderer.render(scene, camera);
      renderer.domElement.toBlob(
        function (bl) {
          if (bl) cb(bl);
        },
        "image/jpeg",
        0.9
      );
    }

    // muis en vingers: op de unit = slepen, ernaast = draaien, twee vingers of scrollen = zoomen
    var ray = null,
      vingers = {},
      sleep = false,
      vorigeAfstand = 0;
    function straal(e) {
      var r = renderer.domElement.getBoundingClientRect();
      var m = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray = ray || new T.Raycaster();
      ray.setFromCamera(m, camera);
      return ray;
    }
    vlak.addEventListener("pointerdown", function (e) {
      if (!renderer || e.target !== renderer.domElement) return;
      vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
      renderer.domElement.setPointerCapture(e.pointerId);
      e.preventDefault();
      if (Object.keys(vingers).length === 1) {
        var raak = straal(e).intersectObject(unit, true);
        sleep = raak.length > 0;
        renderer.domElement.style.cursor = sleep ? "grabbing" : "move";
      }
    });
    vlak.addEventListener("pointermove", function (e) {
      if (!renderer) return;
      if (!vingers[e.pointerId]) {
        if (e.pointerType === "mouse") {
          var over = straal(e).intersectObject(unit, true).length > 0;
          renderer.domElement.style.cursor = over ? "grab" : "default";
        }
        return;
      }
      var ids = Object.keys(vingers);
      if (ids.length === 1) {
        var v = vingers[e.pointerId];
        if (sleep) {
          var hit = straal(e).intersectObject(gevelVlak);
          if (hit.length) {
            unitPos.x = hit[0].point.x;
            unitPos.y = hit[0].point.y;
            zetUnit();
          }
        } else {
          zicht.yaw -= (e.clientX - v.x) * 0.006;
          zicht.pitch += (e.clientY - v.y) * 0.004;
          zicht.yaw = Math.max(-1.25, Math.min(1.25, zicht.yaw));
          zicht.pitch = Math.max(0.04, Math.min(0.95, zicht.pitch));
          vuil = true;
        }
        v.x = e.clientX;
        v.y = e.clientY;
      } else {
        vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
        var a = vingers[ids[0]],
          b = vingers[ids[1]];
        var af = Math.hypot(a.x - b.x, a.y - b.y);
        if (vorigeAfstand) {
          zicht.r = Math.max(6, Math.min(28, zicht.r * (vorigeAfstand / af)));
          vuil = true;
        }
        vorigeAfstand = af;
      }
    });
    function los(e) {
      delete vingers[e.pointerId];
      vorigeAfstand = 0;
      sleep = false;
      if (renderer) renderer.domElement.style.cursor = "default";
    }
    vlak.addEventListener("pointerup", los);
    vlak.addEventListener("pointercancel", los);
    vlak.addEventListener(
      "wheel",
      function (e) {
        if (!renderer) return;
        e.preventDefault();
        zicht.r = Math.max(6, Math.min(28, zicht.r * (e.deltaY > 0 ? 1.08 : 0.92)));
        vuil = true;
      },
      { passive: false }
    );
    return { start: start, stop: stop, laadModel: laadModel };
  }

  // ---------------------------------------------------------------------
  // Voor js/main.js: welke foto's horen bij dit toestel?
  // ---------------------------------------------------------------------
  function buitenFoto(model) {
    var m = typeof RT_MEDIA !== "undefined" ? RT_MEDIA[model] : null;
    var f = m && m.fotos ? m.fotos.filter(function (x) { return x && x.src && /^buitenunit/i.test(x.label || ""); })[0] : null;
    return f ? f.src : null;
  }
  window.rtZicht = {
    open: open,
    sluit: sluit,
    buitenFoto: buitenFoto,
    laadModel: function (url) {
      if (drieDeel) drieDeel.laadModel(url);
    },
  };
})();
