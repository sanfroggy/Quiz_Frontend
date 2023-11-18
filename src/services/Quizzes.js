//Importing axios.
import axios from 'axios'

//Defining a baseUrl variable for the request.
const baseUrl = '/api/quizzes'

let token = null

//Defining a function to set the value of the token variable.
const setToken = newToken => {

    token = `Bearer ${newToken}`
}

const getQuizzes = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

/*Using axios.post method to send credentials to the Node backend
and returning the response. */
const createQuiz = async (quiz) => {

    console.log(quiz)

    const config = {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    }

    const response = await axios.post(baseUrl, quiz, config)
    return response.data
}

export default { createQuiz, getQuizzes, setToken }
