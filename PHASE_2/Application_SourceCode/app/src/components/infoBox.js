import React from 'react'
import HospitalGraph from './hospitalGraph'

class InfoBox extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            casesOrBeds: "cases"
        }

        this.switchGraph = this.switchGraph.bind(this)
    }

    switchGraph(evt) {
        if (evt.target.checked) {
            this.setState({ casesOrBeds: "beds" })
        }
        else {
            this.setState({ casesOrBeds: "cases" })
        }
    }

    displayToggleSwitch() {
        return (
            <label className="switch">
                <input type="checkbox" onChange={this.switchGraph}/>
                <span className="slider round"></span>
            </label>
        )
    }

    render(){
        return(
            <div className="info-box">
                <span id={"close-info-" + this.props.name} className="close-info-box" onClick={this.props.closeInfoDisplayed}> &#x2715; </span>
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
                    <div className="toggle">
                        <p className="toggle-text"> Predicted Cases </p>
                        {this.displayToggleSwitch()}
                        <p className="toggle-text"> Predicted Beds </p>
                    </div>
                    <HospitalGraph
                        suburb={this.props.suburb}
                        allSuburbCases={this.props.allSuburbCases}
                        totalBeds={this.props.totalBeds}
                        casesOrBeds={this.state.casesOrBeds}
                    />
                </div>
            </div>
        );
    }
}

export default InfoBox