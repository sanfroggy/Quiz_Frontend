import { useState } from 'react'
import { useField } from '../hooks/index'
import QuizService from '../services/Quizzes'
import PropTypes from 'prop-types'

const CreateQuizForm = ({errorMsgMethod, successMsgMethod, user }) => {

    const [selectedImage, setSelectedImage] = useState('')
    const title = useField('text')

    const handleImage = async () => {

        console.log(selectedImage)

        try {
            const response = await postImage(selectedImage)
            console.log(response)
        } catch (error) {
            console.log(error)
            //errorMsgMethod(error.response.data.error)
        }
    }

    const handleCreate = async (event) => {
        event.preventDefault()

        try {
            const quizTitle = title.objectProps.value
            const author = user
            const image = selectedImage

            await QuizService.createQuiz({
                title: quizTitle,
                author: author,
                image: image
            })

            successMsgMethod(`Quiz ${title.objectProps.value} has been created successfully.`, 3)
            title.reset()
            selectedImage.reset()

        } catch (exception) {
            console.log(exception)

        }
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
                    Upload a decorative image:
                    <br /><br />
                    <button type='button'><label style={{ backgroundColor: 'buttonface' }}
                        htmlFor='image'>Choose image</label></button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedImage.name}
                    <input type='file' accept='image/*' style={{ visibility: 'hidden' }} id='image' name='image' value=''
                        onChange={(event) => setSelectedImage(event.target.files[0])} />
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