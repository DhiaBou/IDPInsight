import React from 'react'
import Card from 'react-bootstrap/Card'
import formatDate from '../countryPage/utils'

interface DatasetOfAFileComponentProps {
   title: string
   description: string
   lastModified: string
   source: string
}

const DatasetOfAFileComponent: React.FC<DatasetOfAFileComponentProps> = ({
   title,
   description,
   lastModified,
   source
}) => {
   return (
      <Card style={{ backgroundColor: '#f5f5f5' }}>
         <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Footer>
               <small>Last modified: {formatDate(lastModified)}</small>
            </Card.Footer>
            <Card.Footer>
               <small>Source: {source}</small>
            </Card.Footer>
         </Card.Body>
      </Card>
   )
}

export default DatasetOfAFileComponent
