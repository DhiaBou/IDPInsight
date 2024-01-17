import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { ENDPOINTS } from '../utils/apiEndpoints'
import { WorldMapAndSelector } from './WorldMapAndSelector'
import logo from './logo.png'
// this function gets the countries that have available datasets
export const fetchData = async (): Promise<any> => {
   try {
      const response = await fetch(ENDPOINTS.getCountries)
      if (!response.ok) {
         console.error('Network response was not ok')
         return []
      }
      return await response.json()
   } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      return []
   }
}

// this function displays the home the world map that have the available datasets
const HomePageComponent = () => {
   const [data, setData] = useState<any[]>([])

   useEffect(() => {
      const getData = async () => {
         try {
            const result = await fetchData()
            setData(result)
         } catch (error) {
            console.error('Failed to fetch data:', error)
         }
      }
      getData()
   }, [])
   return <WorldMapAndSelector countryISOs={data} />
}

// this component serves as the home page. It has the logo on top, then thw world map below it
const HomePage: React.FC = () => {
   return (
      <Container>
         <Row className='bg-dark text-white text-center py-4'>
            <Col>
               <img src={logo} alt='Logo' style={{ width: '300px' }} />
               <div style={{ height: '20px' }} />
               <p style={{ fontFamily: 'Roboto' }}>Automated Data Solution for Internally Displaced Persons</p>
            </Col>
         </Row>
         <div style={{ height: '50px' }} />

         <HomePageComponent />
      </Container>
   )
}

export default HomePage
