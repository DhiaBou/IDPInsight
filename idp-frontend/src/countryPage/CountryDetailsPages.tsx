import { useParams } from 'react-router-dom'
import React from 'react'

const CountryDetailsPage: React.FC = () => {
	const { country } = useParams()

	return (
		<div>
			<h1>{country}</h1>
			<p>Some facts about {country}.</p>
		</div>
	)
}

export default CountryDetailsPage
