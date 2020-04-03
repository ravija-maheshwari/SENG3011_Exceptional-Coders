import React from 'react'

class InfoBox extends React.Component{

    constructor(props) {
        super(props)
    }

    render(){
        return(
            <div className="info-box">
                <span className="close-info-box" onClick={this.props.closeInfoDisplayed}> &#x2715; </span>
                <p className="hospital-name"> {this.props.name} </p>
            </div>
        );
    }
}

export default InfoBox