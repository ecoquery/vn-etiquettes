import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, AppThunk, RootState } from '@renderer/app/store'
import { ConfigState, HeadersMonClub } from '../configuration/configurationSlice'

/** Clé avec laquelle les données sont stockées dans le localStorage de
 * l'application. */
const creneauxLocalStorageKey = 'creneaux'

/** Une activité correspond à un type de créneau, ce qui correspond en général à
 * un type d'adhérent. */
export interface Activite {
  nom: string
}

/**
 * Créée une activité à partir d'une ligne du fichier d'import
 * @param line la ligne du fichier d'import
 * @param h les headers du fichier d'import
 */
function activiteFromLine(line: Record<string, string>, h: HeadersMonClub): Activite {
  const nom = line[h.cNomActivite]
  return { nom }
}

/** Un créneau est une session (parfois juste une catégorie comme dans le cas
 * des compétiteurs). Il est rattaché à une activité. */
export interface Creneau {
  nom: string
  activite: Activite
  debut?: string
  fin?: string
  lieu?: string
  jour?: string
}

/**
 * Donne le jour de la semaine en fonction de la date
 * @param dateS Une date dont on veut le jour
 * @returns le jour de la semaine à afficher
 */
function jourFromDate(dateS: string): string | undefined {
  const [day, month, year] = dateS.split('/').map(Number)

  // Créer un objet Date (attention : les mois sont indexés à 0 en JavaScript)
  const date = new Date(year, month - 1, day)

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    console.log('Format de date invalide. Utilisez jj/mm/aaaa.', dateS)
    return undefined
  }

  // Utiliser Intl.DateTimeFormat pour obtenir le jour en français
  //const fullDay = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const shortDay = date.toLocaleDateString('fr-FR', { weekday: 'short' })

  // Retourner le résultat
  return shortDay
}

/**
 * Détermine la piscine via l'adresse
 * @param adresse L'adresse saisie dans mon club
 * @param config La configuration pour récupérer le mapping adresse piscine
 * @returns la piscine, si l'adresse est connue
 */
function piscineFromAdresse(adresse: string, config: ConfigState): string|undefined {
  if (adresse in config.adressePiscine) {
    return config.adressePiscine[adresse]
  } else {
    console.log(`Pas de piscine pour l'adresse '${adresse}'`)
    return undefined
  }
}

/**
 *
 * @param data ligne du fichier d'import
 * @param activite activite pour ce créneau
 * @param h noms des headers dans le fichier d'import
 */
function creneauFromLine(
  data: Record<string, string>,
  activite: Activite,
  config: ConfigState
): Creneau {
  const h = config.headersMonClub
  const nom = data[h.cNomCreneau]
  const jour = jourFromDate(data[h.cDateDebut])
  const debut = data[h.cHeureDebut]
  const lieu = piscineFromAdresse(data[h.cAdresse], config)
  return { nom, activite, jour, debut, lieu }
}

/**
 * Les informations sur l'ensemble des créneaux et des activités.
 */
export interface CreneauxState {
  activites: Record<string, Activite>
  creneaux: Record<string, Creneau>
}

/** Données fictives */
const initialActivites = { 'Activité Test': { nom: 'Activité Test' } }
/** Données fictives */
const initialCreneaux = {
  'Créneau Test': { nom: 'Créneau Test', activite: initialActivites['Activité Test'] }
}

const initialState: CreneauxState = {
  activites: initialActivites,
  creneaux: initialCreneaux
}

export const creneauxSlice = createSlice({
  name: 'creneaux',
  initialState,
  reducers: {
    updateCreneauxData: (state, action: PayloadAction<CreneauxState>) => {
      Object.assign(state, action.payload)
    }
  }
})

/**
 * Sauvegarde les informations des créneaux et
 * des activités dans le localstorage.
 * @param _dispatch inutilisé
 * @param getState pour accéder à l'état global
 */
const saveCreneaux: AppThunk = (_dispatch, getState) => {
  localStorage.setItem(creneauxLocalStorageKey, JSON.stringify(getState().creneaux))
}

/**
 * Charge les données des créneaux depuis le localStorage.
 * @param dispatch pour décclencher la mise à jour de l'état
 * @param _getState inutilisé
 */
export const loadCreneaux: AppThunk = (dispatch, _getState) => {
  const jsonData = localStorage.getItem(creneauxLocalStorageKey)
  const creneauxData = JSON.parse(jsonData ?? JSON.stringify(initialState)) as CreneauxState
  dispatch(creneauxSlice.actions.updateCreneauxData(creneauxData))
}

/**
 * Construit les données des créneaux à partir du fichier d'import
 * @param rows lignes du fichier csv importé
 */
export const importCreneauxWithData =
  (rows: Array<Record<string, string>>) => (dispatch: AppDispatch, getState: () => RootState) => {
    console.log('Importation des créneaux', rows)
    const activites: Record<string, Activite> = {}
    const creneaux: Record<string, Creneau> = {}
    const config = getState().configuration
    const hd = config.headersMonClub
    for (const row of rows) {
      const nomCreneau = row[hd.cNomCreneau]
      const nomActivite = row[hd.cNomActivite]
      if (!(nomActivite in activites)) {
        activites[nomActivite] = activiteFromLine(row, hd)
      }
      const activite = activites[nomActivite]
      if (nomCreneau) {
        creneaux[nomCreneau] = creneauFromLine(row, activite, config)
      }
    }
    dispatch(creneauxSlice.actions.updateCreneauxData({ activites, creneaux }))
    dispatch(saveCreneaux)
  }

// export const { ....... } = creneauxSlice.actions

export default creneauxSlice.reducer

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectActivites = (state: RootState) => state.creneaux.activites
export const selectCreneaux = (state: RootState) => state.creneaux.creneaux
