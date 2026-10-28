# Reijners Technics – projectgeheugen voor Claude

Dit bestand lezen alle sessies en alle agents van het team. Hoe de site technisch werkt, staat in `README.md`.

## Het bedrijf

- Reijners Technics, zaakvoerder Rim Reijners: installateur van airco's (lucht/lucht-warmtepompen). Plaatsing, onderhoud en herstelling.
- Borreshoefstraat 12, 3650 Dilsen-Stokkem · +32 491 11 33 13 · reijnerstechnics@gmail.com · BTW BE 1021.765.138.
- Rechtsvorm: Reijners Technics **BV** (besloten vennootschap sinds 1-4-2025, volgens de KBO). RPR Antwerpen, afdeling Tongeren-Borgloon: de bevoegde rechtbank voor Dilsen-Stokkem volgens territoriale-bevoegdheid.just.fgov.be. Beide staan onderaan de site en in de privacyverklaring (Rims vraag, 24-10-2026).
- Instagram: @reijnerstechnics (op de site sinds 23-10-2026). Er is nog geen Facebookpagina.
- Eigen webadres (bv. reijnerstechnics.be): pas als Rims eigen foto's volledig op de site staan (Rim, 24-10-2026). Tot dan enkel het vercel.app-adres.
- Werkgebied: Dilsen-Stokkem, Maaseik, Bree, Genk, Hasselt, Tongeren en omgeving.
- Merken: Daikin, LG, Mitsubishi Electric, Mitsubishi Heavy Industries (MHI), Nuova en Toshiba. Onderhoud en herstelling doet Rim ook voor andere merken, zoals Samsung of Fujitsu (24-10-2026).
- **Niet** in het aanbod (bewust overal verwijderd): lucht/water-warmtepompen, warmtepompboilers, het merk Ariston. Ook geen foto's van Gree of Olimpia Splendid (op 22-10-2026 van de site gehaald). Voeg ze nooit opnieuw toe.
- Beloftes op de site: gratis plaatsbezoek, binnen 24 uur teruggebeld door Rim zelf, rechtstreeks met de installateur, u beslist pas na de offerte.
- Op Rims vraag weggehaald (24-10-2026), want zonder bron: "Nazorg gegarandeerd", "u behoudt uw garantie", "geen wachttijden", "Binnen 1 tot 2 dagen klaar", "20-30% besparing" en "5-10 jaar langer". Zet ze niet terug.
- Rim is altijd zelf het aanspreekpunt. Fabio Lomma (eigen zaak: Lomma Technics) plaatst mee, maar is geen aanspreekpunt (Rim, 22-10-2026).
- De foto van Rim en Fabio samen wil Rim niet op de site (22-10-2026). Er komt ook geen fotootje van Fabio uit die foto: zijn kaartje op Over ons houdt de letters "FL". De bewerkte versies in `voorbeeld/ronde-1/nieuw/` gebruik je niet.
- Rim heeft een koeltechnisch certificaat. Het nummer en een foto van het certificaat komen nooit online (kans op misbruik).
- Rim plaatst al 6 jaar airco's (zijn antwoord op 22-10-2026). Herstellingen gebeuren op afspraak: er is geen storingsdienst 's avonds of in het weekend.
- Bereikbaarheid (Rim, 28-10-2026): op werkdagen van 8 tot 18 uur; buiten die uren antwoordt hij de volgende werkdag. Mag op de site staan.
- Prijzen die Rim bevestigde:
  - onderhoud €150 tot €200 **exclusief btw**, afhankelijk van de situatie en het aantal toestellen (22 en 24-10-2026);
  - herstelling €100 tot €150 voor de verplaatsing en het eerste uur, **exclusief btw** (Rims antwoord "zonder", 24-10-2026);
  - "vanaf €1.500" voor één kamer is met plaatsing en **6% btw** (woning ouder dan 10 jaar; jonger: 21%), Rims "ja" van 24-10-2026.
  - Alle andere bedragen op de site zijn nog niet bevestigd.
  - **Rims rekenregel voor de richtprijzen (27-10-2026):** toestellen aan zijn inkoopprijs (Nova Air; Daikin via comfycool.be, excl. btw) **x 1,15**, plus zijn werk: **€ 1.000 bij 1 binnenunit, € 1.500 bij 2, € 2.000 bij 3** (excl. btw, enkel 5 m leiding inbegrepen), en daarop 6 % btw. Vanaf 4 binnenunits of bij extra werk (stroom vanuit de zekeringkast, langere leiding) geen bedrag maar "op maat, na het plaatsbezoek". Altijd "richtprijs voor een standaardplaatsing" met "wat zit erin / wat kan erbij komen". De inkoopprijzen blijven privé in `voorbeeld/prijslijst/` (buiten git); `js/prijzen.js` bevat enkel de berekende bedragen.
  - Let op: voor particulieren hoort een prijs normaal mét btw op de site. Rim vraagt zijn boekhouder welk tarief geldt voor onderhoud en herstelling; daarna komt de prijs met btw erbij.

