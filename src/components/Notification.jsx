//Importing prop-types.
import PropTypes from 'prop-types'

/*Defining a Notification component to notify the user of successful and
failed operations. */
const Notification = (props) => {

    //Defining inline css-styles for success and error messages.
    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '18px,',
        borderStyle: 'solid',
        borderRadius: '4px',
        padding: '8px',
        marginBottom: '25px'
    }
    const errorStyle = {
        color: 'darkred',
        background: 'lightgrey',
        fontSize: '18px,',
        borderStyle: 'solid',
        borderRadius: '4px',
        padding: '8px',
        marginBottom: '25px'
    }

    /*Returning a message string to be displayed. If isError boolean is true
    errorStyle is used and if not successStyle is used. */
    if (!props.message) {
        return null
    } else {
        if (props.isError === false) {
            return (
                <div className='successMsg' style={successStyle}>
                    {props.message}
                </div>
            )
        }
        if (props.isError === true) {
            return (
                <div className='errorMsg' style={errorStyle}>
                    {props.message}
                </div>
            )
        }
    }

}

//Defining prop validation for the Notification component with PropTypes.
Notification.propTypes = {
    message: PropTypes.string.isRequired,
    isError: PropTypes.bool.isRequired
}

export default Notification
