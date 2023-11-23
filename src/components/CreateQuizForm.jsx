//Importing the necessary hooks, services and components, as well as prop-types.
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useField } from '../hooks/index'
import QuizService from '../services/Quizzes'
import PropTypes from 'prop-types'
import Togglable from './Togglable'
import QuestionForm from './QuestionForm'

/*Defining a component for creating a quiz object to be saved to mongoDB 
through Node backend. */
const CreateQuizForm = ({errorMsgMethod, successMsgMethod, user, createNew }) => {

    /*Defining "state variables" for the display image, quizSubmitted boolean and
    quiz object to be created. Also defining a variable for title and questionsMax
    variables with the defined useField custom hook as well as the ref for the Togglable 
    component. */
    const [selectedImage, setSelectedImage] = useState('')
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quiz, setQuiz] = useState(null)
    const title = useField('text')
    const questionsMax = useField('number')
    const questionFormRef = useRef()
    const params = useParams()

    useEffect(() => {
        if (!createNew) {
            setQuizToEdit()
        }
    }, [])

    const setQuizToEdit = async () => {
        const id = params.id
        const quiz = await QuizService.getQuiz(id)
        setQuiz(quiz)
        setQuizSubmitted(true)
        questionFormRef.current.toggleVisibility()
    }

    //Defining a method to handle creating a quiz.
    const handleCreate = async (event) => {

        event.preventDefault()

        try {

            const quizTitle = title.objectProps.value
            const author = user
            const image = selectedImage
            let questionsToComplete

            /*If the value of the input field is smaller than 0 or the
            input field doesn't have a value, the value of the variable to
            be passed to the backend is set to 0. If not the value is the value 
            of the input field. */
            if (questionsMax.objectProps.value < 0 ||
                !questionsMax.objectProps.value) {
                questionsToComplete = 0
            } else {
                questionsToComplete = questionsMax.objectProps.value
            }

            /*Setting the jsonwebtoken of the imported QuizService
            for authorization. */
            QuizService.setToken(user.token)

            /*Defining the newQuiz object to be passed to the backend 
            and saved to the MongoDB. */
            const newQuiz = await QuizService.createQuiz({
                title: quizTitle,
                author: author,
                image: image,
                completedAt: questionsToComplete
            })

            /*Displaying a message informing the user of a successful operation
            and resetting the input fields. Also showing the QuestionForm component. */
            successMsgMethod(`Quiz ${title.objectProps.value} has been created successfully.`, 3)
            setQuiz(newQuiz)
            setQuizSubmitted(true)
            title.reset()
            setSelectedImage(null)
            questionFormRef.current.toggleVisibility()

        } catch (exception) {

            /*If an exception is caught it is printed as an error message and displayed to the user
            for 3 seconds. */
            //const msg = exception.data.errors.title.message
            if (exception.response.data.name === 'ValidationError') {
                if (!exception.response.data.message.includes('unique')) {
                    errorMsgMethod(exception.response.data.message.substring(31), 3)
                } else {
                    errorMsgMethod(`E${exception.response.data.message.substring(39, 68)}`, 3)
                }
                console.log(exception)
                
            } else {
                errorMsgMethod(exception.response.data.error, 3)
            }
        }
    }

    //Getting the input element for the validation of the questionsMax variable.
    let input = document.getElementById('completedAtInput');

    /*Adding an event listener for the number type input field of the questionsMax 
    variable to make sure that a proper numeric value is provided. */
    if (input) {
        input.addEventListener('input', function () {

            this.setCustomValidity('');

            if (this.validity.badInput || this.validity.typeMismatch) {
                this.setCustomValidity('Please enter a valid number.');
            }
        });
    }

    /*Returning a form with input fields, image upload button and a submit button.
    Also returning a QuestionForm component as a child of the defined Togglable
    component. */
    return (
        <div>
            <form onSubmit={handleCreate} encType='multipart/form-data'>
                <div>
                    {!quizSubmitted ? <div><h2>Create a quiz: </h2>
                    <div>
                        Title: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input name='titleInput' {...title.objectProps} />
                    </div>
                    <br />
                    <div>
                        Questions to complete: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input id='completedAtInput' name='completedAtInput'
                            onInvalid={() => this.setCustomValidity('Enter a valid number.')} {...questionsMax.objectProps} />
                    </div>
                    <br />
                    Upload a decorative image:
                    <br /><br />
                    <button type='button'><label style={{ backgroundColor: 'buttonface' }}
                        htmlFor='image'>Choose image</label></button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedImage ? selectedImage.name : null}
                    <input type='file' accept='image/*' style={{ visibility: 'hidden' }} id='image' name='image' value=''
                            onChange={(event) => setSelectedImage(event.target.files[0])} /> </div>:
                    <div>
                        <h2>{quiz.title}:</h2>
                    </div>}
                </div>
                <br />
                <div>
                    {!quizSubmitted ? <button type = 'submit'>Submit</button> : null }
                </div>
            </form>
            <div>
                <Togglable buttonLabel="New blog" ref={questionFormRef}>
                    <QuestionForm quiz={quiz} successMsgMethod={successMsgMethod} errorMsgMethod={errorMsgMethod} />
                </Togglable>
            </div>
        </div>
    )
}

//Defining prop validation for the CreateQuizForm component with PropTypes.
CreateQuizForm.propTypes = {
    errorMsgMethod: PropTypes.func.isRequired,
    successMsgMethod: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    createNew: PropTypes.bool.isRequired
}

export default CreateQuizForm