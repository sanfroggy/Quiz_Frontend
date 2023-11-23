const HomePage = () => {
    return (
        <div>
            <div>
                <h1>Quizmos</h1>
                <br />
                <div>
                    <img style={{
                        width: 100, height: 200
                    }}
                        src={`api/images/symbol_questionmark.png`} />
                </div>
                <br />
                <p>Register and create fun quizzes.</p>
                <p> Try quizzes created by others
                and set a new high score. </p>
            </div>
            <br />

        </div>
    )
}

export default HomePage
