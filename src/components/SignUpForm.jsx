import * as Yup from 'yup';
import { useField } from '../hooks/index'
import PropTypes from 'prop-types'

const SignUpForm = ({ registerMethod, successMsgMethod, errorMsgMethod }) => {

    const username = useField('text')
    const password = useField('password')
    const passwordReentry = useField('password')

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username cannot have an empty value.'),
        password: Yup.string().min(8, 'Password must have a minimum of eight characters.').
            required('Password cannot have an empty value.'),
        passwordReentry: Yup.string().oneOf([Yup.ref('password'), null], 'Password re-entry is invalid.').
            required('You must confirm the password by re-entering it.'),
    });

    const handleRegister = async (event) => {

        event.preventDefault()

        try {
            const user = username.objectProps.value
            const pwd = password.objectProps.value
            const pwdReentry = passwordReentry.objectProps.value
            // Awaiting for Yup to validate text
            await validationSchema.validate({
                username: user, password: pwd,
                passwordReentry: pwdReentry
            }, { abortEarly: false });

            await registerMethod(username.objectProps.value, password.objectProps.value)

            successMsgMethod(`User ${username.objectProps.value} has been created successfully.`, 3)
            username.reset()
            password.reset()

        } catch (exception) {
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

SignUpForm.propTypes = {
    registerMethod: PropTypes.func.isRequired,
    errorMsgMethod: PropTypes.func.isRequired,
    successMsgMethod: PropTypes.func.isRequired
}

export default SignUpForm
