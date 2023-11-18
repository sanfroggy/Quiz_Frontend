//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/users'

/*Using axios.post method to send credentials to the Node backend
and returning the response. */
const createUser = async userData => {
    const response = await axios.post(baseUrl, userData)
    return response.data
}

export default createUser
