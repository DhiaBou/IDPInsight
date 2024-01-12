import React from 'react'
import Card from 'react-bootstrap/Card'

interface FileDetailsComponentProps {
   cdvDownloadUrl: string
   description: string
   lastModified: string
   id: string
   source: string
   name: string
   downloadUrl: string
}

const FileDetailsComponent: React.FC<FileDetailsComponentProps> = ({
   name,
   downloadUrl,
   cdvDownloadUrl,
   description,
   lastModified,
   id,
   source
}) => {
   return (
      <Card>
         <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Footer>
               <small>Last modified: {lastModified}</small>
            </Card.Footer>
            <Card.Footer>
               <small>Id: {id}</small>
            </Card.Footer>
            <Card.Footer>
               <small>Source: {source}</small>
            </Card.Footer>
            <Card.Footer>
               <small>
                  HDX Download url:{' '}
                  <a href={downloadUrl} target='_blank' rel='noopener noreferrer'>
                     Download from here
                  </a>
               </small>
            </Card.Footer>
            <Card.Footer>
               <small>
                  Processed File Download url:{' '}
                  <a href={cdvDownloadUrl} target='_blank' rel='noopener noreferrer'>
                     Download from here
                  </a>
               </small>
            </Card.Footer>
         </Card.Body>
      </Card>
   )
}

export default FileDetailsComponent
