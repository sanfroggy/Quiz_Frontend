import {Routes,
    Route, Link, useNavigate
} from 'react-router-dom'
import { useState } from 'react'
import QuizList from './components/QuizList'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import CreateQuizForm from './components/CreateQuizForm'
import Notification from './components/Notification'
import login from './services/Login'
import createUser from './services/Users'
import QuizService from './services/Quizzes'

const App = () => {

    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUserData'))
    const [user, setUser] = useState(loggedUser)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const padding = {
        paddingLeft: 15,
        display: 'inline'
    }

    const setSuccessMessage = (message, timeinseconds) => {
        setMessage(message)
        setError(false)
        setTimeout(() => {
            setMessage('')
            setError(false)
        }, timeinseconds * 1000)
    }


    const setErrorMessage = (message, timeinseconds) => {
        setMessage(message)
        setError(true)
        setTimeout(() => {
            setMessage('')
            setError(false)
        }, timeinseconds * 1000)
    }

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

    const logOut = () => {

        setUser(null)
        window.localStorage.removeItem('loggedUserData')

    }

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
                <Route path='/' element={<QuizList />} />
                <Route path='/quizzes' element={<QuizList />} />
                <Route path='/myquizzes' element={<QuizList />} />
                <Route path='/login' element={<LoginForm loginMethod={loginFnct} />} />
                <Route path='/signup' element={<SignUpForm registerMethod={signUp} successMsgMethod={setSuccessMessage}
                    errorMsgMethod={setErrorMessage} />} />
                <Route path='/create' element={<CreateQuizForm errorMsgMethod={setErrorMessage} user={user}
                    successMsgMethod={setSuccessMessage} />} />
            </Routes>
        </div>
    )
}

export default App
