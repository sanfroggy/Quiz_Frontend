//Importing the necessary hooks, services and components.
import {
    Routes,
    Route, Link, useNavigate
} from 'react-router-dom'
import { useState } from 'react'
import Play from './components/Play'
import QuizList from './components/QuizList'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import CreateQuizForm from './components/CreateQuizForm'
import Notification from './components/Notification'
import HomePage from './components/HomePage'
import login from './services/Login'
import createUser from './services/Users'
import QuizService from './services/Quizzes'

const App = () => {

    /*Defining "state variables" for the logged in user, a message string to display notifications
    and a booleans to define if the notification is an error message as well as to define if all
    quizzes are to be shown. Also defining a variable for using the useNavigate hook. */
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUserData'))
    const [user, setUser] = useState(loggedUser)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    //Defining an inline css-style for the different links.
    const padding = {
        paddingLeft: 15,
        display: 'inline'
    }

    //Defining a method to display a timed success notification to the user.
    const setSuccessMessage = (message, timeinseconds) => {
        setMessage(message)
        setError(false)
        setTimeout(() => {
            setMessage('')
            setError(false)
        }, timeinseconds * 1000)
    }

    //Defining a method to display a timed error notification to the user.
    const setErrorMessage = (message, timeinseconds) => {
        setMessage(message)
        setError(true)
        setTimeout(() => {
            setMessage('')
            setError(false)
        }, timeinseconds * 1000)
    }

    /*Defining a method for creating a new user. If the
    user is created successfully the useNavigate hook is used
    to go to the "login view". If not an error message is displayed. */
    const signUp = async (username, password) => {
        try {
            await createUser({ username, password })
            navigate('/login')
        } catch (exception) {

            setMessage(exception.response.data.error)
            setError(true)
            setTimeout(() => {
                setMessage('')
                setError(false)
            }, 3000)
        }
    }

    /*Defining a method for logging in. If the
    login is successful the useNavigate hook is used
    to go to the "quiz list view". If not an error message is displayed. */
    const loginFnct = async (username, password) => {

        try {
            const user = await login({ username, password })
            setUser(user)
            window.localStorage.setItem('loggedUserData', JSON.stringify(user))
            QuizService.setToken(user.token)
            navigate('/quizzes')
        } catch (exception) {

            setMessage(exception.response.data.error)
            setError(true)
            setTimeout(() => {
                setMessage('')
                setError(false)
            }, 3000)
        }
    }

    /*Defining a method for logging out. The user "state variable"
    is set to null and the loggedUserData item is removed from localStorage. */
    const logOut = () => {

        setUser(null)
        window.localStorage.removeItem('loggedUserData')

    }

    /*Returning links with conditional rendering depending on the logged in user.
    Also returning routes related to these links. "Home page view" is set to be the list of 
    available quizzes. */
    return (
        <div>
            <div>
                <Link to='/quizzes'>All quizzes</Link>
                {user ? <Link style={padding} to='/myquizzes'>My quizzes</Link> : null}
                {!user ? <Link style={padding} to='/login'>Login</Link> : null}
                {!user ? <Link style={padding} to='/signup'>Register</Link> : null}
                {user ? <Link style={padding} to='/create'>Create a quiz</Link> : null}
                {user ? <Link style={padding} to='/' onClick={logOut}>Logout</Link> : null}
                {user ? <p>Logged in as {user.username}</p> : null}
                <br />
                <br />
                <Notification message={message} isError={error} />
            </div>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/quizzes' element={<QuizList all={true} successMsgMethod={setSuccessMessage}
                    errorMsgMethod={setErrorMessage} />} />
                <Route path='/myquizzes' element={<QuizList all={false} successMsgMethod={setSuccessMessage}
                    errorMsgMethod={setErrorMessage} />} />
                <Route path='/login' element={<LoginForm loginMethod={loginFnct} />} />
                <Route path='/signup' element={<SignUpForm registerMethod={signUp} successMsgMethod={setSuccessMessage}
                    errorMsgMethod={setErrorMessage} />} />
                <Route path='/create' element={<CreateQuizForm errorMsgMethod={setErrorMessage} user={user}
                    successMsgMethod={setSuccessMessage} createNew={true} />} />
                <Route path='/edit/:id' element={<CreateQuizForm errorMsgMethod={setErrorMessage} user={user}
                    successMsgMethod={setSuccessMessage} createNew={false} />} />
                <Route path='/play/:id' element={<Play user={user}/>} />
            </Routes>
        </div>
    )
}

export default App
