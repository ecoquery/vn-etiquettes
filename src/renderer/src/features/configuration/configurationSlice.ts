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

export const { updateAnnee } = configurationSlice.actions
export default configurationSlice.reducer
export const selectAnnee = (state: RootState) => state.configuration.annee
