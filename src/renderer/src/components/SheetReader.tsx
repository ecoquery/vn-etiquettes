import { Box, Button, Typography } from '@mui/material'
import Papa from 'papaparse'
import { type ChangeEvent, useState } from 'react'
import * as XLSX from 'xlsx'

interface SheetData {
  [key: string]: string // | number | boolean | null;
}

const SheetReader = ({ onDataLoaded }: { onDataLoaded: (data: SheetData[]) => void }) => {
  // const [data, setData] = useState<SheetData[]>([])
  const [fileName, setFileName] = useState<string>('')
  const changeData = (data) => {
    // setData(data)
    onDataLoaded(data)
  }
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        delimiter: ';',
        complete: (results) => {
          changeData(results.data)
        },
        error: (error) => {
          console.error('Erreur lors du parsing :', error)
        }
      })
    } else {
      try {
        const arrayBuffer = await file.arrayBuffer()

        // Lire le contenu du fichier Excel
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const worksheetName = workbook.SheetNames[0] // Prendre la première feuille
        const worksheet = workbook.Sheets[worksheetName]
        const jsonData: SheetData[] = XLSX.utils.sheet_to_json(worksheet)
        changeData(jsonData)
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier :', error)
      }
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
        Importer (xlsx ou csv){' '}
        <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
      </Button>

      {fileName && (
        <Typography variant="body1" gutterBottom>
          Fichier sélectionné : {fileName}
        </Typography>
      )}
    </Box>
  )
}
export default SheetReader
