// =====================================================================
// Reijners Technics - JavaScript voor de hele website
// ---------------------------------------------------------------------
// Elk onderdeel staat in een eigen blok  (function(){ ... })();
// Volgorde: navigatie, aanvragen versturen (Formspree), kleurkeuze toestellen,
// WhatsApp-links, contactformulier, offerteformulier (calculator),
// offerte starten, welkomstbericht, foto-carrousels, wisselende foto's,
// filterknoppen, fotoraster met fotoviewer, AI-chat.
// Let op: de AI-chat werkt alleen in de versie bij Claude (window.claude).
// Op een eigen domein blijft de chat automatisch verborgen.
// =====================================================================

// =====================================================================
// NAVIGATIE
// De website werkt op twee manieren:
//  1. Losse pagina's (index.html, diensten.html, ...). Elke pagina is een
//     apart bestand; <body data-page="..."> zegt op welke pagina we zijn.
//  2. Alles-in-een (de live versie bij Claude). Alle pagina's staan dan in
//     een bestand en worden getoond of verborgen met de class "page-active".
// =====================================================================
(function () {
  var PAGE_FILES = {
    home: "index.html",
    diensten: "diensten.html",
    toestellen: "toestellen.html",
    realisaties: "realisaties.html",
    "over-ons": "over-ons.html",
    contact: "contact.html",
    privacy: "privacy.html",
  };
  var pageNames = Object.keys(PAGE_FILES);
  var currentPage = document.body.getAttribute("data-page");
  var isMultiPage = !!currentPage;

  function setActivePage(pageId) {
    if (!isMultiPage) {
      document.querySelectorAll("section[data-page]").forEach(function (el) {
        el.classList.toggle("page-active", el.dataset.page === pageId);
      });
    }
    document.querySelectorAll("#site-nav a[data-page]").forEach(function (a) {
      a.classList.toggle("active", a.dataset.page === (pageId === "toestel" ? "toestellen" : pageId));
    });
  }

  function closeMenu() {
    var nav = document.getElementById("site-nav");
    var toggle = document.getElementById("nav-toggle");
    if (nav) nav.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  // Zoekt uit bij welke pagina (en welk onderdeel) een #link hoort.
  function pageForHash(hash) {
    if (!hash) return null;
    hash = hash.replace("#", "");
    if (!hash) return null;
    // detailpagina van een toestel (#toestel-...), zie het blok TOESTELLEN: COMPACTE KAARTEN
    if (hash.indexOf("toestel-") === 0) return window.rtToestelInfo ? window.rtToestelInfo(hash.slice(8)) : null;
    if (pageNames.indexOf(hash) !== -1) return { page: hash, scrollTo: null };
    var el = document.getElementById(hash);
    if (el) {
      var pageEl = el.closest("[data-page]");
      return { page: pageEl ? pageEl.dataset.page : "home", scrollTo: el };
    }
    return null;
  }

  // Ga naar een pagina. Bij losse pagina's opent dit het juiste bestand.
  // hash: optioneel een ander adres dan de paginanaam (bv. "toestel-daikin-perfera").
  window.goToPage = function (pageId, doScrollTop, hash) {
    closeMenu();
    if (isMultiPage) {
      if (pageId !== currentPage) {
        location.href = PAGE_FILES[pageId];
        return;
      }
      if (doScrollTop) window.scrollTo(0, 0);
      return;
    }
    setActivePage(pageId);
    var adres = "#" + (hash || pageId);
    if (location.hash !== adres) {
      history.pushState(null, "", adres);
    }
    if (doScrollTop) window.scrollTo(0, 0);
  };

  // Klik op een #link binnen dezelfde pagina: vloeiend naar dat onderdeel scrollen.
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute("href").slice(1);
    if (!hash) return;
    var info = pageForHash(hash);
    if (!info) return;
    e.preventDefault();
    if (info.scrollTo) {
      goToPage(info.page, false);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          info.scrollTo.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else {
      goToPage(info.page, true, info.hash);
    }
  });

  // Menuknop (hamburger) op de gsm
  var navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var nav = document.getElementById("site-nav");
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (!isMultiPage) {
    window.addEventListener("popstate", function () {
      var info = pageForHash(location.hash);
      setActivePage(info ? info.page : "home");
    });
  }

  var initial = isMultiPage
    ? { page: currentPage, scrollTo: location.hash ? document.getElementById(location.hash.slice(1)) : null }
    : pageForHash(location.hash) || { page: "home" };
  setActivePage(initial.page);
  if (initial.scrollTo) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        initial.scrollTo.scrollIntoView({ behavior: "auto", block: "start" });
      });
    });
  }
})();

// =====================================================================
// AANVRAGEN VERSTUREN
// Elke aanvraag (aanvraagformulier, aanvulling, contactformulier) gaat
// via Formspree als e-mail naar reijnerstechnics@gmail.com.
// Ander Formspree-formulier? Pas dan enkel FORMSPREE_URL hieronder aan.
// =====================================================================
var FORMSPREE_URL = "https://formspree.io/f/mdeakpaq";

var SOURCE_SUBJECTS = {
  aanvraagformulier: "Nieuwe aanvraag via de website",
  "aanvraagformulier-aanvulling": "Aanvulling op een aanvraag",
  "contact-form": "Nieuw bericht via het contactformulier",
  prijscalculator: "Offerteaanvraag via de prijscalculator",
};

function sendLead(data) {
  var payload = { _subject: (SOURCE_SUBJECTS[data.source] || "Website") + (data.naam ? " - " + data.naam : "") };
  for (var k in data) {
    var v = data[k];
    payload[k] = Array.isArray(v) ? v.join(", ") : v;
  }
  if (data.email) payload._replyto = data.email;
  return fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  }).then(function (res) {
    if (!res.ok) throw new Error("Formspree " + res.status);
    return res.json();
  });
}

(function () {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".color-btn");
    if (!btn) return;
    var group = btn.parentElement;
    var photoBox = group.previousElementSibling;
    var img = photoBox ? photoBox.querySelector("img") : null;
    if (!img) return;
    img.setAttribute("src", btn.dataset.src);
    img.setAttribute("alt", btn.dataset.alt);
    group.querySelectorAll(".color-btn").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
  });
})();

(function () {
  var waNumber = "32491113313";
  var waText = encodeURIComponent("Hallo, ik heb interesse in het plaatsen van een airco/warmtepomp.");
  var waHref = "https://wa.me/" + waNumber + "?text=" + waText;
  ["wa-header", "wa-hero", "wa-card", "wa-float"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", waHref);
  });
  document.querySelectorAll(".js-wa").forEach(function (el) {
    el.setAttribute("href", waHref);
  });
})();

