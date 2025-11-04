import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../../app/store'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConfigState, updateAliasPiscine } from '../configuration/configurationSlice'

const cNumeroOffre = 'Numéro offre'
const cCategorie = 'Catégorie'
const cLieuxHoraires = 'Lieux et horaires'
const cActivite = 'Nom spécifique activité'
const cNumeroComiti = 'Numéro Comiti'
const cNom = 'Nom'
const cPrenom = 'Prénom'
const cDateInscription = "Date d'inscription"

/**
 * Représente une offre comiti, utilisé pour construire l'affichage d'un créneau
 * placé sur une carte.
 */
export interface Offre {
  nOffre: number
  titre: string
  creneaux: Array<{ lieu: string; heure: string }>
  titreCourt: string
  activite: string
}

/**
 * Represente un membre du club et les offres auxquelles il est inscrit
 */
export interface Inscrit {
  nComiti: number
  nom: string
  offres: Array<Offre>
  inscription?: string
}

/**
 * Sort model, compatible with Data Grid from MUI X
 * see https://mui.com/x/api/data-grid/data-grid/#data-grid-prop-sortingOrder
 */
export interface SortModel {
  field: string
  sort: 'asc' | 'desc' | undefined | null
}

/**
 * Partie de l'état qui est calculée à partir des données comiti
 */
export interface ProcessedComitiData {
  inscrits: Record<number, Inscrit>
  activites: string[]
  offres: Offre[]
  piscines: string[]
  categories: string[]
}

/**
 * Application internal state on comiti data
 */
export interface InscritsState extends ProcessedComitiData {
  selected: Inscrit | undefined
  selectedActivite: string | undefined
  selectedOffre: Offre | undefined
  selectedInscritApres: string | undefined
  sortModel: SortModel
}

/** regex used to parse lieux et horaires */
const lieuHoraireParser = /\s*(?<piscine>\S.+)\s(?<jour>\S+)\s:\s(?<heure>\S+)\s.*/
/**
 * Extrait le jour et l'heure du créneau dans comiti
 * @param data le lieu et l'horaire issu de comiti
 * @returns un jour et une heure à afficher sur l'étiquette
 */
export function extractHoraire(data: string): string {
  const matched = lieuHoraireParser.exec(data)
  if (matched) {
    return `${matched.groups?.jour?.substring(0, 3)} ${matched.groups?.heure}`
  } else {
    console.error(`Could not parse lieu horaire '${data}'`)
    return 'erreur'
  }
}

/**
 * Extrait la piscine de l'information issue de comiti
 * @param data le lieu et l'horaire issu de comiti
 * @returns la piscine dans laquelle l'activité a lieu
 */
export function extractPiscine(data: string, config: ConfigState): string | undefined {
  const matched = lieuHoraireParser.exec(data)
  if (matched) {
    const piscine = matched.groups?.piscine
    if (!piscine) {
      console.error('Piscine not found in ', matched) // TODO: Améliorer le retour utilisateur
      return undefined
    }
    const alias = config.aliasPiscines[piscine]
    if (alias?.ignore) {
      return undefined // pas de carte pour cette piscine
    } else {
      return alias?.replacement ?? piscine
    }
  } else {
    console.error(`Could not parse lieu horaire '${data}'`)
    return 'erreur'
  }
}

export function extractPiscineBrut(row: Record<string, string>): string | undefined {
  const data = row[cLieuxHoraires].split(',')
  for (const d of data) {
    const matched = lieuHoraireParser.exec(d)
    if (matched?.groups?.piscine) {
      return matched?.groups?.piscine
    }
  }
  return undefined
}

/**
 * Extrait un tableaux de lieux et horaires pour une offre
 * @param data la cellule lieux et horaires du fichier comiti
 */
export function extractCreneaux(
  data: string,
  config: ConfigState
): Array<{ lieu: string; heure: string }> {
  return data
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ lieu: extractPiscine(s, config) ?? '', heure: extractHoraire(s) }))
    .filter((c) => c.lieu !== '')
}

