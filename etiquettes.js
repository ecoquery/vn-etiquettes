// Faire des étiquettes nominatives et avec la liste des créneaux
// Impr par ordre alpha par activite
// prévoir d'imprimer en plusieurs fois

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Fonctions liées à l'impression
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Génère une étiquette à imprimer
 * @param {*} nom nom de l'adhérent
 * @param {*} creneaux créneaux pris par l'adhérent
 * @param {*} saison saison à afficher sur la carte
 * @returns le code xml de l'étiquette
 */
function genereLabelContent(nom, creneaux, saison) {
  // - creneaux: liste des creneaux (acronyme jour heure piscine). si plusieurs creneaux, utiliser \n
  // - saison: annee scolaire, e.g. 2021 / 2022
  return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
	<PaperOrientation>Portrait</PaperOrientation>
	<Id>Small30334</Id>
	<IsOutlined>false</IsOutlined>
	<PaperName>30334 2-1/4 in x 1-1/4 in</PaperName>
	<DrawCommands>
		<RoundRectangle X="0" Y="0" Width="3240" Height="1800" Rx="270" Ry="270" />
	</DrawCommands>
	<ObjectInfo>
		<ImageObject>
			<Name>GRAPHISME</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>False</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<Image>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</Image>
			<ScaleMode>Uniform</ScaleMode>
			<BorderWidth>0</BorderWidth>
			<BorderColor Alpha="255" Red="0" Green="0" Blue="0" />
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Center</VerticalAlignment>
		</ImageObject>
		<Bounds X="118" Y="86" Width="541.947448730469" Height="553.817626953125" />
	</ObjectInfo>
	<ObjectInfo>
		<TextObject>
			<Name>TEXTE</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>False</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">VILLEURBANNE NATATION
</String>
					<Attributes>
						<Font Family="Calibri" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
				<Element>
					<String xml:space="preserve">SAISON ${saison} </String>
					<Attributes>
						<Font Family="Calibri" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
		</TextObject>
		<Bounds X="759.157653808594" Y="100.363212585449" Width="2357.71240234375" Height="559.752685546875" />
	</ObjectInfo>
	<ObjectInfo>
		<AddressObject>
			<Name>ADRESSE_2</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">${creneaux}</String>
					<Attributes>
						<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
			<ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>
			<BarcodePosition>AboveAddress</BarcodePosition>
			<LineFonts>
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
			</LineFonts>
		</AddressObject>
		<Bounds X="195.000000000001" Y="1059" Width="2868" Height="599.999999999999" />
	</ObjectInfo>
	<ObjectInfo>
		<AddressObject>
			<Name>ADRESSE_1</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">${nom}</String>
					<Attributes>
						<Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
			<ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>
			<BarcodePosition>AboveAddress</BarcodePosition>
			<LineFonts>
				<Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
			</LineFonts>
		</AddressObject>
		<Bounds X="159.000000000001" Y="687" Width="2892" Height="276" />
	</ObjectInfo>
</DieCutLabel>
    `;
}

// loads all supported printers into a combo box
function loadPrinters() {
  let printers = dymo.label.framework.getPrinters();
  if (printers.length == 0) {
    console.log("No DYMO printers are installed. Install DYMO printers.");
    return [];
  }

  return printers
    .filter((p) => p.printerType == "LabelWriterPrinter")
    .map((p) => p.name);
}

/**
 * Lance les impressions concernant les membres affichés
 * @param {*} data les données de l'application
 * @param {*} membres liste des membres à imprimer
 * @param {bool} onlyPreview ne pas imprimer, simplement changer l'affichage
 * @param {number} tempo attente entre deux impressions
 * @param {*} idx indice à partir duquel imprimer les membres
 */
function printAll(data, membres, onlyPreview, tempo, idx) {
  console.log("Printing", membres, idx);
  if (idx === undefined) {
    idx = 0;
  }
  if (idx >= membres.length) {
    return;
  }
  data.membreAffiche = membres[idx];
  updatePage(data);
  if (!onlyPreview) {
    let label = dymo.label.framework.openLabelXml(labelData);
    label.print(data.printers[0]);
  }
  setTimeout(() => printAll(data, membres, onlyPreview, tempo, idx + 1), tempo);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Fonctions liées aux données de l'application
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Lit une date extraite de comiti
 * @param {string} dateString date au format dd-mm-YYY
 * @return {Date} la date lue
 */
function litDate(dateString) {
  if (dateString) {
    [d, m, y, ..._] = dateString.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  } else {
    return undefined;
  }
}

/**
 * Données de chaque membre pour générer les étiquettes
 * @param {*} comitiData donnes comiti
 * @returns donnes agrégées par membre
 */
function makeDonneesMembres(comitiData) {
  membres = {};
  for (row of comitiData) {
    id = row["Numéro Comiti"];
    if (membres[id] === undefined) {
      membres[id] = [];
    }
    membres[id].push(row);
  }
  result = {};
  for (id in membres) {
    rows = membres[id];
    m = {
      id: id,
      nom: rows[0]["Nom"] + " " + rows[0]["Prénom"],
      creneaux: rows.map((r) => r["Catégorie"]),
      dateInscr: Math.min(
        ...rows.map((r) => r["Date de inscription"]).map(litDate)
      ),
    };
    result[id] = m;
  }
  return result;
}

/**
 * Filtre les membres pour la sélection d'activité /  de catégorie en cours
 * @param {*} data les donnes de l'application
 * @param {*} categorie la categorie sélectionnée ou undefined
 * @param {*} activite l'activité selectionnée
 */
function membresPourCategorieActivite(data) {
  categorie = data.categorie;
  activite = data.activite;
  if (data.comiti === undefined) {
    return [];
  }
  membres = Object.values(makeDonneesMembres(data.comiti));
  let filterFunction;
  if (categorie !== undefined && categorie !== "tout") {
    console.log("filtering wrt categorie " + categorie);
    filterFunction = (m) => m.creneaux.some((c) => c === categorie);
  } else if (activite !== undefined) {
    console.log("filtering wrt activite " + activite);
    filterFunction = (m) =>
      m.creneaux.some((c) => data.categorieActivite[c] === activite);
  } else {
    // console.log("Nobody");
    filterFunction = (m) => false;
  }
  filterFrom = data.from ? (m) => m.dateInscr >= data.from : (m) => true;
  filterTo = data.to ? (m) => m.dateInscr <= data.to : (m) => true;
  result = membres.filter(filterFunction).filter(filterFrom).filter(filterTo);
  return result;
}

/**
 * Ajoute le lien catégorie -> activite dans le champs categorieActivite des données de l'application
 * @param {*} data les donnes de l'application
 */
function addCategorieActiviteMapping(data) {
  if (data.comiti === undefined) {
    data.categorieActivite = undefined;
  } else {
    m = {};
    for (raw of data.comiti) {
      categorie = raw["Catégorie"];
      activite = raw["Nom spécifique activité"];
      if (
        categorie !== undefined &&
        activite !== undefined &&
        m[categorie] === undefined
      ) {
        m[categorie] = activite;
      }
    }
    data.categorieActivite = m;
  }
}

/**
 * Renvoie les différentes valeurs pour une colonne comiti.
 * @param {string} colonne colonne à extraire
 * @param {*} comitiData donnes comiti
 */
function getComitiValues(colonne, comitiData) {
  rawValues = comitiData
    .map((x) => x[colonne])
    .filter((x) => x !== undefined && x !== "");
  dictinctValues = [...new Set(rawValues)].sort();
  return dictinctValues;
}

/**
 * Renvoie les différentes categories présentes dans les données comiti.
 * @param {*} comitiData donnes comiti
 */
function getCategories(comitiData) {
  return getComitiValues("Catégorie", comitiData);
}

/**
 * Renvoie les différentes activités présentes dans les données comiti.
 * @param {*} comitiData donnes comiti
 */
function getActivites(comitiData) {
  return getComitiValues("Nom spécifique activité", comitiData);
}

/**
 * Affiche dans la console les catégories qui ne sont pas mappées dans le
 * dictionnaire afficheCrenaux.
 * @param {*} data les données de l'application
 */
function logCategorieManquantesDansAfficheCreneaux(data) {
  data.categories
    .filter((c) => data.afficheCreneaux[c] === undefined)
    .filter((c) => data.sansEtiquette.indexOf(c) < 0)
    .forEach((c) => console.log("Description print manquante: ", c));
}

/**
 * Mets à jour les données de l'application en fonction des données reçues dans comiti
 * @param {*} data les données de l'application
 * @param {*} comitiData les données issues de comiti
 */
function updateComitiData(data, comitiData) {
  // TODO
  console.log(`Le fichier comiti contient ${comitiData.length} lignes`);
  data.comiti = comitiData;
  addCategorieActiviteMapping(data);
  data.activites = getActivites(comitiData);
  data.categories = getCategories(comitiData);
  logCategorieManquantesDansAfficheCreneaux(data);
  updatePage(data);
}

/**
 * Recalcule les données intermédiaires de l'application
 * @param {*} data les données de l'application
 */
function updateApplicationData(data) {
  // selectedActivity = document.getElementById("select-activite").value;
  // data.activite = selectedActivity ? selectedActivity : "Aucune";
  // selectedCategorie = document.getElementById("select-categorie").value;
  // data.categorie = selectedCategorie ? selectedCategorie : "tout";
  membres = membresPourCategorieActivite(data, data.categorie, data.activite);
  membres.sort((a, b) => (a.nom < b.nom ? -1 : a.nom > b.nom ? 1 : 0));
  data.membres = membres.map((m) => ({
    ...m,
    creneaux: m.creneaux.map((c) =>
      data.afficheCreneaux[c] !== undefined ? data.afficheCreneaux[c] : c
    ),
  }));
  if (data.activite === "Aucune" || data.activite === undefined) {
    console.log("Pas d'étiquette");
    data.membreAffiche = undefined;
  } else if (
    data.membreAffiche === undefined ||
    data.membres.every((m) => m.id != data.membreAffiche.id)
  ) {
    console.log(`activite dans update: ${data.activite}`);
    data.membreAffiche = data.membres[0];
  }
}

/**
 * Charge le fichier comiti indiqué dans le formulaire
 * @param {*} data Le données de l'application
 */
function loadComitiFile(data, fileElt) {
  if (fileElt.files.length > 0) {
    console.log("Loading comiti file");
    Papa.parse(fileElt.files[0], {
      complete: function (results) {
        updateComitiData(data, results.data);
      },
      header: true,
    });
  } else {
    console.log("No comiti file selected");
  }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Fonctions liées à l'interface
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Enregistre un callback appelé lors du chargement du fichier comiti
 * @param {*} data données de l'application
 */
function registerComitiFileAction(data) {
  fileElt = document.getElementById("file-comiti");
  fileElt.onchange = function () {
    loadComitiFile(data, fileElt);
  };
}

/**
 * Mets à jour la zone d'informations sur le fichier comiti
 * @param {*} data les données de l'application
 */
function updateComitiInfos(data) {
  comitiInfos = document.getElementById("z-comiti-infos");
  // console.debug(`Updating comiti infos with ${data.comiti}`);
  if (data.comiti !== undefined) {
    comitiInfos.innerHTML = `(${data.comiti.length} inscriptions)`;
  } else {
    comitiInfos.innerHTML = "";
  }
}

/**
 * Mets à jour le menu des catégories en fonction du csv
 * @param {*} data les données de l'application
 */
function updateCategorieSelect(data) {
  let catagoriesSelect = document.getElementById("select-categorie");
  let content;
  if (data.comiti === undefined) {
    content = `<option selected="selected">Aucune</option>`;
  } else {
    activite = data.activite;
    content = `<option ${
      data.categorie === "tout" ? `selected="selected"` : ""
    }>tout</option>`;
    content += data.categories //getCategories(data.comiti)
      .filter((c) => data.categorieActivite[c] === activite)
      .map(
        (c) =>
          `<option id="${c}" ${
            data.categorie === c ? `selected="selected"` : ""
          }>${c}</option>`
      )
      .join("");
  }
  catagoriesSelect.innerHTML = content;
  catagoriesSelect.onchange = () => {
    data.categorie = catagoriesSelect.value;
    data.membreAffiche = undefined;
    updatePage(data);
  };
}

/**
 * Mets à jour le menu des activités en fonction du csv
 * @param {*} data les données de l'application
 */
function updateActiviteSelect(data) {
  let activiteSelect = document.getElementById("select-activite");
  let content;
  if (data.comiti === undefined) {
    content = `<option selected="selected">Aucune</option>`;
  } else {
    activites = data.activites;
    if (data.activite === undefined) {
      data.activite = "Aucune"; //activites[0];
      data.categorie = "tout";
    }
    content = `<option >Aucune</option>`;
    content += activites
      .map(
        (c) =>
          `<option id="${c}" ${
            data.activite === c ? `selected="selected"` : ""
          }>${c}</option>`
      )
      .join("");
  }
  activiteSelect.innerHTML = content;
  activiteSelect.onchange = () => {
    data.activite = activiteSelect.value;
    data.categorie = "tout";
    updatePage(data);
  };
}

/**
 * Mets à jour la table des membres, filtrée
 * @param {*} data donnes de l'application
 */
function updateTableMembres(data) {
  if (data.comiti !== undefined) {
    membres = data.membres;
    // membresPourCategorieActivite(data, categorie, activite);
    // membres.sort((a, b) => (a.nom < b.nom ? -1 : a.nom > b.nom ? 1 : 0));
    document.getElementById("tbody-membres").innerHTML = membres
      .map(
        (m) =>
          `<tr id="ligne-membre-${m.id}" class="${
            data.membreAffiche && data.membreAffiche.id === m.id
              ? "selectionne"
              : ""
          }"><td>${m.id}</td><td>${m.nom}</td><td>${m.creneaux.join(
            ", "
          )}</td></tr>`
      )
      .join("");
    membres.forEach((m) => {
      document.getElementById(`ligne-membre-${m.id}`).onclick = () => {
        data.membreAffiche = membres.filter((m2) => m2.id === m.id)[0];
        updatePage(data);
      };
    });
  }
}

/**
 * Mets à jour la zone de preview de l'étiquette
 * @param {*} data données de l'application
 */
function updatePreview(data) {
  if (data.membreAffiche !== undefined) {
    m = data.membreAffiche;
    labelData = genereLabelContent(m.nom, m.creneaux.join("\n"), "2022 / 2023");
    let label = dymo.label.framework.openLabelXml(labelData);
    let pngData = label.render();
    document.getElementById("preview").innerHTML = `<img id="previewImage">`;
    let labelImage = document.getElementById("previewImage");
    labelImage.src = "data:image/png;base64," + pngData;
    document.getElementById("btn-print").onclick = () => {
      label.print(data.printers[0]);
    };
  } else {
    document.getElementById("preview").innerHTML = "";
  }
}

/**
 * Enregistre le callback sur le clic pour tout imprimer
 * @param {*} data les données de l'application
 */
function registerPrintAll(data) {
  document.getElementById("btn-print-all").onclick = () => {
    printAll(data, data.membres, true, 2000);
  };
}

/**
 * Mets à jour le contenu de la page
 * @param {*} data Le données de l'application
 */
function updatePage(data) {
  updateApplicationData(data);
  registerComitiFileAction(data);
  updateComitiInfos(data);
  updateActiviteSelect(data);
  updateCategorieSelect(data);
  updateTableMembres(data);
  updatePreview(data);
  registerPrintAll(data);
}

/**
 * Mets en place les calendriers pour les dates de sélection des inscriptions
 * @param {*} data les données de l'application
 */
function setupDatePickers(data) {
  let options = {
    autohide: true,
    clearBtn: true,
    format: "dd/mm/yyyy",
    todayBtn: true,
    todayHighlight: true,
    weekStart: 1,
  };
  let inputFrom = document.getElementById("date-from");
  let dateFrom = new Datepicker(inputFrom, options);
  let inputTo = document.getElementById("date-to");
  let dateTo = new Datepicker(inputTo, options);
  inputFrom.addEventListener("changeDate", () => {
    data.from = dateFrom.getDate();
    updatePage(data);
  });
  inputTo.addEventListener("changeDate", () => {
    data.to = dateTo.getDate();
    updatePage(data);
  });
  data.from = dateFrom.getDate();
  data.to = dateTo.getDate();
}

// Actions à effectuer au démarrage de l'application
document.addEventListener("DOMContentLoaded", function () {
  let data = {
    afficheCreneaux: {
      "ADO - A1-1 - 14-17 ans - Maitrise 1-2 nages":
        "A1-1 - Me 20h - Boulloche",
      "ADO - A1-2 - 14-17 ans - Maitrise 1-2 nages":
        "A1-2 - Ve 20h - Boulloche",
      "ADO - A2-1 - 14-17 ans - Maitrise 3-4 nages":
        "A2-1 - Me 20h - Boulloche",
      "ADO - A2-2 - 14-17 ans - Maitrise 3-4 nages": "A2-2 - Me 16h - CNEG",
      "ADO - A2-3 - 14-17 ans - Maitrise 3-4 nages": "A2-3 - Me 17h - CNEG",
      "ADO - A2-4 - 14-17 ans - Maitrise 3-4 nages": "A2-4 - Ve 20h - CNEG",
      "ADU1 - 3/4 nages": "ADU1 - Lu 07h - CNEG",
      "ADU2 - 1/2 nages": "ADU2 - Lu 12h30 - Boulloche",
      "ADU3 - 3-4 nages": "ADU3 - Lu 12h30 - Boulloche",
      "ADU4 - 1/2 nages": "ADU4 - Lu 21h - CNEG",
      "ADU5 -3-4 nages": "ADU5 - Lu 21h - CNEG",
      "ADU6 - 3-4 nages": "AD6 - Ma 12h - CNEG",
      "ADU7 - 3-4 nages": "ADU7 - Ma 20h - CNEG",
      "ADU8 - 1-2 nages": "ADU8 - Ma 20h - CNEG",
      "ADU9 - 1-2 nages": "ADU9 - Me 20h - CNEG",
      "ADU10 -3-4 nages": "ADU10 - Me 20h - CNEG",
      "ADU11 3-4 nages": "ADU11 - Me 21h - CNEG",
      "ADU12 - 3/4 nages": "ADU12 - Me 21h - CNEG",
      "ADU13 - 1-2 nages": "ADU13 - Je 20h - Boulloche",
      "ADU14 - 3-4 nages": "ADU14 - Je 20h - Boulloche",
      "ADU15 - 3/4 nages": "ADU15 - Ve 07h - CNEG",
      "ADU16 -1-2 nages": "ADU16 - Ve 11h30 - Boulloche",
      "ADU17 -3/4 nages": "ADU17 - Ve 11h30 - Boulloche",
      "ADU18 - 1-2 nages": "ADU18 - Ve 12h30 - Boulloche",
      "ADU19 - 3/4 nages": "ADU19 - Ve 12h30 - Boulloche",
      "ADU20 - 1-2 nages": "ADU20 - Ve 20h - CNEG",
      "ADU21 - 3/4 nages": "ADU21 - Ve 20h - CNEG",
      "ADULTES DEBUTANTS -DEB1": "DEB1 - Je 20h - Boulloche",
      "Dauphin Bronze - DB15 - 5-6 ans": "DB15 - Sa 11h - Boulloche",
      "Dauphin Bronze - DB16 - 7-8 ans": "DB16 - Sa 12h - Boulloche",
      "DAUPHIN BRONZE -DB17- 5-6 ANS": "DB17 - Sa 13h - Boulloche",
      "DAUPHIN BRONZE -DB18- 7-8 ANS": "DB18 - Sa 13h - Boulloche",
      "Dauphin Argent - DA9": "DA9 - Sa 11h - Boulloche",
      "Dauphin Argent - DA10": "DA10 - Sa 12h - Boulloche",
      "Dauphin Argent - DA11": "DA11 - Sa 13h - Boulloche",
      "Dauphin Argent - DA12": "DA12 - Sa 13h45 - Boulloche",
      "Dauphin Or - DO1": "DO1 - Me 15h - Boulloche",
      "Dauphin Or - DO2": "DO2 - Sa 11h - Boulloche",
      Elite: "Elite",
      "Espoir 1": "Espoir 1",
      "Espoir 2": "Espoir 2",
      "Espoir 3": "Espoir 3",
      "Groupe départemental": "Groupe départemental",
      "Jeunes - J1-2 - 10-13 ans - Maitrise 1-2 nages":
        "J1-2 - Me 20h - Boulloche",
      "Jeunes - J1-4 - 10-13 ans - Maitrise 1-2 nages":
        "J1-4 - Ve 20h - Boulloche",
      "Jeunes - J1-5 - 10-13 ans - Maitrise 1-2 nages":
        "J1-5 - Sa 12h - Boulloche",
      "Jeunes - J2-1 - 10-13 ans - Maitrise 3-4 nages":
        "J2-1 - Me 20h - Boulloche",
      "Jeunes - J2-2 - 10-13 ans - Maitrise 3-4 nages": "J2-2 - Me 15h - CNEG",
      "Jeunes - J2-3 - 10-13 ans - Maitrise 3-4 nages": "J2-3 - Me 16h - CNEG",
      "Jeunes - J2-4 - 10-13 ans - Maitrise 3-4 nages":
        "J2-4 - Sa 12h - Boulloche",
      MAÎTRES: "MAÎTRES",
      Relève: "Relève",
    },
    sansEtiquette: [
      "ADULTES DEBUTANTS -DEB2",
      "Dauphin Argent - DA1",
      "Dauphin Argent - DA2",
      "Dauphin Argent - DA3",
      "Dauphin Argent - DA4",
      "Dauphin Argent - DA5",
      "Dauphin Argent - DA6",
      "Dauphin Argent - DA7",
      "Dauphin Argent - DA8",
      "Dauphin Bronze - DB10 - 5-6 ans",
      "Dauphin Bronze - DB11 - 7-8 ans",
      "Dauphin Bronze - DB12 - 5-6 ans",
      "Dauphin Bronze - DB13 - 7-8 ans",
      "Dauphin Bronze - DB14 - 5-6 ans",
      "Dauphin Bronze - DB1 - 5-6 ans",
      "Dauphin Bronze - DB2 - 5-6 ans",
      "Dauphin Bronze - DB3 - 5-6 ans",
      "Dauphin Bronze - DB4 - 7-8 ans",
      "Dauphin Bronze - DB5 - 7-8 ans",
      "Dauphin Bronze - DB6 - 5-6 ans",
      "Dauphin Bronze - DB7 - 7-8 ans",
      "Dauphin Bronze - DB8 - 7-8 ans",
      "Dauphin Bronze - DB9 - 5-6 ans",
      "Jeunes - J1-1 - 10-13 ans - Maitrise 1-2 nages",
      "Jeunes - J1-3 - 10-13 ans - Maitrise 1-2 nages",
      "Membre CA",
      "Officiel",
    ],
    membreAffiche: undefined,
    printers: loadPrinters(),
  };
  setupDatePickers(data);
  console.log(data);
  updatePage(data);
  loadComitiFile(data, document.getElementById("file-comiti"));
});