(function () {
  var form = document.getElementById("lead-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  var PLACEHOLDERS = {
    "Nieuwe airco": "Bijvoorbeeld: aantal ruimtes, bestaande verwarming, gewenste periode",
    "Nieuwe warmtepomp": "Bijvoorbeeld: aantal ruimtes, bestaande verwarming, gewenste periode",
    Onderhoud: "Bijvoorbeeld: merk en type toestel, wanneer het laatste onderhoud was",
    Herstelling: "Bijvoorbeeld: merk en type toestel, wat er scheelt en sinds wanneer, eventuele foutcode",
    "Iets anders": "Uw vraag of bericht",
  };
  form.type.addEventListener("change", function () {
    form.bericht.setAttribute("placeholder", PLACEHOLDERS[form.type.value] || "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector("button[type=submit]");
    var data = {
      naam: form.naam.value.trim(),
      telefoon: form.telefoon.value.trim(),
      email: form.email.value.trim(),
      type: form.type.value,
      bericht: form.bericht.value.trim(),
      source: "contact-form",
      submittedAt: new Date().toISOString(),
    };

    if (!data.naam || !data.telefoon) {
      status.textContent = "Vul uw naam en telefoonnummer in, dan kan Rim u terugbellen.";
      status.className = "form-status err";
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "Bezig met versturen...";
    status.className = "form-status";

    function done(ok, msg) {
      submitBtn.disabled = false;
      status.textContent = msg;
      status.className = "form-status " + (ok ? "ok" : "err");
      if (ok) form.reset();
    }

    sendLead(data)
      .then(function () {
        done(true, "Bedankt, " + data.naam + "! Rim belt u binnen 24 uur terug.");
        if (window.rtLeadDone) window.rtLeadDone(data.naam);
      })
      .catch(function () {
        done(false, "Versturen lukte niet. Probeer het opnieuw of gebruik WhatsApp hiernaast.");
      });
  });
})();

(function () {
  var form = document.getElementById("calc-form");
  if (!form) return;

  var ORDER = ["dienst", "contact", "klaar"];
  var state = {};
  var history = ["dienst"];
  var WA_NUMBER = "32491113313";

  var LABELS = {
    dienst: { nieuw: "Nieuwe airco of warmtepomp", onderhoud: "Onderhoud", herstelling: "Herstelling" },
    grootte: {
      "<20": "kleiner dan 20 m²",
      "20-35": "20-35 m²",
      "35-50": "35-50 m²",
      ">50": "groter dan 50 m²",
    },
    laatsteOnderhoud: {
      "<1j": "minder dan 1 jaar geleden",
      "1-2j": "1 tot 2 jaar geleden",
      ">2j": "meer dan 2 jaar geleden",
      nooit: "nog nooit",
      onbekend: "weet ik niet",
    },
    sinds: { vandaag: "vandaag", week: "deze week", maand: "deze maand", langer: "langer dan een maand" },
    probleem: {
      "koelt-verwarmt-niet": "koelt of verwarmt slecht of niet",
      lekt: "lekt water",
      lawaai: "maakt lawaai",
      geur: "vreemde geur",
      foutcode: "foutcode op het display",
      "start-niet": "start niet op",
      anders: "iets anders",
    },
  };
  function label(field, value) {
    return (LABELS[field] && LABELS[field][value]) || value || "";
  }
  function roomsLabel(v) {
    if (v === "4+") return "4 of meer ruimtes";
    if (v === "1") return "1 ruimte";
    return v + " ruimtes";
  }

  function currentKey() {
    return history[history.length - 1];
  }
  function render() {
    var key = currentKey();
    var stepEls = form.querySelectorAll(".calc-step");
    for (var i = 0; i < stepEls.length; i++) {
      stepEls[i].classList.toggle("active", stepEls[i].getAttribute("data-step") === key);
    }
    var idx = ORDER.indexOf(key);
    var fill = document.getElementById("calc-fill");
    var lab = document.getElementById("calc-label");
    if (key === "klaar") {
      fill.style.width = "100%";
      lab.textContent = "Aanvraag verstuurd";
    } else {
      fill.style.width = (idx === 0 ? 12 : 60) + "%";
      lab.textContent = "Stap " + (idx + 1) + " van 2";
    }
    var backBtn = document.getElementById("calc-back");
    if (key === "contact") backBtn.removeAttribute("hidden");
    else backBtn.setAttribute("hidden", "");
  }
  function goTo(key) {
    history.push(key);
    render();
  }
  document.getElementById("calc-back").addEventListener("click", function () {
    if (history.length > 1) {
      history.pop();
      render();
    }
  });

  // stap 1: dienst kiezen (1 klik, gaat automatisch door)
  var dienstBtns = form.querySelectorAll('.option-grid[data-field="dienst"] .option-btn');
  Array.prototype.forEach.call(dienstBtns, function (btn) {
    btn.addEventListener("click", function () {
      Array.prototype.forEach.call(dienstBtns, function (b) {
        b.classList.remove("selected");
      });
      btn.classList.add("selected");
      state.dienst = btn.getAttribute("data-value");
      setTimeout(function () {
        goTo("contact");
        var n = document.getElementById("calc-naam");
        if (n && window.matchMedia && window.matchMedia("(min-width: 761px)").matches) n.focus();
      }, 200);
    });
  });

  // Enter springt naar het volgende veld, op het laatste veld wordt verstuurd
  var fieldOrder = ["calc-naam", "calc-telefoon", "calc-gemeente"];
  fieldOrder.forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el)
      el.addEventListener("input", function () {
        var st = document.getElementById("calc-contact-status");
        if (st.className.indexOf("err") !== -1) {
          st.textContent = "";
          st.className = "calc-status";
        }
      });
    if (el)
      el.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (i < fieldOrder.length - 1) document.getElementById(fieldOrder[i + 1]).focus();
        else document.getElementById("calc-send").click();
      });
  });

  function buildWaText(s) {
    var lines = ["Hallo, ik heb op de website een aanvraag gedaan:"];
    lines.push("- " + label("dienst", s.dienst));
    if (s.ruimtes) lines.push("- Ruimtes: " + roomsLabel(s.ruimtes));
    if (s.grootte) lines.push("- Oppervlakte per ruimte: " + label("grootte", s.grootte));
    if (s.probleem && s.probleem.length)
      lines.push(
        "- Probleem: " +
          s.probleem
            .map(function (v) {
              return label("probleem", v);
            })
            .join(", "),
      );
    if (s.sinds) lines.push("- Sinds: " + label("sinds", s.sinds));
    if (s.laatsteOnderhoud)
      lines.push("- Laatste onderhoud: " + label("laatsteOnderhoud", s.laatsteOnderhoud));
    if (s.toestel) lines.push("- Toestel: " + s.toestel);
    if (s.omschrijving) lines.push("- " + s.omschrijving);
    if (s.naam) lines.push("Naam: " + s.naam + (s.gemeente ? ", " + s.gemeente : ""));
    if (s.telefoon) lines.push("Telefoon: " + s.telefoon);
    return lines.join("\n");
  }
  function waHref() {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildWaText(state));
  }

  // stap 2: gegevens + versturen (de aanvraag wordt hier meteen bewaard)
  var sendBtn = document.getElementById("calc-send");
  sendBtn.addEventListener("click", function () {
    var naam = document.getElementById("calc-naam").value.trim();
    var telefoon = document.getElementById("calc-telefoon").value.trim();
    var gemeente = document.getElementById("calc-gemeente").value.trim();
    var statusEl = document.getElementById("calc-contact-status");
    var digits = telefoon.replace(/\D/g, "");
    if (!naam || !telefoon || !gemeente) {
      statusEl.textContent = "Vul uw naam, telefoonnummer en gemeente in.";
      statusEl.className = "calc-status err";
      return;
    }
    if (digits.length < 8) {
      statusEl.textContent = "Kijk uw telefoonnummer even na, dan kan Rim u terugbellen.";
      statusEl.className = "calc-status err";
      return;
    }
    state.naam = naam;
    state.telefoon = telefoon;
    state.gemeente = gemeente;
    statusEl.textContent = "Bezig met versturen...";
    statusEl.className = "calc-status";
    sendBtn.disabled = true;

    var data = {
      dienst: state.dienst,
      naam: naam,
      telefoon: telefoon,
      gemeente: gemeente,
      model: window.rtModel || "",
      source: "aanvraagformulier",
      submittedAt: new Date().toISOString(),
    };
    function fail() {
      sendBtn.disabled = false;
      statusEl.innerHTML = "";
      statusEl.className = "calc-status err";
      statusEl.appendChild(document.createTextNode("Versturen lukte niet. "));
      var a = document.createElement("a");
      a.href = waHref();
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Stuur uw aanvraag via WhatsApp";
      statusEl.appendChild(a);
    }
    sendLead(data)
      .then(function () {
        sendBtn.disabled = false;
        statusEl.textContent = "";
        showDone();
      })
      .catch(fail);
  });

  function showDone() {
    document.getElementById("calc-done-title").textContent = "Bedankt, " + state.naam + "!";
    document.getElementById("calc-done-text").textContent =
      "Uw aanvraag is goed ontvangen. Rim belt u binnen 24 uur terug op " + state.telefoon + ".";
    var isNieuw = state.dienst === "nieuw";
    document.getElementById("calc-extra-nieuw").hidden = !isNieuw;
    document.getElementById("calc-extra-onderhoud").hidden = state.dienst !== "onderhoud";
    document.getElementById("calc-extra-herstelling").hidden = state.dienst !== "herstelling";
    document.getElementById("calc-wa").setAttribute("href", waHref());
    history = ["klaar"];
    render();
    var card = form.closest(".calc-card");
    if (card && card.getBoundingClientRect().top < 70) {
      window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    }
  }

  // optionele aanvulling na het versturen
  var chipGrids = form.querySelectorAll(".chip-grid");
  Array.prototype.forEach.call(chipGrids, function (grid) {
    var field = grid.getAttribute("data-extra");
    var multi = grid.hasAttribute("data-multi");
    var chips = grid.querySelectorAll(".chip");
    Array.prototype.forEach.call(chips, function (c) {
      c.setAttribute("aria-pressed", "false");
      c.addEventListener("click", function () {
        if (multi) {
          c.classList.toggle("selected");
        } else {
          Array.prototype.forEach.call(chips, function (x) {
            x.classList.remove("selected");
            x.setAttribute("aria-pressed", "false");
          });
          c.classList.add("selected");
        }
        c.setAttribute("aria-pressed", c.classList.contains("selected") ? "true" : "false");
        if (multi) {
          state[field] = Array.prototype.filter
            .call(chips, function (x) {
              return x.classList.contains("selected");
            })
            .map(function (x) {
              return x.getAttribute("data-value");
            });
        } else {
          state[field] = c.getAttribute("data-value");
        }
      });
    });
  });

  var KW_AREA_MIDPOINT = { "<20": 15, "20-35": 27, "35-50": 42, ">50": 55 };
  var KW_STANDARD_SIZES = [2.0, 2.5, 3.5, 5.0, 6.0, 7.1, 8.0];
  function snapKw(v) {
    for (var i = 0; i < KW_STANDARD_SIZES.length; i++) {
      if (KW_STANDARD_SIZES[i] >= v) return KW_STANDARD_SIZES[i];
    }
    return KW_STANDARD_SIZES[KW_STANDARD_SIZES.length - 1];
  }
  function estimateKw(s) {
    var area = KW_AREA_MIDPOINT[s.grootte];
    if (!area) return null;
    var low = snapKw(area * 0.09),
      high = snapKw(area * 0.12);
    var perRoom = low === high ? low.toFixed(1) + " kW" : low.toFixed(1) + " - " + high.toFixed(1) + " kW";
    var n = s.ruimtes === "4+" ? 4 : parseInt(s.ruimtes, 10);
    return n && n > 1 ? perRoom + " per ruimte (bij " + roomsLabel(s.ruimtes) + ")" : perRoom;
  }

  var extraBtn = document.getElementById("calc-extra-send");
  extraBtn.addEventListener("click", function () {
    var st = document.getElementById("calc-extra-status");
    var extra = {};
    if (state.dienst === "nieuw") {
      if (state.ruimtes) extra.ruimtes = state.ruimtes;
      if (state.grootte) extra.grootte = state.grootte;
    } else {
      var d = state.dienst;
      if (d === "herstelling") {
        if (state.probleem && state.probleem.length)
          extra.probleem = state.probleem.map(function (v) {
            return label("probleem", v);
          });
        if (state.sinds) extra.sinds = label("sinds", state.sinds);
      }
      if (state.laatsteOnderhoud) extra.laatsteOnderhoud = label("laatsteOnderhoud", state.laatsteOnderhoud);
      var toestel = document.getElementById("calc-toestel-" + d).value.trim();
      if (toestel) {
        extra.toestel = toestel;
        state.toestel = toestel;
      }
      var om = document.getElementById("calc-omschrijving-" + d).value.trim();
      if (om) {
        extra.omschrijving = om;
        state.omschrijving = om;
      }
    }
    if (!Object.keys(extra).length) {
      st.textContent = "Kies of vul eerst iets in, of sla deze stap gewoon over.";
      st.className = "calc-status err";
      return;
    }
    extra.aangevuldAt = new Date().toISOString();
    var kw = estimateKw(state);
    if (kw) extra.kwRichtwaarde = kw;
    extraBtn.disabled = true;
    st.textContent = "Bezig...";
    st.className = "calc-status";
    function ok() {
      extraBtn.disabled = false;
      st.textContent = "Dank u, dat helpt ons om goed voorbereid te bellen.";
      st.className = "calc-status ok";
      if (kw) {
        document.getElementById("calc-kw-value").textContent = kw;
        document.getElementById("calc-kw-box").hidden = false;
      }
      document.getElementById("calc-wa").setAttribute("href", waHref());
    }
    function fail() {
      extraBtn.disabled = false;
      st.textContent = "Aanvullen lukte niet. Uw aanvraag zelf is wel verstuurd.";
      st.className = "calc-status err";
    }
    var copy = {
      naam: state.naam,
      telefoon: state.telefoon,
      gemeente: state.gemeente,
      dienst: state.dienst,
      source: "aanvraagformulier-aanvulling",
    };
    for (var k in extra) copy[k] = extra[k];
    sendLead(copy).then(ok).catch(fail);
  });

  window.rtStartOffer = function (d) {
    if (currentKey() === "klaar") return;
    history = ["dienst"];
    render();
    var b = form.querySelector('.option-grid[data-field="dienst"] .option-btn[data-value="' + d + '"]');
    if (b) b.click();
  };
  window.rtOfferStarted = function () {
    return !!state.dienst || currentKey() !== "dienst";
  };

  render();
})();

