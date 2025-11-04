import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AppDispatch } from '@renderer/app/store'
import {
  defaultHeadersComiti,
  exportConfiguration,
  importConfiguration,
  loadConfiguration,
  saveConfiguration,
  selectAliasGroupes,
  selectAliasPiscines,
  selectAnnee,
  selectHeadersComiti,
  selectPrintDelay,
  selectSimulatePrint,
  updateAliasGroupe,
  updateAliasPiscine,
  updateAnnee,
  updateHeader,
  updatePrintDelay,
  updateSimulatePrint
} from '@renderer/features/configuration/configurationSlice'
import {
  selectCategories,
  selectPiscines,
  titreCourtCalcule
} from '@renderer/features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AliasEditor } from './AliasEditor'
import { useState } from 'react'

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
  const groupes = useSelector(selectCategories)
  const headersComiti = useSelector(selectHeadersComiti)
  const [inclureGroupeAuto, setInclureGroupeAuto] = useState(false)
  const groupesAjoutables = groupes.filter(
    (gr) =>
      (inclureGroupeAuto || titreCourtCalcule(gr) === undefined) && aliasGroupes[gr] === undefined
  )
  const emptyCfgFile = ''
  const [groupeAAjouter, setGroupeAAjouter] = useState<string | null>(null)

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
          <Button component="label" variant="contained" role={undefined} tabIndex={-1}>
            Importer
            <VisuallyHiddenInput type="file" value={emptyCfgFile} onChange={handleImport} />
          </Button>
          <Button variant="contained" onClick={handleExport}>
            Exporter
          </Button>
        </Stack>
      </Stack>
      <Stack
        alignItems={'center'}
        spacing={2}
        style={{ maxHeight: 600, overflow: 'scroll', marginTop: 20 }}
      >
        {/*
        Section général
        */}
        <Typography variant="h5">Général</Typography>
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

        {/*
        Section piscines
        */}
        <Typography variant="h5">Piscines</Typography>
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

        {/*
        Section groupes
         */}
        <Typography variant="h5">Groupes</Typography>
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
        {groupesAjoutables.length > 0 ? (
          <Stack direction="row" spacing={2}>
            <Autocomplete
              disablePortal
              options={groupesAjoutables}
              sx={{ width: 300 }}
              value={groupeAAjouter}
              onChange={(_event, value) => {
                setGroupeAAjouter(value)
              }}
              renderInput={(params) => <TextField {...params} label="Groupe" />}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (groupeAAjouter) {
                  dispatch(
                    updateAliasGroupe({
                      name: groupeAAjouter,
                      alias: { ignore: true, replacement: '' }
                    })
                  )
                  setGroupeAAjouter('')
                }
              }}
            >
              Ajouter
            </Button>
          </Stack>
        ) : (
          ''
        )}
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

        {/*
          Section entêtes
          */}
        <Typography variant="h5">Entêtes</Typography>
        <List>
          {Object.keys(headersComiti).map((h) => (
            <ListItem key={h}>
              <TextField
                label={defaultHeadersComiti[h]}
                value={headersComiti[h]}
                onChange={(event) => {
                  dispatch(updateHeader(h, event.target.value))
                }}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  )
}
