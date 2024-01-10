import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Header'
import HomePage from './HomePage/HomePage'
import Page1 from './Page1'
import Page2 from './Page2'
import { Container } from 'react-bootstrap'
import CountryDatasets from './countryPage/CountryDatasets'
import FileVisualizer from './fileVisualizer/FileVisualizer'
import Footer from './Footer'

const App: React.FC = () => {
   return (
      <Router>
         <Header />
         <Container>
            <Routes>
               <Route path='/' element={<HomePage />} />
               <Route path='/page1' element={<Page1 />} />
               <Route path='/page2' element={<Page2 />} />
               <Route path='/:country' element={<CountryDatasets />} />
               <Route path='/:country/:dataset/:file' element={<FileVisualizer />} />
            </Routes>
         </Container>
         <Footer />
      </Router>
   )
}

export default App
