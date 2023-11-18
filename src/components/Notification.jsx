const Notification = (props) => {

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

export default Notification
