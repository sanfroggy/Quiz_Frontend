//Importing the necessary hooks, services and components.
import { useState, useEffect } from 'react'
import QuizService from '../services/Quizzes'
import PropTypes from 'prop-types'
import Quiz from './Quiz'

/*Defining a component to display a list of Quiz objects
received from the mongoDB through Node backend. */
const QuizList = ({ all, successMsgMethod, errorMsgMethod }) => {

    const user = JSON.parse(window.localStorage.getItem('loggedUserData'))
    //Defining a "state variable" for the array of quizzes.
    const [quizzes, setQuizzes] = useState([])

    //Initializing the array of quizzes on first render.
    useEffect(() => {
        initializeQuizzes()
    }, [all])

    /*Defining a method to delete a quiz. If the removal is confirmed,
    the id of the quiz is given to the deleteQuiz method defined in 
    the imported QuizService. */
    const deleteMethod = async (quiz) => {
        try {
            const id = quiz.id
            if (window.confirm(`Are you sure you want to remove 
            ${quiz.title}?`)) {
                QuizService.setToken(user.token)
                await QuizService.deleteQuiz(id)
                setQuizzes(quizzes.filter(quiz => quiz.id === id ?
                    null : quiz))
                successMsgMethod(`Quiz ${quiz.title} removed successfully.`, 3)
            }
        } catch (exception) {
            console.log(exception)
            errorMsgMethod(exception.response.data.error, 3)
        }
    }

    /*Defining a method to get the array of quiz objects from the
    Node backend and set the state of the quizzes array. */
    const initializeQuizzes = async () => {

        /*If the value of all received is true, then all quizzes
        are shown. If not, then only the quizzes created by the currently 
        logged in user are shown. */
        if (all === true) {
            const quizList = await QuizService.getQuizzes()
            setQuizzes(quizList)
        } else {
            if (user) {
                const quizList = await QuizService.getQuizzes()
                setQuizzes(quizList.filter(quiz => quiz.author.username === user.username
                    ? quiz : null))
            }
        }

    }

    //Returning a the quizzes array mapped to Quiz components. */
    return (
        <div>
            {quizzes.length > 0 ? quizzes.map(quiz => 
                <div key={quiz.id}>
                    {all ? <Quiz quiz={quiz} getImageMethod={QuizService.getImage} mydisplay={false}
                        handleDelete={deleteMethod} />
                        : <Quiz quiz={quiz} getImageMethod={QuizService.getImage} mydisplay={true}
                            handleDelete={deleteMethod} />}
                </div>
            ) : null}
        </div>
    )
}

//Defining prop validation for the CreateQuizForm component with PropTypes.
QuizList.propTypes = {
    all: PropTypes.bool.isRequired,
    successMsgMethod: PropTypes.func.isRequired,
    errorMsgMethod: PropTypes.func.isRequired
}

export default QuizList
