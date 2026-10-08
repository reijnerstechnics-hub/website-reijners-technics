// =====================================================================
// PRIJSADVIES  (bovenaan de pagina Toestellen, #prijs)
// ---------------------------------------------------------------------
// De klant beantwoordt een paar eenvoudige vragen, één per scherm:
// hoeveel ruimtes, hoe groot, op welke verdieping, hoe ver van de
// buitenunit, wat hij belangrijk vindt en hoe oud de woning is.
// Daarna kiest de calculator zelf het toestel (zie "pakketten" in
// js/prijzen.js) en zoekt hij de voordeligste opstelling: hoeveel
// buitenunits, en waar. Maximaal RT_PRIJZEN.maxPerBuitenunit
// binnenunits per buitenunit.
//
// Foto's en specificaties komen van de kaarten in de lijst met alle
// toestellen (via data-model).
// =====================================================================
(function () {
  var root = document.getElementById("pc");
  if (!root || typeof RT_PRIJZEN === "undefined") return;

  var P = RT_PRIJZEN;
  var INST = P.installatie;
  var KW_PER_M2 = 0.1; // vuistregel: 100 W per m² (goed geïsoleerde woning)
  var STORE_KEY = "rt-prijsadvies";

  // Antwoorden die de klant kan kiezen
  var TYPES = ["Woonkamer", "Slaapkamer", "Bureau", "Keuken", "Andere"];
  var SIZES = [
    { v: "s", t: "Klein", s: "tot 15 m²", m2: 12 },
    { v: "m", t: "Gemiddeld", s: "15 tot 25 m²", m2: 20 },
    { v: "l", t: "Groot", s: "25 tot 40 m²", m2: 32 },
    { v: "xl", t: "Heel groot", s: "meer dan 40 m²", m2: 48 },
  ];
  var FLOORS = [
    { v: 0, t: "Gelijkvloers" },
    { v: 1, t: "1e verdieping" },
    { v: 2, t: "2e verdieping of zolder" },
  ];
  // Leiding in meter tot de hoofdplek (achtergevel/tuin) en tot de andere kant van het huis
  var DISTS = [
    { v: "kort", t: "Vlakbij", s: "tegen dezelfde buitenmuur", a: 3, b: 15 },
    { v: "midden", t: "Midden in huis", s: "een paar kamers verder", a: 8, b: 8 },
    { v: "ver", t: "Andere kant van het huis", s: "tegen de voor- of zijgevel", a: 15, b: 3 },
  ];
  var M_PER_FLOOR = 3;
  var SPOTS = [{ naam: "achtergevel of tuin" }, { naam: "andere kant van het huis" }];

  var euro = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  function eur(v) {
    return euro.format(Math.round(v));
  }
  function kwTxt(k) {
    return String(k).replace(".", ",") + " kW";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function find(list, key, val) {
    for (var i = 0; i < list.length; i++) if (list[i][key] === val) return list[i];
    return null;
  }

  // ---------- toestellen: foto en specificaties uit de lijst met alle toestellen ----------
  var MODELS = P.toestellen.map(function (t) {
    var sizes = Object.keys(t.prijzen)
      .map(parseFloat)
      .sort(function (a, b) {
        return a - b;
      });
    var cta = document.querySelector('.device-cta[data-model="' + t.model.replace(/"/g, '\\"') + '"]');
    var card = cta ? cta.closest(".device-card") : null;
    var img = card ? card.querySelector(".device-photo img") : null;
    var specs = card ? card.querySelector(".device-specs") : null;
    return {
      cfg: t,
      sizes: sizes,
      img: img ? img.getAttribute("src") || img.getAttribute("data-src") : "",
      specs: specs ? specs.innerHTML : "",
    };
  });
  function modelByName(name) {
    for (var i = 0; i < MODELS.length; i++) if (MODELS[i].cfg.model === name) return MODELS[i];
    return null;
  }
  function price(m, kw, kind) {
    var row = m.cfg.prijzen[kw.toFixed(1)] || m.cfg.prijzen[String(kw)];
    return row ? row[kind] : null;
  }
  // Kleinste uitvoering >= gewenst vermogen die als set (0) of losse binnenunit (1) bestaat.
  function sizeFor(m, want, kind) {
    var ok = m.sizes.filter(function (s) {
      return price(m, s, kind) != null;
    });
    if (!ok.length) return null;
    for (var i = 0; i < ok.length; i++) if (ok[i] >= want - 0.001) return ok[i];
    return ok[ok.length - 1];
  }

  // =====================================================================
  // REKENEN
  // =====================================================================
  function pipeCost(meters) {
    return Math.max(0, meters - INST.leidingInbegrepen) * INST.perMeter;
  }
  function extraMeters(meters) {
    return Math.max(0, meters - INST.leidingInbegrepen);
  }

  // Eén ruimte met een eigen buitenunit (single-split)
  function singleUnit(m, item) {
    var kw = sizeFor(m, item.kw, 0);
    if (kw == null) return null;
    return {
      multi: false,
      items: [item],
      label: "Eén binnenunit",
      kw: [kw],
      mat: price(m, kw, 0),
      inst: INST.buitenunit + INST.binnenunit,
      pipe: pipeCost(item.meters),
    };
  }

  // Meerdere ruimtes op één multi-split buitenunit
  function multiUnit(m, items) {
    var series = P.multi[m.cfg.multi];
    if (!series || items.length > P.maxPerBuitenunit) return null;
    var kws = [],
      mat = 0,
      sum = 0,
      pipe = 0;
    for (var i = 0; i < items.length; i++) {
      var kw = sizeFor(m, items[i].kw, 1);
      if (kw == null) return null;
      kws.push(kw);
      mat += price(m, kw, 1);
      sum += kw;
      pipe += pipeCost(items[i].meters);
    }
    var best = null;
    series.units.forEach(function (u) {
      if (u.poorten < items.length) return;
      if (u.kw * P.multiMaxAansluiting < sum) return;
      if (!best || u.prijs < best.prijs) best = u;
    });
    if (!best) return null;
    return {
      multi: true,
      items: items,
      label: items.length + " binnenunits op één buitenunit (multi-split)",
      kw: kws,
      mat: mat + best.prijs,
      inst: INST.buitenunit + INST.binnenunit * items.length,
      pipe: pipe,
    };
  }

  // Alle ruimtes op één plek: zo weinig mogelijk buitenunits.
  function unitsForSpot(m, items) {
    if (!items.length) return [];
    var singles = [],
      rest = [];
    items.forEach(function (it) {
      (m.cfg.multi && sizeFor(m, it.kw, 1) != null ? rest : singles).push(it);
    });
    var out = [];
    if (rest.length === 1) singles.push(rest.pop());
    if (rest.length) {
      var sorted = rest.slice().sort(function (a, b) {
        return b.kw - a.kw;
      });
      var done = false;
      for (var k = Math.ceil(sorted.length / P.maxPerBuitenunit); k <= sorted.length && !done; k++) {
        var cap = Math.ceil(sorted.length / k);
        var groups = [];
        for (var g = 0; g < k; g++) groups.push({ items: [], sum: 0 });
        sorted.forEach(function (it) {
          var tgt = null;
          groups.forEach(function (gr) {
            if (gr.items.length < cap && (!tgt || gr.sum < tgt.sum)) tgt = gr;
          });
          tgt.items.push(it);
          tgt.sum += it.kw;
        });
        var units = [];
        var ok = groups.every(function (gr) {
          if (!gr.items.length) return true;
          var u = gr.items.length === 1 ? singleUnit(m, gr.items[0]) : multiUnit(m, gr.items);
          if (u) units.push(u);
          return !!u;
        });
        if (ok) {
          out = out.concat(units);
          done = true;
        }
      }
      if (!done) singles = singles.concat(rest);
    }
    singles.forEach(function (it) {
      var u = singleUnit(m, it);
      if (u) out.push(u);
    });
    return out;
  }

  function evaluate(m, items, assign) {
    var res = { units: [], mat: 0, inst: 0, pipe: 0, meters: 0 };
    SPOTS.forEach(function (sp, si) {
      var here = items.filter(function (it, idx) {
        return assign[idx] === si;
      });
      here.forEach(function (it) {
        it.meters = it.m[si];
      });
      unitsForSpot(m, here).forEach(function (u) {
        u.spot = si;
        u.items = u.items.map(function (it) {
          return { naam: it.naam, meters: it.meters };
        });
        res.units.push(u);
        res.mat += u.mat;
        res.inst += u.inst;
        res.pipe += u.pipe;
        u.items.forEach(function (it) {
          res.meters += extraMeters(it.meters);
        });
      });
    });
    res.excl = res.mat + res.inst + res.pipe;
    return res;
  }

  // Probeert elke verdeling van de ruimtes over de plekken en houdt de goedkoopste.
  // Geeft ook het resultaat met alles op de hoofdplek terug, om te vergelijken.
  function calculate(m, withSecond) {
    var items = roomList().map(function (r) {
      var d = find(DISTS, "v", r.dist) || DISTS[1];
      var up = (r.floor || 0) * M_PER_FLOOR;
      var it = { naam: r.naam, kw: r.m2 * KW_PER_M2, m: [d.a + up, d.b + up], opts: [0] };
      if (withSecond) it.opts = [0, 1];
      return it;
    });
    var best = null,
      allMain = null,
      assign = [];
    (function walk(i) {
      if (i === items.length) {
        var res = evaluate(m, items, assign);
        if (!best || res.excl < best.excl - 0.5 || (Math.abs(res.excl - best.excl) <= 0.5 && res.units.length < best.units.length))
          best = res;
        if (
          assign.every(function (a) {
            return a === 0;
          })
        )
          allMain = res;
        return;
      }
      items[i].opts.forEach(function (o) {
        assign[i] = o;
        walk(i + 1);
      });
    })(0);
    best.allMain = allMain;
    best.model = m;
    return best;
  }

  // =====================================================================
  // ANTWOORDEN VAN DE KLANT
  // =====================================================================
  var state = { step: "aantal", n: null, rooms: [], tweede: null, wens: null, oud: null, keuze: null, sent: false };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.rooms) state = saved;
    state.sent = false;
  } catch (e) {}
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function setRooms(n) {
    while (state.rooms.length < n)
      state.rooms.push({
        type: state.rooms.length ? "Slaapkamer" : "Woonkamer",
        size: null,
        floor: state.rooms.length ? 1 : 0,
        dist: null,
      });
    state.rooms.length = n;
  }
  // Ruimtes met een naam ("Slaapkamer 2") en oppervlakte
  function roomList() {
    var seen = {};
    var count = {};
    state.rooms.forEach(function (r) {
      count[r.type] = (count[r.type] || 0) + 1;
    });
    return state.rooms.map(function (r, i) {
      seen[r.type] = (seen[r.type] || 0) + 1;
      var naam = r.type === "Andere" ? "Ruimte " + (i + 1) : r.type + (count[r.type] > 1 ? " " + seen[r.type] : "");
      var sz = find(SIZES, "v", r.size) || SIZES[1];
      return { naam: naam, m2: sz.m2, floor: r.floor, dist: r.dist, sizeLbl: sz.s };
    });
  }
  function anyFar() {
    return state.rooms.some(function (r) {
      return r.dist === "ver";
    });
  }
  function steps() {
    var s = ["aantal", "ruimtes", "verdieping", "afstand"];
    if (anyFar()) s.push("tweede");
    s.push("wens", "btw", "advies");
    return s;
  }
  function canNext(step) {
    if (step === "aantal") return !!state.n;
    if (step === "ruimtes")
      return state.rooms.every(function (r) {
        return r.size;
      });
    if (step === "afstand")
      return state.rooms.every(function (r) {
        return r.dist;
      });
    if (step === "tweede") return !!state.tweede;
    if (step === "wens") return !!state.wens;
    if (step === "btw") return state.oud !== null;
    return true;
  }
  function go(step) {
    state.step = step;
    save();
    render();
    var top = root.getBoundingClientRect().top;
    if (top < 70 || top > window.innerHeight * 0.6)
      window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
  }
  function next() {
    var s = steps();
    var i = s.indexOf(state.step);
    if (i < s.length - 1 && canNext(state.step)) go(s[i + 1]);
  }
  function prev() {
    var s = steps();
    var i = s.indexOf(state.step);
    if (i > 0) go(s[i - 1]);
  }

  // =====================================================================
  // SCHERMEN
  // =====================================================================
  function opt(attrs, selected, title, sub) {
    return (
      '<button type="button" class="pc-opt' +
      (selected ? " selected" : "") +
      '" ' +
      attrs +
      ' aria-pressed="' +
      !!selected +
      '"><b>' +
      title +
      "</b>" +
      (sub ? "<small>" + sub + "</small>" : "") +
      "</button>"
    );
  }
  function chip(attrs, selected, label) {
    return (
      '<button type="button" class="chip' + (selected ? " selected" : "") + '" ' + attrs + ' aria-pressed="' + !!selected + '">' + label + "</button>"
    );
  }
  function q(title, hint) {
    return '<h2 class="pc-q">' + title + "</h2>" + (hint ? '<p class="pc-hint">' + hint + "</p>" : "");
  }
  function roomHead(r, i) {
    return '<div class="pc-room-lbl"><span>' + (i + 1) + "</span>" + esc(r.naam) + "</div>";
  }

  var SCREENS = {
    aantal: function () {
      var h = q("In hoeveel ruimtes wilt u een airco?", "Tel elke kamer waar een binnenunit moet komen.");
      h += '<div class="pc-opts pc-opts-n">';
      for (var n = 1; n <= 6; n++)
        h += opt('data-n="' + n + '"', state.n === n, n === 6 ? "6 of meer" : String(n), n === 1 ? "ruimte" : "ruimtes");
      h += "</div>";
      if (state.n === 6) h += '<p class="pc-hint">Bij meer dan 6 ruimtes rekenen we met 6. De rest bespreken we graag samen.</p>';
      return h;
    },
    ruimtes: function () {
      var h = q(
        state.n === 1 ? "Welke ruimte is het, en hoe groot?" : "Welke ruimtes zijn het, en hoe groot?",
        "Een schatting is genoeg. Daarmee kiezen we het juiste vermogen."
      );
      var list = roomList();
      state.rooms.forEach(function (r, i) {
        h += '<div class="pc-room" data-i="' + i + '">' + roomHead(list[i], i);
        h += '<div class="chip-grid">';
        TYPES.forEach(function (t) {
          h += chip('data-type="' + t + '"', r.type === t, t);
        });
        h += '</div><div class="pc-opts pc-opts-4">';
        SIZES.forEach(function (s) {
          h += opt('data-size="' + s.v + '"', r.size === s.v, s.t, s.s);
        });
        h += "</div></div>";
      });
      return h;
    },
    verdieping: function () {
      var h = q(
        state.n === 1 ? "Op welke verdieping ligt de ruimte?" : "Op welke verdieping ligt elke ruimte?",
        "Hoe hoger, hoe meer leiding er nodig is naar de buitenunit."
      );
      var list = roomList();
      state.rooms.forEach(function (r, i) {
        h += '<div class="pc-room" data-i="' + i + '">' + roomHead(list[i], i) + '<div class="pc-opts pc-opts-3">';
        FLOORS.forEach(function (f) {
          h += opt('data-floor="' + f.v + '"', r.floor === f.v, f.t);
        });
        h += "</div></div>";
      });
      return h;
    },
    afstand: function () {
      var h = q(
        "Hoe ver ligt " + (state.n === 1 ? "de ruimte" : "elke ruimte") + " van de buitenunit?",
        "De buitenunit komt meestal tegen de achtergevel of in de tuin. Hoe dichterbij, hoe minder leiding en hoe goedkoper."
      );
      var list = roomList();
      state.rooms.forEach(function (r, i) {
        h += '<div class="pc-room" data-i="' + i + '">' + roomHead(list[i], i) + '<div class="pc-opts pc-opts-3">';
        DISTS.forEach(function (d) {
          h += opt('data-dist="' + d.v + '"', r.dist === d.v, d.t, d.s);
        });
        h += "</div></div>";
      });
      return h;
    },
    tweede: function () {
      var far = roomList()
        .filter(function (r) {
          return r.dist === "ver";
        })
        .map(function (r) {
          return esc(r.naam);
        });
      var h = q(
        "Kan er aan de andere kant van het huis ook een buitenunit komen?",
        (far.length === 1 ? far[0] + " ligt" : far.join(" en ") + " liggen") +
          " ver van de achtergevel. Een tweede buitenunit dichterbij betekent minder leiding. Dat is soms goedkoper. Wij rekenen het voor u uit."
      );
      h += '<div class="pc-opts pc-opts-3">';
      h += opt('data-tweede="ja"', state.tweede === "ja", "Ja, dat kan", "bv. tegen de zijgevel of voorgevel");
      h += opt('data-tweede="nee"', state.tweede === "nee", "Nee, liever niet");
      h += opt('data-tweede="weetniet"', state.tweede === "weetniet", "Weet ik niet", "we rekenen het voor u uit");
      return h + "</div>";
    },
    wens: function () {
      var h = q("Wat vindt u het belangrijkst?", "Op basis daarvan kiezen wij het toestel dat bij u past.");
      h += '<div class="pc-opts pc-opts-2">';
      P.pakketten.forEach(function (p) {
        h += opt(
          'data-wens="' + p.id + '"',
          state.wens === p.id,
          esc(p.vraag) + (p.aanbevolen ? ' <span class="pc-badge">Meest gekozen</span>' : ""),
          esc(p.waarom)
        );
      });
      return h + "</div>";
    },
    btw: function () {
      var h = q("Is uw woning ouder dan 10 jaar?", "Dat bepaalt hoeveel btw u betaalt.");
      h += '<div class="pc-opts pc-opts-2">';
      h += opt('data-oud="1"', state.oud === true, "Ja", P.btw.oud + "% btw");
      h += opt('data-oud="0"', state.oud === false, "Nee, jonger of nieuwbouw", P.btw.nieuw + "% btw");
      return h + "</div>";
    },
    advies: renderAdvies,
  };

  function render() {
    var s = steps();
    if (s.indexOf(state.step) === -1) state.step = s[0];
    var i = s.indexOf(state.step);
    if (state.step === "advies") {
      root.innerHTML = SCREENS.advies();
      return;
    }
    var total = s.length - 1;
    var h =
      '<div class="pc-top"><div class="pc-prog"><span style="width:' +
      Math.round((i / total) * 100) +
      '%"></span></div><span class="pc-prog-lbl">Vraag ' +
      (i + 1) +
      " van " +
      total +
      "</span></div>";
    h += '<div class="pc-screen">' + SCREENS[state.step]() + "</div>";
    h += '<div class="pc-nav">';
    h += i > 0 ? '<button type="button" class="pc-back" data-act="prev">&larr; Vorige</button>' : "<span></span>";
    var last = i === total - 1;
    h +=
      '<button type="button" class="btn btn-gold" data-act="next"' +
      (canNext(state.step) ? "" : " disabled") +
      ">" +
      (last ? "Toon mijn advies" : "Volgende") +
      ' <span class="ar">&rarr;</span></button>';
    h += "</div>";
    root.innerHTML = h;
  }

  // ---------- het advies ----------
  var lastRes = null;
  function pakket(id) {
    return find(P.pakketten, "id", id) || P.pakketten[0];
  }
  function btwPct() {
    return state.oud ? P.btw.oud : P.btw.nieuw;
  }
  function priceRange(res) {
    var incl = res.excl * (1 + btwPct() / 100);
    return {
      incl: incl,
      lo: Math.floor((incl * (1 - P.marge.min / 100)) / 50) * 50,
      hi: Math.ceil((incl * (1 + P.marge.max / 100)) / 50) * 50,
    };
  }
  function withSecond() {
    return anyFar() && state.tweede !== "nee";
  }

  function renderAdvies() {
    var pk = pakket(state.keuze || state.wens);
    var m = modelByName(pk.model);
    if (!m) return '<p class="pc-hint">Dit toestel staat niet in de prijslijst.</p>';
    var res = calculate(m, withSecond());
    var pr = priceRange(res);
    res.lo = pr.lo;
    res.hi = pr.hi;
    res.pakket = pk;
    lastRes = res;
    var f = 1 + btwPct() / 100;

    var h = '<div class="pc-top pc-top-done"><span class="pc-prog-lbl">Uw persoonlijk advies</span>';
    h += '<button type="button" class="pc-back" data-act="edit">Antwoorden aanpassen</button></div>';
    h += '<div class="pc-result">';

    // links: het toestel
    h += '<div class="pc-device">';
    h += '<div class="pc-kicker">Wij raden u aan</div>';
    if (m.img) h += '<div class="pc-device-ph"><img src="' + esc(m.img) + '" alt="' + esc(pk.model) + '"></div>';
    h += '<h2 class="pc-device-name">' + esc(m.cfg.merk) + " " + esc(m.cfg.naam) + "</h2>";
    h += '<p class="pc-device-why">' + esc(pk.waarom) + "</p>";

    var list = roomList();
    h += '<div class="pc-plan"><div class="pc-plan-title">Zo plaatsen we het</div>';
    res.units.forEach(function (u, i) {
      h +=
        '<div class="pc-unit"><div class="pc-unit-head"><span class="pc-unit-ic" aria-hidden="true"></span><b>Buitenunit' +
        (res.units.length > 1 ? " " + (i + 1) : "") +
        "</b> &middot; " +
        SPOTS[u.spot].naam +
        '</div><ul>' +
        u.items
          .map(function (it, j) {
            return "<li><span>" + esc(it.naam) + "</span><span>binnenunit " + kwTxt(u.kw[j]) + "</span></li>";
          })
          .join("") +
        "</ul></div>";
    });
    h += "</div>";

    var adv = advies(res, f);
    if (adv) h += '<div class="pc-advice">' + adv + "</div>";

    if (m.specs)
      h +=
        '<details class="pc-details"><summary>Alle specificaties van dit toestel</summary><div class="device-specs">' +
        m.specs +
        "</div></details>";

    // andere keuzes
    h += '<div class="pc-alts"><div class="pc-plan-title">Liever iets anders?</div>';
    P.pakketten.forEach(function (p) {
      if (p.id === pk.id) return;
      var mm = modelByName(p.model);
      if (!mm) return;
      var r = priceRange(calculate(mm, withSecond()));
      h +=
        '<button type="button" class="pc-alt" data-keuze="' +
        p.id +
        '"><span><b>' +
        esc(p.titel) +
        "</b><small>" +
        esc(mm.cfg.merk + " " + mm.cfg.naam) +
        "</small></span><span class=\"pc-alt-pr\">" +
        eur(r.lo) +
        " &ndash; " +
        eur(r.hi) +
        "</span></button>";
    });
    h += "</div></div>";

    // rechts: de prijs
    h += '<div class="pc-price">';
    h += '<div class="pc-kicker">Prijsindicatie</div>';
    h += '<div class="pc-price-big">' + eur(pr.lo) + " &ndash; " + eur(pr.hi) + "</div>";
    h += '<div class="pc-price-sub">incl. ' + btwPct() + "% btw, toestellen en plaatsing</div>";
    h += '<ul class="pc-incl"><li>Toestel' + (list.length > 1 ? "len" : "") + " geleverd en geplaatst</li><li>Leidingen netjes afgewerkt</li><li>Opstarten en uitleg van de bediening</li></ul>";
    h +=
      '<details class="pc-details pc-details-dark"><summary>Hoe is deze prijs opgebouwd?</summary><div class="pc-rows">' +
      "<div><span>Toestellen</span><span>" +
      eur(res.mat * f) +
      "</span></div>" +
      "<div><span>Plaatsing</span><span>" +
      eur(res.inst * f) +
      "</span></div>" +
      "<div><span>Extra leiding (" +
      res.meters +
      " m)</span><span>" +
      eur(res.pipe * f) +
      "</span></div>" +
      '<div class="tot"><span>Samen</span><span>' +
      eur(pr.incl) +
      '</span></div></div><p class="pc-fine">Bedragen incl. btw. De vork houdt rekening met wat we pas ter plaatse zien, zoals muren, hoogte en elektriciteit.</p></details>';
    if (P.voorlopig)
      h += '<div class="pc-demo">Let op: deze calculator gebruikt nog voorbeeldprijzen.</div>';

    h += '<div class="pc-lead">';
    if (state.sent) {
      h += "<b>Bedankt! Rim belt u binnen 24 uur terug.</b><span class=\"pc-muted\">Dan plannen we samen het gratis plaatsbezoek.</span>";
    } else {
      h +=
        "<b>Vaste prijs nodig?</b>" +
        '<span class="pc-muted">Rim belt u binnen 24 uur terug en komt gratis langs. Daarna krijgt u een vaste offerte.</span>' +
        '<div class="field"><label for="pc-naam">Naam</label><input id="pc-naam" type="text" autocomplete="name"></div>' +
        '<div class="field"><label for="pc-tel">Telefoon</label><input id="pc-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="04xx xx xx xx"></div>' +
        '<div class="field"><label for="pc-gem">Gemeente</label><input id="pc-gem" type="text" autocomplete="address-level2" placeholder="bv. Bree"></div>' +
        '<div class="calc-status" id="pc-status" role="alert"></div>' +
        '<button type="button" class="btn btn-gold" data-act="send">Vraag mijn gratis plaatsbezoek aan <span class="ar">&rarr;</span></button>';
    }
    h += "</div>";
    h += '<p class="pc-fine">Dit is een indicatie. De exacte prijs krijgt u na het gratis plaatsbezoek.</p>';
    h += "</div></div>";
    h += '<div class="pc-restart"><button type="button" class="pc-back" data-act="restart">Opnieuw beginnen</button></div>';
    return h;
  }

  function advies(res, f) {
    var spots = [];
    res.units.forEach(function (u) {
      if (spots.indexOf(u.spot) === -1) spots.push(u.spot);
    });
    var main = res.allMain;
    if (spots.indexOf(1) !== -1 && main && main.excl > res.excl + 1) {
      return (
        (spots.length > 1
          ? "<b>Daarom 2 plekken voor de buitenunits</b>Met een buitenunit aan de andere kant van het huis is er "
          : "<b>Beste plek: de andere kant van het huis</b>Daar is er ") +
        (main.meters - res.meters) +
        " m minder leiding nodig. Dat is ongeveer <b>" +
        eur((main.excl - res.excl) * f) +
        "</b> goedkoper dan alles aan de achtergevel." +
        (state.tweede === "weetniet" ? " Of dat bij u kan, bekijken we tijdens het plaatsbezoek." : "")
      );
    }
    if (anyFar() && state.tweede === "nee")
      return (
        '<b>Tip</b>Kan er aan de andere kant van het huis toch een buitenunit komen? Dan is er minder leiding nodig. <button type="button" class="pc-link" data-act="second">Reken het uit</button>'
      );
    if (res.units.length > 1 && spots.length === 1 && res.units.every(function (u) { return u.multi; }))
      return "<b>Waarom " + res.units.length + " buitenunits?</b>Op één buitenunit passen maximaal " + P.maxPerBuitenunit + " binnenunits.";
    if (!res.model.cfg.multi && state.rooms.length > 1)
      return "<b>Goed om te weten</b>Bij dit toestel krijgt elke ruimte een eigen buitenunit.";
    if (state.rooms.length > 1 && res.units.length === 1)
      return "<b>Eén buitenunit voor alles</b>Alle binnenunits komen op één buitenunit. Zo hangt er maar één toestel aan de gevel.";
    return "";
  }

  // =====================================================================
  // KLIKKEN
  // =====================================================================
  root.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t || !root.contains(t)) return;
    var roomEl = t.closest("[data-i]");
    var r = roomEl ? state.rooms[+roomEl.getAttribute("data-i")] : null;
    var act = t.getAttribute("data-act");
    var auto = false; // na één keuze meteen door naar de volgende vraag

    if (act === "next") return next();
    if (act === "prev") return prev();
    if (act === "edit") return go("aantal");
    if (act === "restart") {
      state = { step: "aantal", n: null, rooms: [], tweede: null, wens: null, oud: null, keuze: null, sent: false };
      return go("aantal");
    }
    if (act === "second") {
      state.tweede = "ja";
      save();
      return render();
    }
    if (act === "send") return send();

    if (t.hasAttribute("data-n")) {
      state.n = +t.getAttribute("data-n");
      setRooms(state.n);
      auto = true;
    } else if (t.hasAttribute("data-type")) r.type = t.getAttribute("data-type");
    else if (t.hasAttribute("data-size")) r.size = t.getAttribute("data-size");
    else if (t.hasAttribute("data-floor")) r.floor = +t.getAttribute("data-floor");
    else if (t.hasAttribute("data-dist")) r.dist = t.getAttribute("data-dist");
    else if (t.hasAttribute("data-tweede")) {
      state.tweede = t.getAttribute("data-tweede");
      auto = true;
    } else if (t.hasAttribute("data-wens")) {
      state.wens = t.getAttribute("data-wens");
      state.keuze = null;
      auto = true;
    } else if (t.hasAttribute("data-oud")) {
      state.oud = t.getAttribute("data-oud") === "1";
      auto = true;
    } else if (t.hasAttribute("data-keuze")) {
      state.keuze = t.getAttribute("data-keuze");
      save();
      render();
      return go("advies");
    } else return;

    // Eén ruimte: ook bij ruimte-vragen meteen door zodra alles is ingevuld
    if (state.n === 1 && r && (t.hasAttribute("data-size") || t.hasAttribute("data-floor") || t.hasAttribute("data-dist")))
      auto = true;
    save();
    render();
    if (auto) setTimeout(next, 220);
  });

  function send() {
    var st = document.getElementById("pc-status");
    var naam = document.getElementById("pc-naam").value.trim(),
      tel = document.getElementById("pc-tel").value.trim(),
      gem = document.getElementById("pc-gem").value.trim();
    if (!naam || !tel) {
      st.textContent = "Vul uw naam en telefoonnummer in, dan kan Rim u terugbellen.";
      st.className = "calc-status err";
      return;
    }
    if (!lastRes || typeof sendLead !== "function") return;
    var btn = root.querySelector('[data-act="send"]');
    btn.disabled = true;
    st.textContent = "Bezig met versturen...";
    st.className = "calc-status";
    var list = roomList();
    sendLead({
      naam: naam,
      telefoon: tel,
      gemeente: gem,
      dienst: "nieuw",
      toestel: lastRes.model.cfg.model + " (" + lastRes.pakket.titel + ")",
      indicatie: eur(lastRes.lo) + " - " + eur(lastRes.hi) + " (incl. " + btwPct() + "% btw)",
      ruimtes: list
        .map(function (r) {
          return r.naam + ": " + r.sizeLbl + ", " + FLOORS[r.floor].t + ", " + find(DISTS, "v", r.dist).t.toLowerCase();
        })
        .join(" | "),
      opstelling: lastRes.units
        .map(function (u, i) {
          return (
            "Buitenunit " +
            (i + 1) +
            " (" +
            SPOTS[u.spot].naam +
            "): " +
            u.items
              .map(function (it, j) {
                return it.naam + " " + kwTxt(u.kw[j]);
              })
              .join(", ")
          );
        })
        .join(" | "),
      tweedeBuitenunit: state.tweede || "",
      source: "prijscalculator",
      submittedAt: new Date().toISOString(),
    })
      .then(function () {
        state.sent = true;
        render();
        if (window.rtLeadDone) window.rtLeadDone(naam);
      })
      .catch(function () {
        btn.disabled = false;
        st.innerHTML =
          'Versturen lukte niet. Probeer het opnieuw of bel <a href="tel:+32491113313">0491 11 33 13</a>.';
        st.className = "calc-status err";
      });
  }

  if (state.n) setRooms(state.n);
  render();
})();
