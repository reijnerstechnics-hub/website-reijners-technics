// =====================================================================
// EXTRA FOTO'S EN VIDEO PER TOESTEL (voor de toestelpagina's)
// ---------------------------------------------------------------------
// Per toestel (de sleutel is data-model van de kaart in index.html):
//   fotos: extra foto's naast de kaartfoto, elk { src, label, alt }
//          (webp 1000 x 1000 in assets/img/, naam t-<slug>-<n>.webp)
//   video: de officiële productvideo van het merk op YouTube: { youtube: id, titel, kanaal }
//          De video laadt pas als de klant op afspelen tikt (youtube-nocookie).
// Bronnen per foto staan in voorbeeld/media/ (buiten git). Rims wens (27-10-2026): de klant
// moet het toestel in elke stand kunnen bekijken (klep open, zijkant, buitenunit) en inzoomen.
// =====================================================================
var RT_MEDIA = {};
