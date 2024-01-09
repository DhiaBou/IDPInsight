import React from 'react'
import Card from 'react-bootstrap/Card'

interface DatasetOfAFileComponentProps {
	title: string
	description: string
	lastModified: string
	id: string
	source: string
}

const DatasetOfAFileComponent: React.FC<DatasetOfAFileComponentProps> = ({
	title,
	description,
	lastModified,
	id,
	source
}) => {
	return (
		<Card>
			<Card.Body>
				<Card.Title>{title}</Card.Title>
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
			</Card.Body>
		</Card>
	)
}

export default DatasetOfAFileComponent
