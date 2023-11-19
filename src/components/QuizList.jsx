import { useState, useEffect } from 'react'
import QuizService from '../services/Quizzes'
import Quiz from './Quiz'
import PropTypes from 'prop-types'

const QuizList = () => {

    const [quizzes, setQuizzes] = useState([])

    useEffect(() => {
        initializeQuizzes()
    }, [])

    const initializeQuizzes = async () => {
        const quizList = await QuizService.getQuizzes()
        setQuizzes(quizList)
    }

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
