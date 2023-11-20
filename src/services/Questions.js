//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/questions'

/*Using axios.post method to send a created answer related to a question 
to the Node backend and returning the response. */
const addAnswer = async (id, answer) => {

    const response = await axios.post(`${baseUrl}/${id}/answers`, answer)
    return response.data
}

export default { addAnswer }

