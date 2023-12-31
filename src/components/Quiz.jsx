//Importing the defined useEffect and useState hooks and prop-types.
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/*Defining a component for displaying the data of a single quiz object
received from the QuizList component. */
const Quiz = ({ quiz, mydisplay, handleDelete }) => {

    /*Defining a "state variable" for topics array and a variable for using
    the useNavigate hook. */
    const [topics, setTopics] = useState([])
    const navigate = useNavigate()

    const topicsArr = []

    /*Using the topicsArr variable and the topics state variable to
    map the topics of all questions into a single array. No topic should
    be present in the array twice. */
    useEffect(() => {
        quiz.questions.map(question => {
            if (!topicsArr.includes(question.topic)) {
                const topic = question.topic
                topicsArr.push(topic)
            }
        })
        setTopics(topicsArr)
    }, [])

    /*Returning a header with the title and author of the quiz, a list of topics
    related to this quiz and the decorative image uploaded upon creation and received
    from the MongoDB through Node backend. */
    return (
        <div>
            <div>
                <h2>{quiz.title} by {quiz.author.username}</h2>
            </div>
            <div>
                <h3>Topics:</h3>
            
                {topics.length > 0 ? topics.map(topic => 
                    <p style={{ display: 'inline' }} key={topic}>
                        {topics.indexOf(topic) > 0 ? ', ' + topic : topic}</p>
                ) : null}
                <br /><br />
            </div>
            <div>
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
            <br />
            {!mydisplay ? quiz.questions.length > 0 ? <button style={{ width: 320, height: 35, fontSize: 20 }}
                    onClick={() => { navigate(`/play/${quiz.id}`) }}>Play</button> : null :
                <div><button style={{ width: 320, height: 35, fontSize: 20 }}
                    onClick={() => { navigate(`/edit/${quiz.id}`) }}>Edit</button>
                    <br /><br /><button style={{ width: 320, height: 35, fontSize: 20 }}
                        onClick={() => { handleDelete(quiz) }}>Delete</button></div>}  
        </div>
    )
}

//Defining prop validation for the Quiz component with PropTypes.
Quiz.propTypes = {
    quiz: PropTypes.object.isRequired,
    mydisplay: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired
}

export default Quiz
