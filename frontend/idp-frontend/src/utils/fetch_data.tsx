

/**
 * TODO: Implement HTTP GET request, returning all countries from the S3 bucket
 * @returns 
 */
export const getCountries = async (): Promise<string[]> => {
    return fetch('https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev/get-countries')
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
   * TODO: Implement HTTP GET request, returning all datasets for a country
   * @param country country name, probably iso3 will  be required
   * @returns array of dataset names
   */
export const getDatasets = (country: String) => {
  console.log("Get all datasets for country: " + country);
  return ["dataset-1", "dataset-2", "dataset-3"];
}


