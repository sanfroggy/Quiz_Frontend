//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/quizzes'

let token = null

//Defining a function to set the value of the token variable.
const setToken = newToken => {

    token = `Bearer ${newToken}`
}

/*Using axios.get method to get all existing quizzes
from the Node backend and returning the response. */
const getQuizzes = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

/*Using axios.get method to get a single existing quizzes
from the Node backend with an id received as a parameter
and returning the response. */
const getQuiz = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

/*Using axios.post method to send a quiz object to the Node backend
and returning the response. A jsonwebtoken is also sent to the backend
in the Authorization header for authorization and the Content-Type header is 
altered to allow multer to recognize image data. */
const createQuiz = async (quiz) => {

    const config = {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    }

    const response = await axios.post(baseUrl, quiz, config)
    return response.data
}

const deleteQuiz = async (id) => {

    const config = {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

/*Using axios.post method to send a created question related to a quiz
to the Node backend and returning the response. */
const addQuestion = async (id, question) => {

    const response = await axios.post(`${baseUrl}/${id}/questions`, question)
    return response.data
}

export default { createQuiz, getQuizzes, getQuiz, deleteQuiz, addQuestion, setToken }
