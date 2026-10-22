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
// airco-installateurs vragen (oktober 2026). Het prijsadvies zegt de klant dat de echte
// prijs pas in de offerte komt, na het plaatsbezoek. Zet voorlopig op true om weer een melding "voorbeeldprijzen" te tonen.
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
      prijzen: { "2.5": [650, 380], "3.5": [720, 420], "5.0": [1050, 560], "7.1": [1450, 750] } },
    { merk: "Nuova", model: "Nuova Premium Inverter", naam: "Premium Inverter", multi: "nuova-mso",
      prijzen: { "3.5": [800, 450], "5.0": [1150, 600] } },
    { merk: "Nuova", model: "Nuova Stellar Inverter", naam: "Stellar Inverter", multi: "nuova-mso",
      prijzen: { "3.5": [950, 520], "5.0": [1300, 680] } },
    { merk: "Nuova", model: "Nuova Vloermodel", naam: "Vloermodel", multi: "nuova-inf",
      prijzen: { "2.5": [900, 450], "3.5": [1000, 500], "5.0": [1300, 650], "7.1": [1700, null] } },

    // Daikin: winkelprijs excl. btw x 1,6 x 0,66, afgestemd op de marktprijzen (oktober 2026)
    { merk: "Daikin", model: "Daikin Sensira", naam: "Sensira", multi: null,
      prijzen: { "2.0": [550, null], "2.5": [580, null], "3.5": [600, null], "5.0": [1000, null], "6.0": [1090, null], "7.1": [1390, null] } },
    { merk: "Daikin", model: "Daikin FTXF-F", naam: "FTXF-F", multi: null,
      prijzen: { "2.0": [610, null], "2.5": [630, null], "6.0": [1130, null], "7.1": [1320, null] } },
    { merk: "Daikin", model: "Daikin Comfora", naam: "Comfora", multi: "daikin-mxm",
      prijzen: { "2.0": [830, 350], "2.5": [930, 390], "3.5": [1040, 400], "5.0": [1480, 480], "6.0": [1640, 510], "7.1": [1910, 600] } },
    { merk: "Daikin", model: "Daikin Perfera", naam: "Perfera", multi: "daikin-mxm",
      prijzen: { "2.0": [1020, 440], "2.5": [1130, 460], "3.5": [1250, 510], "4.2": [1480, 590], "5.0": [1620, 690], "6.0": [1830, 830], "7.1": [2090, 930] } },
    { merk: "Daikin", model: "Daikin Stylish", naam: "Stylish", multi: "daikin-mxm",
      prijzen: { "2.0": [1170, 460], "2.5": [1660, 550], "3.5": [1760, 590], "4.2": [1830, 650], "5.0": [2160, 700] } },
    { merk: "Daikin", model: "Daikin Emura", naam: "Emura", multi: "daikin-mxm",
      prijzen: { "2.0": [1480, 550], "2.5": [1570, 590], "3.5": [1780, 730], "4.2": [2070, 790], "5.0": [2250, 880] } },
    { merk: "Daikin", model: "Daikin Perfera vloermodel", naam: "Perfera vloermodel", multi: "daikin-mxm",
      prijzen: { "2.5": [1350, 690], "3.5": [1660, 840], "5.0": [1900, 1020] } },
    { merk: "Daikin", model: "Daikin Sensira CTXF-C multi-split binnenunit", naam: "Sensira multi", multi: "daikin-mxf",
      prijzen: { "2.0": [null, 260], "2.5": [null, 280], "3.5": [null, 300] } },

    { merk: "LG", model: "LG DualCool WZ-serie", naam: "DualCool WZ", multi: null,
      prijzen: { "2.5": [750, null], "3.5": [850, null], "5.0": [1250, null], "7.0": [1650, null] } },
    { merk: "LG", model: "LG DualCool Comfort Special E · EZ-serie", naam: "DualCool Comfort EZ", multi: "lg-multif",
      prijzen: { "2.5": [950, 480], "3.5": [1050, 540], "5.0": [1450, 700], "6.6": [1850, 850] } },
    { merk: "LG", model: "LG Standard Plus DualCool Special P · PZ-serie", naam: "Standard Plus PZ", multi: "lg-multif",
      prijzen: { "2.5": [850, 430], "3.5": [950, 480], "5.0": [1350, 650], "6.6": [1700, 800] } },
    { merk: "LG", model: "LG DualCool AI Air Special Smart Inverter", naam: "DualCool AI Air Special", multi: "lg-multif",
      prijzen: { "2.5": [1000, 520], "3.5": [1100, 580] } },
    { merk: "LG", model: "LG Deluxe AI H-serie", naam: "Deluxe AI", multi: "lg-multif",
      prijzen: { "2.1": [null, 500], "2.5": [1100, 550], "3.5": [1250, 630], "5.0": [1650, 830], "7.0": [2100, 1050] } },
    { merk: "LG", model: "LG Artcool AI Air Mirror", naam: "Artcool AI Air Mirror", multi: "lg-multif",
      prijzen: { "2.5": [1250, 630], "3.5": [1400, 700], "5.0": [1850, 930] } },
    { merk: "LG", model: "LG Artcool AI Matt Black", naam: "Artcool AI Matt Black", multi: "lg-multif",
      prijzen: { "2.5": [1250, 630] } },
    { merk: "LG", model: "LG Artcool Gallery Special", naam: "Artcool Gallery", multi: "lg-multif",
      prijzen: { "2.5": [1650, 830], "3.5": [1800, 900] } },
    { merk: "LG", model: "LG Artcool LCD Gallery Premium", naam: "Artcool LCD Gallery", multi: "lg-multif",
      prijzen: { "2.5": [2400, 1200], "3.5": [2600, 1300] } },
    { merk: "LG", model: "LG Vloermodel UQ-reeks", naam: "Vloermodel UQ", multi: "lg-multif",
      prijzen: { "2.6": [1500, 750], "3.5": [1650, 830], "5.0": [2050, 1030] } },

    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-HR instapreeks", naam: "MSZ-HR", multi: "me-mxzha",
      prijzen: { "2.5": [900, 450], "3.5": [1000, 520], "5.0": [1400, 700], "6.0": [1750, null], "7.1": [2050, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-AY Compact", naam: "MSZ-AY Compact", multi: "me-mxz",
      prijzen: { "1.5": [null, 520], "2.0": [null, 560], "2.5": [1250, 600], "3.5": [1400, 680], "4.2": [1700, 800], "5.0": [1950, 900], "6.0": [2350, null], "7.1": [2650, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-EF Premium Design", naam: "MSZ-EF Premium Design", multi: "me-mxz",
      prijzen: { "1.8": [null, 850], "2.5": [1800, 900], "3.5": [2000, 1000], "5.0": [2500, 1200] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-LN Diamond", naam: "MSZ-LN Diamond", multi: "me-mxz",
      prijzen: { "2.5": [2200, 1150], "3.5": [2400, 1250], "5.0": [3000, 1450], "6.1": [3600, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MSZ-LN Diamond Zubadan", naam: "MSZ-LN Diamond Zubadan", multi: null,
      prijzen: { "2.5": [2900, null], "3.5": [3150, null], "5.0": [3800, null] } },
    { merk: "Mitsubishi Electric", model: "Mitsubishi Electric MFZ-KT Vloermodel", naam: "MFZ-KT Vloermodel", multi: "me-mxz",
      prijzen: { "2.5": [1800, 1000], "3.5": [2000, 1100], "5.0": [2500, 1300], "6.0": [2900, 1450] } },

    { merk: "Mitsubishi Heavy Industries", model: "MHI ZSP Standard", naam: "ZSP Standard", multi: null,
      prijzen: { "2.5": [800, null], "3.5": [900, null], "5.0": [1250, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZS Premium", naam: "ZS Premium", multi: "mhi-scm",
      prijzen: { "2.0": [1000, 480], "2.5": [1050, 500], "3.5": [1200, 560], "5.0": [1600, 720] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZTL Standard Plus", naam: "ZTL Standard Plus", multi: null,
      prijzen: { "1.5": [850, null], "2.0": [880, null], "2.5": [920, null], "3.5": [1020, null], "5.0": [1400, null], "6.3": [1800, null], "7.1": [2000, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI ZSX Diamond Hyper", naam: "ZSX Diamond Hyper", multi: "mhi-scm",
      prijzen: { "2.0": [1450, 700], "2.5": [1500, 720], "3.5": [1700, 800], "5.0": [2200, 1000], "6.0": [2600, 1150], "7.1": [3000, null], "8.0": [3400, null], "10.0": [4100, null] } },
    { merk: "Mitsubishi Heavy Industries", model: "MHI Diamond Vloermodel", naam: "Diamond Vloermodel", multi: "mhi-scm",
      prijzen: { "2.5": [1500, 800], "3.5": [1650, 880], "5.0": [2100, 1050] } },
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
      { poorten: 2, kw: 5.28, prijs: 950 },
      { poorten: 3, kw: 8.0, prijs: 1350 },
      { poorten: 4, kw: 10.5, prijs: 1750 },
      { poorten: 5, kw: 13.5, prijs: 2150 },
    ] },
    "nuova-inf": { naam: "Nuova Infinity AI Smart multi", units: [
      { poorten: 2, kw: 5.0, prijs: 900 },
      { poorten: 3, kw: 6.8, prijs: 1200 },
      { poorten: 3, kw: 8.0, prijs: 1350 },
      { poorten: 4, kw: 10.0, prijs: 1650 },
      { poorten: 5, kw: 12.5, prijs: 2000 },
    ] },
    "lg-multif": { naam: "LG Multi F", units: [
      { poorten: 2, kw: 4.1, prijs: 1150 },
      { poorten: 2, kw: 4.7, prijs: 1250 },
      { poorten: 3, kw: 5.3, prijs: 1550 },
      { poorten: 3, kw: 6.2, prijs: 1700 },
      { poorten: 4, kw: 7.0, prijs: 2050 },
      { poorten: 4, kw: 7.9, prijs: 2250 },
      { poorten: 5, kw: 8.8, prijs: 2550 },
      { poorten: 5, kw: 11.2, prijs: 3000 },
    ] },
    "me-mxz": { naam: "Mitsubishi Electric MXZ", units: [
      { poorten: 2, kw: 3.3, prijs: 1300 },
      { poorten: 2, kw: 4.2, prijs: 1450 },
      { poorten: 2, kw: 5.3, prijs: 1650 },
      { poorten: 3, kw: 5.4, prijs: 1850 },
      { poorten: 3, kw: 6.8, prijs: 2150 },
      { poorten: 4, kw: 7.2, prijs: 2500 },
      { poorten: 4, kw: 8.3, prijs: 2800 },
      { poorten: 5, kw: 10.2, prijs: 3300 },
    ] },
    "me-mxzha": { naam: "Mitsubishi Electric MXZ-HA", units: [
      { poorten: 2, kw: 4.0, prijs: 1100 },
      { poorten: 2, kw: 5.0, prijs: 1250 },
      { poorten: 3, kw: 5.0, prijs: 1450 },
    ] },
    "daikin-mxm": { naam: "Daikin MXM", units: [
      { poorten: 2, kw: 4.0, prijs: 1210 },
      { poorten: 2, kw: 5.0, prijs: 1360 },
      { poorten: 2, kw: 6.8, prijs: 1740 },
      { poorten: 3, kw: 4.0, prijs: 1660 },
      { poorten: 3, kw: 5.2, prijs: 1830 },
      { poorten: 3, kw: 6.8, prijs: 1880 },
      { poorten: 4, kw: 6.8, prijs: 2090 },
      { poorten: 4, kw: 8.0, prijs: 2430 },
      { poorten: 5, kw: 9.0, prijs: 2780 },
    ] },
    "daikin-mxf": { naam: "Daikin Sensira 2MXF", units: [
      { poorten: 2, kw: 4.0, prijs: 1120 },
    ] },
    "mhi-scm": { naam: "MHI SCM", units: [
      { poorten: 2, kw: 4.0, prijs: 1300 },
      { poorten: 2, kw: 4.5, prijs: 1400 },
      { poorten: 3, kw: 5.0, prijs: 1600 },
      { poorten: 3, kw: 6.0, prijs: 1800 },
      { poorten: 4, kw: 7.1, prijs: 2200 },
      { poorten: 4, kw: 8.0, prijs: 2450 },
      { poorten: 5, kw: 10.0, prijs: 2900 },
    ] },
  },
};