/**
 * Tente d'extraire un titre court à partir de schémas de nommages des titres longs.
 * @param titreLong le titre duquel on extrait le titre court
 */
export function titreCourtCalcule(titreLong: string): string | undefined {
  /** essaie d'extraire un groupe à partir d'une regex */
  function t(re, repl?) {
    const m = re.exec(titreLong)
    if (m) {
      return repl ?? m[1]
    } else {
      return false
    }
  }
  return (
    t(/Dauphin Bronze - (DB\d\d?)/) ||
    t(/Dauphin Argent - (DA\d\d?)/) ||
    t(/Dauphin Or - (DO\d\d?)/) ||
    t(/Jeunes - (J\d-\d) - 10-13 ans - Maitrise [13]-[24] nages/) ||
    t(/ADO - (A\d-\d) - 14-17 ans - Maitrise [13]-[24] nages/) ||
    t(/(ADU\d\d?).*/) ||
    t(/ADULTES DEBUTANTS.*/, 'ADUDEB') ||
    undefined
  )
}

/**
 * Calcule le nom d'un groupe à afficher
 * @param {string} data le nom du groupe dans comiti
 */
export function extractTitreCourt(data: string, config: ConfigState): string | undefined {
  const shortName = titreCourtCalcule(data)
  if (shortName) {
    return shortName
  } else if (config.aliasGroupes[data]?.ignore) {
    return undefined
  } else if (config.aliasGroupes[data]) {
    return config.aliasGroupes[data].replacement || data
  } else {
    console.error(`Failed to extract groupe from '${data}'`)
    return 'erreur'
  }
}

/**
 * Extrait une offre à partir des données d'un ligne de l'extraction comiti
 * @param row ligne comiti issue du fichier csv
 * @returns une offre
 */
export function offreOfRow(row, config: ConfigState): Offre | undefined {
  const titreCourt = extractTitreCourt(row[cCategorie], config)
  if (titreCourt === undefined) {
    return undefined // Pas de titre -> l'offre ne correspond pas à une carte (e.g. Officiel)
  }
  const creneaux = extractCreneaux(row[cLieuxHoraires], config)
  if (creneaux.length === 0) {
    return undefined // Pas de créneau (i.e. que des créneaux sans besoin de carte)
  }
  return {
    nOffre: Number(row[cNumeroOffre]),
    titre: row[cCategorie],
    creneaux: creneaux,
    titreCourt: titreCourt,
    activite: row[cActivite]
  }
}

/**
 * Extrait les information d'un inscrit à partir d'une ligne du fichier comiti
 * @param row la ligne issue du fichier csv comiti
 * @returns un inscrit, sans l'offre associée
 */
export function inscritOfRow(row): Inscrit {
  return { nComiti: Number(row[cNumeroComiti]), nom: `${row[cNom]} ${row[cPrenom]}`, offres: [] }
}

/**
 * Extrait la date d'inscription de la ligne comiti
 * @param row la ligne comiti
 * @returns la date d'inscription de la ligne comiti
 */
export function parseDateInscription(row: Record<string, string>): string {
  const sValue: string = row[cDateInscription]
  const [jour, mois, annee] = sValue.split('-')
  return new Date(`${annee}-${mois}-${jour}`).toISOString()
}

/**
 * Comparison function for strings containing a number. The number part is
 * compared using its value, not its representation.
 * @param s1 first string to compare
 * @param s2 second string to compare
 * @return 0 if strings are equal, -1 if s1 is before s2, 1 else
 */
export function stringWithNumberCompare(s1: string, s2: string): number {
  if (s1 === s2) {
    return 0
  }
  const extractPartsRe = /^(?<prefix>\D*)(?<num>\d*)(?<suffix>(\D.*)?)$/
  const m1 = extractPartsRe.exec(s1)
  const m2 = extractPartsRe.exec(s2)
  const prefixCmp = (m1?.groups?.prefix ?? '').localeCompare(m2?.groups?.prefix ?? '')
  if (prefixCmp == 0) {
    const num1 = Number(m1?.groups?.num ?? 0)
    const num2 = Number(m2?.groups?.num ?? 0)
    const numCmp = num1 - num2
    if (numCmp == 0) {
      return (m1?.groups?.suffix ?? '').localeCompare(m2?.groups?.suffix ?? '')
    } else {
      return numCmp
    }
  } else {
    return prefixCmp
  }
}

