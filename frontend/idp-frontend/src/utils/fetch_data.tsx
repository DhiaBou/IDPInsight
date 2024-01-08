import { Dataset } from "./types";

/**
 * HTTP GET request, returning all countries ISO3
 * @returns country ISO3
 */
export const getCountries = async (url: URL): Promise<string[]> => {
    return fetch(url)
      .then((response) => {
        if(!response.ok) {
          throw new Error("Bad response");
        }
      
        return response.json();
      })
      .then((data) => {
        // Ensure data is an array before returning it
        if (Array.isArray(data)) {
          return data;
        } else {
          console.error("Data is not an array: ", data);
          throw new Error("Data is not an array");
        }
      })
      .catch((err)=>{
        console.error("Error fetching data: ", err);
        throw err;
      })
  };


  /**
   * TODO: Implement HTTP GET request, returning all datasets names for a country
   * @param country country name, probably iso3 will  be required
   * @returns array of dataset names
   */
export const getDatasets = (country: string, baseUrl: URL): Promise<Dataset[]> => {
  const url = new URL(baseUrl + "/" + country);
  return fetch(url)
          .then((response) => {
            if(!response.ok) {
              throw new Error("Bad response");
            }
            return response.json();
          })
          .then((data: Dataset[]) => {
            let datasets: Dataset[] =[];

            for(const dataset of data) {
              let entry: Dataset = {
                country: country, 
                id: dataset.id,
                name: dataset.name
              }
              datasets.push(entry);
            }

            return datasets;
          })
          .catch((err)=>{
            console.error("Error fetching data: ", err);
            throw err;
          })
}

export const getData = async (): Promise<any> => {
  console.log("Get country and dataset data");

  return fetch("https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev/get-countries")
          .then((response) => {
            if(!response.ok) {
              throw new Error("Bad response");
            }
            
            const data = response.json();
            return data;
          })
          .catch((error) => { 
            console.error("Error fetching data: ", error);
            throw error;
          })
}

