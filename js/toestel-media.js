// =====================================================================
// EXTRA FOTO'S EN VIDEO PER TOESTEL (voor de toestelpagina's)
// ---------------------------------------------------------------------
// Per toestel (de sleutel is data-model van de kaart in index.html):
//   fotos: extra foto's naast de kaartfoto, elk { src, label, alt }
//          (webp 1000 x 1000 in assets/img/, naam t-<slug>-<n>.webp)
//   video: de officiële productvideo van het merk op YouTube: { youtube: id, titel, kanaal }
//          De video laadt pas als de klant op afspelen tikt (youtube-nocookie).
// Dit bestand wordt gemaakt door voorbeeld/media/maak-media.ps1 uit de JSON-bestanden daar
// (met de bron per foto; buiten git). Rims wens (27-10-2026): de klant moet het toestel in
// elke stand kunnen bekijken (klep open, zijkant, buitenunit) en inzoomen.
// =====================================================================
var RT_MEDIA ={
  "LG DualCool WZ-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-dualcool-wz-serie-2.webp",
        "label": "Klep dicht",
        "alt": "LG DualCool WZ binnenunit, vooraanzicht met gesloten klep"
      },
      {
        "src": "assets/img/t-lg-dualcool-wz-serie-3.webp",
        "label": "Klep open",
        "alt": "LG DualCool WZ binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-dualcool-wz-serie-4.webp",
        "label": "Zijkant",
        "alt": "LG DualCool WZ binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-dualcool-wz-serie-5.webp",
        "label": "Buitenunit",
        "alt": "LG DualCool WZ buitenunit, vooraanzicht"
      }
    ],
    "video": null
  },
  "LG DualCool Comfort Special E · EZ-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-dualcool-comfort-special-e-ez-serie-2.webp",
        "label": "Klep open",
        "alt": "LG DualCool Comfort EZ binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-dualcool-comfort-special-e-ez-serie-3.webp",
        "label": "Zijkant",
        "alt": "LG DualCool Comfort EZ binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-dualcool-comfort-special-e-ez-serie-4.webp",
        "label": "Buitenunit",
        "alt": "LG DualCool Comfort EZ buitenunit"
      }
    ],
    "video": null
  },
  "LG Standard Plus DualCool Special P · PZ-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-standard-plus-dualcool-special-p-pz-serie-2.webp",
        "label": "Klep open",
        "alt": "LG Standard Plus PZ binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-standard-plus-dualcool-special-p-pz-serie-3.webp",
        "label": "Zijkant",
        "alt": "LG Standard Plus PZ binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-standard-plus-dualcool-special-p-pz-serie-4.webp",
        "label": "Buitenunit",
        "alt": "LG Standard Plus PZ buitenunit"
      }
    ],
    "video": {
      "youtube": "Gra8Vsxo2Hw",
      "titel": "LG Klimaat | Installatie van een LG DUALCOOL Standard Plus airco bij een particuliere klant",
      "kanaal": "LG Benelux"
    }
  },
  "LG DualCool AI Air Special Smart Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-lg-dualcool-ai-air-special-smart-inverter-2.webp",
        "label": "Klep dicht",
        "alt": "LG DualCool AI Air Special binnenunit, vooraanzicht met gesloten klep"
      },
      {
        "src": "assets/img/t-lg-dualcool-ai-air-special-smart-inverter-3.webp",
        "label": "Klep open",
        "alt": "LG DualCool AI Air Special binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-dualcool-ai-air-special-smart-inverter-4.webp",
        "label": "Zijkant",
        "alt": "LG DualCool AI Air Special binnenunit van opzij"
      }
    ],
    "video": {
      "youtube": "nSt3Fle8De8",
      "titel": "LG DUALCOOL AI Air: Intelligente koeling, perfect afgestemd",
      "kanaal": "LG Benelux"
    }
  },
  "LG Deluxe AI H-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-deluxe-ai-h-serie-2.webp",
        "label": "Klep dicht",
        "alt": "LG Deluxe AI binnenunit, vooraanzicht met gesloten klep"
      },
      {
        "src": "assets/img/t-lg-deluxe-ai-h-serie-3.webp",
        "label": "Klep open",
        "alt": "LG Deluxe AI binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-deluxe-ai-h-serie-4.webp",
        "label": "Zijkant",
        "alt": "LG Deluxe AI binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-deluxe-ai-h-serie-5.webp",
        "label": "Afstandsbediening",
        "alt": "Afstandsbediening van de LG Deluxe AI"
      }
    ],
    "video": {
      "youtube": "alSkcP34nYk",
      "titel": "LG DUALCOOL AI: Slimme AI-koeling en -verwarming, perfect afgestemd",
      "kanaal": "LG Benelux"
    }
  },
  "LG Artcool AI Air Mirror": {
    "fotos": [
      {
        "src": "assets/img/t-lg-artcool-ai-air-mirror-2.webp",
        "label": "Binnenunit",
        "alt": "LG Artcool AI Air Mirror binnenunit, vooraanzicht in spiegelzwart"
      }
    ],
    "video": {
      "youtube": "xqz1A-Mm75k",
      "titel": "LG ARTCOOL AI Air: Intelligent cooling, artfully crafted | LG",
      "kanaal": "LG Global"
    }
  },
  "LG Artcool AI Matt Black": {
    "fotos": [
      {
        "src": "assets/img/t-lg-artcool-ai-matt-black-2.webp",
        "label": "Binnenunit",
        "alt": "LG Artcool AI Matt Black binnenunit met afstandsbediening"
      }
    ],
    "video": {
      "youtube": "xqz1A-Mm75k",
      "titel": "LG ARTCOOL AI Air: Intelligent cooling, artfully crafted | LG",
      "kanaal": "LG Global"
    }
  },
  "LG Artcool Gallery Special": {
    "fotos": [
      {
        "src": "assets/img/t-lg-artcool-gallery-special-2.webp",
        "label": "Vooraanzicht",
        "alt": "LG Artcool Gallery Special binnenunit met een kunstafbeelding in het kader"
      },
      {
        "src": "assets/img/t-lg-artcool-gallery-special-3.webp",
        "label": "Zijkant",
        "alt": "LG Artcool Gallery Special binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-artcool-gallery-special-4.webp",
        "label": "Klep open",
        "alt": "LG Artcool Gallery Special binnenunit met opengeklapt kader"
      }
    ],
    "video": null
  },
  "LG Artcool LCD Gallery Premium": {
    "fotos": [
      {
        "src": "assets/img/t-lg-artcool-lcd-gallery-premium-2.webp",
        "label": "Met afstandsbediening",
        "alt": "LG Artcool LCD Gallery Premium binnenunit met lcd-scherm en afstandsbediening"
      },
      {
        "src": "assets/img/t-lg-artcool-lcd-gallery-premium-3.webp",
        "label": "Vooraanzicht",
        "alt": "LG Artcool LCD Gallery Premium binnenunit, vooraanzicht met lcd-scherm"
      },
      {
        "src": "assets/img/t-lg-artcool-lcd-gallery-premium-4.webp",
        "label": "Zijkant",
        "alt": "LG Artcool LCD Gallery Premium binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-lg-artcool-lcd-gallery-premium-5.webp",
        "label": "Schuin",
        "alt": "LG Artcool LCD Gallery Premium binnenunit, van onderen schuin bekeken"
      }
    ],
    "video": {
      "youtube": "sLCkhNhhIN4",
      "titel": "LG ARTCOOL Gallery Premium, Air Conditioner Case-Study",
      "kanaal": "LG HVAC Solution Europe"
    }
  },
  "LG Vloermodel UQ-reeks": {
    "fotos": [
      {
        "src": "assets/img/t-lg-vloermodel-uq-reeks-2.webp",
        "label": "Binnenunit",
        "alt": "LG vloermodel UQ binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-lg-vloermodel-uq-reeks-3.webp",
        "label": "Afstandsbediening",
        "alt": "Afstandsbediening van het LG vloermodel UQ"
      },
      {
        "src": "assets/img/t-lg-vloermodel-uq-reeks-4.webp",
        "label": "Buitenunit",
        "alt": "LG buitenunit UUA1 bij het vloermodel UQ"
      }
    ],
    "video": null
  },
  "LG Standard Plus Smart Inverter Multi · PM05SP / PM15SP": {
    "fotos": [
      {
        "src": "assets/img/t-lg-standard-plus-smart-inverter-multi-pm05sp-pm15sp-2.webp",
        "label": "Klep open",
        "alt": "LG Standard Plus multi-split binnenunit met open klep"
      },
      {
        "src": "assets/img/t-lg-standard-plus-smart-inverter-multi-pm05sp-pm15sp-3.webp",
        "label": "Zijkant",
        "alt": "LG Standard Plus multi-split binnenunit, schuin van opzij"
      }
    ],
    "video": null
  },
  "LG Cassette 4-weg CT- en UT-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-cassette-4-weg-ct-en-ut-serie-2.webp",
        "label": "Met buitenunit",
        "alt": "LG 4-weg cassette met buitenunit"
      },
      {
        "src": "assets/img/t-lg-cassette-4-weg-ct-en-ut-serie-3.webp",
        "label": "Buitenunit",
        "alt": "LG buitenunit UUB1 voor de grotere 4-weg cassettes"
      }
    ],
    "video": {
      "youtube": "gPYdF7faq8Q",
      "titel": "De LG Dual Vane Cassette product film",
      "kanaal": "LG Benelux"
    }
  },
  "LG Kanaalunit CL / CM / UM / UB": {
    "fotos": [
      {
        "src": "assets/img/t-lg-kanaalunit-cl-cm-um-ub-2.webp",
        "label": "Binnenunit CL",
        "alt": "LG kanaalunit CL (lage druk), binnenunit"
      },
      {
        "src": "assets/img/t-lg-kanaalunit-cl-cm-um-ub-3.webp",
        "label": "Binnenunit CM",
        "alt": "LG kanaalunit CM (middendruk), binnenunit"
      },
      {
        "src": "assets/img/t-lg-kanaalunit-cl-cm-um-ub-4.webp",
        "label": "Buitenunit",
        "alt": "LG buitenunit UUA bij de kanaalunit"
      }
    ],
    "video": {
      "youtube": "xqW_4hkOIXo",
      "titel": "LG HVAC : New Single Concealed Duct | LG",
      "kanaal": "LG Global"
    }
  },
  "LG Ronde cassette": {
    "fotos": [
      {
        "src": "assets/img/t-lg-ronde-cassette-2.webp",
        "label": "Binnenunit",
        "alt": "LG ronde cassette, binnenunit van onderen"
      },
      {
        "src": "assets/img/t-lg-ronde-cassette-3.webp",
        "label": "Buitenunit",
        "alt": "LG buitenunit UUD bij de ronde cassette"
      }
    ],
    "video": {
      "youtube": "l-ojRjbDpVU",
      "titel": "LG Air Solutions: Indoor Round Cassette",
      "kanaal": "LG Australia"
    }
  },
  "LG Plafondmodel UV-serie": {
    "fotos": [
      {
        "src": "assets/img/t-lg-plafondmodel-uv-serie-2.webp",
        "label": "Binnenunit",
        "alt": "LG plafondmodel UV, binnenunit onder het plafond"
      },
      {
        "src": "assets/img/t-lg-plafondmodel-uv-serie-3.webp",
        "label": "Buitenunit",
        "alt": "LG buitenunit bij het plafondmodel UV"
      },
      {
        "src": "assets/img/t-lg-plafondmodel-uv-serie-4.webp",
        "label": "Afstandsbediening",
        "alt": "Afstandsbediening van het LG plafondmodel UV"
      }
    ],
    "video": null
  },
  "Toshiba Yukai": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-yukai-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba Yukai binnenunit, schuin van opzij"
      },
      {
        "src": "assets/img/t-toshiba-yukai-3.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij de Yukai"
      }
    ],
    "video": null
  },
  "Toshiba Haori": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-haori-2.webp",
        "label": "Lichtgrijs",
        "alt": "Toshiba Haori binnenunit met lichtgrijze stoffen hoes"
      },
      {
        "src": "assets/img/t-toshiba-haori-3.webp",
        "label": "Donkergrijs",
        "alt": "Toshiba Haori binnenunit met donkergrijze stoffen hoes"
      },
      {
        "src": "assets/img/t-toshiba-haori-4.webp",
        "label": "Hoes los",
        "alt": "Toshiba Haori binnenunit met de hoes er los overheen"
      },
      {
        "src": "assets/img/t-toshiba-haori-5.webp",
        "label": "Hoezen in kleur",
        "alt": "Verwisselbare hoezen voor de Toshiba Haori in beige, blauwgrijs, bruin en groen"
      }
    ],
    "video": {
      "youtube": "m_4bseIbj4E",
      "titel": "HAORI | Toshiba Climate Solutions Europe",
      "kanaal": "Toshiba Climate Solutions Europe"
    }
  },
  "Toshiba Daiseikai 10": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-daiseikai-10-2.webp",
        "label": "In wit",
        "alt": "Toshiba Daiseikai 10 binnenunit in wit, vooraanzicht"
      },
      {
        "src": "assets/img/t-toshiba-daiseikai-10-3.webp",
        "label": "In hout",
        "alt": "Toshiba Daiseikai 10 binnenunit met houten front, vooraanzicht"
      }
    ],
    "video": {
      "youtube": "slhvB0qgsbE",
      "titel": "Introducing Toshiba DAISEIKAI 10",
      "kanaal": "Toshiba Air Conditioning UK"
    }
  },
  "Toshiba Shorai Edge Kazumi": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-shorai-edge-kazumi-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba Shorai Edge Kazumi binnenunit in zwart, schuin van opzij"
      }
    ],
    "video": {
      "youtube": "uJvUKv0TLCc",
      "titel": "Introducing The Toshiba Shorai Edge",
      "kanaal": "Toshiba Air Conditioning UK"
    }
  },
  "Toshiba Wandmodel Digital Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-wandmodel-digital-inverter-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba wandmodel Digital Inverter binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-toshiba-wandmodel-digital-inverter-3.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij het wandmodel Digital Inverter"
      }
    ],
    "video": null
  },
  "Toshiba Bi-Flow vloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-bi-flow-vloermodel-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba Bi-Flow vloermodel binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-toshiba-bi-flow-vloermodel-3.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij het Bi-Flow vloermodel"
      }
    ],
    "video": null
  },
  "Toshiba Cassette 4-weg": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-cassette-4-weg-2.webp",
        "label": "Standaard",
        "alt": "Toshiba 4-weg cassette standaard, binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-cassette-4-weg-3.webp",
        "label": "Compact",
        "alt": "Toshiba 4-weg cassette compact, binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-cassette-4-weg-4.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij de 4-weg cassette"
      }
    ],
    "video": null
  },
  "Toshiba Kanaalunit": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-kanaalunit-2.webp",
        "label": "Standaard",
        "alt": "Toshiba kanaalunit standaard, binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-kanaalunit-3.webp",
        "label": "Slim",
        "alt": "Toshiba kanaalunit slim (lage inbouwhoogte), binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-kanaalunit-4.webp",
        "label": "Multi-split",
        "alt": "Toshiba kanaalunit voor multi-split, binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-kanaalunit-5.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij de kanaalunit"
      }
    ],
    "video": null
  },
  "Toshiba Plafondmodel Digital Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-plafondmodel-digital-inverter-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba plafondmodel Digital Inverter, binnenunit onder het plafond"
      },
      {
        "src": "assets/img/t-toshiba-plafondmodel-digital-inverter-3.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij het plafondmodel"
      }
    ],
    "video": null
  },
  "Toshiba Zuilmodel Digital Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-toshiba-zuilmodel-digital-inverter-2.webp",
        "label": "Binnenunit",
        "alt": "Toshiba zuilmodel Digital Inverter, staande binnenunit"
      },
      {
        "src": "assets/img/t-toshiba-zuilmodel-digital-inverter-3.webp",
        "label": "Buitenunit",
        "alt": "Toshiba buitenunit bij het zuilmodel"
      },
      {
        "src": "assets/img/t-toshiba-zuilmodel-digital-inverter-4.webp",
        "label": "Afstandsbediening",
        "alt": "Bedrade afstandsbediening van het Toshiba zuilmodel"
      }
    ],
    "video": null
  },
  "Mitsubishi Electric MSZ-HR instapreeks": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-msz-hr-instapreeks-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric MSZ-HR binnenunit, vooraanzicht met gesloten klep"
      }
    ],
    "video": {
      "youtube": "4_Q7B0P2zow",
      "titel": "RAC - MSZ-HR Basis",
      "kanaal": "Mitsubishi Electric Warmtepompen & Airconditioners"
    }
  },
  "Mitsubishi Electric MSZ-AY Compact": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ay-compact-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric MSZ-AY Compact binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ay-compact-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric MUZ-AY buitenunit voor de MSZ-AY Compact"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ay-compact-4.webp",
        "label": "Afstandsbediening",
        "alt": "Afstandsbediening van de Mitsubishi Electric MSZ-AY Compact"
      }
    ],
    "video": {
      "youtube": "qf9qEneYUUU",
      "titel": "RAC - MSZ-AY Standaard",
      "kanaal": "Mitsubishi Electric Warmtepompen & Airconditioners"
    }
  },
  "Mitsubishi Electric MSZ-EF Premium Design": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ef-premium-design-2.webp",
        "label": "Binnenunit wit",
        "alt": "Mitsubishi Electric MSZ-EF Premium Design binnenunit in natural white"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ef-premium-design-3.webp",
        "label": "In zilver",
        "alt": "Mitsubishi Electric MSZ-EF Premium Design binnenunit in zilver"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ef-premium-design-4.webp",
        "label": "In zwart",
        "alt": "Mitsubishi Electric MSZ-EF Premium Design binnenunit in onyx black"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ef-premium-design-5.webp",
        "label": "Afstandsbediening",
        "alt": "Afstandsbediening van de Mitsubishi Electric MSZ-EF Premium Design"
      }
    ],
    "video": {
      "youtube": "s7RAanoYaBE",
      "titel": "Mitsubishi Electric Design-lijn airconditioning voor thuis",
      "kanaal": "Mitsubishi Electric Warmtepompen & Airconditioners"
    }
  },
  "Mitsubishi Electric MSZ-LN Diamond": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric MSZ-LN Diamond binnenunit in natural white met afstandsbediening"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric MUZ-LN buitenunit voor de MSZ-LN Diamond"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-4.webp",
        "label": "In robijnrood",
        "alt": "Mitsubishi Electric MSZ-LN Diamond binnenunit in ruby red"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-5.webp",
        "label": "In zwart",
        "alt": "Mitsubishi Electric MSZ-LN Diamond binnenunit in onyx black"
      }
    ],
    "video": {
      "youtube": "RxVxQ87St6s",
      "titel": "MSZ LN wall mounted unit",
      "kanaal": "Mitsubishi Electric Belgium"
    }
  },
  "Mitsubishi Electric MSZ-LN Diamond Zubadan": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-zubadan-2.webp",
        "label": "Binnenunit zwart",
        "alt": "Mitsubishi Electric MSZ-LN Diamond Zubadan binnenunit in onyx black"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-zubadan-3.webp",
        "label": "In wit",
        "alt": "Mitsubishi Electric MSZ-LN Diamond Zubadan binnenunit in natural white met afstandsbediening"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-msz-ln-diamond-zubadan-4.webp",
        "label": "Afstandsbediening",
        "alt": "Zwarte afstandsbediening van de Mitsubishi Electric MSZ-LN Diamond Zubadan"
      }
    ],
    "video": {
      "youtube": "mBpYrIABA00",
      "titel": "Hyper Heating LN and FT Series (Europe) - Mitsubishi Electric Air Conditioner",
      "kanaal": "Mitsubishi Electric - Global"
    }
  },
  "Mitsubishi Electric MFZ-KT Vloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-mfz-kt-vloermodel-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric MFZ-KT vloermodel binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-mfz-kt-vloermodel-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric SUZ-M buitenunit voor het MFZ-KT vloermodel"
      }
    ],
    "video": {
      "youtube": "MXd62Ckxuns",
      "titel": "RAC - MFZ-KT Vloerunit",
      "kanaal": "Mitsubishi Electric Warmtepompen & Airconditioners"
    }
  },
  "Mitsubishi Electric Cassette 4-weg SLZ-M / PLA-M": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-cassette-4-weg-slz-m-pla-m-2.webp",
        "label": "Cassette SLZ-M",
        "alt": "Mitsubishi Electric SLZ-M compacte 4-weg cassette, van onder gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-cassette-4-weg-slz-m-pla-m-3.webp",
        "label": "Cassette PLA-M",
        "alt": "Mitsubishi Electric PLA-M 4-weg cassette, van onder gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-cassette-4-weg-slz-m-pla-m-4.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric SUZ-M buitenunit voor de cassette"
      }
    ],
    "video": {
      "youtube": "TtdhR9xGGeM",
      "titel": "4-Wege-Deckenkassetten SLZ-M Mitsubishi Electric",
      "kanaal": "Mitsubishi Electric - Living Environment Systems"
    }
  },
  "Mitsubishi Electric MLZ-KP Cassette 1-weg": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-mlz-kp-cassette-1-weg-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric MLZ-KP 1-weg cassette met wit paneel"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-mlz-kp-cassette-1-weg-3.webp",
        "label": "Zijkant",
        "alt": "Mitsubishi Electric MLZ-KP 1-weg cassette, schuin van onder gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-mlz-kp-cassette-1-weg-4.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric MXZ buitenunit voor de MLZ-KP cassette"
      }
    ],
    "video": {
      "youtube": "RpO-HFFR-jU",
      "titel": "Mitsubishi Electric - Eénzijdige cassette-unit MLZ",
      "kanaal": "Mitsubishi Electric Warmtepompen & Airconditioners"
    }
  },
  "Mitsubishi Electric SFZ-M Inbouwvloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-sfz-m-inbouwvloermodel-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Electric SFZ-M inbouwvloermodel binnenunit, zonder omkasting"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-sfz-m-inbouwvloermodel-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric SUZ-M buitenunit voor het SFZ-M inbouwvloermodel"
      }
    ],
    "video": null
  },
  "Mitsubishi Electric Kanaalunit SEZ-M / PEAD-M": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-kanaalunit-sez-m-pead-m-2.webp",
        "label": "Kanaalunit SEZ-M",
        "alt": "Mitsubishi Electric SEZ-M kanaalunit, schuin van voren gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-kanaalunit-sez-m-pead-m-3.webp",
        "label": "Kanaalunit PEAD-M",
        "alt": "Mitsubishi Electric PEAD-M kanaalunit, schuin van voren gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-kanaalunit-sez-m-pead-m-4.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric SUZ-M buitenunit voor de kanaalunit"
      }
    ],
    "video": null
  },
  "Mitsubishi Electric Vloer- en plafondmodel": {
    "fotos": [
      {
        "src": "assets/img/t-mitsubishi-electric-vloer-en-plafondmodel-2.webp",
        "label": "Plafondunit",
        "alt": "Mitsubishi Electric PCA-M vloer- en plafondmodel binnenunit, schuin van onder gezien"
      },
      {
        "src": "assets/img/t-mitsubishi-electric-vloer-en-plafondmodel-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Electric buitenunit voor het vloer- en plafondmodel"
      }
    ],
    "video": null
  },
  "MHI ZSP Standard": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-zsp-standard-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Heavy Industries ZSP Standard binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-mhi-zsp-standard-3.webp",
        "label": "Zijkant",
        "alt": "Mitsubishi Heavy Industries ZSP Standard binnenunit, schuin van opzij gezien"
      },
      {
        "src": "assets/img/t-mhi-zsp-standard-4.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries SRC buitenunit voor de ZSP Standard"
      }
    ],
    "video": null
  },
  "MHI ZS Premium": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-zs-premium-2.webp",
        "label": "Binnenunit wit",
        "alt": "Mitsubishi Heavy Industries ZS Premium binnenunit in wit"
      },
      {
        "src": "assets/img/t-mhi-zs-premium-3.webp",
        "label": "In titanium",
        "alt": "Mitsubishi Heavy Industries ZS Premium binnenunit in titanium"
      },
      {
        "src": "assets/img/t-mhi-zs-premium-4.webp",
        "label": "In zwart-wit",
        "alt": "Mitsubishi Heavy Industries ZS Premium binnenunit in zwart-wit"
      },
      {
        "src": "assets/img/t-mhi-zs-premium-5.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries SRC buitenunit voor de ZS Premium"
      }
    ],
    "video": {
      "youtube": "7_ieOUt29vc",
      "titel": "Mitsubishi Heavy Industries Air Conditioning - SRK-ZS",
      "kanaal": "Mitsubishi Heavy Industries Air Conditioning Europe Ltd"
    }
  },
  "MHI ZTL Standard Plus": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-ztl-standard-plus-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Heavy Industries ZTL Standard Plus binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-mhi-ztl-standard-plus-3.webp",
        "label": "Buitenunit en afstandsbediening",
        "alt": "Mitsubishi Heavy Industries buitenunit en afstandsbediening van de ZTL Standard Plus"
      }
    ],
    "video": null
  },
  "MHI ZSX Diamond Hyper": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-zsx-diamond-hyper-2.webp",
        "label": "Binnenunit wit",
        "alt": "Mitsubishi Heavy Industries ZSX Diamond Hyper binnenunit in wit"
      },
      {
        "src": "assets/img/t-mhi-zsx-diamond-hyper-3.webp",
        "label": "Zijkant",
        "alt": "Mitsubishi Heavy Industries ZSX Diamond Hyper binnenunit, schuin van opzij gezien"
      },
      {
        "src": "assets/img/t-mhi-zsx-diamond-hyper-4.webp",
        "label": "In titanium",
        "alt": "Mitsubishi Heavy Industries ZSX Diamond Hyper binnenunit in titanium"
      },
      {
        "src": "assets/img/t-mhi-zsx-diamond-hyper-5.webp",
        "label": "In zwart-wit",
        "alt": "Mitsubishi Heavy Industries ZSX Diamond Hyper binnenunit in zwart-wit"
      }
    ],
    "video": {
      "youtube": "jDuIYAwLTPQ",
      "titel": "Mitsubishi Heavy Industries SRK-ZSX series",
      "kanaal": "Mitsubishi Heavy Industries Air-Conditioning Europe, Ltd"
    }
  },
  "MHI Diamond Vloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-diamond-vloermodel-2.webp",
        "label": "Binnenunit",
        "alt": "Mitsubishi Heavy Industries Diamond vloermodel binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-mhi-diamond-vloermodel-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries SRC buitenunit voor het Diamond vloermodel"
      }
    ],
    "video": null
  },
  "MHI Cassette 4-weg FDTC / FDT": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-cassette-4-weg-fdtc-fdt-2.webp",
        "label": "Cassette",
        "alt": "Mitsubishi Heavy Industries FDT 4-weg cassette, van onder gezien"
      },
      {
        "src": "assets/img/t-mhi-cassette-4-weg-fdtc-fdt-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries Hyper Inverter buitenunit voor de cassette"
      }
    ],
    "video": {
      "youtube": "HqCi2HqvBqI",
      "titel": "Mitsubishi Heavy Industries FDT cassette air conditioning unit",
      "kanaal": "Mitsubishi Heavy Industries Air Conditioning Europe Ltd"
    }
  },
  "MHI Kanaalunit Premium / FDUM / FDU": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-kanaalunit-premium-fdum-fdu-2.webp",
        "label": "Kanaalunit",
        "alt": "Mitsubishi Heavy Industries FDU kanaalunit, schuin van voren gezien"
      },
      {
        "src": "assets/img/t-mhi-kanaalunit-premium-fdum-fdu-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries Hyper Inverter buitenunit voor de kanaalunit"
      },
      {
        "src": "assets/img/t-mhi-kanaalunit-premium-fdum-fdu-4.webp",
        "label": "Buitenunit groot vermogen",
        "alt": "Mitsubishi Heavy Industries Hyper Inverter buitenunit voor de kanaalunit van 10 tot 14 kW"
      }
    ],
    "video": null
  },
  "MHI Plafondmodel FDE": {
    "fotos": [
      {
        "src": "assets/img/t-mhi-plafondmodel-fde-2.webp",
        "label": "Plafondunit",
        "alt": "Mitsubishi Heavy Industries FDE plafondmodel binnenunit, schuin van onder gezien"
      },
      {
        "src": "assets/img/t-mhi-plafondmodel-fde-3.webp",
        "label": "Buitenunit",
        "alt": "Mitsubishi Heavy Industries Hyper Inverter buitenunit voor het plafondmodel"
      }
    ],
    "video": null
  },
  "Nuova Infinity AI Smart": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-infinity-ai-smart-2.webp",
        "label": "Klep open",
        "alt": "Nuova Infinity AI Smart binnenunit in wit, vooraanzicht met open klep"
      },
      {
        "src": "assets/img/t-nuova-infinity-ai-smart-3.webp",
        "label": "Zijkant",
        "alt": "Nuova Infinity AI Smart binnenunit in wit, zijaanzicht met open klep"
      },
      {
        "src": "assets/img/t-nuova-infinity-ai-smart-4.webp",
        "label": "In zwart",
        "alt": "Nuova Infinity AI Smart binnenunit in mat zwart, vooraanzicht"
      },
      {
        "src": "assets/img/t-nuova-infinity-ai-smart-5.webp",
        "label": "In zilver",
        "alt": "Nuova Infinity AI Smart binnenunit in mat zilver, vooraanzicht"
      }
    ],
    "video": null
  },
  "Nuova Premium Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-premium-inverter-2.webp",
        "label": "Klep open",
        "alt": "Nuova Premium Inverter binnenunit, vooraanzicht met open klep"
      },
      {
        "src": "assets/img/t-nuova-premium-inverter-3.webp",
        "label": "Zijkant",
        "alt": "Nuova Premium Inverter binnenunit, schuin van links met open klep"
      },
      {
        "src": "assets/img/t-nuova-premium-inverter-4.webp",
        "label": "Buitenunit",
        "alt": "Nuova buitenunit, voorzijde"
      },
      {
        "src": "assets/img/t-nuova-premium-inverter-5.webp",
        "label": "Zijkant, profiel",
        "alt": "Nuova Premium Inverter binnenunit, zijkant in profiel"
      }
    ],
    "video": null
  },
  "Nuova Stellar Inverter": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-stellar-inverter-2.webp",
        "label": "Klep open",
        "alt": "Nuova Stellar Inverter binnenunit in wit, vooraanzicht met open uitblaasklep"
      },
      {
        "src": "assets/img/t-nuova-stellar-inverter-3.webp",
        "label": "Zijkant",
        "alt": "Nuova Stellar Inverter binnenunit in wit, zijaanzicht met open uitblaasklep"
      },
      {
        "src": "assets/img/t-nuova-stellar-inverter-4.webp",
        "label": "Buitenunit",
        "alt": "Nuova buitenunit, voorzijde"
      },
      {
        "src": "assets/img/t-nuova-stellar-inverter-5.webp",
        "label": "In zwart mirror",
        "alt": "Nuova Stellar Inverter binnenunit in zwart mirror, vooraanzicht"
      }
    ],
    "video": null
  },
  "Nuova Vloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-vloermodel-2.webp",
        "label": "Binnenunit",
        "alt": "Nuova vloermodel binnenunit (console), schuin vooraanzicht"
      }
    ],
    "video": null
  },
  "Nuova Polar Plus monoblock 2,5 kW": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-polar-plus-monoblock-2-5-kw-2.webp",
        "label": "Achterkant",
        "alt": "Nuova Polar Plus monoblock, achterkant met de twee muurdoorvoeren"
      }
    ],
    "video": null
  },
  "Nuova Polar Pro monoblock 4,0 kW": {
    "fotos": [
      {
        "src": "assets/img/t-nuova-polar-pro-monoblock-4-0-kw-2.webp",
        "label": "Achterkant",
        "alt": "Nuova Polar Pro monoblock, achterkant met de twee muurdoorvoeren"
      }
    ],
    "video": null
  },
  "Daikin Sensira": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-sensira-2.webp",
        "label": "Vooraanzicht",
        "alt": "Daikin Sensira FTXF-F binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-sensira-3.webp",
        "label": "Zijkant",
        "alt": "Daikin Sensira FTXF-F binnenunit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-sensira-4.webp",
        "label": "Buitenunit",
        "alt": "Daikin Sensira buitenunit, voorzijde"
      },
      {
        "src": "assets/img/t-daikin-sensira-5.webp",
        "label": "Afstandsbediening",
        "alt": "Daikin afstandsbediening ARC470A1 van de Sensira"
      }
    ],
    "video": null
  },
  "Daikin FTXF-F": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-ftxf-f-2.webp",
        "label": "Zijkant",
        "alt": "Daikin FTXF-F binnenunit, schuin van rechtsonder"
      },
      {
        "src": "assets/img/t-daikin-ftxf-f-3.webp",
        "label": "Vooraanzicht",
        "alt": "Daikin FTXF-F binnenunit, vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-ftxf-f-4.webp",
        "label": "Buitenunit",
        "alt": "Daikin buitenunit van de FTXF-F, voorzijde"
      },
      {
        "src": "assets/img/t-daikin-ftxf-f-5.webp",
        "label": "Afstandsbediening",
        "alt": "Daikin afstandsbediening ARC470A1 van de FTXF-F"
      }
    ],
    "video": null
  },
  "Daikin Comfora": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-comfora-2.webp",
        "label": "Zijkant",
        "alt": "Daikin Comfora FTXP-N binnenunit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-comfora-3.webp",
        "label": "Buitenunit",
        "alt": "Daikin Comfora buitenunit, schuin vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-comfora-4.webp",
        "label": "Afstandsbediening",
        "alt": "Daikin afstandsbediening ARC480A van de Comfora"
      }
    ],
    "video": {
      "youtube": "crmROzOXfLc",
      "titel": "Daikin Comfora FTXP-M Bluevolution R-32 wandmodel",
      "kanaal": "Daikin Nederland"
    }
  },
  "Daikin Perfera": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-perfera-2.webp",
        "label": "Zijkant",
        "alt": "Daikin Perfera FTXM-A binnenunit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-perfera-3.webp",
        "label": "Klep open",
        "alt": "Daikin Perfera FTXM-A binnenunit, detail van de open uitblaasklep"
      },
      {
        "src": "assets/img/t-daikin-perfera-4.webp",
        "label": "Buitenunit",
        "alt": "Daikin Perfera buitenunit, voorzijde"
      },
      {
        "src": "assets/img/t-daikin-perfera-5.webp",
        "label": "Grote maten",
        "alt": "Daikin Perfera FTXM60-71A binnenunit (6,0 en 7,1 kW), vooraanzicht"
      }
    ],
    "video": {
      "youtube": "EBdushaTpv4",
      "titel": "DAIKIN PERFERA: Het zuinigste wandmodel op de markt",
      "kanaal": "Daikin Nederland"
    }
  },
  "Daikin Stylish": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-stylish-2.webp",
        "label": "Zijkant",
        "alt": "Daikin Stylish FTXA-CW binnenunit in wit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-stylish-3.webp",
        "label": "Klep open",
        "alt": "Daikin Stylish binnenunit in wit, detail van de open uitblaasklep"
      },
      {
        "src": "assets/img/t-daikin-stylish-4.webp",
        "label": "Buitenunit",
        "alt": "Daikin Stylish buitenunit RXA, schuin vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-stylish-5.webp",
        "label": "In zwart",
        "alt": "Daikin Stylish FTXA-CB binnenunit in zwart, vooraanzicht"
      }
    ],
    "video": {
      "youtube": "kyIP_uGYSWk",
      "titel": "Daikin Stylish wandmodel",
      "kanaal": "Daikin Belux"
    }
  },
  "Daikin Emura": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-emura-2.webp",
        "label": "Zijkant, wit",
        "alt": "Daikin Emura FTXJ-AW binnenunit in wit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-emura-3.webp",
        "label": "In wit",
        "alt": "Daikin Emura FTXJ-AW binnenunit in wit, vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-emura-4.webp",
        "label": "In zwart",
        "alt": "Daikin Emura FTXJ-AB binnenunit in zwart, vooraanzicht"
      },
      {
        "src": "assets/img/t-daikin-emura-5.webp",
        "label": "Afstandsbediening",
        "alt": "Daikin afstandsbediening ARC488A1 van de Emura"
      }
    ],
    "video": {
      "youtube": "SEtxGK2YgRA",
      "titel": "Ontdek de nieuwe Daikin Emura",
      "kanaal": "Daikin Nederland"
    }
  },
  "Daikin Perfera vloermodel": {
    "fotos": [
      {
        "src": "assets/img/t-daikin-perfera-vloermodel-2.webp",
        "label": "Zijkant",
        "alt": "Daikin Perfera vloermodel FVXM-A binnenunit, schuin van links"
      },
      {
        "src": "assets/img/t-daikin-perfera-vloermodel-3.webp",
        "label": "Klep open",
        "alt": "Daikin Perfera vloermodel, detail van de open uitblaasklep bovenaan"
      },
      {
        "src": "assets/img/t-daikin-perfera-vloermodel-4.webp",
        "label": "Afstandsbediening",
        "alt": "Daikin afstandsbediening van het Perfera vloermodel"
      },
      {
        "src": "assets/img/t-daikin-perfera-vloermodel-5.webp",
        "label": "Buitenunit",
        "alt": "Daikin Perfera buitenunit, voorzijde"
      }
    ],
    "video": {
      "youtube": "HPzPgg_p3lM",
      "titel": "Daikin FVXM-A",
      "kanaal": "Daikin Belux"
    }
  }
};
