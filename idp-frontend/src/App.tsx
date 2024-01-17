import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Theme/Header'
import HomePage from './HomePage/HomePage'
import { Container } from 'react-bootstrap'
import CountryDatasets from './countryPage/CountryDatasets'
import FileVisualizer from './fileVisualizer/FileVisualizer'
import Footer from './Theme/Footer'
import './App.css' // Assuming your CSS is in App.css

const App: React.FC = () => {
   return (
      <div id='main-container'>
         <Router>
            <div className='content'>
               <Header />
               <Container>
                  <Routes>
                     <Route path='/' element={<HomePage />} />
                     <Route path='/:country' element={<CountryDatasets />} />
                     <Route path='/:country/:dataset/:file' element={<FileVisualizer />} />
                  </Routes>
               </Container>
            </div>
            <Footer />
         </Router>
      </div>
   )
}

export default App
