import React from 'react'
import hospitalIcon from '../mapIcons/hospital.png'
import InfoBox from './infoBox'

class HospitalMarker extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isInfoDisplayed: false
        }

        this.openInfo = this.openInfo.bind(this)
        this.closeInfo = this.closeInfo.bind(this)
    }


     openInfo(){
        this.setState({isInfoDisplayed: true})
    }

    closeInfo(){
        this.setState({isInfoDisplayed: false})
    }

    render() {
        return (
            <div className="hospital-marker">
                <img alt="marker" src={hospitalIcon} style={{ width: 18, height: 18 }} onClick={ this.openInfo } ></img>
                {this.state.isInfoDisplayed ?
                <InfoBox
                    name = {this.props.name}
                    closeInfoDisplayed = {this.closeInfo}
                    totalBeds = {this.props.totalBeds}
                    bedsAvailable = {this.props.bedsAvailable}
                    suburb = {this.props.suburb}
                />
                :
                null}
            </div>
        )
    }
}

export default HospitalMarker
