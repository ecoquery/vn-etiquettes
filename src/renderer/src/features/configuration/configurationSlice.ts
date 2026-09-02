import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk, RootState } from '@renderer/app/store'

const configKey = 'configuration'

/**
 * Traitement des alias
 */
export interface Alias {
  ignore: boolean
  replacement: string
}

export interface NameAlias {
  name: string
  alias: Alias | undefined
}

// export interface HeadersComiti {
//   cNumeroOffre: string
//   cCategorie: string
//   cLieuxHoraires: string
//   cActivite: string
//   cNumeroComiti: string
//   cNom: string
//   cPrenom: string
//   cDateInscription: string
// }

// export const defaultHeadersComiti: HeadersComiti = {
//   cNumeroOffre: 'Numéro offre',
//   cCategorie: 'Catégorie',
//   cLieuxHoraires: 'Lieux et horaires',
//   cActivite: 'Nom spécifique activité',
//   cNumeroComiti: 'Numéro Comiti',
//   cNom: 'Nom',
//   cPrenom: 'Prénom',
//   cDateInscription: "Date d'inscription"
// }

/** Valeur par défaut des colonnes du fichier d'import de créneau de MonClub */
export const defaultHeadersMonClub = {
  cNomCreneau: 'Nom du créneau',
  cNomActivite: 'Nom',
  cDateDebut: 'Date de début du créneau',
  cHeureDebut: 'Heure',
  cAdresse: 'Adresse',
  cNomAdherent: 'Adhérents'
}

/** Nom des colonnes dans le fichiers d'import des créneaux */
export type HeadersMonClub = typeof defaultHeadersMonClub

export interface ConfigState {
  annee: string
  printDelay: number
  simulatePrint: boolean
  aliasGroupes: Record<string, Alias>
  aliasPiscines: Record<string, Alias>
  adressePiscine: Record<string, string>
  // headersComiti: HeadersComiti
  headersMonClub: HeadersMonClub
  sansSceance: Array<string>
  sansCarte: Array<string>
}

const aIgnore = () => ({ ignore: true, replacement: '' })
const aReplace = (x) => ({ ignore: false, replacement: x })

const initialState: ConfigState = {
  annee: '2025-2026',
  printDelay: 2,
  simulatePrint: true,
  aliasGroupes: {
    'ADU-CSE-BPCESI': aReplace('BPCESI'),
    'Dauphin bronze - DB2': aReplace('DB2'),
    'Dauphin bronze - DB6': aReplace('DB6'),
    MAÎTRES: aReplace('MAÎTRES'),
    Seniors: aReplace('Seniors'),
    Avenirs: aReplace('Avenirs'),
    Juniors: aReplace('Juniors'),
    Benjamins: aReplace('Benjamins'),
    Promotionnel: aIgnore(),
    Officiel: aIgnore()
  },
  aliasPiscines: {
    'Centre Nautique Etienne Gagnaire': aReplace('CNEG'),
    'Piscine André Boulloche': aReplace('Boulloche'),
    'Piscine des Gratte Ciel': aIgnore()
    // Compétition: aReplace('Compétition')
  },
  adressePiscine: {
    '59 avenue Marcel Cerdan, 69100, Villeurbanne': 'Centre Nautique Etienne Gagnaire',
    '96 rue Francis De Pressensé, 69100, Villeurbanne': 'Piscine André Boulloche',
    'Place Lazare Goujon, 69100, Villeurbanne': 'Piscine des Gratte Ciel',
    'Place Lazar Goujon, 69100, Villeurbanne': 'Piscine des Gratte Ciel'
  },
  // headersComiti: { ...defaultHeadersComiti },
  headersMonClub: { ...defaultHeadersMonClub },
  sansSceance: ['Compétition Licence Maîtres', 'Encadrants - Coachs', 'Officiels - bénévoles'],
  sansCarte: ['Officiels - bénévoles']
}

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    updateAnnee: (state, action: PayloadAction<string>) => {
      state.annee = action.payload
    },
    updatePrintDelay: (state, action: PayloadAction<number>) => {
      state.printDelay = action.payload
    },
    updateSimulatePrint: (state, action: PayloadAction<boolean>) => {
      state.simulatePrint = action.payload
    },
    updateWholeConfiguration: (state, action: PayloadAction<ConfigState>) => {
      Object.assign(state, action.payload)
    },
    updateAliasPiscine: (state, action: PayloadAction<NameAlias>) => {
      if (action.payload.alias === undefined) {
        delete state.aliasPiscines[action.payload.name]
      } else {
        state.aliasPiscines[action.payload.name] = action.payload.alias
      }
    },
    updateAliasGroupe: (state, action: PayloadAction<NameAlias>) => {
      if (action.payload.alias === undefined) {
        delete state.aliasGroupes[action.payload.name]
      } else {
        state.aliasGroupes[action.payload.name] = action.payload.alias
      }
    },
    updateHeader: (state, action: PayloadAction<{ header: string; value: string }>) => {
      if (Object.keys(state.headersMonClub).includes(action.payload.header)) {
        state.headersMonClub[action.payload.header] = action.payload.value
      } else {
        console.error(`Unknown header in updateHeader: ${action.payload.header}`)
      }
    }
  }
})

export const saveConfiguration: AppThunk = (_dispatch, getState) => {
  localStorage.setItem(configKey, JSON.stringify(getState().configuration))
}

export const loadConfiguration: AppThunk = (dispatch, _getState) => {
  const jsonData = localStorage.getItem(configKey)
  const configData = JSON.parse(jsonData ?? JSON.stringify(initialState)) as ConfigState
  dispatch(configurationSlice.actions.updateWholeConfiguration(configData))
}

export const importConfiguration =
  (file: File): AppThunk =>
  async (dispatch, _getState) => {
    const jsonData = await file.text()
    const configData = JSON.parse(jsonData)
    dispatch(configurationSlice.actions.updateWholeConfiguration(configData))
    dispatch(saveConfiguration)
  }

export const exportConfiguration =
  (fileHandle: FileSystemFileHandle): AppThunk =>
  async (_dispatch, getState) => {
    const state = getState().configuration
    const stringData = JSON.stringify(state, undefined, 2)
    const writable = await fileHandle.createWritable()
    await writable.write(stringData)
    await writable.close()
  }

export const updateAliasPiscine =
  (nameAlias: NameAlias): AppThunk =>
  (dispatch, _getState) => {
    dispatch(configurationSlice.actions.updateAliasPiscine(nameAlias))
    // dispatch(rebuildComitiDerivedData)
  }

export const updateAliasGroupe =
  (nameAlias: NameAlias): AppThunk =>
  (dispatch, _getState) => {
    dispatch(configurationSlice.actions.updateAliasGroupe(nameAlias))
    // dispatch(rebuildComitiDerivedData)
  }

export const updateHeader =
  (header: string, value: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(configurationSlice.actions.updateHeader({ header, value }))
    // dispatch(rebuildComitiDerivedData)
  }

export const { updateAnnee, updatePrintDelay, updateSimulatePrint } = configurationSlice.actions
export default configurationSlice.reducer
export const selectAnnee = (state: RootState) => state.configuration.annee
export const selectPrintDelay = (state: RootState) => state.configuration.printDelay
export const selectSimulatePrint = (state: RootState) => state.configuration.simulatePrint
export const selectAliasGroupes = (state: RootState) => state.configuration.aliasGroupes
export const selectAliasPiscines = (state: RootState) => state.configuration.aliasPiscines
// export const selectHeadersComiti = (state: RootState) => state.configuration.headersComiti
export const selectHeadersMonClub = (state: RootState) => state.configuration.headersMonClub