## Doel van de site

- Particulieren uit de regio laten kiezen en een aanvraag laten doen. De meeste bezoekers komen op een gsm.
- Rims eisen: zo vlot, duidelijk en simpel mogelijk; de bezoeker mag nooit twijfelen; de site mag er niet uitzien alsof ze door AI gemaakt is.

## Taal en toon

- Alles in het Nederlands (Vlaams). Op de site: u-vorm, korte zinnen, concreet, zoals een vakman praat.
- Vaste woorden: binnenunit, buitenunit, single-split, multi-split, warmtepomp (Rims keuze van 22-10-2026: nooit "lucht/lucht"; bij de eerste vermelding "een airco die ook verwarmt"), plaatsbezoek, offerte, richtprijs.
- Nooit verzinnen: geen prijzen, reviews, getuigenissen, garanties, levertijden of specificaties zonder bron.
- Richtprijzen: Rim wil ze rond de prijzen van andere airco-installateurs (online opgezocht, met bron). Zet er altijd duidelijk bij dat het een richtprijs is en dat de echte prijs pas in de offerte komt, nadat Rim is langs geweest.
- Antwoorden aan Rim: in eenvoudig Nederlands, zonder vakjargon. Rim is geen ontwikkelaar.

## Huisstijl (voorlopig, nog niet vastgelegd)

- **De kleuren en lettertypes zijn nog niet definitief.** Rim wil dat het team ze eerst kritisch beoordeelt: misschien werkt een ander lettertype of een andere kleurencombinatie beter.
  - Een alternatief stel je altijd voor met een voorbeeld in `voorbeeld/` en screenshots op computer en gsm. Rim kiest.
  - Pas na zijn keuze komt de huisstijl hier vast te staan.
  - Tot dan gebruik je bij ander werk de huidige stijl. Wissel niet op eigen houtje.
- **Nu in gebruik** (bovenaan `css/style.css`):
  - donkerblauw `--ink` #16283d, goud `--gold` #e3a63e, lichtgoud `--gold-tint`, donker goud voor kleine tekst `--gold-text` #7a5417, blauw `--sky` #326d9a, grijs `--muted` #5f6e7b, achtergrond `--paper` #f6f9fb;
  - kleine tekst is sinds 24-10-2026 donkerder, voor een goede leesbaarheid (Rims keuze uit `voorbeeld/kleur-tekst/`): kleine gouden tekst op een lichte achtergrond krijgt `--gold-text`, `--gold` dient voor vlakken, knoppen en tekst op donker;
  - Source Serif 4 voor titels (`--font-kop`) en Source Sans 3 voor tekst (`--font-tekst`), via Google Fonts in `index.html`.
