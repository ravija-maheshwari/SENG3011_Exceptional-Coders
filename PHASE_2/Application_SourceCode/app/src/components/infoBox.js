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
                <div className="hospital-detail">
                    <p> Total beds = {this.props.totalBeds}</p>
                    <p> Beds Available = {this.props.bedsAvailable}</p>
                </div>
            </div>
        );
    }
}

export default InfoBox