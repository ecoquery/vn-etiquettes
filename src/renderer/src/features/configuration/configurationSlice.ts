import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@renderer/app/store'

const configKey = 'configuration'

export interface ConfigState {
  annee: string
}

const initialState: ConfigState = {
  annee: '2025-2026'
}

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    updateAnnee: (state, action: PayloadAction<string>) => {
      state.annee = action.payload
    },
    updateWholeConfiguration: (state, action: PayloadAction<ConfigState>) => {
      Object.assign(state, action.payload)
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

export const { updateAnnee } = configurationSlice.actions
export default configurationSlice.reducer
export const selectAnnee = (state: RootState) => state.configuration.annee
