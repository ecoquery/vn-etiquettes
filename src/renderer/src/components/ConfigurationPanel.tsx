import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Stack,
  TextField,
  Toolbar
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import {
  defaultHeadersMonClub,
  exportConfiguration,
  importConfiguration,
  loadConfiguration,
  saveConfiguration,
  selectAliasGroupes,
  selectAliasPiscines,
  selectAnnee,
  selectHeadersMonClub,
  selectPrintDelay,
  selectSimulatePrint,
  updateAliasGroupe,
  updateAliasPiscine,
  updateAnnee,
  updateHeader,
  updatePrintDelay,
  updateSimulatePrint
} from '../features/configuration/configurationSlice'
import { AliasEditor } from './AliasEditor'

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
  const printDelay = useSelector(selectPrintDelay)
  const simulatePrint = useSelector(selectSimulatePrint)
  const aliasPiscines = useSelector(selectAliasPiscines)
  const aliasGroupes = useSelector(selectAliasGroupes)
  const headersMonClub = useSelector(selectHeadersMonClub)
  const [inclureGroupeAuto, setInclureGroupeAuto] = useState(false)
  const emptyCfgFile = ''
  const tabs = ['Général', 'Piscines', 'Entêtes']
  const [curTab, setCurTab] = useState(tabs[0])

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

  const general = () => (
    <>
      {/* <Typography variant="h5">Général</Typography> */}
      <Stack alignItems={'normal'} spacing={2}>
        <TextField
          label="Année"
          value={annee}
          onChange={(event) => {
            dispatch(updateAnnee(event.target.value))
          }}
        />
        <TextField
          label="Attente (en s) entre deux impressions"
          type="number"
          value={printDelay}
          onChange={(event) => {
            dispatch(updatePrintDelay(Number(event.target.value)))
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={simulatePrint}
              onChange={(event) => {
                dispatch(updateSimulatePrint(event.target.checked))
              }}
            />
          }
          label="Simuler l'impression"
        />
      </Stack>
    </>
  )

  function piscines() {
    return (
      <>
        {/*
        Section piscines
        */}
        {/* <Typography variant="h5">Piscines</Typography> */}
        <List>
          {Object.keys(aliasPiscines).map((p) => (
            <ListItem key={p}>
              <AliasEditor
                name={p}
                value={aliasPiscines[p]}
                onChange={(name, alias) => {
                  dispatch(updateAliasPiscine({ name, alias }))
                }}
              />
            </ListItem>
          ))}
        </List>
      </>
    )
  }

  function groupes() {
    return (
      <>
        {/*
        Section groupes
         */}
        {/* <Typography variant="h5">Groupes</Typography> */}
        <List>
          {Object.keys(aliasGroupes).map((g) => (
            <ListItem key={g}>
              <AliasEditor
                name={g}
                value={aliasGroupes[g]}
                onChange={(name, alias) => {
                  dispatch(updateAliasGroupe({ name, alias }))
                }}
                deletable
              />
            </ListItem>
          ))}
        </List>
        <FormControlLabel
          control={
            <Checkbox
              value={inclureGroupeAuto}
              onChange={(_event, checked) => {
                setInclureGroupeAuto(checked)
              }}
            />
          }
          label="Voir les groupes gérés automatiquement"
        />
      </>
    )
  }
  function entetes() {
    return (
      <>
        {/*
          Section entêtes
          */}
        {/* <Typography variant="h5">Entêtes</Typography> */}
        <List>
          {Object.keys(headersMonClub).map((h) => (
            <ListItem key={h}>
              <TextField
                label={defaultHeadersMonClub[h]}
                value={headersMonClub[h]}
                onChange={(event) => {
                  dispatch(updateHeader(h, event.target.value))
                }}
              />
            </ListItem>
          ))}
        </List>
      </>
    )
  }
  function tabContent(entry) {
    switch (entry) {
      case 'Général':
        return general()
      case 'Piscines':
        return piscines()
      case 'Entêtes':
        return entetes()
    }
    return undefined
  }

  return (
    <Container>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {tabs.map((entry) => (
            <Button
              key={entry}
              onClick={() => setCurTab(entry)}
              variant={entry === curTab ? 'outlined' : 'text'}
            >
              {entry}
            </Button>
          ))}
        </Box>
      </Toolbar>
      <Stack
        alignItems={'center'}
        spacing={2}
        style={{ height: 500, maxHeight: 650, overflow: 'scroll', marginTop: 20 }}
      >
        {tabContent(curTab)}
      </Stack>
      <Stack alignItems="center" spacing={2}>
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
          <Button component="label" variant="contained" tabIndex={-1}>
            Importer
            <VisuallyHiddenInput type="file" value={emptyCfgFile} onChange={handleImport} />
          </Button>
          <Button variant="contained" onClick={handleExport}>
            Exporter
          </Button>
          <Button variant="contained" color="error">
            Supprimer les adhérents
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
