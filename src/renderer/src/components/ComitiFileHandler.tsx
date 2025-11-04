import { Button } from '@mui/material'
import { updateWithComitiData } from '../features/inscrits/inscritsSlice'
import { CSSProperties } from 'react'
import { useCSVReader } from 'react-papaparse'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@renderer/app/store'

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10
  } as CSSProperties,
  browseFile: {
    width: '200px',
    margin: 10
  } as CSSProperties,
  acceptedFile: {
    // border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '500px'
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px'
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'blue'
  } as CSSProperties
}

export const ComitiFileHandler = () => {
  const dispatch: AppDispatch = useDispatch()
  const { CSVReader } = useCSVReader()

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        dispatch(updateWithComitiData(results.data))
      }}
      config={{ header: true }}
    >
      {({ getRootProps, acceptedFile, ProgressBar }: any) => (
        <>
          <div style={styles.csvReader}>
            <Button variant="contained" {...getRootProps()} style={styles.browseFile}>
              Fichier comiti
            </Button>
            <div style={styles.acceptedFile}>{acceptedFile?.name}</div>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  )
}
