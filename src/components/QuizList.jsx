//Importing the necessary hooks, services and components.
import { useState, useEffect } from 'react'
import QuizService from '../services/Quizzes'
import Quiz from './Quiz'

/*Defining a component to display a list of Quiz objects
received from the mongoDB through Node backend. */
const QuizList = () => {

    //Defining a "state variable" for the array of quizzes.
    const [quizzes, setQuizzes] = useState([])

    //Initializing the array of quizzes on first render.
    useEffect(() => {
        initializeQuizzes()
    }, [])

    /*Defining a method to get the array of quiz objects from the
    Node backend and set the state of the quizzes array. */
    const initializeQuizzes = async () => {
        const quizList = await QuizService.getQuizzes()
        setQuizzes(quizList)
    }

    //Returning a the quizzes array mapped to Quiz components. */
    return (
        <div>
            {quizzes.length > 0 ? quizzes.map(quiz => 
                <div key={quiz.id}>
                    <Quiz quiz={quiz} getImageMethod={QuizService.getImage} />
                </div>
            ) : null}
        </div>
    )
}

export default QuizList
