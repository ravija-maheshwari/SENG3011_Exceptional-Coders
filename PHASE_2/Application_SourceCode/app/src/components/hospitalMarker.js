import React from 'react'
import hospitalRed from '../mapIcons/hospitalRed.png'
import hospitalOrange from '../mapIcons/hospitalOrange.png'
import hospitalGreen from '../mapIcons/hospitalGreen.png'
import InfoBox from './infoBox'
import { getBedsCapacityRatio, getDistanceToSelectedSuburb } from '../helpers'
import allNswAreas from '../datasets/nswAreas'

class HospitalMarker extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isInfoDisplayed: false,
            markerClass: "hospital-marker"
        }

        this.openInfo = this.openInfo.bind(this)
        this.closeInfo = this.closeInfo.bind(this)
    }

    openInfo(){
        this.setState({isInfoDisplayed: true, markerClass: "hospital-marker-selected" })
        this.props.autoCloseInfoBox("close-info-" + this.props.name)

        let position
        let hospitals = this.props.hospitals

        for (var i=0; i<hospitals.length; i++) {
            if (hospitals[i].name.includes(this.props.name)) {
                position = { lat: hospitals[i].latitude - 0.31, lng: hospitals[i].longitude + 0.35 }
            }
        }

        this.props.setCenter(position)
    }

    closeInfo(){
        this.setState({isInfoDisplayed: false, markerClass: "hospital-marker" })
        this.props.closedInfoBoxes()
    }

    render() {
        let { lat, lng, selectedSuburb } = this.props
        let bedsAvailable = this.props.bedsAvailable
        let totalBeds = this.props.totalBeds
        let bedsRatio = getBedsCapacityRatio(bedsAvailable, totalBeds)
        let distanceToSuburb = 0
        
        if (selectedSuburb.length !== 0) {
            distanceToSuburb = getDistanceToSelectedSuburb(lat, lng, selectedSuburb, allNswAreas)
        }

        return (
            <div className={this.state.markerClass}>
                {/* If bedsRatio > 0.7, show GREEN, if > 0.3 && <= 0.7, show ORANGE, else show RED */}
                { bedsRatio > 0.7 ?
                    <img id={this.props.name} alt="marker" src={hospitalGreen} onClick={ this.openInfo } ></img>
                : bedsRatio > 0.3 && bedsRatio <= 0.7 ?
                    <img id={this.props.name} alt="marker" src={hospitalOrange} onClick={ this.openInfo } ></img>
                :
                    <img id={this.props.name} alt="marker" src={hospitalRed} onClick={ this.openInfo } ></img>
                }
                {this.state.isInfoDisplayed ?
                <InfoBox
                    name = {this.props.name}
                    closeInfoDisplayed = {this.closeInfo}
                    totalBeds = {this.props.totalBeds}
                    bedsAvailable = {this.props.bedsAvailable}
                    kitsAvailable = {this.props.kitsAvailable}
                    suburb = {this.props.suburb}
                    distanceToSuburb = {distanceToSuburb}
                    allSuburbCases = {this.props.allSuburbCases}
                />
                :
                null}
            </div>
        )
    }
}

export default HospitalMarker
