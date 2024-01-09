import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import Papa from 'papaparse';

// If the CSV structure is known, replace `any` with a more specific type/interface
type CsvRow = any;

const CsvVisualizer: React.FC<{ url: string }> = ({ url }) => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data as CsvRow[]);
          },
          error: (error: { message: React.SetStateAction<string | null>; }) => {
            setError(error.message);
          }
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // @ts-ignore
  return (
    <Card>
      <Card.Body>
        {data.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                {Object.keys(data[0]).map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.entries(row).map(([key, value], idx) => (
                    <td key={idx}>{'value.toString()'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>Loading...</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CsvVisualizer;