/**
 * Compare deux offres selon leur titre court.
 * @param o1 première offre
 * @param o2 deuxième offre
 * @returns 0 si elles ont le même titre court, -1 si la première est avant la deuxième, 1 sinon
 */
export function compareOffre(o1: Offre, o2: Offre): number {
  return stringWithNumberCompare(o1.titreCourt, o2.titreCourt)
}

/**
 * Mets à jour les informations des inscrits des données du fichier comiti
 * @param rows les lignes du fichier comiti
 */
export const updateWithComitiData =
  (rows: Array<Record<string, string>>) => (dispatch: AppDispatch, getState: () => RootState) => {
    const inscrits: Record<number, Inscrit> = {}
    const offres: Record<number, Offre> = {}
    const activites: Set<string> = new Set()
    const piscines: Set<string> = new Set()
    const categoriesBrutes: Set<string> = new Set()
    for (const row of rows) {
      if (row[cNumeroComiti] === '') {
        continue // ligne vide
      }
      const numOffre = Number(row[cNumeroOffre])
      if (!(numOffre in offres)) {
        const piscineBrut = extractPiscineBrut(row)
        if (piscineBrut !== undefined) {
          piscines.add(piscineBrut)
        }
        categoriesBrutes.add(row[cCategorie])
        const offre = offreOfRow(row, getState().configuration)
        if (offre === undefined) {
          continue // Cette offre ne donne pas lieu à être affichée sur une carte
        } else {
          offres[numOffre] = offre
          activites.add(offre.activite)
        }
      }
      const numInscrit = Number(row[cNumeroComiti])
      if (!(numInscrit in inscrits)) {
        inscrits[numInscrit] = inscritOfRow(row)
      }
      const inscrit = inscrits[numInscrit]
      inscrit.offres.push(offres[numOffre])
      const insDate = parseDateInscription(row)
      if (inscrit.inscription === undefined || inscrit.inscription < insDate) {
        inscrit.inscription = insDate
      }
    }

    // tri des offres pour chaque inscrit
    for (const inscrit of Object.values(inscrits)) {
      inscrit.offres.sort(compareOffre)
    }

    dispatch(
      updateFullInscritsState({
        inscrits,
        activites: new Array(...activites.values()).toSorted(stringWithNumberCompare),
        offres: Object.values(offres).toSorted(compareOffre),
        piscines: new Array(...piscines.values()),
        categories: new Array(...categoriesBrutes.values())
      })
    )

    for (const p of piscines.values()) {
      if (getState().configuration.aliasPiscines[p] === undefined) {
        dispatch(updateAliasPiscine({ name: p, alias: { ignore: false, replacement: p } }))
      }
    }
  }

/**
 * Une string pour afficher une offre avec ses créneaux.
 * @param o L'offre à afficher
 * @returns Une chaîne représentant l'offre
 */
export const stringOfOffre = (o: Offre) => {
  const sCr =
    o.creneaux.map((cr) => `${cr.lieu} - ${cr.heure}`)[0] + (o.creneaux.length > 1 ? ', ...' : '')
  return `${o.titreCourt} - ${sCr}`
}

/**
 * Crée un filtre correspondant à une offre et une activité
 * @param offre offre sélectionnée
 * @param activite activité sélectionnée
 * @param dateInscription  ne garde que les inscriptions postérieures à cette date
 * @returns un filtre qui ne garde que les inscrits correspondant à l'offre et à l'activité
 */