- **Nu op de site, maar mag in een voorstel anders:**
  - een gouden knop voor de hoofdactie;
  - toestelkaarten met een label op de foto (Binnen- + buitenunit / Zonder buitenunit / Buitenunit);
  - het kW-blok (lichtgoud, "tot 7,1 kW" en elke maat als knopje; op de toestelpagina kiest de bezoeker er een vermogen mee).
- **Wat wel vastligt:**
  - de site mag er niet uitzien alsof ze door AI gemaakt is: geen lettertypes die je op elke AI-site ziet (Sora, Inter, Poppins), geen overdreven verlopen of glaseffecten;
  - eigen foto's van echte plaatsingen gaan voor op stockfoto's;
  - alles moet goed leesbaar zijn, ook op gsm, met voldoende contrast;
  - wat eruitziet als een knop, moet ook iets doen. Anders geef je het een andere vorm (Rim, 24-10-2026: de kW-maten op de toestelpagina leken knopjes maar deden niets).

## Technische opbouw (kort)

- Statische site zonder build-stap: `index.html` (alle pagina's als `section[data-page]`, navigatie via #adressen), `css/style.css`, `js/main.js`, `js/prijzen.js` + `js/prijscalculator.js` (prijsadvies), `js/toestel-media.js` (extra foto's en merkvideo per toestel), `assets/img/`.
- Toestellen: elke kaart `.device-card` heeft `data-brand`, `data-type`, `data-category` en `data-kw` (zie README). De site bouwt er de lijst, de filters, de zoekfunctie en de detailpagina's (`#toestel-...`) uit.
- Formulieren gaan via Formspree (`FORMSPREE_URL` in `js/main.js`). Bij testen **nooit** echte aanvragen versturen: zet eerst `window.fetch` om naar een nepfunctie.
- Lokaal bekijken: de dev-server "website" uit `.claude/launch.json` (http://localhost:8080, script `.claude/serve.ps1`).
- Productfoto's: webp, 600 × 600 px. `POST /__save/<naam>.webp` op de dev-server bewaart een bestand in `assets/img/`.
- `voorbeeld/` staat buiten git: daar komen voorbeeldpagina's en screenshots voor Rim.

## Werkwijze (altijd)

1. Werk op een aparte git-branch, nooit rechtstreeks op `main`.
2. Bij ontwerpkeuzes, of als Rim om een voorbeeld vraagt: eerst een voorbeeld in `voorbeeld/` of screenshots, en Rim laten kiezen.
3. Na elke wijziging testen op computer (1366 px), tablet (768 px) en gsm (375 px): geen foutmeldingen in de console, geen kapotte afbeeldingen, niets dat buiten het scherm valt.
4. Lokaal committen met een duidelijke Nederlandse boodschap.
5. Pushen naar GitHub (`reijnerstechnics-hub/website-reijners-technics`, branch `main`) **pas na Rims uitdrukkelijke "akkoord" voor die wijziging**: `git switch main && git merge --ff-only <branch> && git push origin main`. Alleen de hoofdsessie pusht; agents nooit. Doe vóór elke nieuwe branch en vóór elke push `git fetch origin` en kijk of `origin/main` veranderd is: op 26-10-2026 pushte een andere sessie (cloud, "Hoofdagent") rechtstreeks naar `main`, buiten deze werkwijze om.
6. Afsluiten met een kort verslag voor Rim: wat er veranderd is, wat hij moet nakijken, en de vraag om akkoord. Geef er altijd een paar concrete tips bij om bezoekers sneller een offerte te laten aanvragen (Rims vaste wens, 22-10-2026).

## Het team (`.claude/agents/`)

| Agent | Rol | Wijzigt bestanden? |
| --- | --- | --- |
| `projectleider` | Hoofdagent: plant grotere opdrachten, verdeelt ze over het team en levert één verslag af | ja, commit lokaal op een branch; pusht nooit |
| `ux-adviseur` | Bekijkt de site door de ogen van de klant, vooral op gsm | nee, enkel analyse |
| `ui-ontwerper` | Huisstijl en layout; maakt voorbeelden en voert ontwerpwijzigingen uit | ja |
| `seo-specialist` | Vindbaarheid op Google, vooral lokaal | ja, na goedkeuring van het plan |
| `toestellenbeheerder` | Toestellen, merken, specificaties, kW en productfoto's | ja |
| `tekstschrijver` | Teksten in helder Vlaams | ja, als dat gevraagd is |
| `tester` | Volledige controle voor elke push | nee, enkel testen |

- Een kleine opdracht binnen één vak gaat rechtstreeks naar die specialist.
- Een opdracht die meerdere vakken raakt (nieuwe pagina, audit, herontwerp, maandelijkse controle) gaat naar de `projectleider`.
- Agents zien het gesprek met Rim niet: geef ze altijd een volledige opdracht mee (doel, context, branch, wat ze mogen wijzigen, wat ze moeten opleveren).
- Agents kunnen Rim niets vragen. Keuzes die Rim moet maken, komen terug naar de hoofdsessie, en die legt ze aan Rim voor.

## Stand van zaken (bijwerken als iets klaar is)

- De prijzen in `js/prijzen.js` zijn richtprijzen, op Rims vraag afgestemd op de markt (oktober 2026; alle toestelprijzen x 0,75), met `voorlopig: false`, online sinds 22-10-2026. Toestellen die later zijn toegevoegd, zitten nog niet in het prijsadvies.
- SEO: de site is één pagina met #adressen; de detailpagina's van toestellen maakt JavaScript, dus Google vindt ze niet apart. Sinds 26-10-2026 (branch `verbeteringen-26-10`) zijn er wel `robots.txt`, `sitemap.xml` (één adres), structured data (HVACBusiness, in de head), Open Graph met een eigen deelfoto, vierkante iconen, `404.html` en `vercel.json` (zie README, "Voor Google"). Bij een eigen domein: het adres vervangen (commentaar EIGEN DOMEIN in de head). Echte aparte pagina's per dienst en per toestel zijn de volgende grote stap (eerst Rims akkoord).
- Er is nog geen eigen foto van een Mitsubishi Electric Diamond voor de wisselende foto's op de homepagina. Een Mitsubishi Electric-paar kan er pas bij met een foto van een binnenunit die niet de hele breedte vult: de foto van het wandmodel tegen de houten wand (g-s-f5c477ad326e) is te breed voor het hoge kader.
- Sinds 22 oktober 2026 ook online (Rims akkoord):
  - op Home wisselen de grote en de kleine foto bovenaan samen: telkens een binnen- en een buitenunit van hetzelfde merk, met kleine versies `k-...webp` voor het kleine fotootje (zie README);
  - 8 nieuwe eigen foto's op Realisaties (g-n86 t/m g-n93). De genummerde lijst om de gemeente per foto te vragen staat in `voorbeeld/ronde-1/fotos-nummers.txt` (1 t/m 72, g-n39 staat er als weggehaald bij); de antwoorden van Rim ontbreken nog;
  - het blok "Nette plaatsing" op Home heeft een wit tekstkader, zodat het toestel op de foto helemaal zichtbaar blijft (Rims vraag).
- Sinds 23 oktober 2026 ook online (Rims akkoord):
  - Home: de eerste foto bovenaan is het Daikin-vloermodel; het gouden blok "Gratis plaatsbezoek" is een knop; de functie onder de namen op Over ons staat in donker goud (`--gold-text`);
  - seizoensfoto's bovenaan Home: warme foto's van oktober tot april, frisse van mei tot september (`data-seizoen`, zie README);
  - geen knop "Richtprijs berekenen" meer op de toestelpagina's (Rim: wie daar klikt, wil de prijs van dat toestel);
  - de verbeteringen van de grote controle van 23 oktober en Instagram @reijnerstechnics. Een dubbele foto (g-n39) is weg: de teller op Home staat op 71. Het verslag voor Rim met de open punten ("Later" en de vragen) staat in `voorbeeld/controle-2026-10-23/verslag.md`.
- Opgelost op 26-10-2026 (branch `verbeteringen-26-10`): de wissel bovenaan op Home laadt en wisselt enkel als het fotovak in beeld is.
- Sinds 24 oktober 2026 ook online (Rims akkoord):
  - Rims antwoorden: onderhoud exclusief btw, "6% btw" bij "vanaf €1.500", BV en RPR onderaan en in de privacyverklaring, beloftes zonder bron weg, onderhoud en herstelling ook voor andere merken (Diensten en de zoekbalk);
  - een richtprijs per toestel op de toestelpagina's: "vanaf €..." en een kolom Richtprijs in "Welk vermogen heb ik nodig?", met dezelfde berekening als het prijsadvies (zie README);
  - de kolom Contact in de voettekst over de volle breedte op tablet en gsm.
- Sinds 24 oktober 2026 ook online (Rims derde akkoord van die dag): de richtprijs op de kaartjes in de toestellenlijst ("vanaf € ..."; met de filter Vermogen de prijs voor die maat), met één uitleg bovenaan de lijst.
- **26 oktober 2026, prijzen.** Om 16:07 pushte een andere sessie (cloud, git-gebruiker reijnerstechnics-hub, "test via Hoofdagent") rechtstreeks naar `main`: "Geen prijzen meer op de site (1/4)", enkel de teksten op Home, Diensten, FAQ en Toestellen. Dat staat live, terwijl de toestelpagina's, de kaartjes en het prijsadvies nog richtprijzen tonen: de site spreekt zichzelf tegen. Rims beslissing (26-10, in de hoofdsessie): **de prijzen blijven**, maar de richtprijs wordt voortaan zijn eigen inkoopprijs uit zijn prijslijst bij Nova Air (nova-air.be, enkel zichtbaar na zijn login) plus een redelijk percentage (voorstel 30 %), overal duidelijk als "richtprijs". De inkoopprijzen zelf komen NOOIT in een bestand dat online staat (`js/prijzen.js` is publiek): de lijst en het percentage horen in `voorbeeld/prijslijst/` (buiten git), en in `prijzen.js` komen enkel de berekende richtprijzen. Daarna de prijsteksten van Home, Diensten en de FAQ terugzetten met de nieuwe bedragen. Branch `prijzen-toshiba-cassette-kanaal` (webshopprijzen, 25-10) is daarmee vervallen.
  - **Uitgevoerd op 27-10-2026 (branch `verbeteringen-26-10`, nog niet online):** Rim logde zelf in bij Nova Air (in zijn Chrome); ik las 743 dealerprijzen uit (`voorbeeld/prijslijst/nova-air-2026-10-27-deel1..3.txt`, buiten git) en `maak-prijzen.ps1` maakt daaruit `js/prijzen.js` (inkoop × 1,15; Daikin uit comfycool × 1,15). 56 van de 71 toestellen hebben nu een richtprijs; de rest (Nuova cassette/kanaal, mobiele airco, enkele multi-split binnenunits) heeft bij Nova Air geen setprijs. Het werk zit in `werk: {1: 1000, 2: 1500, 3: 2000}`; vanaf 4 binnenunits toont het prijsadvies "Op maat". De richtprijs is één bedrag (afgerond op 10 euro), geen vork meer; overal staat "richtprijs voor een standaardplaatsing (5 m leiding inbegrepen)" met wat erbij kan komen. De prijsteksten op Home, Diensten en in de FAQ zijn terug: één kamer vanaf € 1.360, meestal € 1.400 tot € 2.500 (design tot ± € 3.100), twee kamers ± € 2.300 tot € 4.100, drie kamers € 3.100 tot € 5.900; onderhoud € 150-200 en herstelling € 100-150 excl. btw. Aandachtspunt: Daikin is via comfycool duurder dan de Nova Air-merken, waardoor "Beste prijs-kwaliteit" (Perfera) in het prijsadvies boven "Premium" (ME Diamond) uitkomt; Rim beslist of de voorstellen wisselen of dat hij zijn Daikin-inkoopprijzen geeft.
- 26 tot 28 oktober 2026, branch `verbeteringen-26-10`, **online sinds 28-10-2026** (Rims akkoord na eigen controle op localhost; nagekeken op de live site), op Rims vraag "ga zo ver als je kunt":
  - Google: zie SEO hierboven;
  - gsm: alle tikdoelen minstens 44 px; tablet en computer: de zwevende bel- en WhatsApp-knop rechts onderaan (schermfoto's voor en na in `voorbeeld/ui-2026-10-26/`);
  - klantenblik (`ux-adviseur`, 18 punten, schermfoto's in `voorbeeld/ux-2026-10-26/`), hersteld: een zoekterm staat zichtbaar boven de lijst met een wisknop en een merk kiezen wist hem; de hulpkaart "Twijfelt u" één keer; aaneensluitende maten in de filter Vermogen ("tot 2,5 kW · tot 28 m²") en "voor een kamer tot ... m²" bij de kleinste maat; rode foutmeldingen met een rode rand om lege velden; prijsadvies "Ons voorstel" tot de klant kiest en "(kleinste maat van dit model)"; "Kleur" bij de kleurbolletjes; tellers zonder animatie; welkomstvenster enkel vanaf 1024 px; minibalk niet op Toestellen;
  - productfoto's: zie de inventaris in `voorbeeld/fotos-2026-10-26/` (toestellenbeheerder);
  - Home optie 1 (keuzeknoppen vóór de zoekbalk) en de kortere pagina Diensten zijn op 27-10 uitgevoerd (Rims keuze); het voorbeeld staat in `voorbeeld/home-en-diensten-2026-10-26/`.
  - 27-10, Rims wens "maak de website levend, de klant moet het toestel in elke stand kunnen zien": op de toestelpagina opent elke foto een viewer met inzoomen; extra foto's (klep open, zijkant, buitenunit ...) en de officiële merkvideo (YouTube, pas na een tik; Rim gaf toestemming, enkel merkkanalen) komen uit `js/toestel-media.js`. Rim filmt zelf geen clips. Uitgevoerd op 28-10: 57 toestellen met 160 extra foto's en 28 officiële merkvideo's (`voorbeeld/media/maak-media.ps1` maakt `js/toestel-media.js` uit de JSON-bestanden daar, met de bron per foto). Enkel Daikin en Nuova hebben echte foto's met open klep; de andere merken fotograferen dicht, daar toont de video de beweging. Geen extra foto's: Daikin CTXF-C, LG MT-cassette, de Nuova cassette/kanaalunit/mobiele airco en de losse buitenunits. Rim bekijkt alles eerst zelf op http://localhost:8080 voor er iets online gaat.
  - Nog te doen uit de klantenblik (tekstschrijver, in `index.html`): één naam voor de startknop ("Start uw aanvraag" / "Aanvraag starten" / "Start aanvraag" ...), "Uw installateur uit Dilsen-Stokkem" in de bovenste strook, "marketing-gelul" → "verkooppraatjes", SEER/SCOP en R32 kort uitleggen, Contact: één keuze "Nieuwe airco" (geen aparte "warmtepomp"), de merkpillen op Home als links naar de lijst en de gemeentepillen als gewone tekst, de zin op Diensten over het probleem beschrijven bij een herstelling.
  - Enkel Rim kan antwoorden: de gemeente per foto op Realisaties, hoelang een plaatsbezoek duurt en hoe snel de offerte volgt, of Fabio meekomt, of "gecertificeerd koeltechnicus" op Over ons mag (zonder nummer), en of er klanten zijn die een korte uitspraak of Google-review willen geven.
- Ook sinds 24 oktober 2026 online (Rims tweede akkoord van die dag):
  - vermogen kiezen op de toestelpagina (Rims melding: "kW aanpassen gaat niet"): de maten zijn knoppen, met de richtprijs voor die maat; het vermogen gaat mee in de offerte, WhatsApp en e-mail (zie README);
  - de donkerdere kleine tekst (Rims keuze: het voorstel uit `voorbeeld/kleur-tekst/`);
  - herstelling €100 tot €150 exclusief btw;
  - de grote controle als klant (Rims vraag, tester, 24-10): geen blokkerende fouten. Hersteld:
    - zoeken op vermogen ("3,5 kW") zoekt in de maten;
    - een oude filter Vermogen hangt niet meer vast bij een nieuwe zoekopdracht of bij "Alle toestellen van ...";
    - het gekozen toestel staat ook in de WhatsApp-tekst en in de aanvulling;
    - geen oud toestel meer in het formulier. Op een toestelpagina vraagt elke offerteknop (ook bovenaan en in de balk onderaan) een offerte voor dat toestel, met vermogen en gekozen kleur;
    - het logo gaat naar Home;
    - bij een zoekterm zonder resultaat (bv. Samsung) ook op Toestellen de zin over andere merken, met "onderhoud aanvragen" en "herstelling aanvragen";
    - op Diensten "Meestal €1.500 tot €3.000";
    - de tegel "Ook achter de kap netjes" gaat naar "Zo sluiten we aan";
    - in het prijsadvies springt Enter naar het volgende veld, is de gemeente verplicht en staan de kamers in de mail in de juiste volgorde;
    - op de kaarten in de lijst is de donkere maat die van de filter Vermogen (vroeger de grootste maat).
  - Nog open uit die controle (later, niet dringend): de prijsnotatie verschilt: "€ 2.450 – 3.050" op de toestelpagina, "€ 2.450 – € 3.050" in het prijsadvies. (De tikdoelen, de zwevende knoppen en de productfoto's zijn op 26-10 aangepakt, zie hieronder.)
- Promotieplan voor Instagram en andere kanalen, met voorbeeldberichten en reels: `voorbeeld/social/index.html` (prijzen bijgewerkt op 24-10-2026).
- Huisstijl: sinds 21 oktober 2026 staat het lettertype "C" (Source Serif + Source Sans) met de huidige kleuren online. De kleuren en lettertypes zijn nog in beoordeling: de voorstellen A (huidig, bijgewerkt), B (Vakwerk) en C (Helder) staan in `voorbeeld/huisstijl/`. Rim kiest.
- Audit vóór de livegang (21 oktober 2026): `AUDIT.md` (nog niet in git) en `voorbeeld/audit/`. Verbeterplan voor Diensten, Over ons en Realisaties (22 oktober 2026): `voorbeeld/paginas/verbeterplan.md`, met een echte fout in het aanvraagformulier (D-1) en foto's met Gree en Olimpia Splendid op Realisaties (R-2). Van beide is nog niets uitgevoerd: ze wachten op Rims antwoorden en akkoord.
- Ronde 1 van het verbeterplan staat sinds 22 oktober 2026 online (Rims akkoord): formulierfout, snelheid, merken op de foto's, Rims keuzes en kleinere fixes. De voorbeelden voor een nieuwe indeling van Diensten, Realisaties (fotoraster) en Over ons staan in `voorbeeld/ronde-1/` (README voor Rim). Rim kiest nog. De `.vercelignore` werkt: CLAUDE.md, .claude/ en .gitattributes geven op Vercel 404. Ronde 2 staat sinds 22 oktober 2026 ook online (Rims akkoord): richtprijzen rond de markt op Diensten, Home en in het prijsadvies, 6 jaar ervaring, herstelling op afspraak, vraag "Wat kost een airco?", geruststelling onder de knop, de link "Bereken uw richtprijs" op Home, het welkomstvenster maar één keer per bezoeker en niet op gsm, gewoon "warmtepomp" (geen lucht/lucht), en WhatsApp en e-mail met het toestel al ingevuld (toestelpagina's) plus een knop E-mail in de banden.
