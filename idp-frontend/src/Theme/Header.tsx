import React from 'react'
import { Container, Navbar, ListGroup } from 'react-bootstrap'
import logo from './logo.png'

const Header: React.FC = () => {
   return (
      <>
         <Navbar bg='light' expand='lg'>
            <Container>
               <Navbar.Brand href='/'>
                  <img src={logo} alt='Logo' style={{ width: '200px' }} />
               </Navbar.Brand>
            </Container>
         </Navbar>
         <div style={{ height: '20px' }} />
      </>
   )
}

export default Header
