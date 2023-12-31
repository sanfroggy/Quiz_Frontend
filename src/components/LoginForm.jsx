//Importing the defined useField custom hook and prop-types.
import { useField } from '../hooks/index'
import PropTypes from 'prop-types'

/*Defining a LoginForm component with text and password type input
fields and a submit button. The required login method is received
from props. */
const LoginForm = ({ loginMethod }) => {

    const username = useField('text')
    const password = useField('password')

    //Defining a method to handle logging in and resetting the input fields.
    const handleLogin = async (event) => {
        event.preventDefault()
        await loginMethod(username.objectProps.value, password.objectProps.value)
        username.reset()
        password.reset()
    }

    return (
        <form onSubmit={handleLogin}>
            <h2>Log in to Quizmos: </h2>
            <div>
                Username: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input name='userInput' autoComplete="off" {...username.objectProps} />
            </div>
            <br />
            <div>
                Password: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='password' name='pwdInput' {...password.objectProps} />
            </div>
            <br />
            <div>
                <button id='loginBtn' type="submit">Login</button>
            </div>
        </form>
    )
}

//Defining prop validation for the LoginForm component with PropTypes.
LoginForm.propTypes = {
    loginMethod: PropTypes.func.isRequired
}

export default LoginForm
