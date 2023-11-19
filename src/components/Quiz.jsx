import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const Quiz = ({ quiz }) => {

    const [topics, setTopics] = useState([])

    const topicsArr = []

    useEffect(() => {
        quiz.questions.map(question => {
            if (!topicsArr.includes(question.topic)) {
                const topic = question.topic
                topicsArr.push(topic)
            }
        })
        setTopics(topicsArr)
    }, [])

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

Quiz.propTypes = {
    quiz: PropTypes.object.isRequired
}

export default Quiz
