import { Button, Container, Stack, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { AppDispatch } from '@renderer/app/store'
import {
  exportConfiguration,
  importConfiguration,
  loadConfiguration,
  saveConfiguration,
  selectAnnee,
  updateAnnee
} from '@renderer/features/configuration/configurationSlice'
import { useDispatch, useSelector } from 'react-redux'

// From https://mui.com/material-ui/react-button/#file-upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const saveFileOptions = {
  types: [
    {
      suggestedName: 'config.json',
      description: 'Json Files',
      accept: {
        'application/json': ['.json']
      }
    }
  ]
}

export const ConfigurationPanel = () => {
  const dispatch: AppDispatch = useDispatch()
  const annee = useSelector(selectAnnee)
  const emptyCfgFile = ''
  const handleImport = (event) => {
    if (event.target?.files[0]) {
      dispatch(importConfiguration(event.target.files[0]))
    } else {
      console.error("Pas de fichier pour l'import")
    }
  }
  const handleExport = async () => {
    const fileHandle = await globalThis.showSaveFilePicker(saveFileOptions)
    dispatch(exportConfiguration(fileHandle))
  }
  return (
    <Container>
      <Stack alignItems={'center'} spacing={2}>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(saveConfiguration)
            }}
          >
            Sauver
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(loadConfiguration)
            }}
          >
            Restaurer
          </Button>
          <Button component="label" variant="contained" role={undefined} tabIndex={-1}>
            Importer
            <VisuallyHiddenInput type="file" value={emptyCfgFile} onChange={handleImport} />
          </Button>
          <Button variant="contained" onClick={handleExport}>
            Exporter
          </Button>
        </Stack>
        <Stack alignItems={'normal'}>
          <TextField
            label="Année"
            value={annee}
            onChange={(event) => {
              dispatch(updateAnnee(event.target.value))
            }}
          />
        </Stack>
      </Stack>
    </Container>
  )
}
