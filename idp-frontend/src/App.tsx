import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Theme/Header'
import HomePage from './HomePage/HomePage'
import { Container } from 'react-bootstrap'
import CountryDatasets from './countryPage/CountryDatasets'
import FileVisualizer from './fileVisualizer/FileVisualizer'
import Footer from './Theme/Footer'

const App: React.FC = () => {
   return (
      <Router>
         <Header />
         <Container>
            <Routes>
               <Route path='/' element={<HomePage />} />
               <Route path='/:country' element={<CountryDatasets />} />
               <Route path='/:country/:dataset/:file' element={<FileVisualizer />} />
            </Routes>
         </Container>
         <Footer />
      </Router>
   )
}

export default App