// =====================================================================
// OFFERTE STARTEN vanuit een tegel of het welkomstbericht.
// Staat het formulier niet op deze pagina, dan gaan we naar
// index.html en kiezen we daar meteen de juiste dienst.
// =====================================================================
window.rtGoToOffer = function (d, model) {
  // model: het toestel waarvoor de bezoeker een offerte vraagt (vanaf Toestellen)
  window.rtModel = model || "";
  var mEl = document.getElementById("calc-model");
  if (mEl) {
    mEl.hidden = !model;
    mEl.textContent = model ? "Gekozen toestel: " + model : "";
  }
  if (!document.getElementById("calc-form")) {
    location.href =
      "index.html?dienst=" + encodeURIComponent(d) + (model ? "&model=" + encodeURIComponent(model) : "") + "#calculator";
    return;
  }
  if (window.goToPage) window.goToPage("home", false);
  if (window.rtStartOffer) window.rtStartOffer(d);
  setTimeout(function () {
    var card = document.querySelector("#calculator .calc-card");
    if (card)
      window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  }, 260);
};
(function () {
  var m = /[?&]dienst=([a-z]+)/.exec(location.search);
  var mm = /[?&]model=([^&#]+)/.exec(location.search);
  if (m && document.getElementById("calc-form")) {
    setTimeout(function () {
      window.rtGoToOffer(m[1], mm ? decodeURIComponent(mm[1].replace(/\+/g, " ")) : "");
    }, 150);
  }
})();

(function () {
  document.querySelectorAll("[data-start-dienst]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.rtGoToOffer(btn.getAttribute("data-start-dienst"), btn.getAttribute("data-model") || "");
    });
  });
})();

(function () {
  var bubble = document.getElementById("welcome-bubble");
  if (!bubble) return;
  var KEY = "rt-welcome-dismissed";
  var tries = 0;
  function dismissed() {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function remember() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch (e) {}
  }
  function isShown() {
    return !bubble.hidden;
  }
  function hide() {
    if (!isShown()) return;
    remember();
    bubble.classList.remove("show");
    setTimeout(function () {
      bubble.hidden = true;
    }, 260);
  }
  function chatVisible() {
    var w = document.getElementById("ai-chat");
    return !!(w && !w.hidden);
  }
  function calcInView() {
    var c = document.getElementById("calculator");
    if (!c || !c.offsetParent) return false;
    var r = c.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  function show() {
    if (dismissed() || isShown()) return;
    if (document.querySelector('section[data-page="contact"].page-active')) {
      setTimeout(show, 5000);
      return;
    }
    if (window.rtOfferStarted && window.rtOfferStarted()) return;
    var panel = document.getElementById("chat-panel");
    if (panel && !panel.hidden) return;
    if (calcInView()) {
      if (++tries < 5) setTimeout(show, 4000);
      return;
    }
    bubble.classList.toggle("above-chat", chatVisible());
    document.getElementById("wb-ask").hidden = !chatVisible();
    bubble.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bubble.classList.add("show");
      });
    });
  }
  setTimeout(show, 5000);

  document.getElementById("wb-close").addEventListener("click", hide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  Array.prototype.forEach.call(bubble.querySelectorAll(".wb-opt"), function (btn) {
    btn.addEventListener("click", function () {
      hide();
      window.rtGoToOffer(btn.getAttribute("data-dienst"));
    });
  });

  document.getElementById("wb-ask").addEventListener("click", function () {
    hide();
    var panel = document.getElementById("chat-panel");
    var toggle = document.getElementById("chat-toggle");
    if (panel && panel.hidden && toggle) toggle.click();
  });
  var chatToggle = document.getElementById("chat-toggle");
  if (chatToggle) chatToggle.addEventListener("click", hide);
})();

(function () {
  var chatWidget = document.getElementById("ai-chat");
  var chatToggle = document.getElementById("chat-toggle");
  var chatPanel = document.getElementById("chat-panel");
  var chatClose = document.getElementById("chat-close");
  var chatMessages = document.getElementById("chat-messages");
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  if (!chatWidget || !chatToggle || !chatPanel || !chatForm || !chatInput) return;
  var chatSubmitBtn = chatForm.querySelector("button[type=submit]");
  var iconOpen = chatToggle.querySelector(".chat-icon-open");
  var iconClose = chatToggle.querySelector(".chat-icon-close");

  var RULES =
    "Je bent de chatassistent van Reijners Technics, een airco- en warmtepompinstallateur in Dilsen-Stokkem (werkgebied: de regio rond Dilsen-Stokkem, onder meer Maaseik, Bree, Genk, Lanaken, Bilzen, Tongeren, Hasselt en Peer). Reijners Technics installeert, onderhoudt en herstelt airco's en lucht/lucht-warmtepompen van de merken Daikin, Mitsubishi Electric, LG, Toshiba, Nuova en Mitsubishi Heavy Industries, en warmtepompboilers. Er staan bewust geen prijzen op de website. Verwijs voor een offerte, onderhoud of herstelling altijd eerst naar het aanvraagformulier op de website (de knop Offerte aanvragen): twee korte stappen, en Reijners Technics belt binnen 24 uur terug. Enkel als de bezoeker liever rechtstreeks contact wil: WhatsApp of telefoon op +32 491 11 33 13, of e-mail reijnerstechnics@gmail.com. Antwoord kort (maximaal een paar zinnen), vriendelijk en concreet in het Nederlands. Verzin geen feiten die je niet zeker weet, zoals exacte prijzen, garantietermijnen of levertijden - verwijs daarvoor door naar rechtstreeks contact. Blijf bij het onderwerp airco's, warmtepompen, installatie, onderhoud en energieverbruik.";

  var turns = [];
  var sampleFn = null;
  var sending = false;

  function tryInit() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    window.claude
      .use("sample")
      .then(function (s) {
        if (!s) return;
        sampleFn = s;
        chatWidget.hidden = false;
      })
      .catch(function () {});
  }
  tryInit();

  function addMessage(text, kind) {
    var div = document.createElement("div");
    div.className = "chat-msg chat-msg-" + kind;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function openPanel() {
    chatPanel.hidden = false;
    chatToggle.setAttribute("aria-expanded", "true");
    iconOpen.hidden = true;
    iconClose.hidden = false;
    chatInput.focus();
  }
  function closePanel() {
    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    iconOpen.hidden = false;
    iconClose.hidden = true;
  }

  chatToggle.addEventListener("click", function () {
    if (chatPanel.hidden) openPanel();
    else closePanel();
  });
  chatClose.addEventListener("click", closePanel);

  var errorCopy = {
    not_granted: "Deze chat is momenteel niet beschikbaar. Stuur ons gerust een WhatsApp-bericht.",
    sampling_disabled: "Deze chat is momenteel niet beschikbaar. Stuur ons gerust een WhatsApp-bericht.",
    rate_limited: "Even geduld, er komen te veel vragen tegelijk binnen. Probeer straks opnieuw.",
    session_expired: "Uw sessie is verlopen. Vernieuw de pagina om opnieuw te chatten.",
    refused:
      "Daar kan ik zo geen antwoord op geven. Stel het gerust anders, of neem rechtstreeks contact op.",
    empty_completion: "Daar kreeg ik geen antwoord op. Probeer de vraag anders te stellen.",
    upstream_error: "Er ging even iets mis. Probeer het opnieuw.",
  };
  var hideOn = [
    "not_granted",
    "sampling_disabled",
    "not_declared",
    "capability_disabled",
    "capability_removed",
  ];

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending || !sampleFn) return;
    var text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    addMessage(text, "user");
    turns.push({ role: "user", content: text });

    sending = true;
    chatSubmitBtn.disabled = true;
    var botDiv = addMessage("Denkt na...", "bot");

    sampleFn([{ role: "user", content: RULES }].concat(turns), {
      modelTier: "quick",
      cache: false,
      onText: function (update) {
        botDiv.textContent = update.text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      },
    })
      .then(function (result) {
        botDiv.textContent = result.text;
        turns.push({ role: "assistant", content: result.text });
        if (turns.length > 12) turns = turns.slice(turns.length - 12);
      })
      .catch(function (err) {
        var code = err && err.code;
        if (code === "cancelled") {
          botDiv.remove();
        } else if (err && err.text) {
          botDiv.textContent = err.text;
        } else {
          botDiv.className = "chat-msg chat-msg-error";
          botDiv.textContent = errorCopy[code] || "Er ging iets mis. Probeer het opnieuw.";
        }
        if (hideOn.indexOf(code) !== -1) chatWidget.hidden = true;
      })
      .finally(function () {
        sending = false;
        chatSubmitBtn.disabled = false;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
  });
})();

(function () {
  var items = document.querySelectorAll(".faq-item");
  for (var i = 0; i < items.length; i++) {
    (function (item) {
      var btn = item.querySelector(".faq-q");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    })(items[i]);
  }
})();

(function () {
  document.querySelectorAll(".device-photo").forEach(function (photo) {
    var img = photo.querySelector("img");
    var swatches = photo.querySelectorAll(".color-swatch");
    if (!img || !swatches.length) return;
    var selectedSrc = img.getAttribute("src");
    swatches.forEach(function (sw) {
      sw.addEventListener("mouseenter", function () {
        img.setAttribute("src", sw.dataset.src);
      });
      sw.addEventListener("mouseleave", function () {
        img.setAttribute("src", selectedSrc);
      });
      sw.addEventListener("click", function (e) {
        e.preventDefault();
        selectedSrc = sw.dataset.src;
        img.setAttribute("src", selectedSrc);
        swatches.forEach(function (s) {
          s.classList.remove("active");
        });
        sw.classList.add("active");
      });
    });
  });
})();

(function () {
  function load(img) {
    if (img && !img.getAttribute("src") && img.dataset.src) img.setAttribute("src", img.dataset.src);
  }
  document.querySelectorAll("[data-rotate]").forEach(function (box) {
    var imgs = box.querySelectorAll("img.rot");
    if (imgs.length < 2) return;
    var i = 0,
      every = parseInt(box.dataset.rotate, 10) || 5000,
      delay = parseInt(box.dataset.rotateDelay, 10) || 0;
    load(imgs[1]);
    function step() {
      if (document.hidden) return;
      var next = (i + 1) % imgs.length;
      load(imgs[next]);
      imgs[i].classList.remove("on");
      imgs[next].classList.add("on");
      i = next;
      load(imgs[(i + 1) % imgs.length]);
    }
    setTimeout(function () {
      setInterval(step, every);
    }, delay);
  });
})();

