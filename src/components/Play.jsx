import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useField } from '../hooks/index'
import QuizService from '../services/Quizzes'

const Play = ({ user }) => {

    const params = useParams()
    const [quizStarted, setQuizStarted] = useState(false)

    const [quiz, setQuiz] = useState(null)
    const [question, setQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const givenAnswer = useField('text')
    const [fail, setFail] = useState(false)

    const [questionsUsed, setQuestionsUsed] = useState([])
    //Defining a variable to randomize the initial question
    let random = quiz ? Math.floor(Math.random() * quiz.questions.length) : null
    let randomAnswers = quiz ? Math.floor(Math.random() * quiz.questions[random].answers.length) : null

    useEffect(() => {
        initializeQuiz()
    }, [])

    const initializeQuiz = async () => {
        const id = params.id
        const quiz = await QuizService.getQuiz(id)
        setQuiz(quiz)
    }

    const startQuiz = () => {
        if (quiz) {
            setQuizStarted(true)
            setRandom()
        }
    }

    const checkAnswer = (event) => {
        const answer = event.target.value

        if (answers.length > 1) {
            if (answer === question.correctAnswer.id) {
                setFail(false)
                setRandom()
            } else {
                setFail(true)
            }
        } else {
            if (givenAnswer.objectProps.value === question.correctAnswer.title) {
                setFail(false)
                setRandom()
            } else {
                setFail(true)
            }
        }

    }

    const setRandom = () => {

        console.log(questionsUsed)
        console.log(quiz.questions.length)

        if (quiz && quiz.questions.length > questionsUsed.length) {

            random = Math.floor(Math.random() * quiz.questions.length)

            if (questionsUsed.length > 0) {
                while (questionsUsed.includes(quiz.questions[random])) {
                    random = Math.floor(Math.random() * quiz.questions.length)
                }
            } 

            let usedAnswers = []

            let newAnswers = []

            setQuestion(quiz.questions[random])

            setQuestionsUsed(questionsUsed.concat(quiz.questions[random]))

            if (quiz.questions[random].answers.length > 1) {

                randomAnswers = quiz ? Math.floor(Math.random() * quiz.questions[random].answers.length) : null

                for (let i = 0; i < quiz.questions[random].answers.length; i++) {
                    if (usedAnswers.length > 0) {
                        randomAnswers = quiz ? Math.floor(Math.random() * quiz.questions[random].answers.length) : null

                        while (usedAnswers.includes(quiz.questions[random].answers[randomAnswers])) {
                            randomAnswers = quiz ? Math.floor(Math.random() * quiz.questions[random].answers.length) : null
                        }

                        newAnswers.push(quiz.questions[random].answers[randomAnswers])
                        usedAnswers.push(quiz.questions[random].answers[randomAnswers])

                    } else {
                        randomAnswers = quiz ? Math.floor(Math.random() * quiz.questions[random].answers.length) : null
                        newAnswers.push(quiz.questions[random].answers[randomAnswers])
                        usedAnswers.push(quiz.questions[random].answers[randomAnswers])
                    }
                } 

                setAnswers(newAnswers)

            } else {

                newAnswers.push(quiz.questions[random].answers[0])
                setAnswers(newAnswers)
            }
            
        }
    }

    return (
        <div>
            {quiz ? <>
                {!quizStarted ? <div><h1>{quiz.title}</h1>
                    <br />
                    {quiz.highScore > 0 ? <p>High score {quiz.highScore} is currently set by {quiz.highScoreSetBy.username}</p> :
                        <p>No high score has been set for this quiz yet.</p>}
                    {quiz.completedAt > 0 ? <p>The quiz will be completed after answering {quiz.completedAt}
                        question correctly. </p> : <p>The quiz does not have a completion limit for questions.</p>}
                    {quiz.timeLimitPerQuestion > 0 ? <p>You will have a {quiz.timeLimitPerQuestion} seconds time limit to answer each question. <br /> <br />
                        If the question has only one option for answering, you have to know the exact answer.</p> :
                        <p>This quiz does not have a time limit for answering questions. <br /> <br />
                        If the question has only one option for answering, you have to know the exact answer.</p>}
                    <p>Press ready, when you are ready to start.</p>
                    <button style={{ width: 320, height: 35, fontSize: 22 }}
                        onClick={startQuiz}>Ready</button></div> :
                    <div>
                        <div style={{
                            backgroundImage: `api/images/${quiz.image}`
                        }}>
                            <p>{question.title}</p>
                        </div>
                        <>
                        {answers.length > 0 ?
                                answers.length === 1 ? <div><input name='answerInput' autoComplete="off" {...givenAnswer.objectProps} />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<button type='button'
                                    key={`submitAnswer`}
                                    name={`submitAnswer`}
                                    onClick={(event) => { checkAnswer(event) }}>
                                    Submit answer</button></div> :
                            <div>{answers.map((answer, i) => <div key={`answer${i}Container`}><br />
                                <button type='button'
                                    key={`answer${i}Text`}
                                    name={`answer${i}`}
                                    value={answer.id}
                                    onClick={(event) => { checkAnswer(event) }}>
                                    {String.fromCharCode('A'.charCodeAt() + i)}. {`${answer.title}`}</button></div>)}</div>
                            : null
                            }
                        </>
                    </div>
            }
            </> : null}
        </div>
    )
}


Play.propTypes = {
    user: PropTypes.object.isRequired
}

export default Play
