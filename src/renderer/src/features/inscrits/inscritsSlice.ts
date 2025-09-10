import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

const cNumeroOffre = 'Numéro offre'
const cCategorie = 'Catégorie'
const cLieuxHoraires = 'Lieux et horaires'
const cActivite = 'Nom spécifique activité'
const cNumeroComiti = 'Numéro Comiti'
const cNom = 'Nom'
const cPrenom = 'Prénom'
const cDateInscription = "Date d'inscription"

/**
 * Noms alternatifs pour les piscines à placer sur les étiquettes
 */
const piscineAliases = {
  'Centre Nautique Etienne Gagnaire': 'CNEG',
  'Piscine André Boulloche': 'Boulloche'
}

/**
 * Noms de groupes qui ne sont pas gérés programmatiquement
 */
const groupeAliases = { MAÎTRES: 'MAÎTRES' }

/**
 * Représente une offre comiti, utilisé pour construire l'affichage d'un créneau
 * placé sur une carte.
 */
export interface Offre {
  nOffre: number
  titre: string
  creneau: string
  piscine: string
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
 * Application internal state on comiti data
 */
export interface InscritsState {
  inscrits: Array<Inscrit>
  selected: Inscrit | undefined
  status: 'idle' | 'loading' | 'failed'
}

/** regex used to parse lieux et horaires */
const lieuHoraireParser = /(?<piscine>.+)\s(?<jour>\S+)\s:\s(?<heure>\S+)\s.*/
/**
 * Extrait le jour et l'heure du créneau dans comiti
 * @param data le lieu et l'horaire issu de comiti
 * @returns un jour et une heure à afficher sur l'étiquette
 */
export function extractCreneau(data: string): string {
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
export function extractPiscine(data: string): string {
  const matched = lieuHoraireParser.exec(data)
  if (matched) {
    const piscine = matched.groups?.piscine
    return piscineAliases[piscine ?? 'erreur'] ?? piscine
  } else {
    console.error(`Could not parse lieu horaire '${data}'`)
    return 'erreur'
  }
}

/**
 * Calcule le nom d'un groupe à afficher
 * @param {string} data le nom du groupe dans comiti
 */
export function extractTitreCourt(data: string): string {
  /** essaie d'extraire un groupe à partir d'une regex */
  function t(re, repl?) {
    const m = re.exec(data)
    if (m) {
      return repl ?? m[1]
    } else {
      return false
    }
  }
  const shortName =
    t(/Dauphin Bronze - (DB\d\d?)/) ||
    t(/Dauphin Argent - (DA\d\d?)/) ||
    t(/Dauphin Or - (DO\d\d?)/) ||
    t(/Jeunes - (J\d-\d) - 10-13 ans - Maitrise [13]-[24] nages/) ||
    t(/ADO - (A\d-\d) - 14-17 ans - Maitrise [13]-[24] nages/) ||
    t(/(ADU\d\d?).*/) ||
    t(/ADULTES DEBUTANTS.*/, 'ADUDEB') ||
    groupeAliases[data]
  if (shortName) {
    return shortName
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
export function offreOfRow(row): Offre {
  return {
    nOffre: Number(row[cNumeroOffre]),
    titre: row[cCategorie],
    creneau: extractCreneau(row[cLieuxHoraires]),
    piscine: extractPiscine(row[cLieuxHoraires]),
    titreCourt: extractTitreCourt(row[cCategorie]),
    activite: row[cActivite]
  }
}

/**
 * Extrait les information d'un inscrit à partir d'une ligne du fichier comiti
 * @param row la ligne issue du fichier csv comiti
 * @returns un inscrit, sans l'offre associée
 */
export function inscritOfRow(row): Inscrit {
  return { nComiti: Number(cNumeroComiti), nom: `${row[cNom]} ${row[cPrenom]}`, offres: [] }
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
 * Mets à jour les informations des inscrits des données du fichier comiti
 * @param rows les lignes du fichier comiti
 */
export function updateStateWithComitiData(
  state: InscritsState,
  rows: Array<Record<string, string>>
) {
  const inscrits: Record<number, Inscrit> = {}
  const offres: Record<number, Offre> = {}
  for (const row of rows) {
    if (row[cNumeroComiti] === '') {
      continue
    }
    const numInscrit = Number(row[cNumeroComiti])
    if (!(numInscrit in inscrits)) {
      inscrits[numInscrit] = inscritOfRow(row)
    }
    const inscrit = inscrits[numInscrit]
    const numOffre = Number(row[cNumeroOffre])
    if (!(numOffre in offres)) {
      offres[numOffre] = offreOfRow(row)
    }
    inscrit.offres.push(offres[numOffre])
    const insDate = parseDateInscription(row)
    if (inscrit.inscription === undefined || inscrit.inscription < insDate) {
      inscrit.inscription = insDate
    }
  }
  state.inscrits = Object.values(inscrits)
  state.selected = undefined
}

const initialState: InscritsState = {
  inscrits: [],
  selected: undefined,
  status: 'idle'
}

export const inscritsSlice = createSlice({
  name: 'inscrits',
  initialState,
  reducers: {
    updateWithComitiData: (state, action: PayloadAction<Array<Record<string, string>>>) => {
      updateStateWithComitiData(state, action.payload)
    }
  }
})

// Export the generated action creators for use in components
export const { updateWithComitiData } = inscritsSlice.actions

// Export the slice reducer for use in the store configuration
export default inscritsSlice.reducer

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectInscrits = (state: RootState) => state.inscrits.inscrits
export const selectSelected = (state: RootState) => state.inscrits.selected
export const selectStatus = (state: RootState) => state.inscrits.status