(function () {
  var frames = document.querySelectorAll("[data-carousel]");
  frames.forEach(function (frame) {
    var track = frame.querySelector(".carousel-track");
    var viewport = frame.querySelector(".carousel-viewport");
    var dotsWrap = frame.querySelector(".carousel-dots");
    if (!track || !viewport || !dotsWrap) return;
    var slides = frame.querySelectorAll(".carousel-slide");
    if (!slides.length) return;

    var i = 0;
    var interval = parseInt(frame.dataset.interval, 10) || 10000;
    var timer = null;

    function render() {
      track.style.transform = "translateX(-" + i * 100 + "%)";
      dotsWrap.querySelectorAll(".carousel-dot").forEach(function (d, idx) {
        d.classList.toggle("active", idx === i);
      });
      if (counter) counter.textContent = i + 1 + " / " + slides.length;
    }
    function goTo(idx) {
      i = (idx + slides.length) % slides.length;
      render();
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (slides.length > 1)
        timer = setInterval(function () {
          goTo(i + 1);
        }, interval);
    }

    var counter = null;
    if (slides.length > 12) {
      counter = document.createElement("span");
      counter.className = "carousel-count";
      dotsWrap.appendChild(counter);
    }
    if (slides.length > 1) {
      viewport.classList.add("has-multi");
      if (!counter)
        slides.forEach(function (_, idx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
          dot.setAttribute("aria-label", "Foto " + (idx + 1) + " van " + slides.length);
          dot.addEventListener("click", function () {
            goTo(idx);
            restart();
          });
          dotsWrap.appendChild(dot);
        });
      var prevBtn = frame.querySelector(".carousel-prev");
      var nextBtn = frame.querySelector(".carousel-next");
      if (prevBtn)
        prevBtn.addEventListener("click", function () {
          goTo(i - 1);
          restart();
        });
      if (nextBtn)
        nextBtn.addEventListener("click", function () {
          goTo(i + 1);
          restart();
        });
    }

    render();
    restart();
  });
})();

// =====================================================================
// FILTERKNOPPEN (toestellen en realisaties)
// Toestellen: kaarten hebben data-brand en data-type ("wand", "vloer",
// "multi", soms meerdere). Realisaties: foto's hebben data-cat en
// data-brand. Knoppen met dezelfde data-group sluiten elkaar uit.
// =====================================================================
(function () {
  document.querySelectorAll("[data-chips]").forEach(function (bar) {
    var kind = bar.getAttribute("data-chips");
    var section = bar.closest("section") || document;
    var count = bar.querySelector(".v2-count");
    var chips = bar.querySelectorAll(".v2-chip");
    var sel = {};

    // de balk plakt net onder de menubalk
    function setTop() {
      var h = document.querySelector("header.site");
      if (!h) return;
      var st = h.querySelector(".v2-topstrip");
      bar.style.top = h.offsetHeight - (st ? st.offsetHeight : 0) - 1 + "px";
    }
    setTop();
    window.addEventListener("resize", setTop);

    function scrollToTop() {
      var top = bar.getBoundingClientRect().top;
      var stickyTop = parseFloat(getComputedStyle(bar).top) || 0;
      // alleen terugspringen als de balk al vast bovenaan hangt
      if (top <= stickyTop + 1) {
        var y = section.getBoundingClientRect().top + window.scrollY - stickyTop + 1;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }

    function applyToestellen() {
      var n = 0;
      section.querySelectorAll(".device-card").forEach(function (card) {
        var okBrand = !sel.brand || card.dataset.brand === sel.brand;
        var okType = !sel.type || (card.dataset.type || "").split(" ").indexOf(sel.type) !== -1;
        card.hidden = !(okBrand && okType);
        if (!card.hidden) n++;
      });
      section.querySelectorAll(".devices").forEach(function (devices) {
        var any = !!devices.querySelector(".device-card:not([hidden])");
        devices.hidden = !any;
        var sub = devices.previousElementSibling;
        if (sub && sub.classList.contains("brand-sub")) sub.hidden = !any;
      });
      section.querySelectorAll(".brand-block").forEach(function (blockEl) {
        blockEl.hidden = !blockEl.querySelector(".device-card:not([hidden])");
      });
      if (count) count.textContent = n + (n === 1 ? " model" : " modellen");
    }

    function applyRealisaties() {
      var gallery = section.querySelector("[data-gallery]");
      if (!gallery) return;
      gallery.dispatchEvent(new CustomEvent("v2filter", { detail: sel }));
    }

    function apply() {
      if (kind === "toestellen") applyToestellen();
      else applyRealisaties();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var g = chip.dataset.group;
        var v = chip.dataset.value;
        // "Alle" bij realisaties zet alles terug
        if (kind === "realisaties" && g === "cat" && !v) sel = {};
        else if (sel[g] === v && v) sel[g] = "";
        else sel[g] = v;
        chips.forEach(function (c) {
          var cv = c.dataset.value;
          var cg = c.dataset.group;
          c.classList.toggle("on", cv ? sel[cg] === cv : !sel[cg] && (kind === "toestellen" || cg === "cat"));
        });
        apply();
        scrollToTop();
      });
    });
    apply();
    bar.v2count = count;
  });
})();

// =====================================================================
// REALISATIES: fotoraster met "Toon meer" en een fotoviewer (groot beeld)
// =====================================================================
(function () {
  var box = null,
    boxImg,
    boxCap,
    list = [],
    idx = 0;

  function build() {
    box = document.createElement("div");
    box.className = "v2-lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Foto groot bekijken");
    box.innerHTML =
      '<button type="button" class="v2-lb-btn v2-lb-close" aria-label="Sluiten">&times;</button>' +
      '<button type="button" class="v2-lb-btn v2-lb-prev" aria-label="Vorige foto">&lsaquo;</button>' +
      '<img alt=""><p></p>' +
      '<button type="button" class="v2-lb-btn v2-lb-next" aria-label="Volgende foto">&rsaquo;</button>';
    document.body.appendChild(box);
    boxImg = box.querySelector("img");
    boxCap = box.querySelector("p");
    box.querySelector(".v2-lb-close").addEventListener("click", close);
    box.querySelector(".v2-lb-prev").addEventListener("click", function () {
      show(idx - 1);
    });
    box.querySelector(".v2-lb-next").addEventListener("click", function () {
      show(idx + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    var sx = null;
    box.addEventListener(
      "touchstart",
      function (e) {
        sx = e.touches[0].clientX;
      },
      { passive: true }
    );
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  function show(i) {
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    var el = list[idx];
    var img = el.querySelector("img");
    if (img.dataset.src && !img.getAttribute("src")) img.setAttribute("src", img.dataset.src);
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    boxCap.textContent = el.dataset.cap || img.alt;
    var multi = list.length > 1;
    box.querySelector(".v2-lb-prev").hidden = !multi;
    box.querySelector(".v2-lb-next").hidden = !multi;
  }
  function open(items, i) {
    if (!box) build();
    list = items;
    show(i);
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".v2-lb-close").focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.style.overflow = "";
  }

  // fotoraster
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var figs = Array.prototype.slice.call(gallery.querySelectorAll("figure"));
    var stepN = parseInt(gallery.dataset.step, 10) || 16;
    var shown = stepN;
    var sel = {};
    var section = gallery.closest("section") || document;
    var moreBtn = section.querySelector("[data-gallery-more]");
    var count = section.querySelector("[data-chips] .v2-count");

    function matches(f) {
      var cats = (f.dataset.cat || "").split(" ");
      return (!sel.cat || cats.indexOf(sel.cat) !== -1) && (!sel.brand || f.dataset.brand === sel.brand);
    }
    function render() {
      var n = 0;
      figs.forEach(function (f) {
        var ok = matches(f);
        if (ok) n++;
        f.hidden = !(ok && n <= shown);
      });
      if (moreBtn) moreBtn.parentNode.hidden = n <= shown;
      if (count) count.textContent = n + (n === 1 ? " foto" : " foto's");
    }
    gallery.addEventListener("v2filter", function (e) {
      sel = e.detail || {};
      shown = stepN;
      render();
    });
    if (moreBtn)
      moreBtn.addEventListener("click", function () {
        shown += stepN;
        render();
      });
    gallery.addEventListener("click", function (e) {
      var f = e.target.closest("figure");
      if (!f) return;
      var visible = figs.filter(function (x) {
        return !x.hidden;
      });
      open(visible, visible.indexOf(f));
    });
    render();
  });

  // kleine fotoblokken (bv. "Zo sluiten we aan")
  document.querySelectorAll("[data-lightbox-group]").forEach(function (grp) {
    var items = Array.prototype.slice.call(grp.querySelectorAll("button"));
    items.forEach(function (b, i) {
      b.addEventListener("click", function () {
        open(items, i);
      });
    });
  });
})();

