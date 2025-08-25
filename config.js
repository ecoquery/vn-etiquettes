let etiquettesConfig = {
  saison: "2025 / 2026",
  nomGroupe: {
    /* "Groupe dans Comiti": "Groupe sur la carte" */
    MAÎTRES: "MAÎTRES",
    "ADULTES DEBUTANTS-Boulloche": "ADU-DEB",
    Benjamins: "Benjamins",
    Promotionnel: "Promotionnel",
    Avenirs: "Avenirs",
    Juniors: "Juniors",
    Seniors: "Seniors",
    "ADU-CSE-BPCESI": "ADU-CSE-BPCESI",
  },
  /* Groupes pour lesquels on affiche pas les créneaux ni les piscines */
  sansLieu: ["MAÎTRES"],
  /* Lieux sur l'étiquette. "" signifie pas de carte pour cette piscine */
  lieux: {
    "Piscine des Gratte Ciel": "",
    "Centre Nautique Etienne Gagnaire": "CNEG",
    "Piscine André Boulloche": "Boulloche",
  },
  sansEtiquette: [
    /* un groupe par ligne */
    "Officiel",
    "Membre CA",
    "Membre d'honneur",
  ],
};
