// =====================================================================
// "PLAN UW PLAATSING" (Rims keuzes van 3-11-2026)
// ---------------------------------------------------------------------
// Op elke toestelpagina opent de kaart "Plan uw plaatsing bij u thuis" dit venster. De klant maakt in
// vier stappen zijn eigen plan, op eigen foto's of in een 3D-voorbeeldhuis:
//   1. Binnenunit(s): per kamer (tot 3, voor een multi-split) waar de binnenunit komt;
//   2. Buitenunit: waar, en hoe: op een muurbeugel, op een balk op de grond of op een plat dak;
//   3. Leiding en goot: het pad van de goot langs de gevel (op de foto tikt de klant de punten aan,
//      in het 3D-huis tekent de site de goot zelf), de kleur (wit, bruin, zwart, antraciet) en de
//      geschatte lengte (5 m zit in de richtprijs, meer rekenen we na het plaatsbezoek);
//   4. Overzicht: de beelden en het lijstje, naar Rim via WhatsApp of mee in het offerteformulier
//      (window.rtPlan, zie js/main.js).
// De foto's blijven op de gsm van de klant: er wordt niets verstuurd tot hij zelf deelt.
// Het toestel wordt uit de productfoto geknipt (witte achtergrond weg, zie uitsnede). three.js laadt pas
// als de klant het 3D-huis opent. De buitenunit in 3D is nu zelf getekend; zodra het 3D-model uit
// Higgsfield klaar is (december 2026) vult u MODEL_3D in en vervangt laadModel de getekende unit.
// Geopend door js/main.js met window.rtZicht.open({...}).
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
  var MODEL_3D = "";
  var KLEUREN = { wit: "#f1f1ec", bruin: "#6b4a2b", zwart: "#232323", antraciet: "#3d4248" };
  var KAMERNAMEN = ["Woonkamer", "Slaapkamer", "Keuken", "Bureau", "Andere kamer"];
  var MONTAGE = {
    beugel: "op een muurbeugel aan de gevel",
    balk: "op een balk op de grond",
    dak: "op een balk op het platte dak",
    anders: "anders (bespreken we bij het plaatsbezoek)",
  };
  var BUITEN_M = 0.85; // echte breedte van een buitenunit (m), voor de schatting van de gootlengte op een foto
  var INBEGREPEN = "5 m leiding zit in de richtprijs; meer rekenen we na het plaatsbezoek.";
  var MAX_KAMERS = 3;

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
  function m2(x) {
    return (Math.round(x * 2) / 2).toFixed(1).replace(".", ",").replace(",0", "");
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
      var ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(im, 0, 0);
      try {
        ctx.getImageData(0, 0, 1, 1);
      } catch (e) {
        knipCache[sleutel] = c; // (zou enkel mislukken bij een foto van een ander adres)
        return cb(c);
      }
      // Witte toestellen staan op een nog wittere achtergrond: de drempel ligt hoog (250). Gaat de achtergrond
      // daarmee niet weg (het stuk vult bijna de hele foto), dan nog eens met een lagere drempel.
      function snij(drempel, sat) {
        ctx.drawImage(im, 0, 0);
        var id = ctx.getImageData(0, 0, w, h);
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
          return mn > drempel && mx - mn < sat;
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
              d[k * 4 + 3] = Math.max(60, Math.min(255, Math.round((drempel + 2 - lum) * 9)));
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
          if (deel === "onder" && kand.length < 2) return { out: null, bb: 0 };
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

        return { out: out, bb: ((mxX - mnX + 1) * (mxY - mnY + 1)) / (w * h) };
      }
      var r = { out: null, bb: 0 };
      [[250, 8], [240, 12], [232, 16]].some(function (dr) {
        r = snij(dr[0], dr[1]);
        return !r.out || r.bb < 0.92;
      });
      var out = r.out;
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
  // Delen en bewaren
  // ---------------------------------------------------------------------
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
  function deel(blob, naam, tekst, melding) {
    var file = null;
    try {
      file = new File([blob], naam, { type: "image/jpeg" });
    } catch (e) {}
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], text: tekst }).catch(function () {});
      return;
    }
    bewaar(blob, naam);
    melding("Het plan is bewaard als foto (map Downloads). Voeg ze toe in het WhatsApp-gesprek dat nu opent.");
    window.open(WA + encodeURIComponent(tekst + "\n\nHet plan heb ik net bewaard als foto en stuur ik hierbij mee."), "_blank", "noopener");
  }

  // ---------------------------------------------------------------------
  // Het venster en het plan
  // ---------------------------------------------------------------------
  var box = null,
    opener = null,
    o = null, // het toestel: model, merk, type, binnen (src), binnenKan, buiten (src of null)
    plan = null,
    modus = "foto",
    stap = 1,
    knipBinnen = null,
    knipBuiten = null,
    fotoDeel = null,
    drieDeel = null,
    overDeel = null;

  function nieuweKamer(i) {
    return {
      naam: KAMERNAMEN[Math.min(i, KAMERNAMEN.length - 1)],
      foto: null,
      W: 0,
      H: 0,
      stand: null,
      goot: { punten: [], zichtbaar: true },
      d3: { s: 1.6 + i * 2.6, y: 2.7 },
    };
  }
  function nieuwPlan() {
    return {
      kamers: [nieuweKamer(0)],
      actief: 0,
      gevel: { foto: null, W: 0, H: 0, stand: null, montage: "beugel" },
      gootKleur: "wit",
      buiten3d: { type: "muur", s: 6.6, y: 2.4, x: 0, z: 0 },
    };
  }
  function kamer() {
    return plan.kamers[plan.actief];
  }

  function maakBox() {
    if (box) return box;
    box = el("div", "zb");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Plan uw plaatsing");
    box.innerHTML =
      '<div class="zb-top"><b class="zb-titel"></b><button type="button" class="zb-x" aria-label="Sluiten">&times;</button></div>' +
      '<div class="zb-tabs" role="tablist">' +
      '<button type="button" class="zb-tab" role="tab" data-modus="foto" aria-selected="true">Met eigen foto’s</button>' +
      '<button type="button" class="zb-tab" role="tab" data-modus="3d" aria-selected="false">In een 3D-huis</button></div>' +
      '<ol class="zb-stappen">' +
      '<li><button type="button" data-stap="1"><span>1</span> <em class="lang">Binnenunit</em><em class="kort">Binnen</em></button></li>' +
      '<li><button type="button" data-stap="2"><span>2</span> <em class="lang">Buitenunit</em><em class="kort">Buiten</em></button></li>' +
      '<li><button type="button" data-stap="3"><span>3</span> Goot</button></li>' +
      '<li><button type="button" data-stap="4"><span>4</span> <em class="lang">Overzicht</em><em class="kort">Plan</em></button></li></ol>' +
      '<div class="zb-deel zb-foto"></div>' +
      '<div class="zb-deel zb-3d" hidden></div>' +
      '<div class="zb-deel zb-over" hidden></div>' +
      '<p class="zb-melding" aria-live="polite" hidden></p>';
    document.body.appendChild(box);
    box.querySelector(".zb-x").addEventListener("click", sluit);
    box.querySelectorAll(".zb-tab").forEach(function (t) {
      t.addEventListener("click", function () {
        zetModus(t.dataset.modus);
      });
    });
    box.querySelectorAll(".zb-stappen button").forEach(function (b) {
      b.addEventListener("click", function () {
        zetStap(+b.dataset.stap);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box && !box.hidden) sluit();
    });
    window.addEventListener("hashchange", function () {
      if (box && !box.hidden) sluit();
    });
    fotoDeel = maakFotoDeel(box.querySelector(".zb-foto"));
    drieDeel = maakDrieDeel(box.querySelector(".zb-3d"));
    overDeel = maakOverDeel(box.querySelector(".zb-over"));
    return box;
  }
  function melding(t) {
    var m = box.querySelector(".zb-melding");
    m.textContent = t || "";
    m.hidden = !t;
    clearTimeout(m._t);
    if (t)
      m._t = setTimeout(function () {
        m.hidden = true;
      }, 8000);
  }
  function zetModus(m) {
    modus = m;
    box.querySelectorAll(".zb-tab").forEach(function (t) {
      t.setAttribute("aria-selected", t.dataset.modus === m ? "true" : "false");
    });
    zetStap(stap);
  }
  function zetStap(n) {
    stap = Math.max(1, Math.min(4, n));
    box.querySelectorAll(".zb-stappen button").forEach(function (b) {
      b.setAttribute("aria-current", +b.dataset.stap === stap ? "step" : "false");
    });
    var foto = stap < 4 && modus === "foto",
      drie = stap < 4 && modus === "3d";
    box.querySelector(".zb-foto").hidden = !foto;
    box.querySelector(".zb-3d").hidden = !drie;
    box.querySelector(".zb-over").hidden = stap !== 4;
    if (foto) fotoDeel.toon();
    if (drie) drieDeel.start();
    else drieDeel.stop();
    if (stap === 4) overDeel.toon();
  }
  function open(opts) {
    maakBox();
    o = opts;
    plan = nieuwPlan();
    knipBinnen = knipBuiten = null;
    opener = document.activeElement;
    box.querySelector(".zb-titel").textContent = "Plan uw plaatsing: " + o.model;
    melding("");
    // de uitsnedes alvast maken
    if (o.binnenKan && o.type !== "buiten")
      uitsnede(o.binnen, "boven", function (c) {
        knipBinnen = c;
        herteken();
      });
    var buitenKlaar = function (c) {
      knipBuiten = c;
      herteken();
    };
    if (o.buiten) uitsnede(o.buiten, "alles", buitenKlaar);
    else if (o.type === "buiten") uitsnede(o.binnen, "alles", buitenKlaar);
    else
      uitsnede(o.binnen || "", "onder", function (c) {
        if (c) return buitenKlaar(c);
        uitsnede(MERK_BUITEN[o.merk] || MERK_BUITEN.daikin, "alles", buitenKlaar);
      });
    zetModus("foto");
    zetStap(1);
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".zb-x").focus();
  }
  function herteken() {
    if (box && !box.hidden && stap < 4 && modus === "foto") fotoDeel.toon();
  }
  function sluit() {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.documentElement.style.overflow = "";
    drieDeel.stop();
    if (opener && opener.focus) opener.focus();
  }

  // de rij met kamers (stap 1 en 3): kiezen, hernoemen, toevoegen, weghalen
  function kamerRij(root, wissel) {
    var rij = el("div", "zb-kamers");
    plan.kamers.forEach(function (k, i) {
      var b = el("button", null, k.naam);
      b.type = "button";
      b.setAttribute("aria-pressed", i === plan.actief ? "true" : "false");
      b.addEventListener("click", function () {
        if (i === plan.actief) {
          // nog eens tikken: de naam wisselen
          var j = (KAMERNAMEN.indexOf(k.naam) + 1) % KAMERNAMEN.length;
          k.naam = KAMERNAMEN[j];
        }
        plan.actief = i;
        wissel();
      });
      rij.appendChild(b);
    });
    if (plan.kamers.length < MAX_KAMERS && (stap === 1 || modus === "3d")) {
      var plus = el("button", "plus", "+ Kamer");
      plus.type = "button";
      plus.title = "Nog een binnenunit (multi-split)";
      plus.addEventListener("click", function () {
        plan.kamers.push(nieuweKamer(plan.kamers.length));
        plan.actief = plan.kamers.length - 1;
        wissel();
      });
      rij.appendChild(plus);
    }
    if (plan.kamers.length > 1 && stap === 1) {
      var min = el("button", "min", "Kamer weg");
      min.type = "button";
      min.addEventListener("click", function () {
        plan.kamers.splice(plan.actief, 1);
        plan.actief = Math.max(0, plan.actief - 1);
        wissel();
      });
      rij.appendChild(min);
    }
    var tip = el("span", "zb-kamertip", stap === 1 ? "Tik nog eens op de kamer om de naam te wisselen." : "");
    rij.appendChild(tip);
    root.appendChild(rij);
  }
  function knop(tekst, cls, fn) {
    var b = el("button", "zb-btn" + (cls ? " " + cls : ""), tekst);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }
  function seg(label, opties, huidig, fn) {
    var s = el("div", "zb-seg");
    s.setAttribute("role", "group");
    s.setAttribute("aria-label", label);
    Object.keys(opties).forEach(function (k) {
      var b = el("button", null, opties[k]);
      b.type = "button";
      b.setAttribute("aria-pressed", k === huidig ? "true" : "false");
      b.addEventListener("click", function () {
        fn(k);
      });
      s.appendChild(b);
    });
    return s;
  }
  function navKnoppen(balk) {
    if (stap > 1)
      balk.appendChild(
        knop("← Vorige", "", function () {
          zetStap(stap - 1);
        })
      );
    balk.appendChild(
      knop(stap === 3 ? "Naar het overzicht →" : "Volgende →", "gold", function () {
        zetStap(stap + 1);
      })
    );
  }
  function gootLengteFoto(k) {
    var g = plan.gevel;
    if (!k.goot.zichtbaar || k.goot.punten.length < 1 || !g.stand) return 0;
    var mpp = BUITEN_M / (g.stand.b * g.W);
    var pts = k.goot.punten.concat([gootEind()]);
    var len = 0;
    for (var i = 1; i < pts.length; i++) len += Math.hypot((pts[i].x - pts[i - 1].x) * g.W, (pts[i].y - pts[i - 1].y) * g.H) * mpp;
    return len + 0.5;
  }
  // waar de goot op de foto in de buitenunit komt: onderaan in het midden
  function gootEind() {
    var s = plan.gevel.stand;
    var h = knipBuiten ? (s.b * plan.gevel.W * knipBuiten.height) / knipBuiten.width / plan.gevel.H : s.b * 0.7;
    return { x: s.x, y: s.y + h * 0.45 };
  }

  // ---------------------------------------------------------------------
  // Tekenen op een foto: toestel met schaduw, de montage en de goten
  // ---------------------------------------------------------------------
  function tekenToestel(ctx, knip, stand, W, H) {
    if (!knip || !stand) return;
    var b = stand.b * W;
    var h = (b * knip.height) / knip.width;
    ctx.save();
    ctx.translate(stand.x * W, stand.y * H);
    if (stand.spiegel) ctx.scale(-1, 1);
    ctx.shadowColor = "rgba(0,0,0,0.32)";
    ctx.shadowBlur = b * 0.08;
    ctx.shadowOffsetY = b * 0.035;
    ctx.drawImage(knip, -b / 2, -h / 2, b, h);
    ctx.restore();
  }
  function tekenMontage(ctx, W, H) {
    var g = plan.gevel,
      s = g.stand;
    if (!s || !knipBuiten || g.montage === "anders") return;
    var b = s.b * W,
      h = (b * knipBuiten.height) / knipBuiten.width;
    var cx = s.x * W,
      onder = s.y * H + h / 2;
    ctx.save();
    ctx.fillStyle = "#4a4f55";
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = Math.max(1, b * 0.006);
    if (g.montage === "beugel") {
      // twee L-beugels: een staander tegen de muur en een ligger onder het toestel
      [-0.3, 0.3].forEach(function (f) {
        var x = cx + f * b;
        ctx.fillRect(x - b * 0.02, onder - h * 0.1, b * 0.04, h * 0.75);
        ctx.fillRect(x - b * 0.02, onder - b * 0.03, b * 0.04 + b * 0.16, b * 0.035);
        ctx.strokeRect(x - b * 0.02, onder - h * 0.1, b * 0.04, h * 0.75);
      });
    } else {
      // een balk (kunststof of beton) onder het toestel, op de grond of op het platte dak
      ctx.fillStyle = "#5a5e63";
      ctx.fillRect(cx - b * 0.56, onder - b * 0.02, b * 1.12, b * 0.09);
      ctx.strokeRect(cx - b * 0.56, onder - b * 0.02, b * 1.12, b * 0.09);
      ctx.fillStyle = "#3e4247";
      ctx.fillRect(cx - b * 0.56, onder + b * 0.07, b * 1.12, b * 0.025);
    }
    ctx.restore();
  }
  function tekenGoten(ctx, W, H, actiefOok) {
    var g = plan.gevel;
    if (!g.stand) return;
    var dikte = Math.max(3, g.stand.b * W * 0.085);
    plan.kamers.forEach(function (k, i) {
      if (!k.goot.zichtbaar || !k.goot.punten.length) return;
      var pts = k.goot.punten.concat([gootEind()]);
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = dikte + 2;
      pad(ctx, pts, W, H);
      ctx.stroke();
      ctx.strokeStyle = KLEUREN[plan.gootKleur];
      ctx.lineWidth = dikte;
      pad(ctx, pts, W, H);
      ctx.stroke();
      // de doorvoer: een bolletje met de naam van de kamer
      var p0 = pts[0];
      ctx.fillStyle = i === plan.actief && actiefOok ? "#dc9a2c" : "#fff";
      ctx.strokeStyle = "#1b2f44";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p0.x * W, p0.y * H, dikte * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (plan.kamers.length > 1) {
        ctx.font = "bold " + Math.round(dikte * 1.6) + "px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 3;
        ctx.strokeText(k.naam, p0.x * W + dikte * 1.2, p0.y * H - dikte * 0.6);
        ctx.fillText(k.naam, p0.x * W + dikte * 1.2, p0.y * H - dikte * 0.6);
      }
      ctx.restore();
    });
  }
  function pad(ctx, pts, W, H) {
    ctx.beginPath();
    pts.forEach(function (p, i) {
      if (i) ctx.lineTo(p.x * W, p.y * H);
      else ctx.moveTo(p.x * W, p.y * H);
    });
  }
  function tekenKamerBeeld(ctx, k) {
    ctx.drawImage(k.foto.img || k.foto, 0, 0, k.W, k.H);
    tekenToestel(ctx, knipBinnen, k.stand, k.W, k.H);
  }
  function tekenGevelBeeld(ctx, metGoot, actiefOok) {
    var g = plan.gevel;
    ctx.drawImage(g.foto.img || g.foto, 0, 0, g.W, g.H);
    tekenMontage(ctx, g.W, g.H);
    if (metGoot) tekenGoten(ctx, g.W, g.H, actiefOok);
    tekenToestel(ctx, knipBuiten, g.stand, g.W, g.H);
  }

  // een foto uit het bestandsveld laden (met de juiste draaiing), hoogstens 1600 px
  function laadFoto(file, cb) {
    var klaar = function (bm) {
      var s = Math.min(1, 1600 / Math.max(bm.width, bm.height));
      cb(bm, Math.round(bm.width * s), Math.round(bm.height * s));
    };
    var viaImage = function () {
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
    };
    if (window.createImageBitmap) createImageBitmap(file, { imageOrientation: "from-image" }).then(klaar, viaImage);
    else viaImage();
  }

  // ---------------------------------------------------------------------
  // Deel A: met eigen foto's (stap 1 tot 3)
  // ---------------------------------------------------------------------
  function maakFotoDeel(root) {
    var canvas = el("canvas", "zb-canvas"),
      ctx = canvas.getContext("2d");
    canvas.setAttribute("aria-label", "Uw foto met het toestel erop");
    function toon() {
      root.innerHTML = "";
      var k = kamer();
      if (stap === 1) {
        kamerRij(root, toon);
        if (!o.binnenKan || o.type === "buiten") {
          start(
            o.type === "buiten" ? "Welke kamers krijgen een binnenunit?" : "Deze binnenunit komt in het plafond",
            "Kies hierboven de kamer(s). Waar de unit precies komt, bekijkt Rim met u tijdens het gratis plaatsbezoek. Ga verder met de buitenunit.",
            null
          );
        } else if (!k.foto) {
          start(
            "Neem een foto van de muur in de " + k.naam.toLowerCase(),
            "Recht van voren en bij daglicht werkt het best. Daarna sleept u de binnenunit op de juiste plek.",
            function (file) {
              laadFoto(file, function (bm, W, H) {
                k.foto = bm;
                k.W = W;
                k.H = H;
                k.stand = { x: 0.5, y: 0.4, b: 0.3, spiegel: false };
                toon();
              });
            }
          );
        } else {
          werk(k.W, k.H, "Sleep de binnenunit naar de juiste plek. Knijp of scrol om ze groter of kleiner te maken.", function (balk) {
            balk.appendChild(
              knop("Spiegelen", "", function () {
                k.stand.spiegel = !k.stand.spiegel;
                teken();
              })
            );
            balk.appendChild(
              bestandKnop("Andere foto", function (file) {
                laadFoto(file, function (bm, W, H) {
                  k.foto = bm;
                  k.W = W;
                  k.H = H;
                  toon();
                });
              })
            );
            navKnoppen(balk);
          });
        }
      } else if (stap === 2) {
        var g = plan.gevel;
        if (!g.foto) {
          start(
            "Neem een foto van uw gevel, waar de buitenunit komt",
            "Zet u even verder van het huis, zodat ook de plek van de leiding erop staat. Daarna sleept u de buitenunit op zijn plaats en kiest u hoe hij staat.",
            function (file) {
              laadFoto(file, function (bm, W, H) {
                g.foto = bm;
                g.W = W;
                g.H = H;
                g.stand = { x: 0.5, y: 0.55, b: 0.2, spiegel: false };
                toon();
              });
            }
          );
        } else {
          werk(g.W, g.H, "Sleep de buitenunit naar de juiste plek en kies hieronder hoe hij staat.", function (balk) {
            balk.appendChild(
              seg("Hoe staat de buitenunit", { beugel: "Muurbeugel", balk: "Balk op de grond", dak: "Plat dak", anders: "Anders" }, g.montage, function (v) {
                g.montage = v;
                toon();
              })
            );
            balk.appendChild(
              knop("Spiegelen", "", function () {
                g.stand.spiegel = !g.stand.spiegel;
                teken();
              })
            );
            balk.appendChild(
              bestandKnop("Andere foto", function (file) {
                laadFoto(file, function (bm, W, H) {
                  g.foto = bm;
                  g.W = W;
                  g.H = H;
                  plan.kamers.forEach(function (x) {
                    x.goot.punten = [];
                  });
                  toon();
                });
              })
            );
            navKnoppen(balk);
          });
        }
      } else if (stap === 3) {
        var gv = plan.gevel;
        if (!gv.foto) {
          start("Eerst de buitenunit", "Voor de goot hebben we de foto van uw gevel nodig, met de buitenunit erop (stap 2).", null, [
            knop("← Naar stap 2", "gold", function () {
              zetStap(2);
            }),
          ]);
        } else {
          if (plan.kamers.length > 1) kamerRij(root, toon);
          var kk = kamer();
          var uitleg = kk.goot.zichtbaar
            ? kk.goot.punten.length
              ? "Tik de volgende hoekpunten aan tot aan de buitenunit. Het laatste stuk loopt vanzelf naar de unit."
              : "Tik op de gevel waar de leiding door de muur komt (achter de binnenunit in de " +
                kk.naam.toLowerCase() +
                "), en dan de hoekpunten van de goot tot aan de buitenunit."
            : "Voor de " + kk.naam.toLowerCase() + " loopt de leiding binnenin: geen goot aan de gevel.";
          var lengte = gootLengteFoto(kk);
          werk(gv.W, gv.H, uitleg + (lengte ? " Geschat: ± " + m2(lengte) + " m goot. " + INBEGREPEN : ""), function (balk) {
            balk.appendChild(
              seg("Kleur van de goot", { wit: "Wit", bruin: "Bruin", zwart: "Zwart", antraciet: "Antraciet" }, plan.gootKleur, function (v) {
                plan.gootKleur = v;
                teken();
              })
            );
            balk.appendChild(
              knop("Punt weg", "", function () {
                kk.goot.punten.pop();
                toon();
              })
            );
            balk.appendChild(
              knop(kk.goot.zichtbaar ? "Geen goot zichtbaar" : "Toch een goot", "", function () {
                kk.goot.zichtbaar = !kk.goot.zichtbaar;
                toon();
              })
            );
            navKnoppen(balk);
          });
        }
      }
    }
    function start(kop, tekst, metBestand, extraKnoppen) {
      var s = el("div", "zb-start");
      s.innerHTML =
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/></svg>' +
        "<h3></h3><p class=\"zb-uitleg\"></p>";
      s.querySelector("h3").textContent = kop;
      s.querySelector(".zb-uitleg").textContent = tekst;
      if (metBestand) s.appendChild(bestandKnop("Kies of neem een foto", metBestand, "gold zb-kies"));
      var rij = el("div", "zb-startknoppen");
      (extraKnoppen || []).forEach(function (b) {
        rij.appendChild(b);
      });
      if (!metBestand && !extraKnoppen) {
        rij.appendChild(
          knop("Volgende →", "gold", function () {
            zetStap(stap + 1);
          })
        );
      }
      if (rij.children.length) s.appendChild(rij);
      if (metBestand)
        s.appendChild(
          el(
            "p",
            "zb-klein",
            "Uw foto blijft op uw gsm of computer. Er wordt niets verstuurd tot u zelf op “Stuur naar Rim” tikt."
          )
        );
      root.appendChild(s);
    }
    function bestandKnop(tekst, fn, cls) {
      var l = el("label", "zb-btn " + (cls || ""), tekst);
      var inp = el("input");
      inp.type = "file";
      inp.accept = "image/*";
      inp.hidden = true;
      inp.addEventListener("change", function () {
        if (inp.files && inp.files[0]) fn(inp.files[0]);
        inp.value = "";
      });
      l.appendChild(inp);
      return l;
    }
    var vlak = null,
      hint = null;
    function werk(W, H, hintTekst, vulBalk) {
      var w = el("div", "zb-werk");
      vlak = el("div", "zb-vlak");
      canvas.width = W;
      canvas.height = H;
      vlak.appendChild(canvas);
      hint = el("p", "zb-hint", "");
      hint.textContent = hintTekst;
      vlak.appendChild(hint);
      w.appendChild(vlak);
      var balk = el("div", "zb-balk");
      vulBalk(balk);
      w.appendChild(balk);
      root.appendChild(w);
      past();
      teken();
    }
    function past() {
      if (!vlak || !vlak.isConnected) return;
      var r = vlak.getBoundingClientRect();
      var hh = hint.getBoundingClientRect().height + 8;
      var bw = Math.max(100, r.width - 16),
        bh = Math.max(100, r.height - hh - 16);
      var s = Math.min(bw / canvas.width, bh / canvas.height);
      canvas.style.width = Math.round(canvas.width * s) + "px";
      canvas.style.height = Math.round(canvas.height * s) + "px";
    }
    window.addEventListener("resize", function () {
      if (box && !box.hidden && !root.hidden) past();
    });
    function teken() {
      var W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      if (stap === 1) tekenKamerBeeld(ctx, kamer());
      else tekenGevelBeeld(ctx, stap === 3, true);
    }
    // slepen (één vinger of de muis), knijpen (twee vingers), scrollen; in stap 3: tikken = een punt
    var vingers = {},
      vorigeAfstand = 0,
      startPunt = null,
      bewogen = false;
    function standNu() {
      return stap === 1 ? kamer().stand : plan.gevel.stand;
    }
    canvas.addEventListener("pointerdown", function (e) {
      vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
      startPunt = { x: e.clientX, y: e.clientY };
      bewogen = false;
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!vingers[e.pointerId]) return;
      var ids = Object.keys(vingers);
      var r = canvas.getBoundingClientRect();
      if (Math.hypot(e.clientX - startPunt.x, e.clientY - startPunt.y) > 6) bewogen = true;
      if (stap === 3) return;
      var st = standNu();
      if (!st) return;
      if (ids.length === 1) {
        var v = vingers[e.pointerId];
        st.x = Math.max(0, Math.min(1, st.x + (e.clientX - v.x) / r.width));
        st.y = Math.max(0, Math.min(1, st.y + (e.clientY - v.y) / r.height));
        v.x = e.clientX;
        v.y = e.clientY;
        teken();
      } else {
        vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
        var a = vingers[ids[0]],
          b = vingers[ids[1]];
        var af = Math.hypot(a.x - b.x, a.y - b.y);
        if (vorigeAfstand) {
          st.b = Math.max(0.06, Math.min(0.9, st.b * (af / vorigeAfstand)));
          teken();
        }
        vorigeAfstand = af;
      }
    });
    function los(e) {
      if (stap === 3 && vingers[e.pointerId] && !bewogen && e.type === "pointerup") {
        var k = kamer();
        if (k.goot.zichtbaar) {
          var r = canvas.getBoundingClientRect();
          k.goot.punten.push({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
          toon();
        }
      }
      delete vingers[e.pointerId];
      vorigeAfstand = 0;
    }
    canvas.addEventListener("pointerup", los);
    canvas.addEventListener("pointercancel", los);
    canvas.addEventListener(
      "wheel",
      function (e) {
        var st = standNu();
        if (stap === 3 || !st) return;
        e.preventDefault();
        st.b = Math.max(0.06, Math.min(0.9, st.b * (e.deltaY < 0 ? 1.06 : 0.94)));
        teken();
      },
      { passive: false }
    );
    // beelden voor het overzicht
    function beeldKamer(k) {
      if (!k.foto) return null;
      var c = document.createElement("canvas");
      c.width = k.W;
      c.height = k.H;
      tekenKamerBeeld(c.getContext("2d"), k);
      return c;
    }
    function beeldGevel() {
      var g = plan.gevel;
      if (!g.foto) return null;
      var c = document.createElement("canvas");
      c.width = g.W;
      c.height = g.H;
      tekenGevelBeeld(c.getContext("2d"), true, false);
      return c;
    }
    return { toon: toon, beeldKamer: beeldKamer, beeldGevel: beeldGevel };
  }

  // ---------------------------------------------------------------------
  // Deel B: het 3D-voorbeeldhuis (three.js laadt pas hier). Voorgevel, zijgevel en een aanbouw met
  // plat dak. Stap 1: de binnenunit (schim) per kamer op een muur; stap 2: de buitenunit tegen een
  // muur (beugel), op de grond (balk) of op het platte dak (balk); stap 3: de goot tekent zichzelf.
  // ---------------------------------------------------------------------
  function maakDrieDeel(root) {
    var vlak = el("div", "zb-vlak zb-3d-vlak"),
      laden = el("p", "zb-laden", "Het 3D-huis laadt…"),
      hint = el("p", "zb-hint", ""),
      balk = el("div", "zb-balk"),
      kamersVak = el("div");
    vlak.appendChild(laden);
    vlak.appendChild(hint);
    root.appendChild(kamersVak);
    root.appendChild(vlak);
    root.appendChild(balk);
    var T = null,
      scene,
      camera,
      renderer,
      wandMat,
      unit,
      schimmen = [],
      gootGroep,
      vlakken = [], // de onzichtbare sleepvlakken
      gras,
      bezig = false,
      actief = false,
      vuil = true;
    var HUIS = { b: 9, d: 7, h: 5.4 },
      AANB = { x0: 4.5, x1: 8.5, z0: -3.5, z1: 0.5, h: 3.0 };
    var zicht = { yaw: 0.62, pitch: 0.28, r: 17 };
    // de muren "uitgerold": s loopt langs de voorgevel (0-9), de zijgevel (9-12), de aanbouw (12-16, 16-20)
    var WANDEN = [
      { naam: "de voorgevel", s0: 0, s1: 9, p: [-4.5, 3.5], d: [1, 0], n: [0, 1], h: HUIS.h },
      { naam: "de zijgevel", s0: 9, s1: 12, p: [4.5, 3.5], d: [0, -1], n: [1, 0], h: HUIS.h },
      { naam: "de aanbouw (voorkant)", s0: 12, s1: 16, p: [4.5, 0.5], d: [1, 0], n: [0, 1], h: AANB.h },
      { naam: "de aanbouw (zijkant)", s0: 16, s1: 20, p: [8.5, 0.5], d: [0, -1], n: [1, 0], h: AANB.h },
    ];
    function wandBij(s) {
      for (var i = 0; i < WANDEN.length; i++) if (s <= WANDEN[i].s1) return WANDEN[i];
      return WANDEN[WANDEN.length - 1];
    }
    function punt(s, y, uit) {
      var w = wandBij(s),
        t = Math.max(0, Math.min(w.s1 - w.s0, s - w.s0));
      return new T.Vector3(w.p[0] + w.d[0] * t + w.n[0] * uit, y, w.p[1] + w.d[1] * t + w.n[1] * uit);
    }
    function hoek(w) {
      return Math.atan2(w.n[0], w.n[1]);
    }

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
    function start() {
      actief = true;
      laden.hidden = false;
      laadThree(function (ok) {
        if (!ok) {
          laden.textContent = "Het 3D-huis kon niet laden (geen verbinding?). Probeer het straks opnieuw of gebruik uw eigen foto’s.";
          return;
        }
        if (!scene) bouw();
        laden.hidden = true;
        toon();
        past();
        lus();
      });
    }
    function stop() {
      actief = false;
    }
    // de knoppen en de uitleg per stap
    function toon() {
      if (!scene) return;
      kamersVak.innerHTML = "";
      balk.innerHTML = "";
      zetSchimmen();
      zetUnit();
      zetGoten();
      if (stap === 1) {
        kamerRij(kamersVak, toon);
        hint.textContent =
          "Sleep de binnenunit van de " +
          kamer().naam.toLowerCase() +
          " naar de muur waar ze (aan de binnenkant) komt te hangen. Sleep ernaast om het huis te draaien, knijp of scrol om in te zoomen.";
        navKnoppen(balk);
      } else if (stap === 2) {
        hint.textContent =
          "Sleep de buitenunit tegen een muur (muurbeugel), op de grond (balk) of op het platte dak van de aanbouw (balk). Nu: " +
          montage3dTekst() +
          ".";
        balk.appendChild(
          seg("Gevel", { baksteen: "Baksteen", wit: "Wit", grijs: "Grijs" }, gevelNu, function (v) {
            zetGevel(v);
          })
        );
        navKnoppen(balk);
      } else if (stap === 3) {
        if (plan.kamers.length > 1) kamerRij(kamersVak, toon);
        var k = kamer();
        hint.textContent = k.goot.zichtbaar
          ? "De goot loopt van de doorvoer achter de binnenunit langs de gevel naar de buitenunit. Geschat: ± " +
            m2(gootLengte3d(k)) +
            " m" +
            (plan.kamers.length > 1 ? " voor de " + k.naam.toLowerCase() : "") +
            ". " +
            INBEGREPEN
          : "Voor de " + k.naam.toLowerCase() + " loopt de leiding binnenin: geen goot aan de gevel.";
        balk.appendChild(
          seg("Kleur van de goot", { wit: "Wit", bruin: "Bruin", zwart: "Zwart", antraciet: "Antraciet" }, plan.gootKleur, function (v) {
            plan.gootKleur = v;
            zetGoten();
            vuil = true;
          })
        );
        balk.appendChild(
          knop(k.goot.zichtbaar ? "Geen goot zichtbaar" : "Toch een goot", "", function () {
            k.goot.zichtbaar = !k.goot.zichtbaar;
            toon();
          })
        );
        navKnoppen(balk);
      }
      vuil = true;
    }

    // ---- texturen, zelf getekend
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
        c.fillStyle = "#cfc3b3";
        c.fillRect(0, 0, w, h);
        var bh = 32,
          bw = 96,
          voeg = 5;
        for (var rij = 0; rij * bh < h; rij++) {
          var off = rij % 2 ? bw / 2 : 0;
          for (var x = -bw; x < w + bw; x += bw) {
            var t = Math.random();
            c.fillStyle = "rgb(" + (150 + Math.round(t * 40)) + "," + (78 + Math.round(t * 22)) + "," + (60 + Math.round(t * 16)) + ")";
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
        c.fillStyle = "#c9c8c1";
        for (var y = 40; y < h - 40; y += 14) c.fillRect(350, y, 130, 7);
      });
    }
    function tekstSprite(tekst) {
      var c = document.createElement("canvas");
      c.width = 512;
      c.height = 112;
      var x = c.getContext("2d");
      x.fillStyle = "rgba(27,47,68,0.9)";
      x.beginPath();
      x.roundRect ? x.roundRect(4, 4, 504, 104, 30) : x.rect(4, 4, 504, 104);
      x.fill();
      x.fillStyle = "#fff";
      x.font = "bold 44px sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(tekst, 256, 58);
      var t = new T.CanvasTexture(c);
      var sp = new T.Sprite(new T.SpriteMaterial({ map: t, depthTest: false }));
      sp.scale.set(3.2, 0.7, 1);
      return sp;
    }

    var gevelNu = "baksteen";
    function bouw() {
      T = window.THREE;
      scene = new T.Scene();
      scene.background = new T.Color(0xdfe8ef);
      scene.fog = new T.Fog(0xdfe8ef, 34, 80);
      camera = new T.PerspectiveCamera(38, 1, 0.1, 140);
      renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.outputEncoding = T.sRGBEncoding;
      vlak.insertBefore(renderer.domElement, vlak.firstChild);
      renderer.domElement.className = "zb-canvas";
      renderer.domElement.setAttribute("aria-label", "Een huis in 3D met de binnenunits, de buitenunit en de goot");

      scene.add(new T.HemisphereLight(0xeaf2fa, 0x7f8f6a, 0.85));
      var zon = new T.DirectionalLight(0xfff4e0, 1.05);
      zon.position.set(10, 16, 14);
      zon.castShadow = true;
      zon.shadow.mapSize.set(2048, 2048);
      zon.shadow.camera.left = zon.shadow.camera.bottom = -14;
      zon.shadow.camera.right = zon.shadow.camera.top = 14;
      zon.shadow.camera.near = 1;
      zon.shadow.camera.far = 60;
      zon.shadow.bias = -0.0012;
      scene.add(zon);

      var grasT = grasTex();
      grasT.repeat.set(12, 12);
      gras = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ map: grasT, roughness: 1 }));
      gras.rotation.x = -Math.PI / 2;
      gras.receiveShadow = true;
      gras.userData.type = "grond";
      scene.add(gras);
      var pad = new T.Mesh(new T.BoxGeometry(1.6, 0.04, 6), new T.MeshStandardMaterial({ color: 0xb9b4a8, roughness: 0.95 }));
      pad.position.set(1.0, 0.02, HUIS.d / 2 + 3);
      pad.receiveShadow = true;
      scene.add(pad);

      wandMat = new T.MeshStandardMaterial({ roughness: 0.95 });
      var romp = new T.Mesh(new T.BoxGeometry(HUIS.b, HUIS.h, HUIS.d), wandMat);
      romp.position.y = HUIS.h / 2;
      romp.castShadow = romp.receiveShadow = true;
      scene.add(romp);
      // het dak: twee hellende vlakken en twee puntgevels
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
        scene.add(v);
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
        scene.add(g);
      });
      // de aanbouw met plat dak, rechts achteraan
      var aanb = new T.Mesh(new T.BoxGeometry(AANB.x1 - AANB.x0, AANB.h, AANB.z1 - AANB.z0), wandMat);
      aanb.position.set((AANB.x0 + AANB.x1) / 2, AANB.h / 2, (AANB.z0 + AANB.z1) / 2);
      aanb.castShadow = aanb.receiveShadow = true;
      scene.add(aanb);
      var platDak = new T.Mesh(
        new T.BoxGeometry(AANB.x1 - AANB.x0 + 0.3, 0.14, AANB.z1 - AANB.z0 + 0.3),
        new T.MeshStandardMaterial({ color: 0x55504b, roughness: 1 })
      );
      platDak.position.set((AANB.x0 + AANB.x1) / 2 + 0.15, AANB.h + 0.07, (AANB.z0 + AANB.z1) / 2 + 0.15);
      platDak.castShadow = platDak.receiveShadow = true;
      scene.add(platDak);

      // ramen en de deur
      var glas = new T.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.25, metalness: 0.35 });
      var kozijn = new T.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.8 });
      var dorpelMat = new T.MeshStandardMaterial({ color: 0x8e8a82 });
      function raam(s, y, b, h) {
        var w = wandBij(s),
          rot = hoek(w);
        var k = new T.Mesh(new T.BoxGeometry(b + 0.16, h + 0.16, 0.08), kozijn);
        k.position.copy(punt(s, y, 0.02));
        k.rotation.y = rot;
        scene.add(k);
        var r = new T.Mesh(new T.BoxGeometry(b, h, 0.08), glas);
        r.position.copy(punt(s, y, 0.05));
        r.rotation.y = rot;
        scene.add(r);
        var d = new T.Mesh(new T.BoxGeometry(b + 0.3, 0.08, 0.2), dorpelMat);
        d.position.copy(punt(s, y - h / 2 - 0.1, 0.1));
        d.rotation.y = rot;
        d.castShadow = true;
        scene.add(d);
      }
      raam(1.9, 1.55, 2.2, 1.5);
      raam(4.4, 1.55, 1.1, 1.5);
      raam(1.9, 3.95, 1.3, 1.3);
      raam(4.4, 3.95, 1.3, 1.3);
      raam(6.9, 3.95, 1.3, 1.3);
      raam(10.5, 3.95, 1.3, 1.3);
      raam(14.0, 1.5, 1.6, 1.3);
      raam(18.0, 1.5, 1.2, 1.2);
      var deur = new T.Mesh(new T.BoxGeometry(1.05, 2.25, 0.1), new T.MeshStandardMaterial({ color: 0x3a4a58, roughness: 0.6 }));
      deur.position.copy(punt(5.5, 1.125, 0.04));
      scene.add(deur);
      var deurK = new T.Mesh(new T.BoxGeometry(1.25, 2.4, 0.06), kozijn);
      deurK.position.copy(punt(5.5, 1.2, 0.01));
      scene.add(deurK);

      // de onzichtbare sleepvlakken: elke muur, het platte dak
      WANDEN.forEach(function (w) {
        var len = w.s1 - w.s0;
        var v = new T.Mesh(new T.PlaneGeometry(len, w.h), new T.MeshBasicMaterial({ visible: false }));
        v.position.copy(punt((w.s0 + w.s1) / 2, w.h / 2, 0.01));
        v.rotation.y = hoek(w);
        v.userData = { type: "muur", wand: w };
        scene.add(v);
        vlakken.push(v);
      });
      var dakVlak = new T.Mesh(new T.PlaneGeometry(AANB.x1 - AANB.x0, AANB.z1 - AANB.z0), new T.MeshBasicMaterial({ visible: false }));
      dakVlak.rotation.x = -Math.PI / 2;
      dakVlak.position.set((AANB.x0 + AANB.x1) / 2, AANB.h + 0.15, (AANB.z0 + AANB.z1) / 2);
      dakVlak.userData = { type: "dak" };
      scene.add(dakVlak);
      vlakken.push(dakVlak);
      vlakken.push(gras);

      gootGroep = new T.Group();
      scene.add(gootGroep);
      zetGevel("baksteen");
      maakUnit();
      if (MODEL_3D) laadModel(MODEL_3D);
    }
    function zetGevel(naam) {
      if (!T) return;
      gevelNu = naam;
      var m = wandMat;
      if (naam === "baksteen") {
        m.map = baksteenTex();
        m.map.repeat.set(2.2, 2.2);
      } else {
        m.map = pleisterTex(naam === "wit" ? "#efece4" : "#b7b5ae");
        m.map.repeat.set(3, 3);
      }
      m.color.set(0xffffff);
      m.needsUpdate = true;
      vuil = true;
      if (stap === 2) toon();
    }

    // ---- de buitenunit: een doos met de getekende voorkant, een beugel (muur) of een balk (grond, dak)
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
        staand.position.set(x, -UNIT.h / 2 - 0.2, -UNIT.d / 2 - 0.03);
        staand.castShadow = true;
        beugel.add(staand);
        var ligger = new T.Mesh(new T.BoxGeometry(0.05, 0.05, UNIT.d + 0.1), staal);
        ligger.position.set(x, -UNIT.h / 2 - 0.025, 0);
        ligger.castShadow = true;
        beugel.add(ligger);
      });
      unit.add(beugel);
      var balk = new T.Mesh(new T.BoxGeometry(UNIT.b + 0.2, 0.12, UNIT.d + 0.1), new T.MeshStandardMaterial({ color: 0x4a4e53, roughness: 0.9 }));
      balk.position.set(0, -UNIT.h / 2 - 0.06, 0);
      balk.castShadow = balk.receiveShadow = true;
      balk.name = "balk";
      unit.add(balk);
      scene.add(unit);
    }
    // Later: het 3D-model uit Higgsfield (GLB). Vervangt de getekende doos; beugel en balk blijven.
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
          m.scale.setScalar(UNIT.b / Math.max(maat.x, 0.001));
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
    function montage3dTekst() {
      var u = plan.buiten3d;
      if (u.type === "muur") return "op een muurbeugel aan " + wandBij(u.s).naam;
      if (u.type === "dak") return "op een balk op het platte dak van de aanbouw";
      return "op een balk op de grond bij " + wandBij(u.s).naam;
    }
    function zetUnit() {
      if (!unit) return;
      var u = plan.buiten3d;
      unit.getObjectByName("beugel").visible = u.type === "muur";
      unit.getObjectByName("balk").visible = u.type !== "muur";
      if (u.type === "dak") {
        unit.position.set(u.x, AANB.h + 0.14 + 0.12 + UNIT.h / 2, u.z);
        unit.rotation.y = 0;
      } else {
        var w = wandBij(u.s);
        var grens = UNIT.b / 2 + 0.15;
        u.s = Math.max(w.s0 + grens, Math.min(w.s1 - grens, u.s));
        if (u.type === "muur") {
          u.y = Math.max(UNIT.h / 2 + 0.5, Math.min(w.h - UNIT.h / 2 - 0.3, u.y));
          unit.position.copy(punt(u.s, u.y, UNIT.d / 2 + 0.06));
        } else {
          unit.position.copy(punt(u.s, 0.12 + UNIT.h / 2, UNIT.d / 2 + 0.2));
        }
        unit.rotation.y = hoek(w);
      }
      vuil = true;
    }
    // ---- de binnenunits als schim op de muur (ze hangen aan de binnenkant), met de naam van de kamer
    function zetSchimmen() {
      schimmen.forEach(function (s) {
        scene.remove(s);
      });
      schimmen = [];
      plan.kamers.forEach(function (k, i) {
        var g = new T.Group();
        var body = new T.Mesh(
          new T.BoxGeometry(0.9, 0.3, 0.22),
          new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: i === plan.actief && stap === 1 ? 0.95 : 0.6, roughness: 0.5 })
        );
        body.name = "schim";
        g.add(body);
        var w = wandBij(k.d3.s);
        k.d3.y = Math.max(0.6, Math.min(w.h - 0.4, k.d3.y));
        k.d3.s = Math.max(w.s0 + 0.6, Math.min(w.s1 - 0.6, k.d3.s));
        g.position.copy(punt(k.d3.s, k.d3.y, -0.11 + 0.04));
        g.rotation.y = hoek(w);
        var lab = tekstSprite("Binnenunit · " + k.naam);
        lab.position.set(0, 0.62, 0.25);
        g.add(lab);
        g.userData.kamer = i;
        scene.add(g);
        schimmen.push(g);
      });
    }
    // ---- de goot: van de doorvoer verticaal naar de hoogte van de buitenunit, dan langs de muren ernaartoe
    function gootPad(k) {
      var u = plan.buiten3d;
      var s1 = k.d3.s,
        y1 = k.d3.y - 0.05;
      var pts = [];
      var UIT = 0.06;
      var s2, y2;
      if (u.type === "muur") {
        s2 = u.s;
        y2 = u.y - UNIT.h / 2 + 0.08;
      } else if (u.type === "grond") {
        s2 = u.s;
        y2 = 0.3;
      } else {
        // plat dak: langs de muren naar de aanbouw, onder de dakrand, dan omhoog en over het dak naar de unit
        var best = null;
        [WANDEN[2], WANDEN[3]].forEach(function (w) {
          var t = w.d[0] ? u.x - w.p[0] : (u.z - w.p[1]) * w.d[1];
          t = Math.max(0.3, Math.min(w.s1 - w.s0 - 0.3, t));
          var p = punt(w.s0 + t, 0, 0);
          var d = Math.hypot(p.x - u.x, p.z - u.z);
          if (!best || d < best.d) best = { s: w.s0 + t, d: d };
        });
        s2 = best.s;
        y2 = AANB.h - 0.25;
      }
      pts.push(punt(s1, y1, UIT));
      pts.push(punt(s1, y2, UIT));
      // langs de muren, met een hoekpunt bij elke overgang
      var richting = s2 > s1 ? 1 : -1;
      WANDEN.forEach(function (w) {
        var grens = richting > 0 ? w.s1 : w.s0;
        if ((richting > 0 && grens > s1 && grens < s2) || (richting < 0 && grens < s1 && grens > s2)) pts.push(punt(grens, y2, UIT));
      });
      pts.push(punt(s2, y2, UIT));
      var len = Math.abs(y1 - y2) + Math.abs(s1 - s2) + 0.6;
      if (u.type === "dak") {
        var boven = punt(s2, AANB.h + 0.22, UIT);
        pts.push(boven);
        var eind = new T.Vector3(u.x, AANB.h + 0.22, u.z);
        pts.push(eind);
        len += AANB.h + 0.22 - y2 + boven.distanceTo(eind);
      }
      return { pts: pts, len: len };
    }
    function gootLengte3d(k) {
      return k.goot.zichtbaar && T ? gootPad(k).len : 0;
    }
    function zetGoten() {
      if (!gootGroep) return;
      while (gootGroep.children.length) gootGroep.remove(gootGroep.children[0]);
      var mat = new T.MeshStandardMaterial({ color: new T.Color(KLEUREN[plan.gootKleur]), roughness: 0.6 });
      plan.kamers.forEach(function (k) {
        if (!k.goot.zichtbaar) return;
        var pts = gootPad(k).pts;
        for (var i = 1; i < pts.length; i++) {
          var a = pts[i - 1],
            b = pts[i];
          var l = a.distanceTo(b);
          if (l < 0.01) continue;
          var seg = new T.Mesh(new T.BoxGeometry(0.08, 0.07, l + 0.07), mat);
          seg.position.copy(a).lerp(b, 0.5);
          seg.lookAt(b);
          seg.castShadow = true;
          gootGroep.add(seg);
        }
      });
      vuil = true;
    }

    function past() {
      if (!renderer) return;
      var r = vlak.getBoundingClientRect();
      var hh = hint.getBoundingClientRect().height + 8;
      var w = Math.max(100, Math.round(r.width)),
        h = Math.max(100, Math.round(r.height - hh));
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      vuil = true;
    }
    window.addEventListener("resize", function () {
      if (actief && box && !box.hidden) past();
    });
    function zetCamera() {
      var doel = new T.Vector3(2.0, 2.2, 2.2);
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
    function beeld() {
      if (!renderer) return null;
      zetCamera();
      renderer.render(scene, camera);
      return renderer.domElement;
    }

    // muis en vingers: op de unit of een schim = slepen, ernaast = draaien, twee vingers of scrollen = zoomen
    var ray = null,
      vingers = {},
      sleep = null, // "unit" of het nummer van de kamer (schim)
      vorigeAfstand = 0;
    function straal(e) {
      var r = renderer.domElement.getBoundingClientRect();
      var m = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray = ray || new T.Raycaster();
      ray.setFromCamera(m, camera);
      return ray;
    }
    function sleepbaar(e) {
      var rr = straal(e);
      if (stap === 2 && rr.intersectObject(unit, true).length) return "unit";
      if (stap === 1) {
        var hits = rr.intersectObjects(schimmen, true);
        if (hits.length) {
          var g = hits[0].object;
          while (g && g.userData.kamer == null) g = g.parent;
          if (g) return g.userData.kamer;
        }
      }
      return null;
    }
    vlak.addEventListener("pointerdown", function (e) {
      if (!renderer || e.target !== renderer.domElement) return;
      vingers[e.pointerId] = { x: e.clientX, y: e.clientY };
      renderer.domElement.setPointerCapture(e.pointerId);
      e.preventDefault();
      if (Object.keys(vingers).length === 1) {
        sleep = sleepbaar(e);
        if (typeof sleep === "number" && sleep !== plan.actief) {
          plan.actief = sleep;
          toon();
        }
        renderer.domElement.style.cursor = sleep != null ? "grabbing" : "move";
      }
    });
    vlak.addEventListener("pointermove", function (e) {
      if (!renderer) return;
      if (!vingers[e.pointerId]) {
        if (e.pointerType === "mouse") renderer.domElement.style.cursor = sleepbaar(e) != null ? "grab" : "default";
        return;
      }
      var ids = Object.keys(vingers);
      if (ids.length === 1) {
        var v = vingers[e.pointerId];
        if (sleep === "unit") {
          var hits = straal(e).intersectObjects(vlakken);
          if (hits.length) {
            var h = hits[0],
              p = h.point,
              u = plan.buiten3d;
            if (h.object.userData.type === "muur") {
              var w = h.object.userData.wand;
              u.type = "muur";
              u.s = w.s0 + (p.x - w.p[0]) * w.d[0] + (p.z - w.p[1]) * w.d[1];
              u.y = p.y;
            } else if (h.object.userData.type === "dak") {
              u.type = "dak";
              u.x = Math.max(AANB.x0 + 0.6, Math.min(AANB.x1 - 0.6, p.x));
              u.z = Math.max(AANB.z0 + 0.4, Math.min(AANB.z1 - 0.4, p.z));
            } else {
              // op de grond: bij de dichtstbijzijnde muur
              var best = null;
              WANDEN.forEach(function (w) {
                var t = (p.x - w.p[0]) * w.d[0] + (p.z - w.p[1]) * w.d[1];
                t = Math.max(0, Math.min(w.s1 - w.s0, t));
                var q = punt(w.s0 + t, 0, 0);
                var d = Math.hypot(q.x - p.x, q.z - p.z);
                if (!best || d < best.d) best = { s: w.s0 + t, d: d };
              });
              u.type = "grond";
              u.s = best.s;
            }
            zetUnit();
            zetGoten();
            if (stap === 2) hint.textContent = "Nu: " + montage3dTekst() + ". Sleep de buitenunit tegen een muur, op de grond of op het platte dak.";
          }
        } else if (typeof sleep === "number") {
          var hs = straal(e).intersectObjects(
            vlakken.filter(function (x) {
              return x.userData.type === "muur";
            })
          );
          if (hs.length) {
            var ww = hs[0].object.userData.wand,
              pp = hs[0].point,
              k = plan.kamers[sleep];
            k.d3.s = ww.s0 + (pp.x - ww.p[0]) * ww.d[0] + (pp.z - ww.p[1]) * ww.d[1];
            k.d3.y = pp.y;
            zetSchimmen();
            zetGoten();
          }
        } else {
          zicht.yaw -= (e.clientX - v.x) * 0.006;
          zicht.pitch += (e.clientY - v.y) * 0.004;
          zicht.yaw = Math.max(-1.0, Math.min(1.6, zicht.yaw));
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
          zicht.r = Math.max(7, Math.min(30, zicht.r * (vorigeAfstand / af)));
          vuil = true;
        }
        vorigeAfstand = af;
      }
    });
    function los(e) {
      delete vingers[e.pointerId];
      vorigeAfstand = 0;
      sleep = null;
      if (renderer) renderer.domElement.style.cursor = "default";
    }
    vlak.addEventListener("pointerup", los);
    vlak.addEventListener("pointercancel", los);
    vlak.addEventListener(
      "wheel",
      function (e) {
        if (!renderer) return;
        e.preventDefault();
        zicht.r = Math.max(7, Math.min(30, zicht.r * (e.deltaY > 0 ? 1.08 : 0.92)));
        vuil = true;
      },
      { passive: false }
    );
    return {
      start: start,
      stop: stop,
      beeld: beeld,
      laadModel: laadModel,
      wandNaam: function (s) {
        return wandBij(s).naam;
      },
      montageTekst: montage3dTekst,
      gootLengte: gootLengte3d,
      klaar: function () {
        return !!scene;
      },
    };
  }

  // ---------------------------------------------------------------------
  // Stap 4: het overzicht, met de beelden en het lijstje; delen, bewaren of mee in de offerte
  // ---------------------------------------------------------------------
  function planTekst() {
    var r = ["Mijn plaatsingsplan (" + (modus === "foto" ? "op eigen foto’s" : "in het 3D-voorbeeldhuis") + ")", "Toestel: " + o.model];
    plan.kamers.forEach(function (k) {
      var waar;
      if (modus === "foto") waar = !o.binnenKan || o.type === "buiten" ? "plaats bespreken bij het plaatsbezoek" : k.foto ? "op de foto geplaatst" : "nog geen foto";
      else waar = "aan " + drieDeel.wandNaam(k.d3.s) + ", ongeveer " + m2(k.d3.y) + " m hoog";
      r.push("Binnenunit, " + k.naam.toLowerCase() + ": " + waar);
    });
    if (modus === "foto") r.push("Buitenunit: " + (plan.gevel.foto ? MONTAGE[plan.gevel.montage] + " (zie foto)" : "nog geen foto van de gevel"));
    else r.push("Buitenunit: " + drieDeel.montageTekst());
    plan.kamers.forEach(function (k) {
      var l = modus === "foto" ? gootLengteFoto(k) : drieDeel.gootLengte(k);
      var naam = plan.kamers.length > 1 ? " (" + k.naam.toLowerCase() + ")" : "";
      if (!k.goot.zichtbaar) r.push("Leiding" + naam + ": binnenin, geen goot aan de gevel");
      else if (l) r.push("Goot" + naam + ": " + plan.gootKleur + ", ongeveer " + m2(l) + " m");
      else r.push("Goot" + naam + ": nog niet ingetekend");
    });
    r.push(INBEGREPEN);
    return r;
  }
  // één beeld met alle foto's onder elkaar en het lijstje erbij, om te delen of te bewaren
  function planBeeld(cb) {
    var beelden = [];
    if (modus === "foto") {
      plan.kamers.forEach(function (k) {
        var c = fotoDeel.beeldKamer(k);
        if (c) beelden.push({ c: c, t: "Binnenunit, " + k.naam.toLowerCase() });
      });
      var g = fotoDeel.beeldGevel();
      if (g) beelden.push({ c: g, t: "Buitenunit en goot" });
    } else {
      var d = drieDeel.beeld();
      if (d) beelden.push({ c: d, t: "3D-voorbeeldhuis" });
    }
    var B = 1000,
      regels = planTekst(),
      lh = 34;
    var hoogte = 90 + regels.length * lh + 20;
    beelden.forEach(function (b) {
      hoogte += Math.round((B * b.c.height) / b.c.width) + 48;
    });
    var c = document.createElement("canvas");
    c.width = B;
    c.height = hoogte;
    var x = c.getContext("2d");
    x.fillStyle = "#f8f5ee";
    x.fillRect(0, 0, B, hoogte);
    x.fillStyle = "#1b2f44";
    x.font = "bold 40px serif";
    x.fillText("Plaatsingsplan · Reijners Technics", 30, 56);
    x.font = "26px sans-serif";
    var y = 90;
    regels.forEach(function (r, i) {
      x.fillStyle = i === 0 ? "#7a5417" : "#1b2f44";
      x.fillText(r, 30, y + 26);
      y += lh;
    });
    y += 20;
    beelden.forEach(function (b) {
      var h = Math.round((B * b.c.height) / b.c.width);
      x.fillStyle = "#1b2f44";
      x.font = "bold 28px sans-serif";
      x.fillText(b.t, 30, y + 28);
      y += 40;
      x.drawImage(b.c, 0, y, B, h);
      y += h + 8;
    });
    c.toBlob(
      function (bl) {
        cb(bl, c);
      },
      "image/jpeg",
      0.86
    );
  }
  function maakOverDeel(root) {
    function toon() {
      root.innerHTML = "";
      var kaart = el("div", "zb-overkaart");
      kaart.appendChild(el("h3", null, "Uw plaatsingsplan"));
      var ul = el("ul", "zb-lijst");
      planTekst()
        .slice(1)
        .forEach(function (r) {
          ul.appendChild(el("li", null, "")).textContent = r;
        });
      kaart.appendChild(ul);
      var beelden = el("div", "zb-beelden");
      kaart.appendChild(beelden);
      var klaar = false,
        blobKlaar = null;
      planBeeld(function (bl, c) {
        blobKlaar = bl;
        klaar = true;
        var im = el("img");
        im.alt = "Het plaatsingsplan als beeld";
        im.src = c.toDataURL("image/jpeg", 0.7);
        beelden.appendChild(im);
      });
      var rij = el("div", "zb-overknoppen");
      var tekst = function () {
        return "Hallo Rim, hierbij mijn plaatsingsplan voor de " + o.model + ":\n" + planTekst().slice(2).join("\n") + "\nKunt u mij een offerte sturen?";
      };
      rij.appendChild(
        knop("Stuur naar Rim (WhatsApp)", "gold", function () {
          if (!klaar) return melding("Een ogenblik, het beeld wordt gemaakt…");
          deel(blobKlaar, "reijners-technics-plan-" + slug(o.model) + ".jpg", tekst(), melding);
        })
      );
      rij.appendChild(
        knop("Neem op in mijn offerteaanvraag", "", function () {
          window.rtPlan = planTekst().join("\n");
          sluit();
          if (window.rtGoToOffer) window.rtGoToOffer("nieuw", o.model);
        })
      );
      rij.appendChild(
        knop("Bewaar het plan", "", function () {
          if (!klaar) return melding("Een ogenblik, het beeld wordt gemaakt…");
          bewaar(blobKlaar, "reijners-technics-plan-" + slug(o.model) + ".jpg");
          melding("Het plan is bewaard als foto (map Downloads).");
        })
      );
      kaart.appendChild(rij);
      kaart.appendChild(
        el(
          "p",
          "zb-klein",
          "Dit is uw eigen schets. Rim bekijkt alles tijdens het gratis plaatsbezoek en bevestigt de plaats en de prijs in de offerte. " +
            'Liever dat Rim het tekent? <a class="zb-wa" href="#" target="_blank" rel="noopener">Stuur uw foto via WhatsApp</a>.'
        )
      );
      kaart.querySelector(".zb-wa").href = WA + encodeURIComponent("Hallo Rim, ik wil graag zien hoe de " + o.model + " bij mij zou staan. Ik stuur u hierbij een foto.");
      root.appendChild(kaart);
      var balk = el("div", "zb-balk");
      balk.appendChild(
        knop("← Terug naar de goot", "", function () {
          zetStap(3);
        })
      );
      balk.appendChild(
        knop("Opnieuw beginnen", "", function () {
          plan = nieuwPlan();
          zetStap(1);
        })
      );
      root.appendChild(balk);
    }
    return { toon: toon };
  }

  // ---------------------------------------------------------------------
  // Voor js/main.js: welke foto's horen bij dit toestel?
  // ---------------------------------------------------------------------
  function buitenFoto(model) {
    var m = typeof RT_MEDIA !== "undefined" ? RT_MEDIA[model] : null;
    var f =
      m && m.fotos
        ? m.fotos.filter(function (x) {
            return x && x.src && /^buitenunit/i.test(x.label || "");
          })[0]
        : null;
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