// =====================================================================
// TOESTELLEN: MERK, CATEGORIE EN ZOEKEN
// Eerst kiest de bezoeker een merk: met de tegels bovenaan de lijst of
// via het menu onder "Toestellen". Daarna verschijnen links de categorieën
// van dat merk. Een kaart hoort bij een categorie via
//   data-category: "single" en/of "multi" (leeg = geen split-systeem)
//   data-type:     een soort uit RT_SOORTEN hieronder ("wand", "cassette",
//                  "monoblock", "boiler", "buiten" ...)
// Een categorie zonder toestellen bij het gekozen merk wordt niet getoond.
// De zoekbalk zoekt in alle merken tegelijk (naam, reeks, typecodes,
// vermogen ...); een woord als "cassette" of "buitenunit" toont die soort.
// =====================================================================
var RT_MERKEN = {
  daikin: "Daikin",
  lg: "LG",
  me: "Mitsubishi Electric",
  mhi: "Mitsubishi Heavy Industries",
  nuova: "Nuova",
  toshiba: "Toshiba",
};
// Logo per merk (assets/img/logo-....svg), voor de merktegels en de koppen in de lijst
var RT_LOGOS = {
  daikin: "logo-daikin.svg",
  lg: "logo-lg.svg",
  me: "logo-mitsubishi-electric.svg",
  mhi: "logo-mhi.svg",
  nuova: "logo-nuova.svg",
  toshiba: "logo-toshiba.svg",
};
// Soort toestel (data-type) en de groep waartoe het hoort. Zo ziet de bezoeker
// meteen of het een split-airco is (binnen- én buitenunit) of niet.
var RT_SOORTEN = [
  { type: "wand", groep: "split", titel: "Wandmodellen" },
  { type: "vloer", groep: "split", titel: "Vloermodellen" },
  { type: "cassette", groep: "split", titel: "Cassettes" },
  { type: "kanaal", groep: "split", titel: "Kanaal- en inbouwunits" },
  { type: "plafond", groep: "split", titel: "Plafondmodellen" },
  { type: "zuil", groep: "split", titel: "Zuilmodellen" },
  { type: "monoblock", groep: "zonder", titel: "Monoblock, zonder buitenunit" },
  { type: "mobiel", groep: "zonder", titel: "Mobiele airco's" },
  { type: "boiler", groep: "water", titel: "Warmtepompboilers" },
  { type: "buiten", groep: "buiten", titel: "Buitenunits voor multi-split" },
];
function rtGroep(type) {
  for (var i = 0; i < RT_SOORTEN.length; i++) if (RT_SOORTEN[i].type === type) return RT_SOORTEN[i].groep;
  return "split";
}
(function () {
  var section = document.getElementById("alle-toestellen");
  var lijst = document.getElementById("toestellen-lijst");
  if (!section || !lijst) return;
  var catBox = lijst.querySelector(".cat-list");
  var zoek = document.getElementById("toestel-zoek");
  var zoekInfo = section.querySelector(".zoek-info");
  var leeg = lijst.querySelector(".zoek-leeg");
  var cards = Array.prototype.slice.call(section.querySelectorAll(".device-card"));

  // Binnen elk merk de kaarten altijd in dezelfde volgorde zetten, per soort
  // (zie RT_SOORTEN). Een nieuwe kaart mag dus overal in het merkblok staan.
  section.querySelectorAll(".brand-block").forEach(function (blk) {
    var eigen = Array.prototype.slice.call(blk.querySelectorAll(".device-card"));
    blk.querySelectorAll(".brand-sub, .devices").forEach(function (el) {
      el.parentNode.removeChild(el);
    });
    var merk = eigen.length ? eigen[0].dataset.brand : "";
    var kop = blk.querySelector(".brand-heading");
    if (kop && RT_LOGOS[merk]) {
      kop.innerHTML = "";
      var logo = document.createElement("img");
      logo.className = "brand-logo";
      logo.src = "assets/img/" + RT_LOGOS[merk];
      // het logo bevat de merknaam al, dus geen aparte tekst ernaast
      logo.alt = RT_MERKEN[merk] || "";
      kop.appendChild(logo);
    }
    RT_SOORTEN.forEach(function (s) {
      var hier = eigen.filter(function (c) {
        return c.dataset.type === s.type;
      });
      if (!hier.length) return;
      var sub = document.createElement("div");
      sub.className = "brand-sub brand-sub-" + s.groep;
      sub.textContent = s.titel;
      if (s.groep === "buiten") {
        var noot = document.createElement("small");
        noot.textContent = "Een buitenunit koopt u altijd samen met de binnenunits. Wij kiezen de juiste voor u.";
        sub.appendChild(noot);
      }
      var grid = document.createElement("div");
      grid.className = "devices";
      hier.forEach(function (c) {
        grid.appendChild(c);
      });
      blk.appendChild(sub);
      blk.appendChild(grid);
    });
  });

  // zoektekst per kaart: merknaam + alles wat op de kaart staat
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/(\d)[.,](\d)/g, "$1,$2")
      .replace(/\s+/g, " ");
  }
  cards.forEach(function (c) {
    c._zoek = norm((RT_MERKEN[c.dataset.brand] || "") + " " + (c.dataset.brand === "mhi" ? "mhi " : "") + c.textContent);
  });

  function heeft(card, cat) {
    return (card.dataset.category || "").split(" ").indexOf(cat) !== -1;
  }
  function soort(type) {
    return function (card) {
      return card.dataset.type === type;
    };
  }
  // De linkerkolom. Losse buitenunits staan apart: ze horen niet bij
  // "Alle toestellen" (behalve bij zoeken), want je koopt ze altijd samen
  // met binnenunits.
  var CATS = [
    { id: "alle", label: "Alle toestellen", test: function (c) { return !!state.q || c.dataset.type !== "buiten"; } },
    { kop: "Split-airco", sub: "binnen- én buitenunit" },
    { id: "wand", label: "Wandmodellen", test: soort("wand") },
    { id: "vloer", label: "Vloermodellen", test: soort("vloer") },
    { id: "cassette", label: "Cassettes", test: soort("cassette") },
    { id: "kanaal", label: "Kanaal- en inbouwunits", test: soort("kanaal") },
    { id: "plafond", label: "Plafond- en zuilmodellen", test: function (c) { return c.dataset.type === "plafond" || c.dataset.type === "zuil"; } },
    { kop: "Zonder buitenunit", sub: "alles zit in één toestel" },
    { id: "monoblock", label: "Monoblock (vaste airco)", test: soort("monoblock") },
    { id: "mobiel", label: "Mobiele airco's", test: soort("mobiel") },
    { kop: "Warm water" },
    { id: "boiler", label: "Warmtepompboilers", test: soort("boiler") },
    { kop: "Voor hoeveel kamers?", sub: "multi-split: meerdere binnenunits op één buitenunit" },
    { id: "single", label: "Eén kamer (single-split)", test: function (c) { return heeft(c, "single"); } },
    { id: "multi", label: "Meerdere kamers (multi-split)", test: function (c) { return heeft(c, "multi") && c.dataset.type !== "buiten"; } },
    { kop: "Losse onderdelen" },
    { id: "buiten", label: "Multi-split buitenunits", test: soort("buiten") },
  ];
  function zoekCat(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return CATS[0];
  }

  var state = { merk: null, cat: "alle", q: "" };
  function vanMerk(card) {
    return state.merk === "alle" || card.dataset.brand === state.merk;
  }
  // Zoekwoorden die een soort toestel betekenen. Wie "buitenunit" of
  // "cassette" typt, krijgt enkel die toestellen, niet elk toestel waar
  // het woord ergens in de tekst staat.
  var SOORT_WOORDEN = {
    buitenunit: ["buiten"], buitenunits: ["buiten"], buitendeel: ["buiten"],
    wandmodel: ["wand"], wandmodellen: ["wand"], wandunit: ["wand"],
    vloermodel: ["vloer"], vloermodellen: ["vloer"], console: ["vloer"],
    cassette: ["cassette"], cassettes: ["cassette"],
    kanaal: ["kanaal"], kanaalunit: ["kanaal"], kanaalunits: ["kanaal"], inbouw: ["kanaal"], inbouwunit: ["kanaal"], duct: ["kanaal"],
    plafond: ["plafond", "cassette"], plafondmodel: ["plafond"], plafondmodellen: ["plafond"],
    zuil: ["zuil"], zuilmodel: ["zuil"],
    monoblock: ["monoblock"], monoblok: ["monoblock"],
    mobiel: ["mobiel"], mobiele: ["mobiel"],
    boiler: ["boiler"], boilers: ["boiler"], warmtepompboiler: ["boiler"], warmtepompboilers: ["boiler"],
  };
  function past(card) {
    if (!state.q) return true;
    var woorden = norm(state.q).trim().split(" ");
    for (var i = 0; i < woorden.length; i++) {
      var w = woorden[i];
      if (SOORT_WOORDEN.hasOwnProperty(w)) {
        if (SOORT_WOORDEN[w].indexOf(card.dataset.type) === -1) return false;
      } else if (w === "multi" || w === "multisplit" || w === "multi-split") {
        if (!heeft(card, "multi")) return false;
      } else if (w === "single" || w === "singlesplit" || w === "single-split") {
        if (!heeft(card, "single")) return false;
      } else if (card._zoek.indexOf(w) === -1) return false;
    }
    return true;
  }

  // aantal modellen op elke merktegel (zonder losse buitenunits)
  section.querySelectorAll(".merk-tegel").forEach(function (t) {
    var n = cards.filter(function (c) {
      return c.dataset.brand === t.dataset.merk && c.dataset.type !== "buiten";
    }).length;
    t.querySelector(".merk-n").textContent = n + (n === 1 ? " model" : " modellen");
  });

  function render() {
    section.querySelectorAll(".merk-keuze [data-merk], .merk-alle [data-merk]").forEach(function (b) {
      var on = b.dataset.merk === state.merk;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    section.classList.toggle("merk-gekozen", !!state.merk);
    lijst.hidden = !state.merk;
    // op de gsm staan de tegels dan in één schuifrij: het gekozen merk in het midden
    var rij = section.querySelector(".merk-keuze");
    var aan = rij && rij.querySelector(".merk-tegel.on");
    if (aan && rij.scrollWidth > rij.clientWidth) {
      var a = aan.getBoundingClientRect();
      var r = rij.getBoundingClientRect();
      rij.scrollLeft += a.left - r.left - (r.width - a.width) / 2;
    }
    if (zoekInfo) zoekInfo.textContent = "";
    if (!state.merk) return;

    // categorieën van dit merk (en deze zoekopdracht), met het aantal toestellen
    var mijn = cards.filter(function (c) {
      return vanMerk(c) && past(c);
    });
    catBox.innerHTML = "";
    var kop = null;
    var gevonden = false;
    CATS.forEach(function (cat) {
      if (cat.kop) {
        kop = document.createElement("h4");
        kop.textContent = cat.kop;
        if (cat.sub) {
          var uitleg = document.createElement("small");
          uitleg.textContent = cat.sub;
          kop.appendChild(uitleg);
        }
        return;
      }
      var n = mijn.filter(cat.test).length;
      if (!n && cat.id !== "alle") return;
      if (kop) {
        catBox.appendChild(kop);
        kop = null;
      }
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cat-btn";
      b.dataset.cat = cat.id;
      var naam = document.createElement("span");
      naam.textContent = cat.label;
      var aantal = document.createElement("em");
      aantal.textContent = n;
      b.appendChild(naam);
      b.appendChild(aantal);
      catBox.appendChild(b);
      if (cat.id === state.cat) gevonden = true;
    });
    if (!gevonden) state.cat = "alle";
    catBox.querySelectorAll(".cat-btn").forEach(function (b) {
      var on = b.dataset.cat === state.cat;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // kaarten tonen of verbergen, lege groepen ook verbergen
    var test = zoekCat(state.cat).test;
    var zichtbaar = 0;
    cards.forEach(function (c) {
      c.hidden = !(vanMerk(c) && past(c) && test(c));
      if (!c.hidden) zichtbaar++;
    });
    section.querySelectorAll(".brand-sub").forEach(function (sub) {
      var devices = sub.nextElementSibling;
      if (devices && devices.classList.contains("devices")) {
        var iets = !!devices.querySelector(".device-card:not([hidden])");
        sub.hidden = !iets;
        devices.hidden = !iets;
      }
    });
    section.querySelectorAll(".brand-block").forEach(function (blk) {
      blk.hidden = !blk.querySelector(".device-card:not([hidden])");
    });

    if (state.q && zoekInfo) {
      zoekInfo.textContent = zichtbaar
        ? zichtbaar + (zichtbaar === 1 ? " toestel gevonden" : " toestellen gevonden")
        : "Geen toestellen gevonden";
    }
    if (leeg) leeg.hidden = zichtbaar > 0;

    // knop op de gsm toont de gekozen categorie
    var fb = section.querySelector(".v4-filterbtn");
    if (fb && fb.lastChild) fb.lastChild.nodeValue = "Categorie: " + zoekCat(state.cat).label;
  }

  function naarLijst() {
    var y = lijst.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // merk kiezen. houdCat: de gekozen categorie bewaren (bv. terug vanuit een toestel)
  window.rtKiesMerk = function (merk, houdCat) {
    if (state.merk !== merk || !houdCat) state.cat = "alle";
    state.merk = merk;
    merkVoorZoeken = undefined;
    render();
  };

  // merktegels en "alle merken"
  section.querySelectorAll(".merk-keuze [data-merk], .merk-alle [data-merk]").forEach(function (b) {
    b.addEventListener("click", function () {
      window.rtKiesMerk(b.dataset.merk);
      requestAnimationFrame(naarLijst);
    });
  });

  // categorie kiezen
  catBox.addEventListener("click", function (e) {
    var b = e.target.closest(".cat-btn");
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
    var side = lijst.querySelector(".toestellen-sidebar");
    var fb = section.querySelector(".v4-filterbtn");
    if (side && side.classList.contains("v4-open")) {
      side.classList.remove("v4-open");
      if (fb) fb.setAttribute("aria-expanded", "false");
    }
    if (lijst.getBoundingClientRect().top < 0) naarLijst();
  });

  // zoeken: zoekt altijd in alle merken. Wordt de zoekterm gewist, dan
  // komt het merk terug dat voordien gekozen was.
  var merkVoorZoeken; // undefined: niets om terug te zetten (null: geen merk gekozen)
  function zoekNaar(q) {
    if (q && !state.q) {
      merkVoorZoeken = state.merk;
      state.cat = "alle";
    }
    state.q = q;
    if (q) state.merk = "alle";
    else if (merkVoorZoeken !== undefined) {
      state.merk = merkVoorZoeken;
      merkVoorZoeken = undefined;
    }
    render();
  }
  if (zoek) {
    var wacht = null;
    zoek.addEventListener("input", function () {
      clearTimeout(wacht);
      wacht = setTimeout(function () {
        zoekNaar(zoek.value.trim());
      }, 150);
    });
    zoek.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        naarLijst();
      }
      if (e.key === "Escape") {
        zoek.value = "";
        zoekNaar("");
      }
    });
  }
  var wis = lijst.querySelector(".zoek-wis");
  if (wis)
    wis.addEventListener("click", function () {
      if (zoek) zoek.value = "";
      merkVoorZoeken = undefined;
      state.q = "";
      state.merk = "alle";
      render();
    });

  // links met data-merk elders op de site (menu onder "Toestellen", detailpagina).
  // De algemene navigatie opent daarna zelf de pagina Toestellen en scrolt
  // naar de lijst (#toestellen-lijst).
  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest("a[data-merk]");
      if (!a) return;
      window.rtKiesMerk(a.dataset.merk, a.hasAttribute("data-houd"));
      var dd = a.closest(".nav-dd");
      if (dd) dd.classList.add("dicht");
      a.blur();
    },
    true
  );
  document.querySelectorAll(".nav-dd").forEach(function (dd) {
    dd.addEventListener("mouseleave", function () {
      dd.classList.remove("dicht");
    });
  });

  render();
})();

