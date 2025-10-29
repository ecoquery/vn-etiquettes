import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@renderer/app/store'

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
    }
  }
})

export const { updateAnnee } = configurationSlice.actions
export default configurationSlice.reducer
export const selectAnnee = (state: RootState) => state.configuration.annee
