import React, { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import Papa from 'papaparse'
import MyGroupedBarChart from './ChartsComponent'

type CsvRow = any

const CsvDataProvider: React.FC<{
   url: string
   children: (data: CsvRow[], error: string | null, loading: boolean) => React.ReactNode
}> = ({ url, children }) => {
   const [data, setData] = useState<CsvRow[]>([])
   const [error, setError] = useState<string | null>(null)
   const [loading, setLoading] = useState<boolean>(true)

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            const response = await fetch(url)
            const text = await response.text()
            Papa.parse(text, {
               header: true,
               complete: results => {
                  setData(results.data as CsvRow[])
                  setLoading(false)
               },
               // @ts-ignore
               error: error => {
                  setError(error.message)
                  setLoading(false)
               }
            })
         } catch (err: any) {
            setError(err.message)
            setLoading(false)
         }
      }

      fetchData()
   }, [url])

   return <>{children(data, error, loading)}</>
}

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => <div>Error: {error}</div>

const LoadingIndicator: React.FC = () => <div>Loading...</div>

const CsvTable: React.FC<{ data: CsvRow[] }> = ({ data }) => {
   const maxLines = 200
   const remainingLines = data.length > maxLines ? data.length - maxLines : 0
   const displayedData = data.slice(0, maxLines)
   const columnCount = Object.keys(data[0]).length

   return (
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%', maxHeight: '500px' }}>
         <Table striped bordered hover style={{ fontSize: '0.8rem', minWidth: '1000px' }}>
            <thead>
               <tr>
                  {Object.keys(data[0]).map((header, idx) => (
                     <th key={idx}>{header}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {displayedData.map((row, idx) => (
                  <tr key={idx}>
                     {Object.entries(row).map(([key, value], idx) => (
                        // @ts-ignore
                        <td key={idx}>{value.toString()}</td>
                     ))}
                  </tr>
               ))}
               {remainingLines > 0 && (
                  <tr>
                     <td colSpan={columnCount}>+ {remainingLines} more lines not shown</td>
                  </tr>
               )}
            </tbody>
         </Table>
      </div>
   )
}
const CsvVisualizer: React.FC<{ url: string }> = ({ url }) => (
   <Card>
      <Card.Body>
         <CsvDataProvider url={url}>
            {(data, error, loading) => {
               if (error) return <ErrorDisplay error={error} />
               if (loading) return <LoadingIndicator />
               return (
                  <div>
                     <CsvTable data={data} />
                     <div style={{ height: '15px' }} />
                     <MyGroupedBarChart data={data} />
                  </div>
               )
            }}
         </CsvDataProvider>
      </Card.Body>
   </Card>
)

export default CsvVisualizer
