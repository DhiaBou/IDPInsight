import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import { Link } from 'react-router-dom'
import formatDate from './utils'
interface ProcessedFile {
   file_name: string
   last_modified: string
}

interface DatasetProps {
   country: string
   datasetFolderName: string
   title: string
   description: string
   lastModified: string
   source: string
   processedFiles: ProcessedFile[]
}
const FileItem: React.FC<ProcessedFile & { country: string; datasetFolderName: string }> = ({
   file_name,
   last_modified,
   country,
   datasetFolderName
}) => (
   <ListGroup.Item style={{ fontSize: '0.75rem' }}>
      Date: {formatDate(last_modified)}
      <br />
      File: <Link to={`/${country}/${datasetFolderName}/${file_name}`}>{file_name}</Link>
   </ListGroup.Item>
)

const DatasetComponent: React.FC<DatasetProps> = ({
   datasetFolderName,
   country,
   title,
   description,
   lastModified,
   source,
   processedFiles
}) => {
   const [activeKey, setActiveKey] = useState('')

   // @ts-ignore
   const CustomToggle = ({ children, eventKey }) => {
      const decoratedOnClick = useAccordionButton(eventKey, () => {
         setActiveKey(activeKey === eventKey ? '' : eventKey)
      })

      return (
         <button
            type='button'
            style={{
               backgroundColor: 'transparent',
               border: 'none',
               padding: 0,
               fontSize: '0.875rem', // Adjust font size to match Card.Footer
               color: '#007bff' // Adjust color to match Card.Footer (if needed)
            }}
            onClick={decoratedOnClick}
         >
            {children}
         </button>
      )
   }

   return (
      <Card>
         <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Footer>
               <small>Last modified: {formatDate(lastModified)}</small>
            </Card.Footer>
            <Card.Footer>
               <small>Source: {source}</small>
            </Card.Footer>
            <Accordion defaultActiveKey=''>
               <Card.Footer>
                  <small>
                     <CustomToggle eventKey='0'>Available processed files &#9662;</CustomToggle>
                  </small>
               </Card.Footer>
               <Accordion.Collapse eventKey='0'>
                  <ListGroup variant='flush'>
                     {processedFiles
                        // @ts-ignore
                        .sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified))
                        .map((file, index) => (
                           <FileItem key={index} {...file} country={country} datasetFolderName={datasetFolderName} />
                        ))}
                  </ListGroup>
               </Accordion.Collapse>
            </Accordion>
         </Card.Body>
      </Card>
   )
}

export default DatasetComponent
