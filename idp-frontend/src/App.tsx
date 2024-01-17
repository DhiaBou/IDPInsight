import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Theme/Header'
import HomePage from './HomePage/HomePage'
import { Container } from 'react-bootstrap'
import CountryDatasets from './CountryPage/CountryDatasets'
import FileVisualizer from './FileVisualizer/FileVisualizer'
import Footer from './Theme/Footer'
import './App.css'
import CountryPage from './CountryPage/CountryPage'

const App: React.FC = () => {
   return (
      <div id='main-container'>
         <Router>
            <div className='content'>
               <Header />
               <Container>
                  <Routes>
                     <Route path='/' element={<HomePage />} />
                     <Route path='/:country' element={<CountryPage />} />
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
