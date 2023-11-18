//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/login'

/*Using axios.post method to send credentials to the Node backend
and returning the response. */
const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default login
