import React from 'react'
import hospitalRed from '../mapIcons/hospitalRed.png'
import hospitalOrange from '../mapIcons/hospitalOrange.png'
import hospitalGreen from '../mapIcons/hospitalGreen.png'
import InfoBox from './infoBox'
import { getBedsCapacityRatio } from '../helpers'

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
        let bedsAvailable = this.props.bedsAvailable
        let totalBeds = this.props.totalBeds
        let bedsRatio = getBedsCapacityRatio(bedsAvailable, totalBeds)

        return (
            <div className="hospital-marker">
                {/* If bedsRatio > 0.7, show GREEN, if > 0.3 && <= 0.7, show ORANGE, else show RED */}
                { bedsRatio > 0.7 ?
                    <img alt="marker" src={hospitalGreen} style={{ width: 18, height: 18 }} onClick={ this.openInfo } ></img>
                : bedsRatio > 0.3 && bedsRatio <= 0.7 ?
                    <img alt="marker" src={hospitalOrange} style={{ width: 18, height: 18 }} onClick={ this.openInfo } ></img>
                :
                    <img alt="marker" src={hospitalRed} style={{ width: 18, height: 18 }} onClick={ this.openInfo } ></img>
                }
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
