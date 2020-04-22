import React from 'react'

class Quiz extends React.Component {

    closeQuizModal() {
        this.props.closeQuizModal()
    }

    render() {
        return (
            this.props.isVisible ?
                <div className="quiz-modal">
                    <div className="quiz-body">
                        {/* Close button has that className cos style is already there for close button */}
                        <span className="close-info-box" onClick={this.closeQuizModal.bind(this)}> &#x2715; </span>
                        <p> In Progress... </p>
                    </div>
                </div>
            :
                null
        )
    }
}

export default Quiz