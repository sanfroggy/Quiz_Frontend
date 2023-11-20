//Importing the defined useEffect and useState hooks and prop-types.
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

/*Defining a component for displaying the data of a single quiz object
received from the QuizList component. */
const Quiz = ({ quiz }) => {

    /*Defining a "state variable" for topics array. */
    const [topics, setTopics] = useState([])

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
            <button style={{width: 320, height: 35, fontSize: 20} }>Play</button>
        </div>
    )
}

//Defining prop validation for the Quiz component with PropTypes.
Quiz.propTypes = {
    quiz: PropTypes.object.isRequired
}

export default Quiz
