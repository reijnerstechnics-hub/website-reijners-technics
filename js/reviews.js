// =====================================================================
// REVIEWS (pagina #reviews)
// Toont de Google-reviews uit assets/data/reviews.json: de score, het aantal en elke review.
// Dat bestand is de enige plek waar reviews staan. Het wordt bijgewerkt vanuit Rims Google-bedrijfsprofiel
// (zie README, "Reviews"). Hier wordt nooit een review verzonnen, ingekort of herschreven.
// =====================================================================
(function () {
  var BRON = "assets/data/reviews.json";
  var PER_KEER = 12;
  var MAAND = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

  var lijst = document.getElementById("rvw-lijst");
  var score = document.getElementById("rvw-score");
  var bron = document.getElementById("rvw-bron");
  if (!lijst || !score) return;

  function el(tag, klasse, tekst) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (tekst != null) e.textContent = tekst;
    return e;
  }

  function datum(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    if (!m) return "";
    return +m[3] + " " + MAAND[+m[2] - 1] + " " + m[1];
  }

  function komma(getal) {
    return (Math.round(getal * 10) / 10).toFixed(1).replace(".", ",");
  }

  // vijf sterren; "vol" mag een kommagetal zijn (4,6 vult de vijfde ster voor 60 %)
  function sterren(vol, groot) {
    var wrap = el("span", "rvw-sterren" + (groot ? " rvw-sterren-groot" : ""));
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", komma(vol).replace(",0", "") + " van de 5 sterren");
    var pad = "M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z";
    for (var i = 0; i < 5; i++) {
      var deel = Math.max(0, Math.min(1, vol - i));
      var s = el("span", "rvw-ster");
      s.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="leeg" d="' + pad + '"/></svg>' +
        '<svg class="vol" viewBox="0 0 24 24" aria-hidden="true" style="clip-path: inset(0 ' + (100 - deel * 100) + '% 0 0)"><path d="' + pad + '"/></svg>';
      wrap.appendChild(s);
    }
    return wrap;
  }

  function kaart(r) {
    var a = el("article", "rvw-kaart");
    var kop = el("header", "rvw-kop");
    var naam = (r.naam || "Klant").trim();
    var letter = el("span", "rvw-letter", naam.charAt(0).toUpperCase());
    letter.setAttribute("aria-hidden", "true");
    var wie = el("div", "rvw-wie");
    wie.appendChild(el("b", "rvw-naam", naam));
    var d = datum(r.datum);
    if (d) wie.appendChild(el("span", "rvw-datum", d));
    kop.appendChild(letter);
    kop.appendChild(wie);
    kop.appendChild(sterren(+r.sterren || 0));
    a.appendChild(kop);
    if (r.tekst && r.tekst.trim()) a.appendChild(el("p", "rvw-tekst", r.tekst.trim()));
    if (r.antwoord && r.antwoord.trim()) {
      var ant = el("div", "rvw-antwoord");
      ant.appendChild(el("b", null, "Antwoord van Rim"));
      ant.appendChild(el("p", null, r.antwoord.trim()));
      a.appendChild(ant);
    }
    return a;
  }

  function toon(d) {
    var reviews = (d.reviews || []).slice().sort(function (a, b) {
      return String(b.datum || "").localeCompare(String(a.datum || ""));
    });
    var aantal = +d.aantal || reviews.length;

    score.textContent = "";
    if (aantal > 0 && d.score) {
      score.appendChild(el("b", "rvw-cijfer", komma(+d.score)));
      var naast = el("div", "rvw-score-naast");
      naast.appendChild(sterren(+d.score, true));
      naast.appendChild(el("span", "rvw-aantal", aantal + (aantal === 1 ? " review" : " reviews") + " op Google"));
      score.appendChild(naast);
    } else {
      score.appendChild(el("span", "rvw-aantal", "Er staan nog geen reviews op Google."));
    }

    lijst.textContent = "";
    lijst.classList.toggle("is-weinig", reviews.length < 3);
    var sec = lijst.closest(".rvw-sec");
    if (sec) sec.classList.toggle("is-weinig", reviews.length < 3);
    var getoond = 0;
    var meer = document.getElementById("rvw-meer");
    function volgende() {
      reviews.slice(getoond, getoond + PER_KEER).forEach(function (r) {
        lijst.appendChild(kaart(r));
      });
      getoond = Math.min(reviews.length, getoond + PER_KEER);
      if (meer) meer.hidden = getoond >= reviews.length;
    }
    volgende();
    if (meer) meer.addEventListener("click", volgende);

    if (bron) {
      var bij = datum(d.bijgewerkt);
      bron.textContent = "Bron: Google" + (bij ? ", bijgewerkt op " + bij : "") + ". Google verifieert reviews niet.";
    }
  }

  function mislukt() {
    score.textContent = "";
    lijst.textContent = "";
    lijst.classList.add("is-weinig");
    lijst.appendChild(el("p", "rvw-leeg", "De reviews laden nu niet. U kunt ze bekijken op Google met de knop hierboven."));
  }

  fetch(BRON, { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("reviews " + r.status);
      return r.json();
    })
    .then(toon)
    .catch(mislukt);
})();