export const inscritsFilter =
  (offre: Offre | undefined, activite: string | undefined, dateInscription: string | undefined) =>
  (inscrit: Inscrit) => {
    // Élimine les inscrit avant la date d'inscription si elle est fournie
    if (
      dateInscription !== undefined &&
      inscrit.inscription !== undefined &&
      inscrit.inscription < dateInscription
    ) {
      return false
    }
    // Filtre vis-à-vis de l'offre si possible ou, à défaut de l'activité
    if (offre) {
      return inscrit.offres[0].nOffre === offre.nOffre
    } else if (activite) {
      return inscrit.offres.some((o) => o.activite === activite)
    } else {
      return true
    }
  }

/**
 * Produit un comparateur d'Inscrit sur la base du modèle de tri passé en argument.
 * @param model le critère de tri
 * @returns une fonction de comparaison d'inscrit pour trier un tableau d'inscrits
 */
export const compareInscrit = (model: SortModel) => (a: Inscrit, b: Inscrit) => {
  let cmp = 0
  switch (model.field) {
    case 'nComiti':
      cmp = a.nComiti - b.nComiti
      break
    case 'nom':
      cmp = a.nom.localeCompare(b.nom)
      break
    case 'offres':
      cmp = compareOffre(a.offres[0], b.offres[0])
      break
    default:
      console.log(`Critère de tri inconnu: ${model.field}`)
      break
  }
  if (model.sort === 'desc') {
    cmp = -cmp
  }
  return cmp
}

export const defaultSortModel: SortModel = { field: 'nom', sort: 'asc' }

const initialState: InscritsState = {
  inscrits: {},
  selected: undefined,
  activites: [],
  offres: [],
  selectedActivite: undefined,
  selectedOffre: undefined,
  selectedInscritApres: undefined,
  sortModel: defaultSortModel,
  piscines: [],
  categories: []
}

export const inscritsSlice = createSlice({
  name: 'inscrits',
  initialState,
  reducers: {
    updateFullInscritsState: (state, action: PayloadAction<ProcessedComitiData>) => {
      Object.assign(state, action.payload)
      state.selected = undefined
      state.selectedActivite = undefined
      state.selectedOffre = undefined
      state.selectedInscritApres = undefined
    },
    inscritSelected: (state, action: PayloadAction<Inscrit | undefined>) => {
      state.selected = action.payload
    },
    activiteSelected: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload === '') {
        state.selectedActivite = undefined
      } else {
        state.selectedActivite = action.payload
      }
      state.selectedOffre = undefined
    },
    offreSelected: (state, action: PayloadAction<number | undefined>) => {
      state.selectedOffre = state.offres.find((o) => o.nOffre == action.payload)
      if (state.selectedOffre !== undefined) {
        state.selectedActivite = state.selectedOffre.activite
      }
    },
    inscritApresSelected: (state, action: PayloadAction<string | undefined>) => {
      state.selectedInscritApres = action.payload
    },
    sortModelChanged: (state, action: PayloadAction<SortModel>) => {
      state.sortModel = action.payload
      console.log(state.sortModel)
    }
  }
})

// Export the generated action creators for use in components
export const {
  updateFullInscritsState,
  inscritSelected,
  activiteSelected,
  offreSelected,
  sortModelChanged,
  inscritApresSelected
} = inscritsSlice.actions

// Export the slice reducer for use in the store configuration
export default inscritsSlice.reducer

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectInscrits = (state: RootState) => state.inscrits.inscrits
export const selectSelected = (state: RootState) => state.inscrits.selected
export const selectActivites = (state: RootState) => state.inscrits.activites
export const selectSelectedActivite = (state: RootState) => state.inscrits.selectedActivite
export const selectOffres = (state: RootState) => state.inscrits.offres
export const selectSelectedOffre = (state: RootState) => state.inscrits.selectedOffre
export const selectSortModel = (state: RootState) => state.inscrits.sortModel
export const selectInscritApres = (state: RootState) => state.inscrits.selectedInscritApres
export const selectPiscines = (state: RootState) => state.inscrits.piscines
export const selectCategories = (state: RootState) => state.inscrits.categories
