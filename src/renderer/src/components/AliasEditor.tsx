import { Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Alias } from '@renderer/features/configuration/configurationSlice'
import { JSX } from 'react'

export interface AliasEditorProps {
  name: string
  value: Alias
  onChange: (name: string, newValue: Alias | undefined) => void
  deletable?: boolean
}

export function AliasEditor({
  name,
  value,
  onChange,
  deletable
}: Readonly<AliasEditorProps>): JSX.Element {
  const handleChangeIgnore = (event) => {
    onChange(name, { ...value, ignore: event.target.checked })
  }
  const handleChangeReplacement = (event) => {
    onChange(name, { ...value, replacement: event.target.value })
  }
  const handleDelete = () => {
    onChange(name, undefined)
  }
  return (
    <Stack direction="row" spacing={2}>
      <Typography width={250} alignSelf={'center'}>
        {name} :{' '}
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={value.ignore} onChange={handleChangeIgnore} />}
        label="Ignorer"
      />
      <TextField
        disabled={value.ignore}
        value={value.replacement}
        label="Remplacer par"
        onChange={handleChangeReplacement}
      />
      {deletable ? (
        <Button variant="contained" color="error" onClick={handleDelete}>
          <DeleteIcon />
        </Button>
      ) : (
        ''
      )}
    </Stack>
  )
}
