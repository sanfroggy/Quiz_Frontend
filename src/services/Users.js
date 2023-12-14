//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/users'

/*Using axios.post method to send user data to the Node backend
and returning the created user in the response. */
const createUser = async (userData) => {
    const response = await axios.post(baseUrl, userData)
    return response.data
}

export default createUser
