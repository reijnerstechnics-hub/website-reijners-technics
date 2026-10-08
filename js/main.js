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
      a.classList.toggle("active", a.dataset.page === pageId);
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
    if (pageNames.indexOf(hash) !== -1) return { page: hash, scrollTo: null };
    var el = document.getElementById(hash);
    if (el) {
      var pageEl = el.closest("[data-page]");
      return { page: pageEl ? pageEl.dataset.page : "home", scrollTo: el };
    }
    return null;
  }

  // Ga naar een pagina. Bij losse pagina's opent dit het juiste bestand.
  window.goToPage = function (pageId, doScrollTop) {
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
    if (location.hash !== "#" + pageId) {
      history.pushState(null, "", "#" + pageId);
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
      goToPage(info.page, true);
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
    "Je bent de chatassistent van Reijners Technics, een airco- en warmtepompinstallateur in Dilsen-Stokkem (werkgebied: de regio rond Dilsen-Stokkem, onder meer Maaseik, Bree, Genk, Lanaken, Bilzen, Tongeren, Hasselt en Peer). Reijners Technics installeert, onderhoudt en herstelt airco's en lucht/lucht-warmtepompen van de merken Mitsubishi Electric, LG, Nuova en Mitsubishi Heavy Industries. Er staan bewust geen prijzen op de website. Verwijs voor een offerte, onderhoud of herstelling altijd eerst naar het aanvraagformulier op de website (de knop Offerte aanvragen): twee korte stappen, en Reijners Technics belt binnen 24 uur terug. Enkel als de bezoeker liever rechtstreeks contact wil: WhatsApp of telefoon op +32 491 11 33 13, of e-mail reijnerstechnics@gmail.com. Antwoord kort (maximaal een paar zinnen), vriendelijk en concreet in het Nederlands. Verzin geen feiten die je niet zeker weet, zoals exacte prijzen, garantietermijnen of levertijden - verwijs daarvoor door naar rechtstreeks contact. Blijf bij het onderwerp airco's, warmtepompen, installatie, onderhoud en energieverbruik.";

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

(function () {
  var brandChecks = document.querySelectorAll(".brand-filter");
  var typeChecks = document.querySelectorAll(".type-filter-cb");
  if (!brandChecks.length && !typeChecks.length) return;

  function checkedValues(list) {
    return Array.prototype.filter
      .call(list, function (cb) {
        return cb.checked;
      })
      .map(function (cb) {
        return cb.value;
      });
  }
  function allValues(list) {
    return Array.prototype.map.call(list, function (cb) {
      return cb.value;
    });
  }

  function applyFilters() {
    var brands = checkedValues(brandChecks);
    var types = checkedValues(typeChecks);
    if (!brands.length) brands = allValues(brandChecks);
    if (!types.length) types = allValues(typeChecks);

    document.querySelectorAll(".device-card").forEach(function (card) {
      var cats = (card.dataset.category || "single multi").split(" ");
      var brandMatch = brands.indexOf(card.dataset.brand) !== -1;
      var typeMatch = cats.some(function (c) {
        return types.indexOf(c) !== -1;
      });
      card.hidden = !(brandMatch && typeMatch);
    });
    document.querySelectorAll(".brand-sub").forEach(function (sub) {
      var devices = sub.nextElementSibling;
      if (devices && devices.classList.contains("devices")) {
        var anyVisible = Array.prototype.some.call(devices.querySelectorAll(".device-card"), function (c) {
          return !c.hidden;
        });
        sub.hidden = !anyVisible;
        devices.hidden = !anyVisible;
      }
    });
    document.querySelectorAll(".brand-block").forEach(function (blockEl) {
      var anyVisible = Array.prototype.some.call(blockEl.querySelectorAll(".device-card"), function (c) {
        return !c.hidden;
      });
      blockEl.hidden = !anyVisible;
    });
  }

  brandChecks.forEach(function (cb) {
    cb.addEventListener("change", applyFilters);
  });
  typeChecks.forEach(function (cb) {
    cb.addEventListener("change", applyFilters);
  });
  applyFilters();
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
      '<span class="v3-avatar">RR</span><h3>Twijfelt u tussen modellen?</h3><p>Rim helpt u kiezen tijdens het gratis plaatsbezoek. Hij kijkt naar uw ruimte, uw isolatie en waar het toestel kan hangen.</p>' +
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
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 5h18M6 12h12M10 19h4"/></svg>Filter op merk en type';
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
