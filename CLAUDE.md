# Reijners Technics – projectgeheugen voor Claude

Dit bestand lezen alle sessies en alle agents van het team. Hoe de site technisch werkt, staat in `README.md`.

## Het bedrijf

- Reijners Technics, zaakvoerder Rim Reijners: installateur van airco's (lucht/lucht-warmtepompen). Plaatsing, onderhoud en herstelling.
- Borreshoefstraat 12, 3650 Dilsen-Stokkem · +32 491 11 33 13 · reijnerstechnics@gmail.com · BTW BE 1021.765.138.
- Werkgebied: Dilsen-Stokkem, Maaseik, Bree, Genk, Hasselt, Tongeren en omgeving.
- Merken: Daikin, LG, Mitsubishi Electric, Mitsubishi Heavy Industries (MHI), Nuova en Toshiba.
- **Niet** in het aanbod (bewust overal verwijderd): lucht/water-warmtepompen, warmtepompboilers, het merk Ariston. Ook geen foto's van Gree of Olimpia Splendid (op 22-10-2026 van de site gehaald). Voeg ze nooit opnieuw toe.
- Beloftes op de site: gratis plaatsbezoek, binnen 24 uur teruggebeld door Rim zelf, rechtstreeks met de installateur, u beslist pas na de offerte.
- Rim is altijd zelf het aanspreekpunt. Fabio Lomma (eigen zaak: Lomma Technics) plaatst mee, maar is geen aanspreekpunt (Rim, 22-10-2026).
- Rim heeft een koeltechnisch certificaat. Het nummer en een foto van het certificaat komen nooit online (kans op misbruik).
- Rim plaatst al 6 jaar airco's (zijn antwoord op 22-10-2026). Herstellingen gebeuren op afspraak: er is geen storingsdienst 's avonds of in het weekend.
- Prijzen die Rim bevestigde: onderhoud €150 tot €200, afhankelijk van de situatie en het aantal toestellen (22-10-2026; met of zonder btw nog niet gezegd). Alle andere bedragen op de site zijn nog niet bevestigd.

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
  - donkerblauw `--ink` #16283d, goud `--gold` #e3a63e, lichtgoud `--gold-tint`, blauw `--sky` #3e7fb0, achtergrond `--paper` #f6f9fb;
  - Source Serif 4 voor titels (`--font-kop`) en Source Sans 3 voor tekst (`--font-tekst`), via Google Fonts in `index.html`.
- **Nu op de site, maar mag in een voorstel anders:**
  - een gouden knop voor de hoofdactie;
  - toestelkaarten met een label op de foto (Binnen- + buitenunit / Zonder buitenunit / Buitenunit);
  - het kW-blok (lichtgoud, "tot 7,1 kW" en elke maat als knopje).
- **Wat wel vastligt:**
  - de site mag er niet uitzien alsof ze door AI gemaakt is: geen lettertypes die je op elke AI-site ziet (Sora, Inter, Poppins), geen overdreven verlopen of glaseffecten;
  - eigen foto's van echte plaatsingen gaan voor op stockfoto's;
  - alles moet goed leesbaar zijn, ook op gsm, met voldoende contrast.

## Technische opbouw (kort)

- Statische site zonder build-stap: `index.html` (alle pagina's als `section[data-page]`, navigatie via #adressen), `css/style.css`, `js/main.js`, `js/prijzen.js` + `js/prijscalculator.js` (prijsadvies), `assets/img/`.
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
5. Pushen naar GitHub (`reijnerstechnics-hub/website-reijners-technics`, branch `main`) **pas na Rims uitdrukkelijke "akkoord" voor die wijziging**: `git switch main && git merge --ff-only <branch> && git push origin main`. Alleen de hoofdsessie pusht; agents nooit.
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
- SEO: de site is één pagina met #adressen; de detailpagina's van toestellen maakt JavaScript, dus Google vindt ze niet apart. Er is nog geen structured data (LocalBusiness), geen `sitemap.xml` en geen `robots.txt`.
- Er is nog geen eigen foto van een Mitsubishi Electric Diamond voor de wisselende foto's op de homepagina.
- Huisstijl: sinds 21 oktober 2026 staat het lettertype "C" (Source Serif + Source Sans) met de huidige kleuren online. De kleuren en lettertypes zijn nog in beoordeling: de voorstellen A (huidig, bijgewerkt), B (Vakwerk) en C (Helder) staan in `voorbeeld/huisstijl/`. Rim kiest.
- Audit vóór de livegang (21 oktober 2026): `AUDIT.md` (nog niet in git) en `voorbeeld/audit/`. Verbeterplan voor Diensten, Over ons en Realisaties (22 oktober 2026): `voorbeeld/paginas/verbeterplan.md`, met een echte fout in het aanvraagformulier (D-1) en foto's met Gree en Olimpia Splendid op Realisaties (R-2). Van beide is nog niets uitgevoerd: ze wachten op Rims antwoorden en akkoord.
- Ronde 1 van het verbeterplan staat sinds 22 oktober 2026 online (Rims akkoord): formulierfout, snelheid, merken op de foto's, Rims keuzes en kleinere fixes. De voorbeelden voor een nieuwe indeling van Diensten, Realisaties (fotoraster) en Over ons staan in `voorbeeld/ronde-1/` (README voor Rim). Rim kiest nog. De `.vercelignore` werkt: CLAUDE.md, .claude/ en .gitattributes geven op Vercel 404. Ronde 2 staat sinds 22 oktober 2026 ook online (Rims akkoord): richtprijzen rond de markt op Diensten, Home en in het prijsadvies, 6 jaar ervaring, herstelling op afspraak, vraag "Wat kost een airco?", geruststelling onder de knop, de link "Bereken uw richtprijs" op Home, en het welkomstvenster maar één keer per bezoeker en niet op gsm.
