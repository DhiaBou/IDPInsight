const API_ROOT: string = 'https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev'

export const ENDPOINTS = {
   getCountries: `${API_ROOT}/get-countries`,
   datasetsForACountry: `${API_ROOT}/get-datasets-for-a-country`,
   triggerRefresh: `${API_ROOT}/trigger-pipeline`
}