// =====================================================================
// TOESTELLEN: COMPACTE KAARTEN EN EEN DETAILPAGINA PER TOESTEL
// In de lijst toont een kaart enkel de foto, de naam, een korte uitleg en
// drie kerngegevens. Alle specificaties staan op de detailpagina
// (#toestel-<naam>), die opgebouwd wordt uit dezelfde kaart. Zo hoeft een
// toestel maar op één plaats in index.html te staan.
// =====================================================================
(function () {
  var section = document.getElementById("alle-toestellen");
  var detail = document.getElementById("toestel-detail");
  if (!section || !detail) return;
  var cards = Array.prototype.slice.call(section.querySelectorAll(".device-card"));
  var bySlug = {};

  var TYPES = {
    wand: "Wandmodel",
    vloer: "Vloermodel",
    cassette: "Cassette",
    kanaal: "Kanaal- of inbouwunit",
    plafond: "Plafondmodel",
    zuil: "Zuilmodel",
    monoblock: "Zonder buitenunit",
    mobiel: "Mobiele airco",
    buiten: "Buitenunit",
    boiler: "Warmtepompboiler",
  };
  // Label op de foto: is het een split-airco of niet?
  var BADGES = {
    split: "Binnen- + buitenunit",
    zonder: "Zonder buitenunit",
    buiten: "Buitenunit",
    water: "Warm water",
  };
  // Eén zin in gewone taal onder het label van de kaart
  function voorWie(card) {
    var t = card.dataset.type,
      s = heeft(card, "single"),
      m = heeft(card, "multi");
    if (t === "buiten") return "Wordt gecombineerd met meerdere binnenunits";
    if (t === "monoblock") return "Alles in één toestel, geen buitenunit aan de gevel";
    if (t === "mobiel") return "Verplaatsbaar, met een afvoerslang naar buiten";
    if (t === "boiler") return "Voor warm water in keuken en badkamer";
    if (s && m) return "Voor 1 kamer, of meerdere kamers op 1 buitenunit";
    if (s) return "Voor 1 kamer, met een eigen buitenunit";
    if (m) return "Binnenunit voor multi-split (meerdere kamers)";
    return "";
  }
  var UITLEG = {
    wand:
      "Een wandmodel hangt hoog aan de muur. Via een kleine doorvoer in de muur is het met leidingen verbonden met de buitenunit. Het is de meest gekozen oplossing: snel geplaatst en met een goede luchtverdeling.",
    vloer:
      "Een vloermodel staat laag tegen de muur, bijvoorbeeld onder een raam. Handig als er boven geen plaats is, of in een slaapkamer onder een schuin dak. Bij verwarmen komt de warme lucht dicht bij de vloer, waar u ze het meest voelt.",
    cassette:
      "Een cassette wordt ingebouwd in een verlaagd plafond. Alleen het rooster blijft zichtbaar en de lucht gaat naar meerdere kanten tegelijk. Geschikt voor grotere ruimtes zoals een leefruimte, winkel of kantoor.",
    kanaal:
      "Een kanaal- of inbouwunit zit volledig uit het zicht, in een verlaagd plafond, een kast of een technische ruimte. De lucht komt via roosters de kamer in. Dit vraagt wat meer voorbereiding, die we tijdens het plaatsbezoek samen bekijken.",
    monoblock:
      "Bij een monoblock zit alles in één toestel binnen. Er komt geen buitenunit aan de gevel, wel twee ronde doorvoeren door de buitenmuur. Een oplossing voor appartementen of gevels waar een buitenunit niet mag of niet kan.",
    buiten:
      "Op deze buitenunit sluit u meerdere binnenunits aan: één per kamer. Zo hebt u maar één toestel aan de gevel voor het hele huis. Het totale vermogen van de binnenunits moet passen bij de buitenunit; dat rekenen we voor u uit.",
    boiler:
      "Een warmtepompboiler verwarmt uw tapwater met warmte uit de lucht, in plaats van alleen met een elektrische weerstand. Hij staat meestal in een berging, garage of technische ruimte en vervangt een klassieke elektrische boiler.",
    plafond:
      "Een plafondmodel hangt zichtbaar onder het plafond en blaast de lucht ver de ruimte in. Een goede keuze voor grote ruimtes zonder verlaagd plafond, zoals een zaak, kantoor of grote leefruimte.",
    zuil:
      "Een zuilmodel staat als een smalle kast op de vloer en blaast de lucht krachtig en ver de ruimte in. Bedoeld voor grote ruimtes zoals een winkel, zaal of showroom.",
    mobiel:
      "Een mobiele airco staat op wieltjes en gaat gewoon in het stopcontact. De warme lucht gaat via een slang naar buiten, bijvoorbeeld door een raam. Handig als tijdelijke oplossing, maar luider en minder zuinig dan een vaste airco.",
  };

  function slug(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  function heeft(card, cat) {
    return (card.dataset.category || "").split(" ").indexOf(cat) !== -1;
  }
  function spec(card, labels) {
    var rows = card.querySelectorAll(".device-specs > div");
    for (var i = 0; i < rows.length; i++) {
      var s = rows[i].querySelectorAll("span");
      if (s.length < 2) continue;
      var lab = s[0].textContent.trim();
      if (labels.indexOf(lab) !== -1) return s[s.length - 1].textContent.trim();
    }
    return "";
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // drie kerngegevens voor de kaart in de lijst
  function kernen(card) {
    var out = [];
    // vermogen: van het kleinste tot het grootste model
    var kw = spec(card, ["Koelvermogen", "Totaalvermogen", "Vermogen"]).replace(/\(bereik[^)]*\)/g, "");
    var nums = (kw.match(/\d+,\d/g) || []).map(function (n) {
      return parseFloat(n.replace(",", "."));
    });
    if (nums.length) {
      var lo = Math.min.apply(null, nums),
        hi = Math.max.apply(null, nums);
      var f = function (n) {
        return n.toFixed(1).replace(".", ",");
      };
      out.push(lo === hi ? f(lo) + " kW" : f(lo) + " - " + f(hi) + " kW");
    }
    var inhoud = spec(card, ["Inhoud"]);
    if (inhoud) out.push((inhoud.match(/\d+ l/g) || []).join(" / "));
    // energielabel voor koelen (bij een bereik: "tot" het beste label)
    var labels = (spec(card, ["Energielabel"]).split("/")[0].match(/A\+*/g) || []).filter(function (l, i, a) {
      return a.indexOf(l) === i;
    });
    if (labels.length) {
      var best = labels.sort(function (a, b) {
        return b.length - a.length;
      })[0];
      out.push(labels.length > 1 ? "tot " + best : "label " + best);
    }
    // aantal binnenunits bij een multi-split buitenunit
    var pt = spec(card, ["Aantal binnenunits"]) + " " + card.querySelector("h3").textContent;
    var p = pt.match(/(\d) tot (\d)/) || pt.match(/(\d) poorten/);
    if (card.dataset.type === "buiten" && p) out.push(p[2] ? p[1] + " tot " + p[2] + " binnenunits" : p[1] + " binnenunits");
    // geluid: alleen als er een bereik vermeld is
    var dB = spec(card, ["Geluidsniveau binnen"]);
    var d = dB.match(/\d+(,\d+)?/);
    if (d && /[-\/]|vanaf/.test(dB) && !/^tot/.test(dB)) out.push("vanaf " + d[0] + " dB");
    return out.filter(Boolean).slice(0, 3);
  }

  // ---------- kaarten in de lijst compact maken ----------
  cards.forEach(function (card) {
    var cta = card.querySelector(".device-cta");
    var h3 = card.querySelector("h3");
    var id = slug(cta ? cta.dataset.model : h3.textContent);
    card.dataset.slug = id;
    bySlug[id] = card;

    // label (split of niet): op de computer over de foto, op de gsm naast de foto
    var groep = rtGroep(card.dataset.type);
    var foto = card.querySelector(".device-photo");
    var badge = el("span", "device-badge badge-" + groep, BADGES[groep]);
    card.insertBefore(badge, foto ? foto.nextSibling : card.firstChild);
    // en een zin in gewone taal onder de naam
    var wie = voorWie(card);
    var k = kernen(card);
    var keys = el("div", "device-keys");
    k.forEach(function (t) {
      keys.appendChild(el("span", null, t));
    });
    var meer = el("a", "device-more", "Bekijk details");
    meer.href = "#toestel-" + id;
    meer.appendChild(el("span", "ar", " →"));
    if (wie) card.insertBefore(el("div", "device-sys", wie), h3.nextSibling);
    card.insertBefore(keys, cta);
    card.insertBefore(meer, cta);
  });

  // ganse kaart klikbaar (behalve kleurknoppen en links)
  section.addEventListener("click", function (e) {
    var card = e.target.closest(".device-card");
    if (!card || e.target.closest("a, button")) return;
    var a = card.querySelector(".device-more");
    if (a) a.click();
  });

  // ---------- detailpagina ----------
  function vermogenTabel(card) {
    if (["wand", "vloer", "cassette", "kanaal", "plafond", "zuil", "monoblock"].indexOf(card.dataset.type) === -1) return null;
    var kw = spec(card, ["Koelvermogen"]);
    var nums = (kw.match(/\d+,\d/g) || [])
      .map(function (n) {
        return parseFloat(n.replace(",", "."));
      })
      .filter(function (n, i, a) {
        return n >= 1.4 && n <= 16 && a.indexOf(n) === i;
      })
      .sort(function (a, b) {
        return a - b;
      });
    if (!nums.length) return null;
    var box = el("div", "td-box");
    box.appendChild(el("h3", null, "Welk vermogen heb ik nodig?"));
    box.appendChild(
      el(
        "p",
        null,
        "Als vuistregel rekenen we 90 tot 120 watt per m², afhankelijk van de isolatie, de hoogte van het plafond en de ramen. Het exacte vermogen bepalen we samen tijdens het gratis plaatsbezoek."
      )
    );
    var t = el("table", "td-kw");
    var head = el("tr");
    head.appendChild(el("th", null, "Vermogen"));
    head.appendChild(el("th", null, "Richtwaarde ruimte"));
    t.appendChild(head);
    nums.forEach(function (n) {
      var tr = el("tr");
      tr.appendChild(el("td", null, n.toFixed(1).replace(".", ",") + " kW"));
      tr.appendChild(el("td", null, "ca. " + Math.round(n / 0.12) + " - " + Math.round(n / 0.09) + " m²"));
      t.appendChild(tr);
    });
    box.appendChild(t);
    return box;
  }

  function bouw(card) {
    var merk = card.dataset.brand;
    var merkNaam = RT_MERKEN[merk] || "";
    var h3 = card.querySelector("h3");
    var naam = h3.firstChild ? h3.firstChild.textContent.trim() : h3.textContent.trim();
    var sub = h3.querySelector(".device-sub");
    var cta = card.querySelector(".device-cta");
    var model = cta ? cta.dataset.model : merkNaam + " " + naam;
    detail.innerHTML = "";

    // kruimelpad en terug
    var crumb = el("nav", "v2-crumb td-crumb");
    crumb.setAttribute("aria-label", "Kruimelpad");
    var a1 = el("a", null, "Toestellen");
    a1.href = "#toestellen";
    var a2 = el("a", null, merkNaam);
    a2.href = "#toestellen-lijst";
    a2.dataset.merk = merk;
    a2.setAttribute("data-houd", "");
    crumb.appendChild(a1);
    crumb.appendChild(document.createTextNode(" › "));
    crumb.appendChild(a2);
    crumb.appendChild(document.createTextNode(" › "));
    crumb.appendChild(el("b", null, naam));
    detail.appendChild(crumb);

    // bovenaan: foto en de belangrijkste info
    var top = el("div", "td-top");
    var media = el("div", "td-media");
    var foto = card.querySelector(".device-photo").cloneNode(true);
    var img = foto.querySelector("img");
    if (img) {
      img.removeAttribute("loading");
      img.alt = merkNaam + " " + naam;
    }
    media.appendChild(foto);
    top.appendChild(media);

    var info = el("div", "td-info");
    info.appendChild(el("div", "device-brand", merkNaam + " · " + card.querySelector(".device-brand").textContent.replace(/^Airco · /, "")));
    var h1 = el("h1", null, naam);
    if (sub) h1.appendChild(el("span", "device-sub", " " + sub.textContent));
    info.appendChild(h1);
    var groep = rtGroep(card.dataset.type);
    var tags = el("div", "td-tags");
    tags.appendChild(el("span", "td-tag-" + groep, BADGES[groep]));
    if (card.dataset.type !== "buiten") tags.appendChild(el("span", null, TYPES[card.dataset.type] || ""));
    if (heeft(card, "single")) tags.appendChild(el("span", null, "Single-split"));
    if (heeft(card, "multi")) tags.appendChild(el("span", null, card.dataset.type === "buiten" ? "Voor multi-split" : "Multi-split"));
    info.appendChild(tags);
    var wie = voorWie(card);
    if (wie) info.appendChild(el("p", "td-wie", wie));
    info.appendChild(el("p", "td-desc", card.querySelector(".device-desc").textContent));
    var keys = el("div", "td-keys");
    kernen(card).forEach(function (t) {
      keys.appendChild(el("span", null, t));
    });
    info.appendChild(keys);
    var acts = el("div", "td-acts");
    var offerte = el("button", "btn btn-gold", "Offerte voor dit model ");
    offerte.type = "button";
    offerte.appendChild(el("span", "ar", "→"));
    offerte.addEventListener("click", function () {
      window.rtGoToOffer("nieuw", model);
    });
    var bel = el("a", "btn v3-btn-line", "Bel Rim");
    bel.href = "tel:+32491113313";
    acts.appendChild(offerte);
    // prijsadvies bovenaan de pagina Toestellen (enkel voor vaste airco's)
    if (["boiler", "mobiel"].indexOf(card.dataset.type) === -1) {
      var richt = el("a", "btn v3-btn-line", "Richtprijs berekenen");
      richt.href = "#prijs";
      acts.appendChild(richt);
    }
    acts.appendChild(bel);
    info.appendChild(acts);
    info.appendChild(el("p", "td-note", "Gratis plaatsbezoek · Rim belt u binnen 24 uur terug · U beslist pas na de offerte"));
    top.appendChild(info);
    detail.appendChild(top);

    // specificaties en meer uitleg
    var body = el("div", "td-body");
    var specs = el("div", "td-specs");
    specs.appendChild(el("h2", null, "Specificaties"));
    var dl = el("dl");
    card.querySelectorAll(".device-specs > div").forEach(function (row) {
      var s = row.querySelectorAll("span");
      if (s.length < 2) return;
      var dt = el("dt");
      dt.appendChild(s[0].cloneNode(true));
      dl.appendChild(dt);
      dl.appendChild(el("dd", null, s[s.length - 1].textContent));
    });
    specs.appendChild(dl);
    body.appendChild(specs);

    var side = el("div", "td-side");
    var kw = vermogenTabel(card);
    if (kw) side.appendChild(kw);
    var weet = el("div", "td-box");
    weet.appendChild(el("h3", null, "Goed om te weten"));
    if (UITLEG[card.dataset.type]) weet.appendChild(el("p", null, UITLEG[card.dataset.type]));
    if (heeft(card, "single") && heeft(card, "multi"))
      weet.appendChild(
        el(
          "p",
          null,
          "Dit toestel kan als single-split (één binnenunit op een eigen buitenunit) of als multi-split (meerdere binnenunits op één buitenunit). Wat het best past, hangt af van het aantal kamers en waar de buitenunit kan komen."
        )
      );
    side.appendChild(weet);
    body.appendChild(side);
    detail.appendChild(body);

    // andere toestellen van hetzelfde merk
    var andere = cards.filter(function (c) {
      return c !== card && c.dataset.brand === merk;
    });
    var zelfde = andere.filter(function (c) {
      return c.dataset.type === card.dataset.type;
    });
    var rest = andere.filter(function (c) {
      return c.dataset.type !== card.dataset.type;
    });
    var toon = zelfde.concat(rest).slice(0, 3);
    if (toon.length) {
      var meer = el("div", "td-meer");
      meer.appendChild(el("h2", null, "Meer van " + merkNaam));
      var grid = el("div", "td-meer-grid");
      toon.forEach(function (c) {
        var a = el("a", "td-mini");
        a.href = "#toestel-" + c.dataset.slug;
        var fi = c.querySelector(".device-photo img");
        if (fi) {
          var i = el("img");
          i.src = fi.getAttribute("src");
          i.alt = "";
          i.loading = "lazy";
          a.appendChild(i);
        }
        var ch3 = c.querySelector("h3");
        a.appendChild(el("b", null, ch3.firstChild ? ch3.firstChild.textContent.trim() : ch3.textContent.trim()));
        a.appendChild(el("span", null, kernen(c).join(" · ")));
        grid.appendChild(a);
      });
      meer.appendChild(grid);
      var alle = el("a", "td-alle", "Alle toestellen van " + merkNaam + " ");
      alle.href = "#toestellen-lijst";
      alle.dataset.merk = merk;
      alle.appendChild(el("span", "ar", "→"));
      meer.appendChild(alle);
      detail.appendChild(meer);
    }
  }

  // kleurknoppen op de detailpagina
  detail.addEventListener("click", function (e) {
    var sw = e.target.closest(".color-swatch");
    if (!sw) return;
    e.preventDefault();
    var img = detail.querySelector(".td-media img");
    if (img) img.setAttribute("src", sw.dataset.src);
    detail.querySelectorAll(".color-swatch").forEach(function (s) {
      s.classList.toggle("active", s === sw);
    });
  });

  // De navigatie (bovenaan dit bestand) vraagt via deze functie of een
  // #toestel-... link bestaat, en laat de detailpagina dan opbouwen.
  window.rtToestelInfo = function (id) {
    var card = bySlug[id];
    if (!card) return null;
    bouw(card);
    return { page: "toestel", scrollTo: null, hash: "toestel-" + id };
  };

  // rechtstreeks openen of vernieuwen op een #toestel-... adres
  var h = location.hash.replace("#", "");
  if (h.indexOf("toestel-") === 0 && window.rtToestelInfo(h.slice(8)) && window.goToPage) {
    window.goToPage("toestel", true, h);
  }
})();

// =====================================================================
// NEXT LEVEL v3: zachte animaties
//  - blokken met class "rv" schuiven zacht in beeld bij het scrollen
//  - cijfers met data-count tellen op (24 uur, 70 foto's)
//  - "Zo werkt het": de stap die in beeld is, licht op
// Wie in zijn toestel "minder beweging" heeft ingesteld, krijgt alles
// meteen zonder animatie te zien.
// =====================================================================
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("v3-anim");

  var rvObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          rvObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".rv").forEach(function (el) {
    rvObs.observe(el);
  });

  function countUp(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (!end) return;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          countUp(e.target);
          cObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) {
    cObs.observe(el);
  });

  var cards = document.querySelectorAll(".v3-scard");
  var prog = document.querySelectorAll(".v3-prog > div");
  if (cards.length) {
    var sObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var n = e.target.getAttribute("data-step");
          cards.forEach(function (c) {
            c.classList.toggle("on", c === e.target);
          });
          prog.forEach(function (p, i) {
            p.classList.toggle("on", String(i) === n);
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    cards.forEach(function (c) {
      sObs.observe(c);
    });
  }
})();

