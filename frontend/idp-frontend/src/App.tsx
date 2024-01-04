
import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";

import DefaultView from './views/DefaultView'
import SudanView from './views/SudanView'
import ColombiaView from './views/ColombiaView'

function App() {
  const countries = [
    {name: 'sudan'}, 
    {name: 'colombia'},
  ]

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<DefaultView countryNames={countries} />} />
          <Route path="sudan" element={<SudanView countryNames={countries}/>} />
          <Route path="colombia" element={<ColombiaView countryNames={countries}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App