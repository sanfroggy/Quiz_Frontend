import { useState } from 'react'
import { useField } from '../hooks/index'
import PropTypes from 'prop-types'

const QuestionForm = (quiz) => {

    const [answerCount, setAnswerCount] = useState(4)
    const [answers, setAnswers] = useState(new Array(answerCount).fill(''));

    const question = useField('text')

    // Get DOM reference
    let input = document.getElementById('numberOfAnswersInput');

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

    const handleUserInputChange = position => (e) => {
        // Update the correct input state
        setAnswers(...answers.slice(0, position), e.target.value, ...answers.slice(position + 1));
    };

    const handleAddQuestion = () => {

    }
    return (
        <form onSubmit={handleAddQuestion}>
            <h2>Add a question: </h2>
            <div>
                Number of answers: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='number' id='numberOfAnswersInput' name='numberOfAnswersInput'
                    onChange={(event) => { setAnswerCount(event.target.value) }} />
            </div>
            <br />
            <div>
                Question: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input name='questionInput' {...question.objectProps} />
            </div>
            <br />
            {answers.map((text, i) => <div key={`answer${i}`}><br />Answer {i + 1}: &nbsp;&nbsp;&nbsp;&nbsp;<input key={`answer${i}`}
                name={`answer${i}`}
                value={text}
                onChange={handleUserInputChange(i)}
            /></div>)} 
            <br />
            
            <br />
            <div>
                <button id='submitBtn' type="submit">Submit</button>
            </div>
        </form>
    )
}

QuestionForm.propTypes = {
    quiz: PropTypes.object.isRequired
}

export default QuestionForm