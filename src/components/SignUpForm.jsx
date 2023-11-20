//Importing thedefined useField custom hook, yup library and prop-types.
import * as Yup from 'yup';
import { useField } from '../hooks/index'
import PropTypes from 'prop-types'

/*Defining a component for creating a user object saved to mongoDB 
through Node backend. */
const SignUpForm = ({ registerMethod, successMsgMethod, errorMsgMethod }) => {

    /*Defining a variable for the username, password and password reentry 
    with the defined useField custom hook. */
    const username = useField('text')
    const password = useField('password')
    const passwordReentry = useField('password')

    /*Defining a validation schema for the username, password and password reentry
    using the imported yup library. */
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username cannot have an empty value.'),
        password: Yup.string().min(8, 'Password must have a minimum of eight characters.').
            required('Password cannot have an empty value.'),
        passwordReentry: Yup.string().oneOf([Yup.ref('password'), null], 'Password re-entry is invalid.').
            required('You must confirm the password by re-entering it.'),
    });

    /*Defining a method for creating a user and saving the created object to
    MongoDB through Node backend. */
    const handleRegister = async (event) => {

        event.preventDefault()

        try {
            const user = username.objectProps.value
            const pwd = password.objectProps.value
            const pwdReentry = passwordReentry.objectProps.value

            /*Validating the values of the username, password
            and passwordrReentry variables. */
            await validationSchema.validate({
                username: user, password: pwd,
                passwordReentry: pwdReentry
            }, { abortEarly: false });

            /*If the opration is a success, a message is displayed for 3 seconds and the
            values of the input fields are reset. */
            await registerMethod(username.objectProps.value, password.objectProps.value)

            successMsgMethod(`User ${username.objectProps.value} has been created successfully.`, 3)
            username.reset()
            password.reset()

        } catch (exception) {

            /*If an exceptions are caught an error message addressing each error is displayed 
            to the user. */
            if (exception.errors.length > 1) {
                let errorstring = ''
                exception.errors.forEach((error) => {
                    errorstring += ` ${error}`
                })
                errorMsgMethod(errorstring, 4.5)
            } else {
                errorMsgMethod(exception.message, 3)
            }
            
        }
    }

    //Returning a form with input fields and a submit button.
    return (
        <form onSubmit={handleRegister}>
            <h2>Sign up: </h2>
            <div>
                Username: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input name='userInput' {...username.objectProps} />
            </div>
            <br />
            <div>
                Password: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='password' name='pwdInput' {...password.objectProps} />
            </div>
            <br />
            <div>
                Re-enter password: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='password' name='pwdReentryInput' {...passwordReentry.objectProps} />
            </div>
            <br />
            <div>
                <button id='submitBtn' type="submit">Submit</button>
            </div>
        </form>
    )

}

//Defining prop validation for the SignUpForm component with PropTypes.
SignUpForm.propTypes = {
    registerMethod: PropTypes.func.isRequired,
    errorMsgMethod: PropTypes.func.isRequired,
    successMsgMethod: PropTypes.func.isRequired
}

export default SignUpForm
