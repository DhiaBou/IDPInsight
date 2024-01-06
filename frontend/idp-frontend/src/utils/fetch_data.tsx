

/**
 * TODO: Implement HTTP GET request, returning all countries from the S3 bucket
 * @returns 
 */
export const getCountries = async (): Promise<Response> => {
    return fetch('https://2mj3txm4z1.execute-api.eu-west-1.amazonaws.com/dev/get-countries')
      .then((response) => {
        if(!response.ok) {
          throw new Error("Bad response");
        }
        console.log(response);
        return response;
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


