// =====================================================================
// PRIJSADVIES  (bovenaan de pagina Toestellen, #prijs)
// ---------------------------------------------------------------------
// Drie korte vragen, één per scherm: hoeveel kamers, hoe groot is elke
// kamer, en wat vindt de klant het belangrijkst. Daarna ziet hij drie
// voorstellen (voordelig, beste prijs-kwaliteit en premium), elk met een
// richtprijs. Welke toestellen dat zijn, staat in js/prijzen.js
// (zie "wensen").
//
// Per voorstel zoekt de calculator zelf de voordeligste opstelling:
// meerdere kamers op één multi-split buitenunit als het toestel dat kan,
// anders een eigen buitenunit per kamer. Maximaal
// RT_PRIJZEN.maxPerBuitenunit binnenunits per buitenunit.
//
// Foto en uitleg van een toestel komen van de kaart in de lijst met alle
// toestellen (via data-model).
// =====================================================================
(function () {
  var root = document.getElementById("pc");
  if (!root || typeof RT_PRIJZEN === "undefined") return;

  var P = RT_PRIJZEN;
  var INST = P.installatie;
  var KW_PER_M2 = 0.1; // vuistregel: 100 W per m² (goed geïsoleerde woning)
  var STORE_KEY = "rt-prijsadvies-v2";
  var NIVEAUS = ["voordelig", "kwaliteit", "premium"];

  var SIZES = [
    { v: "s", t: "Klein", s: "tot 15 m²", m2: 12 },
    { v: "m", t: "Gemiddeld", s: "15 tot 25 m²", m2: 20 },
    { v: "l", t: "Groot", s: "25 tot 40 m²", m2: 32 },
    { v: "xl", t: "Heel groot", s: "meer dan 40 m²", m2: 48 },
  ];

  var euro = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  function eur(v) {
    return euro.format(Math.round(v));
  }
  function kwTxt(k) {
    return Number(k).toFixed(1).replace(".", ",") + " kW";
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

  // ---------- toestellen: foto en uitleg uit de lijst met alle toestellen ----------
  var MODELS = P.toestellen.map(function (t) {
    var sizes = Object.keys(t.prijzen)
      .map(parseFloat)
      .sort(function (a, b) {
        return a - b;
      });
    var cta = document.querySelector('.device-cta[data-model="' + t.model.replace(/"/g, '\\"') + '"]');
    var card = cta ? cta.closest(".device-card") : null;
    var img = card ? card.querySelector(".device-photo img") : null;
    var desc = card ? card.querySelector(".device-desc") : null;
    return {
      cfg: t,
      sizes: sizes,
      img: img ? img.getAttribute("src") || img.getAttribute("data-src") : "",
      desc: desc ? desc.textContent.trim() : "",
      slug: card ? card.dataset.slug || "" : "",
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
  // extra leiding per binnenunit bovenop wat in de plaatsing zit
  var PIPE = Math.max(0, INST.standaardLeiding - INST.leidingInbegrepen) * INST.perMeter;

  // Eén kamer met een eigen buitenunit (single-split)
  function singleUnit(m, item) {
    var kw = sizeFor(m, item.kw, 0);
    if (kw == null) return null;
    return { multi: false, items: [item], kw: [kw], mat: price(m, kw, 0), inst: INST.buitenunit + INST.binnenunit, pipe: PIPE };
  }

  // Meerdere kamers op één multi-split buitenunit
  function multiUnit(m, items) {
    var series = P.multi[m.cfg.multi];
    if (!series || items.length > P.maxPerBuitenunit) return null;
    var kws = [],
      mat = 0,
      sum = 0;
    for (var i = 0; i < items.length; i++) {
      var kw = sizeFor(m, items[i].kw, 1);
      if (kw == null) return null;
      kws.push(kw);
      mat += price(m, kw, 1);
      sum += kw;
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
      kw: kws,
      mat: mat + best.prijs,
      inst: INST.buitenunit + INST.binnenunit * items.length,
      pipe: PIPE * items.length,
    };
  }

  // Zo weinig mogelijk buitenunits: kamers samen op multi-split buitenunits als
  // het toestel dat kan, anders een eigen buitenunit per kamer.
  function unitsFor(m, items) {
    var singles = [],
      rest = [],
      out = [];
    items.forEach(function (it) {
      (m.cfg.multi && sizeFor(m, it.kw, 1) != null ? rest : singles).push(it);
    });
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

  function calculate(m) {
    var items = roomList().map(function (r) {
      return { naam: r.naam, kw: r.m2 * KW_PER_M2 };
    });
    var res = { model: m, units: unitsFor(m, items), mat: 0, inst: 0, pipe: 0 };
    res.units.forEach(function (u) {
      res.mat += u.mat;
      res.inst += u.inst;
      res.pipe += u.pipe;
    });
    res.excl = res.mat + res.inst + res.pipe;
    var incl = res.excl * (1 + P.btw.standaard / 100);
    res.lo = Math.floor((incl * (1 - P.marge.min / 100)) / 50) * 50;
    res.hi = Math.ceil((incl * (1 + P.marge.max / 100)) / 50) * 50;
    return res;
  }

  // Korte omschrijving van de opstelling, bv. "1 buitenunit met 3 binnenunits"
  function opstelling(res) {
    var n = res.units.length;
    var binnen = res.units.reduce(function (s, u) {
      return s + u.items.length;
    }, 0);
    if (binnen === 1) return "1 binnenunit en 1 buitenunit";
    if (n === 1) return "1 buitenunit met " + binnen + " binnenunits (multi-split)";
    if (n === binnen) return binnen + " kamers, elk met een eigen buitenunit";
    return n + " buitenunits voor " + binnen + " binnenunits";
  }

  // =====================================================================
  // ANTWOORDEN VAN DE KLANT
  // =====================================================================
  function leeg() {
    return { step: "aantal", n: null, sizes: [], wens: null, gekozen: null, sent: false };
  }
  var state = leeg();
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.sizes) state = saved;
    state.sent = false;
  } catch (e) {}
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {}
  }
  function setRooms(n) {
    while (state.sizes.length < n) state.sizes.push(null);
    state.sizes.length = n;
  }
  function roomList() {
    return state.sizes.map(function (v, i) {
      var sz = find(SIZES, "v", v) || SIZES[1];
      return { naam: state.n === 1 ? "Uw kamer" : "Kamer " + (i + 1), m2: sz.m2, sizeLbl: sz.s };
    });
  }
  function wens() {
    return find(P.wensen, "id", state.wens) || P.wensen[0];
  }

  var STEPS = ["aantal", "grootte", "wens", "voorstel"];
  function canNext(step) {
    if (step === "aantal") return !!state.n;
    if (step === "grootte")
      return (
        state.sizes.length > 0 &&
        state.sizes.every(function (s) {
          return s;
        })
      );
    if (step === "wens") return !!state.wens;
    return true;
  }
  function go(step) {
    state.step = step;
    save();
    render();
    var top = root.getBoundingClientRect().top;
    if (top < 70 || top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
  }
  function next() {
    var i = STEPS.indexOf(state.step);
    if (i < STEPS.length - 1 && canNext(state.step)) go(STEPS[i + 1]);
  }
  function prev() {
    var i = STEPS.indexOf(state.step);
    if (i > 0) go(STEPS[i - 1]);
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
  function q(title, hint) {
    return '<h2 class="pc-q">' + title + "</h2>" + (hint ? '<p class="pc-hint">' + hint + "</p>" : "");
  }

  var SCREENS = {
    aantal: function () {
      var h = q("In hoeveel kamers wilt u een airco?", "Tel elke kamer waar een toestel moet komen.");
      h += '<div class="pc-opts pc-opts-n">';
      for (var n = 1; n <= 6; n++) h += opt('data-n="' + n + '"', state.n === n, n === 6 ? "6 of meer" : String(n), n === 1 ? "kamer" : "kamers");
      h += "</div>";
      if (state.n === 6) h += '<p class="pc-hint">Bij meer dan 6 kamers rekenen we met 6. De rest bespreken we graag samen.</p>';
      return h;
    },
    grootte: function () {
      var h = q(state.n === 1 ? "Hoe groot is de kamer?" : "Hoe groot is elke kamer?", "Een schatting is genoeg. Daarmee kiezen we het juiste vermogen.");
      var list = roomList();
      state.sizes.forEach(function (v, i) {
        h += '<div class="pc-room" data-i="' + i + '">';
        if (state.n > 1) h += '<div class="pc-room-lbl"><span>' + (i + 1) + "</span>" + esc(list[i].naam) + "</div>";
        h += '<div class="pc-opts pc-opts-4">';
        SIZES.forEach(function (s) {
          h += opt('data-size="' + s.v + '"', v === s.v, s.t, s.s);
        });
        h += "</div></div>";
      });
      return h;
    },
    wens: function () {
      var h = q("Wat vindt u het belangrijkst?", "Daarna krijgt u drie voorstellen, elk met een richtprijs.");
      h += '<div class="pc-opts pc-opts-2">';
      P.wensen.forEach(function (w) {
        h += opt('data-wens="' + w.id + '"', state.wens === w.id, esc(w.vraag), esc(w.uitleg));
      });
      return h + "</div>";
    },
  };

  function render() {
    if (STEPS.indexOf(state.step) === -1) state.step = "aantal";
    if (state.step === "voorstel") {
      root.innerHTML = renderVoorstellen();
      return;
    }
    var i = STEPS.indexOf(state.step);
    var total = STEPS.length - 1;
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
    h +=
      '<button type="button" class="btn btn-gold" data-act="next"' +
      (canNext(state.step) ? "" : " disabled") +
      ">" +
      (i === total - 1 ? "Toon mijn voorstellen" : "Volgende") +
      ' <span class="ar">&rarr;</span></button>';
    h += "</div>";
    root.innerHTML = h;
  }

  // ---------- de drie voorstellen ----------
  var results = {};
  function renderVoorstellen() {
    var w = wens();
    results = {};
    NIVEAUS.forEach(function (nv) {
      var m = modelByName(w.voorstellen[nv]);
      if (m) results[nv] = calculate(m);
    });
    if (!results[state.gekozen]) state.gekozen = results[w.markeer] ? w.markeer : NIVEAUS[0];

    var list = roomList();
    var h = '<div class="pc-top pc-top-done"><span class="pc-prog-lbl">Uw drie voorstellen</span>';
    h += '<button type="button" class="pc-back" data-act="edit">Antwoorden aanpassen</button></div>';
    h +=
      '<p class="pc-vs-intro">Voor ' +
      (list.length === 1 ? "1 kamer (" + esc(list[0].sizeLbl) + ")" : list.length + " kamers") +
      ", toestellen en plaatsing inbegrepen. Kies het voorstel dat u aanspreekt; Rim bespreekt het graag met u.</p>";

    h += '<div class="pc-vs-grid">';
    NIVEAUS.forEach(function (nv) {
      var res = results[nv];
      if (!res) return;
      var m = res.model;
      var on = state.gekozen === nv;
      var niveau = P.niveaus[nv];
      var kws = [];
      res.units.forEach(function (u) {
        kws = kws.concat(u.kw);
      });
      var kMin = Math.min.apply(null, kws),
        kMax = Math.max.apply(null, kws);
      h += '<div class="pc-vs' + (on ? " on" : "") + " pc-vs-" + nv + '">';
      h += '<div class="pc-vs-head"><span class="pc-vs-niveau">' + esc(niveau.titel) + "</span>";
      if (nv === w.markeer) h += '<span class="pc-badge">Past bij uw wens</span>';
      h += "</div>";
      if (m.img) h += '<div class="pc-vs-ph"><img src="' + esc(m.img) + '" alt="' + esc(m.cfg.model) + '" loading="lazy"></div>';
      h += '<div class="pc-vs-merk">' + esc(m.cfg.merk) + "</div>";
      h += '<h3 class="pc-vs-naam">' + esc(m.cfg.naam) + "</h3>";
      h += '<p class="pc-vs-why">' + esc(m.desc || niveau.uitleg) + "</p>";
      h += '<div class="pc-vs-prijs"><small>Richtprijs</small><b>' + eur(res.lo) + " &ndash; " + eur(res.hi) + "</b></div>";
      h += '<ul class="pc-vs-info"><li>' + esc(opstelling(res)) + "</li>";
      h += "<li>" + (kws.length > 1 ? "Binnenunits van " : "Vermogen ") + kwTxt(kMin) + (kMax > kMin ? " tot " + kwTxt(kMax) : "") + "</li></ul>";
      h +=
        '<button type="button" class="btn ' +
        (on ? "btn-gold" : "v3-btn-line") +
        ' pc-vs-btn" data-kies="' +
        nv +
        '" aria-pressed="' +
        on +
        '">' +
        (on ? "&#10003; Gekozen" : "Kies dit voorstel") +
        "</button>";
      if (m.slug) h += '<a class="pc-vs-meer" href="#toestel-' + esc(m.slug) + '">Meer over dit toestel</a>';
      h += "</div>";
    });
    h += "</div>";

    h +=
      '<p class="pc-fine">Dit zijn richtprijzen, incl. ' +
      P.btw.standaard +
      "% btw (woning ouder dan 10 jaar; jonger: " +
      P.btw.nieuw +
      "% btw), voor de toestellen en een standaardplaatsing. De echte prijs krijgt u in de offerte, nadat Rim bij u is langs geweest. Dat plaatsbezoek is gratis.</p>";
    if (P.voorlopig) h += '<div class="pc-demo">Let op: dit prijsadvies gebruikt nog voorbeeldprijzen.</div>';

    // aanvraag
    var gk = results[state.gekozen];
    h += '<div class="pc-lead pc-vs-lead">';
    if (state.sent) {
      h += '<b>Bedankt! Rim belt u binnen 24 uur terug.</b><span class="pc-muted">Dan plannen we samen het gratis plaatsbezoek.</span>';
    } else {
      h +=
        "<div><b>Uw keuze: " +
        esc(P.niveaus[state.gekozen].titel) +
        " &middot; " +
        esc(gk.model.cfg.merk + " " + gk.model.cfg.naam) +
        " &middot; " +
        eur(gk.lo) +
        " &ndash; " +
        eur(gk.hi) +
        '</b><span class="pc-muted">Rim belt u binnen 24 uur terug en komt gratis langs. Daarna krijgt u een vaste offerte.</span></div>' +
        '<div class="pc-vs-form">' +
        '<div class="field"><label for="pc-naam">Naam</label><input id="pc-naam" type="text" autocomplete="name"></div>' +
        '<div class="field"><label for="pc-tel">Telefoon</label><input id="pc-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="04xx xx xx xx"></div>' +
        '<div class="field"><label for="pc-gem">Gemeente</label><input id="pc-gem" type="text" autocomplete="address-level2" placeholder="bv. Bree"></div>' +
        '<button type="button" class="btn btn-gold" data-act="send">Vraag mijn gratis plaatsbezoek aan <span class="ar">&rarr;</span></button>' +
        "</div>" +
        '<div class="calc-status" id="pc-status" role="alert"></div>';
    }
    h += "</div>";
    h += '<div class="pc-restart"><button type="button" class="pc-back" data-act="restart">Opnieuw beginnen</button></div>';
    return h;
  }

  // =====================================================================
  // KLIKKEN
  // =====================================================================
  root.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t || !root.contains(t)) return;
    var act = t.getAttribute("data-act");
    var auto = false; // na een keuze meteen door naar de volgende vraag

    if (act === "next") return next();
    if (act === "prev") return prev();
    if (act === "edit") return go("aantal");
    if (act === "restart") {
      state = leeg();
      return go("aantal");
    }
    if (act === "send") return send();

    if (t.hasAttribute("data-n")) {
      state.n = +t.getAttribute("data-n");
      setRooms(state.n);
      auto = true;
    } else if (t.hasAttribute("data-size")) {
      state.sizes[+t.closest("[data-i]").getAttribute("data-i")] = t.getAttribute("data-size");
      auto = canNext("grootte");
    } else if (t.hasAttribute("data-wens")) {
      state.wens = t.getAttribute("data-wens");
      state.gekozen = null;
      auto = true;
    } else if (t.hasAttribute("data-kies")) {
      state.gekozen = t.getAttribute("data-kies");
      save();
      render();
      var lead = root.querySelector(".pc-vs-lead");
      if (lead && lead.getBoundingClientRect().top > window.innerHeight - 120)
        window.scrollTo({ top: window.scrollY + lead.getBoundingClientRect().top - 160, behavior: "smooth" });
      return;
    } else return;

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
    // zelfde controle als in het formulier op Home: minstens 8 cijfers
    if (tel.replace(/\D/g, "").length < 8) {
      st.textContent = "Kijk uw telefoonnummer even na, dan kan Rim u terugbellen.";
      st.className = "calc-status err";
      document.getElementById("pc-tel").focus();
      return;
    }
    var res = results[state.gekozen];
    if (!res || typeof sendLead !== "function") return;
    var btn = root.querySelector('[data-act="send"]');
    btn.disabled = true;
    st.textContent = "Bezig met versturen...";
    st.className = "calc-status";
    sendLead({
      naam: naam,
      telefoon: tel,
      gemeente: gem,
      dienst: "nieuw",
      wens: wens().vraag,
      voorstel: P.niveaus[state.gekozen].titel,
      toestel: res.model.cfg.model,
      richtprijs: eur(res.lo) + " - " + eur(res.hi) + " (incl. " + P.btw.standaard + "% btw)",
      kamers: roomList()
        .map(function (r) {
          return r.naam + ": " + r.sizeLbl;
        })
        .join(" | "),
      opstelling:
        opstelling(res) +
        " (" +
        res.units
          .map(function (u) {
            return u.kw.map(kwTxt).join(" + ");
          })
          .join(" | ") +
        ")",
      source: "prijscalculator",
      submittedAt: new Date().toISOString(),
    })
      .then(function () {
        // het prijsadvies toont zijn eigen bedankt-tekst; het contactformulier blijft vrij
        state.sent = true;
        render();
      })
      .catch(function () {
        btn.disabled = false;
        st.innerHTML = 'Versturen lukte niet. Probeer het opnieuw of bel <a href="tel:+32491113313">+32 491 11 33 13</a>.';
        st.className = "calc-status err";
      });
  }

  if (state.n) setRooms(state.n);
  render();
})();
