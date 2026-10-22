// =====================================================================
// PRIJZEN VOOR HET PRIJSADVIES  (bovenaan de pagina Toestellen, #prijs)
// ---------------------------------------------------------------------
// Alle bedragen zijn in euro, EXCLUSIEF btw. Het prijsadvies rekent de
// btw er zelf bij (zie "btw" hieronder).
//
// Hier pas je de prijzen en de voorstellen aan. Aan de rest van de code
// hoef je niets te doen.
//
// De prijzen hieronder zijn RICHTPRIJZEN, op Rims vraag afgestemd op wat andere
// airco-installateurs vragen (oktober 2026): alle toestelprijzen x 0,75. Het prijsadvies zegt de klant
// dat de echte prijs pas in de offerte komt, na het plaatsbezoek. Zet voorlopig op true om weer "voorbeeldprijzen" te melden.
// =====================================================================
var RT_PRIJZEN = {
  voorlopig: false,

  // Btw-tarieven (in %). De richtprijs rekent met "standaard"; de klant ziet
  // erbij dat een woning jonger dan 10 jaar het andere tarief heeft.
  btw: { standaard: 6, nieuw: 21 },

  // De klant ziet een vork: berekende prijs min/plus dit percentage.
  marge: { min: 5, max: 15 },

  // Plaatsing
  installatie: {
    buitenunit: 550, //        per buitenunit: plaatsen op beugels of voet, elektrische aansluiting, vacuüm trekken, opstarten
    binnenunit: 350, //        per binnenunit: montage, muurdoorvoer, condensafvoer, aansluiten
    leidingInbegrepen: 3, //   meter leiding per binnenunit die al in de plaatsing zit
    perMeter: 45, //           per extra meter: koperleiding, isolatie, kabel en afwerking met goot
    standaardLeiding: 6, //    met zoveel meter leiding per binnenunit rekent de richtprijs
  },

  // Op één buitenunit mogen maximaal zoveel binnenunits.
  maxPerBuitenunit: 5,

  // Een multi-split buitenunit mag tot dit veelvoud van zijn eigen vermogen
  // aan binnenunits dragen (1,3 = 130 %).
  multiMaxAansluiting: 1.3,

  // -------------------------------------------------------------------
  // DRIE VOORSTELLEN
  // Na drie vragen (hoeveel kamers, hoe groot, wat is het belangrijkst)
  // ziet de klant altijd drie voorstellen: voordelig, beste prijs-kwaliteit
  // en premium, elk met een richtprijs.
  //
  // niveaus: de naam en korte uitleg van de drie voorstellen.
  // wensen:  de knoppen bij "Wat vindt u het belangrijkst?".
  //   vraag:       de tekst op de knop
  //   uitleg:      de kleine tekst onder de knop
  //   markeer:     welk voorstel het label "Past bij uw wens" krijgt
  //   voorstellen: per niveau een toestel uit de lijst "toestellen"
  //                hieronder (exact dezelfde naam als bij "model")
  // -------------------------------------------------------------------
  niveaus: {
    voordelig: { titel: "Voordelig", uitleg: "Betrouwbaar en scherp geprijsd" },
    kwaliteit: { titel: "Beste prijs-kwaliteit", uitleg: "Een topmerk dat jarenlang meegaat" },
    premium: { titel: "Premium", uitleg: "Het beste wat er is" },
  },
  wensen: [
    { id: "prijs", vraag: "Zo voordelig mogelijk", uitleg: "Een betrouwbaar toestel tegen een scherpe prijs", markeer: "voordelig",
      voorstellen: { voordelig: "Nuova Infinity AI Smart", kwaliteit: "Daikin Perfera", premium: "Mitsubishi Electric MSZ-LN Diamond" } },
    { id: "kwaliteit", vraag: "Goede prijs-kwaliteit", uitleg: "Een topmerk dat jarenlang meegaat", markeer: "kwaliteit",
      voorstellen: { voordelig: "Nuova Infinity AI Smart", kwaliteit: "Daikin Perfera", premium: "Mitsubishi Electric MSZ-LN Diamond" } },
    { id: "stil", vraag: "Extra stil en zuinig", uitleg: "Fluisterstil en zo weinig mogelijk verbruik", markeer: "premium",
      voorstellen: { voordelig: "Nuova Stellar Inverter", kwaliteit: "Mitsubishi Electric MSZ-AY Compact", premium: "Mitsubishi Electric MSZ-LN Diamond" } },
    { id: "design", vraag: "Mooi design", uitleg: "Een toestel dat mooi in uw interieur past", markeer: "kwaliteit",
      voorstellen: { voordelig: "Nuova Stellar Inverter", kwaliteit: "Mitsubishi Electric MSZ-EF Premium Design", premium: "Daikin Emura" } },
  ],

  // -------------------------------------------------------------------
  // TOESTELLEN en hun prijzen.
  //   model:   moet exact gelijk zijn aan data-model van de kaart op de
  //            pagina Toestellen. Zo toont het prijsadvies dezelfde foto
  //            en uitleg.
  //   multi:   welke multi-split buitenunits bij dit toestel horen
  //            (zie "multi" verderop), of null als het enkel single-split kan.
  //   prijzen: per vermogen (kW):  [ prijs set binnen+buiten , prijs losse binnenunit voor multi ]
  //            Zet null als die uitvoering niet bestaat.
  // -------------------------------------------------------------------
  toestellen: [
    { merk: "Nuova", model: "Nuova Infinity AI Smart", naam: "Infinity AI Smart", multi: "nuova-inf",
      prijzen: { "2.5": [490, 290], "3.5": [540, 320], "5.0": [790, 420], "7.1": [1090, 560] } },
    { merk: "Nuova", model: "Nuova Premium Inverter", naam: "Premium Inverter", multi: "nuova-mso",
      prijzen: { "3.5": [600, 340], "5.0": [860, 450] } },
    { merk: "Nuova", model: "Nuova Stellar Inverter", naam: "Stellar Inverter", multi: "nuova-mso",
      prijzen: { "3.5": [710, 390], "5.0": [980, 510] } },
    { merk: "Nuova", model: "Nuova Vloermodel", naam: "Vloermodel", multi: "nuova-inf",
      prijzen: { "2.5": [680, 340], "3.5": [750, 380], "5.0": [980, 490], "7.1": [1280, null] } },

    // Daikin: winkelprijs excl. btw x 1,6 (zoals de andere merken), daarna x 0,75 zoals alle merken
    { merk: "Daikin", model: "Daikin Sensira", naam: "Sensira", multi: null,
      prijzen: { "2.0": [620, null], "2.5": [660, null], "3.5": [680, null], "5.0": [1140, null], "6.0": [1240, null], "7.1": [1580, null] } },
    { merk: "Daikin", model: "Daikin FTXF-F", naam: "FTXF-F", multi: null,
      prijzen: { "2.0": [700, null], "2.5": [720, null], "6.0": [1280, null], "7.1": [1500, null] } },
    { merk: "Daikin", model: "Daikin Comfora", naam: "Comfora", multi: "daikin-mxm",
      prijzen: { "2.0": [940, 400], "2.5": [1060, 440], "3.5": [1190, 460], "5.0": [1680, 540], "6.0": [1860, 590], "7.1": [2180, 680] } },
    { merk: "Daikin", model: "Daikin Perfera", naam: "Perfera", multi: "daikin-mxm",
      prijzen: { "2.0": [1160, 500], "2.5": [1280, 520], "3.5": [1430, 590], "4.2": [1680, 680], "5.0": [1850, 780], "6.0": [2080, 950], "7.1": [2380, 1060] } },
    { merk: "Daikin", model: "Daikin Stylish", naam: "Stylish", multi: "daikin-mxm",
      prijzen: { "2.0": [1340, 530], "2.5": [1880, 620], "3.5": [2000, 680], "4.2": [2080, 740], "5.0": [2460, 800] } },
    { merk: "Daikin", model: "Daikin Emura", naam: "Emura", multi: "daikin-mxm",
      prijzen: { "2.0": [1680, 620], "2.5": [1790, 680], "3.5": [2030, 830], "4.2": [2360, 900], "5.0": [2560, 1010] } },
    { merk: "Daikin", model: "Daikin Perfera vloermodel", naam: "Perfera vloermodel", multi: "daikin-mxm",
      prijzen: { "2.5": [1540, 780], "3.5": [1880, 960], "5.0": [2160, 1160] } },
    { merk: "Daikin", model: "Daikin Sensira CTXF-C multi-split binnenunit", naam: "Sensira multi", multi: "daikin-mxf",
      prijzen: { "2.0": [null, 300], "2.5": [null, 320], "3.5": [null, 340] } },

    { merk: "LG", model: "LG DualCool WZ-serie", naam: "DualCool WZ", multi: null,
      prijzen: { "2.5": [560, null], "3.5": [640, null], "5.0": [940, null], "7.0": [1240, null] } },
    { merk: "LG", model: "LG DualCool Comfort Special E · EZ-serie", naam: "DualCool Comfort EZ", multi: "lg-multif",
      prijzen: { "2.5": [710, 360], "3.5": [790, 410], "5.0": [1090, 530], "6.6": [1390, 640] } },
    { merk: "LG", model: "LG Standard Plus DualCool Special P · PZ-serie", naam: "Standard Plus PZ", multi: "lg-multif",
      prijzen: { "2.5": [640, 320], "3.5": [710, 360], "5.0": [1010, 490], "6.6": [1280, 600] } },
    { merk: "LG", model: "LG DualCool AI Air Special Smart Inverter", naam: "DualCool AI Air Special", multi: "lg-multif",
      prijzen: { "2.5": [750, 390], "3.5": [830, 440] } },
    { merk: "LG", model: "LG Deluxe AI H-serie", naam: "Deluxe AI", multi: "lg-multif",
      prijzen: { "2.1": [null, 380], "2.5": [830, 410], "3.5": [940, 470], "5.0": [1240, 620], "7.0": [1580, 790] } },
    { merk: "LG", model: "LG Artcool AI Air Mirror", naam: "Artcool AI Air Mirror", multi: "lg-multif",
      prijzen: { "2.5": [940, 470], "3.5": [1050, 530], "5.0": [1390, 700] } },
    { merk: "LG", model: "LG Artcool AI Matt Black", naam: "Artcool AI Matt Black", multi: "lg-multif",
      prijzen: { "2.5": [940, 470] } },
    { merk: "LG", model: "LG Artcool Gallery Special", naam: "Artcool Gallery", multi: "lg-multif",
      prijzen: { "2.5": [1240, 620], "3.5": [1350, 680] } },
    { merk: "LG", model: "LG Artcool LCD Gallery Premium", naam: "Artcool LCD Gallery", multi: "lg-multif",
      prijzen: { "2.5": [1800, 900], "3.5": [1950, 980] } },
    { merk: "LG", model: "LG Vloermodel UQ-reeks", naam: "Vloermodel UQ", multi: "lg-multif",
      prijzen: { "2.6": [1130, 560], "3.5": [1240, 620], "5.0": [1540, 770] } },

    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-HR instapreeks", naam: "MSZ-HR", multi: "me-mxzha",
      prijzen: { "2.5": [680, 340], "3.5": [750, 390], "5.0": [1050, 530], "6.0": [1310, null], "7.1": [1540, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-AY Compact", naam: "MSZ-AY Compact", multi: "me-mxz",
      prijzen: { "1.5": [null, 390], "2.0": [null, 420], "2.5": [940, 450], "3.5": [1050, 510], "4.2": [1280, 600], "5.0": [1460, 680], "6.0": [1760, null], "7.1": [1990, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-EF Premium Design", naam: "MSZ-EF Premium Design", multi: "me-mxz",
      prijzen: { "1.8": [null, 640], "2.5": [1350, 680], "3.5": [1500, 750], "5.0": [1880, 900] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-LN Diamond", naam: "MSZ-LN Diamond", multi: "me-mxz",
      prijzen: { "2.5": [1650, 860], "3.5": [1800, 940], "5.0": [2250, 1090], "6.1": [2700, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-LN Diamond Zubadan", naam: "MSZ-LN Diamond Zubadan", multi: null,
      prijzen: { "2.5": [2180, null], "3.5": [2360, null], "5.0": [2850, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MFZ-KT Vloermodel", naam: "MFZ-KT Vloermodel", multi: "me-mxz",
      prijzen: { "2.5": [1350, 750], "3.5": [1500, 830], "5.0": [1880, 980], "6.0": [2180, 1090] } },

    { merk: "Mitsubishi Heavy Industries", model: "MHI ZSP Standard", naam: "ZSP Standard", multi: null,
      prijzen: { "2.5": [600, null], "3.5": [680, null], "5.0": [940, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZS Premium", naam: "ZS Premium", multi: "mhi-scm",
      prijzen: { "2.0": [750, 360], "2.5": [790, 380], "3.5": [900, 420], "5.0": [1200, 540] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZTL Standard Plus", naam: "ZTL Standard Plus", multi: null,
      prijzen: { "1.5": [640, null], "2.0": [660, null], "2.5": [690, null], "3.5": [770, null], "5.0": [1050, null], "6.3": [1350, null], "7.1": [1500, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZSX Diamond Hyper", naam: "ZSX Diamond Hyper", multi: "mhi-scm",
      prijzen: { "2.0": [1090, 530], "2.5": [1130, 540], "3.5": [1280, 600], "5.0": [1650, 750], "6.0": [1950, 860], "7.1": [2250, null], "8.0": [2550, null], "10.0": [3080, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI Diamond Vloermodel", naam: "Diamond Vloermodel", multi: "mhi-scm",
      prijzen: { "2.5": [1130, 600], "3.5": [1240, 660], "5.0": [1580, 790] } },
  ],

  // -------------------------------------------------------------------
  // MULTI-SPLIT BUITENUNITS per reeks.
  //   poorten: hoeveel binnenunits erop kunnen
  //   kw:      nominaal koelvermogen
  //   prijs:   prijs van de buitenunit alleen
  // De calculator kiest de goedkoopste die past.
  // -------------------------------------------------------------------
  multi: {
    "nuova-mso": { naam: "Nuova MSO", units: [
      { poorten: 2, kw: 5.28, prijs: 710 },
      { poorten: 3, kw: 8.0, prijs: 1010 },
      { poorten: 4, kw: 10.5, prijs: 1310 },
      { poorten: 5, kw: 13.5, prijs: 1610 },
    ] },
    "nuova-inf": { naam: "Nuova Infinity AI Smart multi", units: [
      { poorten: 2, kw: 5.0, prijs: 680 },
      { poorten: 3, kw: 6.8, prijs: 900 },
      { poorten: 3, kw: 8.0, prijs: 1010 },
      { poorten: 4, kw: 10.0, prijs: 1240 },
      { poorten: 5, kw: 12.5, prijs: 1500 },
    ] },
    "lg-multif": { naam: "LG Multi F", units: [
      { poorten: 2, kw: 4.1, prijs: 860 },
      { poorten: 2, kw: 4.7, prijs: 940 },
      { poorten: 3, kw: 5.3, prijs: 1160 },
      { poorten: 3, kw: 6.2, prijs: 1280 },
      { poorten: 4, kw: 7.0, prijs: 1540 },
      { poorten: 4, kw: 7.9, prijs: 1690 },
      { poorten: 5, kw: 8.8, prijs: 1910 },
      { poorten: 5, kw: 11.2, prijs: 2250 },
    ] },
    "me-mxz": { naam: "Mitsubishi Electric MXZ", units: [
      { poorten: 2, kw: 3.3, prijs: 980 },
      { poorten: 2, kw: 4.2, prijs: 1090 },
      { poorten: 2, kw: 5.3, prijs: 1240 },
      { poorten: 3, kw: 5.4, prijs: 1390 },
      { poorten: 3, kw: 6.8, prijs: 1610 },
      { poorten: 4, kw: 7.2, prijs: 1880 },
      { poorten: 4, kw: 8.3, prijs: 2100 },
      { poorten: 5, kw: 10.2, prijs: 2480 },
    ] },
    "me-mxzha": { naam: "Mitsubishi Electric MXZ-HA", units: [
      { poorten: 2, kw: 4.0, prijs: 830 },
      { poorten: 2, kw: 5.0, prijs: 940 },
      { poorten: 3, kw: 5.0, prijs: 1090 },
    ] },
    "daikin-mxm": { naam: "Daikin MXM", units: [
      { poorten: 2, kw: 4.0, prijs: 1380 },
      { poorten: 2, kw: 5.0, prijs: 1550 },
      { poorten: 2, kw: 6.8, prijs: 1980 },
      { poorten: 3, kw: 4.0, prijs: 1880 },
      { poorten: 3, kw: 5.2, prijs: 2080 },
      { poorten: 3, kw: 6.8, prijs: 2140 },
      { poorten: 4, kw: 6.8, prijs: 2380 },
      { poorten: 4, kw: 8.0, prijs: 2760 },
      { poorten: 5, kw: 9.0, prijs: 3160 },
    ] },
    "daikin-mxf": { naam: "Daikin Sensira 2MXF", units: [
      { poorten: 2, kw: 4.0, prijs: 1280 },
    ] },
    "mhi-scm": { naam: "MHI SCM", units: [
      { poorten: 2, kw: 4.0, prijs: 980 },
      { poorten: 2, kw: 4.5, prijs: 1050 },
      { poorten: 3, kw: 5.0, prijs: 1200 },
      { poorten: 3, kw: 6.0, prijs: 1350 },
      { poorten: 4, kw: 7.1, prijs: 1650 },
      { poorten: 4, kw: 8.0, prijs: 1840 },
      { poorten: 5, kw: 10.0, prijs: 2180 },
    ] },
  },
};
