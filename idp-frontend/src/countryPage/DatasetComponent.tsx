import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { Link } from 'react-router-dom';
interface DatasetProps {
  country: string;
  datasetFolderName: string;
  title: string;
  description: string;
  lastModified: string;
  id: string;
  source: string;
  fileNames: string[];
}

const DatasetComponent: React.FC<DatasetProps> = ({ datasetFolderName, country, title, description, lastModified, id, source, fileNames }) => {
  const [activeKey, setActiveKey] = useState('');

  // @ts-ignore
  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setActiveKey(activeKey === eventKey ? '' : eventKey);
    });

    return (
      <button
        type="button"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          fontSize: '0.875rem', // Adjust font size to match Card.Footer
          color: '#007bff' // Adjust color to match Card.Footer (if needed)
        }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Footer>
          <small>Last modified: {lastModified}</small>
        </Card.Footer>
        <Card.Footer>
          <small>Id: {id}</small>
        </Card.Footer>
        <Card.Footer>
          <small>Source: {source}</small>
        </Card.Footer>
        <Accordion defaultActiveKey="">
        <Card.Footer>
            <small><CustomToggle eventKey="0">Available processed files &#9662;</CustomToggle></small>
        </Card.Footer>
          <Accordion.Collapse eventKey="0">
            <ListGroup variant="flush">
              {fileNames.map((fileName, index) => (
                <Link to={`/${country}/${datasetFolderName}/${fileName}`} key={index}>
                  <ListGroup.Item style={{ fontSize: '0.75rem' }}>{fileName}</ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          </Accordion.Collapse>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default DatasetComponent;