// =====================================================================
// LEVEND v4: seizoen (koelen/verwarmen), meebewegende lagen, reislijn,
// lichtvlek op kaarten, mini-balk, hulpkaarten en uitleg bij toestellen,
// filterknop op de gsm, foto's groot bekijken, bedankmoment contact.
// Alles is licht en respecteert "minder beweging" op het toestel.
// =====================================================================
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var body = document.body;

  // ---------- seizoen: van mei tot september koelen, anders verwarmen ----------
  var month = new Date().getMonth();
  var mode = month >= 4 && month <= 8 ? "cool" : "warm";
  var SUB = {
    cool: "Koel en stil, ook op de warmste zomerdag. Binnen 24 uur belt Rim u zelf terug en bespreekt hij wat bij uw woning past.",
    warm: "Behaaglijk warm deze winter, met een lucht/lucht-warmtepomp. Binnen 24 uur belt Rim u zelf terug en bespreekt hij wat bij uw woning past.",
  };
  var tempEl = document.getElementById("v4-temp");
  var lblEl = document.getElementById("v4-thlbl");
  var subEl = document.getElementById("v4-sub");
  var tVal = 21,
    tAnim = 0;
  function showTemp(v) {
    if (tempEl) tempEl.textContent = v.toFixed(1).replace(".", ",") + "°";
  }
  function animTemp(from, to) {
    cancelAnimationFrame(tAnim);
    if (reduce || !tempEl) {
      tVal = to;
      showTemp(to);
      return;
    }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1800);
      tVal = from + (to - from) * (1 - Math.pow(1 - p, 3));
      showTemp(tVal);
      if (p < 1) tAnim = requestAnimationFrame(step);
    }
    tAnim = requestAnimationFrame(step);
  }
  function setMode(next, first) {
    mode = next;
    body.classList.toggle("rt-warm", mode === "warm");
    body.classList.toggle("rt-cool", mode === "cool");
    document.querySelectorAll(".v4-mode button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-m") === mode ? "true" : "false");
    });
    if (lblEl) lblEl.textContent = mode === "warm" ? "Verwarmen naar" : "Koelen naar";
    // koelen loopt naar 16 graden, verwarmen naar 30 graden
    var target = mode === "warm" ? 30 : 16;
    animTemp(first ? (mode === "warm" ? 21 : 24) : tVal, target);
    if (subEl) {
      subEl.classList.add("out");
      setTimeout(
        function () {
          subEl.textContent = SUB[mode];
          subEl.classList.remove("out");
        },
        first ? 0 : 280
      );
    }
  }
  document.querySelectorAll(".v4-mode button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-m") !== mode) setMode(b.getAttribute("data-m"));
    });
  });
  setMode(mode, true);

  // ---------- lagen in de kop bewegen mee met de muis ----------
  var vis = document.getElementById("v4-visual");
  if (vis && fine && !reduce) {
    var hero = vis.closest("section");
    var layers = [
      [".v3-frame", 6],
      [".v3-main-ph", 10],
      [".v4-thermo", 20],
      [".v3-sub-ph", 24],
      [".v3-glass.g1", 28],
      [".v3-glass.g2", 18],
    ]
      .map(function (l) {
        return [vis.querySelector(l[0]), l[1]];
      })
      .filter(function (l) {
        return l[0];
      });
    hero.addEventListener("mousemove", function (e) {
      var r = vis.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width;
      var y = (e.clientY - r.top - r.height / 2) / r.height;
      layers.forEach(function (l) {
        l[0].style.translate = (-x * l[1]).toFixed(1) + "px " + (-y * l[1]).toFixed(1) + "px";
      });
    });
    hero.addEventListener("mouseleave", function () {
      layers.forEach(function (l) {
        l[0].style.translate = "";
      });
    });
  }

  // ---------- reislijn: de gouden lijn groeit mee bij het scrollen ----------
  var tracks = document.querySelectorAll(".v4-track");
  function drawTracks() {
    var vh = window.innerHeight;
    tracks.forEach(function (track) {
      if (!track.offsetParent) return;
      var fill = track.querySelector(".v4-fill");
      var stops = track.querySelectorAll(".v4-stop");
      var r = track.getBoundingClientRect();
      var len = r.height - 20;
      var prog = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.62 - r.top) / len));
      fill.style.height = prog * len + "px";
      var lineY = r.top + 10 + prog * len;
      stops.forEach(function (st) {
        var sr = st.getBoundingClientRect();
        st.classList.toggle("on", lineY >= sr.top + sr.height * 0.3 && lineY <= sr.bottom + 14);
        st.classList.toggle("past", lineY > sr.bottom + 14);
      });
    });
  }

  // ---------- mini-balk (laptop): na de kop, niet bij het formulier of onderaan ----------
  var mini = document.getElementById("v4-mini");
  function inView(el) {
    if (!el || !el.offsetParent) return false;
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  function updateMini() {
    if (!mini) return;
    var first = document.querySelector("section.page-active");
    var past = first && first.getBoundingClientRect().bottom < 60;
    var busy =
      inView(document.getElementById("calculator")) ||
      inView(document.querySelector("section.page-active #lead-form")) ||
      inView(document.querySelector("section.v2-bandsec.page-active")) ||
      inView(document.querySelector("footer"));
    var show = !!past && !busy;
    mini.classList.toggle("show", show);
    mini.setAttribute("aria-hidden", show ? "false" : "true");
    var a = mini.querySelector("a");
    if (a) a.tabIndex = show ? 0 : -1;
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      drawTracks();
      updateMini();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", onScroll);
  window.addEventListener("popstate", onScroll);
  document.addEventListener("click", function () {
    setTimeout(onScroll, 60);
  });
  onScroll();

  // ---------- lichtvlek waar de muis komt ----------
  if (fine) {
    document.querySelectorAll(".v3-tile:not(.big), .service, .device-card, .v4-ctile, .v4-stop").forEach(function (el) {
      el.classList.add("v4-glow");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  // ---------- toestellen: hulpkaart, uitleg bij termen, filterknop op de gsm ----------
  document.querySelectorAll(".brand-block").forEach(function (blk) {
    var grid = blk.querySelector(".devices");
    if (!grid || grid.querySelectorAll(".device-card").length < 3) return;
    var help = document.createElement("div");
    help.className = "v4-help";
    help.innerHTML =
      '<span class="v3-avatar"><img src="assets/img/rim-reijners.webp" alt="Rim Reijners"></span><h3>Twijfelt u tussen modellen?</h3><p>Rim helpt u kiezen tijdens het gratis plaatsbezoek. Hij kijkt naar uw ruimte, uw isolatie en waar het toestel kan hangen.</p>' +
      '<a class="btn btn-gold btn-sm" href="#calculator" data-start-dienst="nieuw">Gratis plaatsbezoek aanvragen <span class="ar">&rarr;</span></a>';
    grid.appendChild(help);
    help.querySelector("a").addEventListener("click", function (e) {
      e.preventDefault();
      window.rtGoToOffer("nieuw", "");
    });
  });
  var TIPS = {
    "SEER / SCOP": "Hoe zuinig het toestel is over een heel seizoen: SEER bij koelen, SCOP bij verwarmen. Hoe hoger, hoe zuiniger.",
    "EER / COP": "Hoe zuinig het toestel is op één moment: EER bij koelen, COP bij verwarmen. Hoe hoger, hoe zuiniger.",
    Energielabel: "Van A+++ (zuinigst) naar lager, apart voor koelen en verwarmen.",
    "Geluidsniveau binnen": "In dB(A). Fluisteren is ongeveer 30 dB(A); de stilste binnenunits draaien vanaf 19 dB(A).",
    "Geluidsniveau buiten": "In dB(A), gemeten aan de buitenunit.",
    Koudemiddel: "Het middel in het toestel dat de warmte verplaatst. R32 is het gangbare koudemiddel in nieuwe toestellen.",
  };
  document.querySelectorAll(".device-specs > div > span:first-child").forEach(function (sp) {
    var t = TIPS[sp.textContent.trim()];
    if (!t) return;
    sp.classList.add("v4-tip");
    sp.setAttribute("tabindex", "0");
    sp.setAttribute("data-tip", t);
    sp.setAttribute("aria-label", sp.textContent.trim() + ": " + t);
  });
  var side = document.querySelector(".toestellen-sidebar");
  if (side) {
    var fb = document.createElement("button");
    fb.type = "button";
    fb.className = "v4-filterbtn";
    fb.setAttribute("aria-expanded", "false");
    fb.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 5h18M6 12h12M10 19h4"/></svg>Kies een categorie';
    side.parentNode.insertBefore(fb, side);
    fb.addEventListener("click", function () {
      var open = side.classList.toggle("v4-open");
      fb.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---------- realisaties: foto groot bekijken ----------
  var box = null,
    list = [],
    idx = 0;
  function buildBox() {
    box = document.createElement("div");
    box.className = "v4-lb";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Foto groot bekijken");
    box.innerHTML =
      '<button type="button" class="v4-lb-btn x" aria-label="Sluiten">&times;</button><button type="button" class="v4-lb-btn p" aria-label="Vorige foto">&lsaquo;</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="v4-lb-btn n" aria-label="Volgende foto">&rsaquo;</button>';
    document.body.appendChild(box);
    box.querySelector(".x").addEventListener("click", closeBox);
    box.querySelector(".p").addEventListener("click", function () {
      showAt(idx - 1);
    });
    box.querySelector(".n").addEventListener("click", function () {
      showAt(idx + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box) closeBox();
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowLeft") showAt(idx - 1);
      if (e.key === "ArrowRight") showAt(idx + 1);
    });
    var sx = null;
    box.addEventListener(
      "touchstart",
      function (e) {
        sx = e.touches[0].clientX;
      },
      { passive: true }
    );
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) showAt(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
  function showAt(i) {
    idx = (i + list.length) % list.length;
    var slide = list[idx];
    var img = slide.querySelector("img");
    if (img.dataset.src && !img.getAttribute("src")) img.setAttribute("src", img.dataset.src);
    var cap = slide.querySelector(".carousel-caption");
    box.querySelector("img").src = img.currentSrc || img.src;
    box.querySelector("img").alt = img.alt;
    box.querySelector("figcaption").textContent = cap ? cap.textContent : img.alt;
  }
  function closeBox() {
    box.hidden = true;
    document.documentElement.style.overflow = "";
  }
  document.querySelectorAll(".brand-frame").forEach(function (frame) {
    var slides = Array.prototype.slice.call(frame.querySelectorAll(".carousel-slide"));
    slides.forEach(function (sl, i) {
      var img = sl.querySelector("img");
      if (!img) return;
      img.classList.add("v4-zoom");
      img.addEventListener("click", function () {
        if (!box) buildBox();
        list = slides;
        showAt(i);
        box.hidden = false;
        document.documentElement.style.overflow = "hidden";
        box.querySelector(".x").focus();
      });
    });
  });

  // ---------- contact: bedankmoment na versturen ----------
  window.rtLeadDone = function (naam) {
    var d = document.getElementById("v4-lead-done");
    if (!d) return;
    document.getElementById("v4-lead-title").textContent = naam ? "Bedankt, " + naam + "!" : "Bedankt!";
    d.hidden = false;
    d.classList.remove("in");
    requestAnimationFrame(function () {
      d.classList.add("in");
    });
  };
})();
