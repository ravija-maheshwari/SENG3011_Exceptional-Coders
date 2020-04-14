import React from 'react'
import HospitalGraph from './hospitalGraph'

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
                    {this.props.distanceToSuburb
                    ?
                        <p> Distance to home suburb = {this.props.distanceToSuburb} kms </p>
                    :
                        null
                    }
                    <HospitalGraph
                        suburb={this.props.suburb}
                        allSuburbCases={this.props.allSuburbCases}
                        totalBeds={this.props.totalBeds}
                    />
                </div>
            </div>
        );
    }
}

export default InfoBox