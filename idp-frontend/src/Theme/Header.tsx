import React from 'react'
import { Container, Navbar, ListGroup } from 'react-bootstrap'

const Header: React.FC = () => {
   return (
      <>
         <Navbar bg='light' expand='lg'>
            <Container>
               <Navbar.Brand href='/'>IDP Insight</Navbar.Brand>
            </Container>
         </Navbar>
         <div style={{ height: '20px' }} />
      </>
   )
}

export default Header
