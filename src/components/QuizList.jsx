import { useState, useEffect } from 'react'
import QuizService from '../services/Quizzes'
import PropTypes from 'prop-types'

const QuizList = () => {

    const [quizzes, setQuizzes] = useState([])

    useEffect(() => {
        initializeQuizzes()
    }, [])

    const initializeQuizzes = async () => {
        const quizList = await QuizService.getQuizzes()
        setQuizzes(quizList)
        console.log(quizzes)
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

const Quiz = ({ quiz }) => {

    return(
    <div>
            <h2>{quiz.title} by {quiz.author.username}</h2>
            {quiz.image ? <img style={{
                width: 300, height: 450, borderStyle: 'solid',
                borderWidth: 10, borderColor: 'teal'
            }}
                src={`api/images/${quiz.image}`} />
                : <img style={{
                    width: 300, height: 450, borderStyle: 'solid',
                    borderWidth: 10, borderColor: 'teal'
                }}
                    src={`api/images/symbol_questionmark.png`} />}
        </div>
    )
}

Quiz.PropTypes = {
    quiz: PropTypes.object.isRequired
}

export default QuizList
