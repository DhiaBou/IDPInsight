import React from 'react'
import { Col, Row } from 'react-bootstrap'

const Footer: React.FC = () => {
   return (
      <Row className='bg-dark text-white text-center py-3'>
         <Col>
            <p>&copy; 2024 IDP Insight</p>
         </Col>
      </Row>
   )
}

export default Footer
