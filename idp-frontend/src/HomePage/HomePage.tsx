import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ENDPOINTS } from '../utils/apiEndpoints'
import { WorldMapAndSelector } from './WorldMapAndSelector'

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

const HomePage: React.FC = () => {
   return (
      <Container>
         <HomePageComponent />
      </Container>
   )
}

export default HomePage
