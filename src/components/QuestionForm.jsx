//Importing the necessary hooks and services as well as prop-types.
import { useState, useEffect } from 'react'
import { useField } from '../hooks/index'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import QuizService from '../services/Quizzes'
import QuestionsService from '../services/Questions'

/*Defining a component for adding questions and answers related to a quiz 
object saved to mongoDB through Node backend. */
const QuestionForm = ({ quiz, successMsgMethod, errorMsgMethod }) => {

    /*Defining "state variables" for the answer array, number of answers to be given,
    the correct answer object and the boolean result of radio button validation, when checking
    that a value is selected. Also defining a variable for the question string and 
    the topic of the question with the defined useField custom hook and the useNavigate hook. */
    const [answerCount, setAnswerCount] = useState(4)
    const [answers, setAnswers] = useState(new Array(parseInt(4)).fill(''))
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const [optionSelected, setOptionSelected] = useState(false)

    const question = useField('text')
    const topic = useField('text')
    const navigate = useNavigate()

    /*Getting the input element for the validation of the answerCount variable and the
    addBtn button used to add a question and related answers. */
    let input = document.getElementById('numberOfAnswersInput');
    let addButton = document.getElementById('addBtn');

    /*Setting the length of the answer array, whenever the answerCount variable changes.
    This results in a correct number of answer input fields being rendered. */
    useEffect(() => {
        if (answerCount) {
            if (answerCount > 0 && answerCount < 5) {
                setAnswers(new Array(parseInt(answerCount)).fill(''))
            } else {
                setAnswers(new Array(4).fill(''))
            }
        } else {
            setAnswers(new Array(4).fill(''))
        }


    }, [answerCount])

    /*Adding an event listener for the number type input field of the answerCount
    variable to make sure that a proper numeric value is provided. */
    if (input) {
        input.addEventListener('input', function () {

            this.setCustomValidity('');

            if (this.validity.badInput || this.validity.typeMismatch) {
                this.setCustomValidity('Please enter a valid number.');
            }
        });
    }
    /*Adding an event listener for the radio input fields of to make sure 
    that a correct answer is selected when the addButton is clicked. */
    if (addButton) {
        addButton.addEventListener('click', function () {

            if (answerCount > 1) {
                //Getting the radio buttons used for selecting a correct answer.
                const radios = document.getElementsByName('correctAnswerRadio');

                let selected = false;

                let i = 0;

                /*When the question object is sent to Node backend at least one of the radio buttons
                needs to be checked to indicate a correct answer. */
                while (!selected && i < radios.length) {
                    if (radios[i].checked) {
                        selected = true;
                    }
                    i++;
                }

                if (selected) {

                    setOptionSelected(true)

                    radios.forEach(radio => {
                        radio.setCustomValidity('')
                    })
                } else {

                    setOptionSelected(false)

                    /*If no correct answer is selected the setCustomValidity function is used to display a message
                    indicating that the user should select one of the answers to be the correct answer. */
                    radios.forEach(radio => {
                        if (topic && question && !answers.includes('')) {
                            radio.setCustomValidity('Select a correct answer.');
                            radio.checkValidity()
                        }
                    })
                }
            } else {
                setOptionSelected(true)
            }
           
        });
    }


    /*Defining a method for updating the answers array according to user input.
    The element at the given index is replaced with event.target.value. */
    const handleUserInputChange = (index, event) => {

        const answersBefore = [...answers].slice(0, index)
        const answersAfter = [...answers].slice(index + 1)

        const newArr = []
        if (answersBefore.length > 0) {
            answersBefore.forEach(answer =>
                newArr.push(answer)
            )
        }

        newArr.push(event.target.value)

        if (answersAfter.length > 0) {
            answersAfter.forEach(answer =>
                newArr.push(answer)
            )
        }

        setAnswers(newArr)
    }

    //Defining a method to handle creating answers for a defined question.
    const handleAddAnswers = async (id) => {

        try {

            /*Defining a for loop to iterate through the answers array if more than
            one answer exists. If the answer is equal to the correct answer object it a
            correct field is set to true, to indicate that it is the correct answer
            and the backend should add it's value to the correctAnswer field of the 
            Question object. If only one exists it is automatically the correct answer. */
            if (answerCount > 1) {
                for (const answer of answers) {
                    if (answer === correctAnswer) {

                        const answerObj = {
                            title: answer,
                            correct: true
                        }

                        await QuestionsService.addAnswer(id, answerObj)

                    } else {

                        const answerObj = {
                            title: answer,
                            correct: false
                        }

                        await QuestionsService.addAnswer(id, answerObj)
                    }
                }
            } else {
                const answerObj = {
                    title: answers[0],
                    correct: true
                }

                await QuestionsService.addAnswer(id, answerObj)
            }

        } catch (exception) {

            /*If an exception is caught it is printed as an error message and displayed to the user
            for 3.5 seconds. */
            console.log(exception)
            errorMsgMethod(exception.response.data.error, 3.5)
        }

    }

    //Defining a method to handle creating a question related to the created quiz.
    const handleAddQuestion = async (event) => {

        event.preventDefault()

        try {

            /*Defining the questionObj object to be passed to the backend
            and saved to the MongoDB. */
            const questionObj = {
                title: question.objectProps.value,
                topic: topic.objectProps.value
            }

            //If an answer has an empty value the question is not created.
            if (!answers.includes('')) {

                if (optionSelected === true) {

                    //Creating the question and receiving the created object as a response.
                    const newQuestion = await QuizService.addQuestion(quiz.id, questionObj)

                    //Resetting the input fields.
                    question.reset()
                    topic.reset()

                    /*If the newQuestion object has a value the id is given as a parameter to
                    the handleAddAnswers method to save the answers related to the created question. Also
                    resetting the values of the answer input fields. */
                    if (newQuestion !== null && newQuestion !== undefined) {

                        handleAddAnswers(newQuestion.id)

                        if (answerCount) {
                            if (answerCount > 0 && answerCount < 5) {
                                setAnswers(new Array(parseInt(answerCount)).fill(''))
                            } else {
                                setAnswers(new Array(4).fill(''))
                            }
                        } else {
                            setAnswers(new Array(4).fill(''))
                        }

                        //Displaying a message for 4 seconds informing the user of a successful operation.
                        successMsgMethod(`Question ${newQuestion.title} and the given answers successfully added to ${quiz.title}`, 4)
                    }
                }

            } else {
                /*If an exception is caught it is printed as an error message and displayed to the user
                for 4 seconds. */
                errorMsgMethod('All answers must have a value.', 4)
            }

        } catch (exception) {
            /*If an exception is caught it is printed as an error message and displayed to the user
            for 4 seconds. */
            console.log(exception)
            if (exception.response.data.name === 'ValidationError') {

                if (exception.response.data.message.length < 60) {
                    errorMsgMethod(exception.response.data.message.substring(34), 4)
                } else {
                    const msgString = `${exception.response.data.message.substring(34, 57)}
                     ${exception.response.data.message.substring(66)}`
                    errorMsgMethod(msgString, 4)
                }
            }
            
        } 

    }

    /*Returning a form with input fields, radio buttons, add question button and a 
    button to save the quiz and exit the view. */
    return (
        <div>
            <form onSubmit={(event) => handleAddQuestion(event)}>
                <h2>Add a question: </h2>
                <div>
                    Number of answers (1-4): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type='number' id='numberOfAnswersInput' name='numberOfAnswersInput'
                        onChange={(event) => { setAnswerCount(event.target.value) }} />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <br />
                <div>
                    Question: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input name='questionInput' autoComplete="off" {...question.objectProps} />
                </div>
                <br />
                <div>
                    Topic: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input name='topicInput' autoComplete="off" {...topic.objectProps} />
                </div>
                <br />
                {answers.length > 0 ? answers.map((answer, i) => <><div key={`answer${i}Container`}><br />
                    {answers.length === 1 ? 'Answer: (Player has to give the exact answer.):'
                        : `Option${i + 1}:`} &nbsp;&nbsp;&nbsp;&nbsp;<input key={`answer${i}Text`}
                            name={`answer${i}`}
                            autoComplete="off"
                            value={answer}
                            onChange={(event) => handleUserInputChange(i, event)} />
                    &nbsp;&nbsp;&nbsp;&nbsp;{answers.length > 1 ? <><input key={`answer${i}Radio`} type="radio" id={`answer${i}CorrectRadio`}
                        name='correctAnswerRadio' value={answers[i]} onChange={(event) => setCorrectAnswer(event.target.value)} />
                        &nbsp;&nbsp; Correct answer</>
                        : null}</div>
                </>
                ) : null}
                <br />

                <br />
                <div>
                    <button id='addBtn' type='submit' >Add question</button>
                </div>
                <br />
                <div>
                    <button id='saveBtn' onClick={() => {navigate('/quizzes') } }>Save quiz and exit</button>
                </div>
            </form>
        </div>
    )
}

//Defining prop validation for the QuestionForm component with PropTypes.
QuestionForm.propTypes = {
    errorMsgMethod: PropTypes.func.isRequired,
    successMsgMethod: PropTypes.func.isRequired,
    quiz: PropTypes.object.isRequired
}

export default QuestionForm