import { useState, useRef } from 'react'
import { useField } from '../hooks/index'
import QuizService from '../services/Quizzes'
import PropTypes from 'prop-types'
import Togglable from './Togglable'
import QuestionForm from './QuestionForm'

const CreateQuizForm = ({errorMsgMethod, successMsgMethod, user }) => {

    const [selectedImage, setSelectedImage] = useState('')
    const title = useField('text')
    const questionsMax = useField('number')
    const questionFormRef = useRef()

    const handleCreate = async (event) => {
        event.preventDefault()

        try {
            const quizTitle = title.objectProps.value
            const author = user
            const image = selectedImage
            let questionsToComplete
            if (questionsMax.objectProps.value < 0 ||
                !questionsToComplete) {
                questionsToComplete = 0
            } else {
                questionsToComplete = questionsMax.objectProps.value
            }

            QuizService.setToken(user.token)

            await QuizService.createQuiz({
                title: quizTitle,
                author: author,
                image: image,
                completedAt: questionsToComplete
            })

            successMsgMethod(`Quiz ${title.objectProps.value} has been created successfully.`, 3)
            title.reset()
            setSelectedImage(null)
            questionFormRef.current.toggleVisibility()

        } catch (exception) {
            errorMsgMethod(exception.response.data.error, 3)
        }
    }

    // Get DOM reference
    let input = document.getElementById('completedAtInput');

    // Add event listener
    if (input) {
        input.addEventListener('input', function () {

            // Clear any old status
            this.setCustomValidity('');

            // Check for invalid state(s)
            if (this.validity.badInput || this.validity.typeMismatch) {
                this.setCustomValidity('Please enter a valid number.');
            }
        });
    }

    return (
        <div>
            <form onSubmit={handleCreate} encType='multipart/form-data'>
                <div>
                    <h2>Create a quiz: </h2>
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
                        onChange={(event) => setSelectedImage(event.target.files[0])} />
                </div>
                <div>
                    <Togglable buttonLabel="New blog" ref={questionFormRef}>
                        <QuestionForm />
                    </Togglable>
                </div>
                <br />
                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

CreateQuizForm.propTypes = {
    errorMsgMethod: PropTypes.func.isRequired,
    successMsgMethod: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

export default CreateQuizForm