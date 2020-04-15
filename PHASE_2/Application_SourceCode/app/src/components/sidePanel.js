import React from "react";
import SuburbGraph from "./suburbGraph"
import { getPotentialHospitalList, getPotentialSuburbList } from '../helpers'
import { allNswAreas } from "../datasets/nswAreas";

class SidePanel extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            hospitalInput: "",
            suburbInput: "",
            searchingForHospital: false,
            searchingForSuburb: false,
            potentialHospitals: [],
            potentialSuburbs: []
        }

        this.handleHospitalSearch = this.handleHospitalSearch.bind(this);
        this.hospitalSearchFocus = this.hospitalSearchFocus.bind(this);
        this.hospitalSearchOutOfFocus = this.hospitalSearchOutOfFocus.bind(this);
        this.setHospitalSearched = this.setHospitalSearched.bind(this);
        this.setSuburbSearched = this.setSuburbSearched.bind(this);
        this.suburbSearchFocus = this.suburbSearchFocus.bind(this);
        this.suburbSearchOutOfFocus = this.suburbSearchOutOfFocus.bind(this);
    }

    handleHospitalSearch(evt){
        let hospitalsInNSW = this.props.hospitals.filter(h => h["ispublic"] && h["state"] === "NSW")
        this.setState({
            hospitalInput: evt.target.value,
            potentialHospitals: getPotentialHospitalList(evt.target.value, hospitalsInNSW)
        });
    }

    hospitalSearchFocus() {
        this.setState({ searchingForHospital: true })
    }

    hospitalSearchOutOfFocus() {
        this.setState({ searchingForHospital: false })
    }

    setHospitalSearched(hospital) {
        let position
        let { hospitals } = this.props

        for (var i=0; i<hospitals.length; i++) {
            if (hospitals[i].name.includes(hospital)) {
                position = { lat: hospitals[i].latitude, lng: hospitals[i].longitude }
            }
        }

        let hospitalMarker = document.getElementById(hospital)
        hospitalMarker.click()

        this.setState({
            hospitalInput: hospital
        })

        this.props.setHospitalSearched(position, hospital)
    }

    handleSuburbSearch(evt){
        this.setState({
            suburbInput: evt.target.value,
            potentialSuburbs: getPotentialSuburbList(evt.target.value, allNswAreas)
        });
    }

    setSuburbSearched(suburb){
        this.setState({
            suburbInput: suburb
        })
        
        this.props.setSuburbSearched(suburb)
    }

    suburbSearchFocus() {
        this.setState({ searchingForSuburb: true })
    }

    suburbSearchOutOfFocus() {
        this.setState({ searchingForSuburb: false })
    }

    displayHospitalSearchBar() {
        let { potentialHospitals } = this.state

        return (
            <div className="search-hospital">
                <input onFocus={this.hospitalSearchFocus} onBlur={this.hospitalSearchOutOfFocus} type="text" value={ this.state.hospitalInput } onChange={ evt => this.handleHospitalSearch(evt) } placeholder="Search for a Hospital..."></input>
                {this.state.searchingForHospital
                ?
                    <div className="hospital-list">
                            {potentialHospitals.map((hospital) => <p value={hospital} onMouseDown={() => this.setHospitalSearched(hospital)} className="hospital-option">{hospital}</p>)}
                    </div>
                :
                null
                }
            </div>
        )
    }

    displaySuburbSearchBar() {
        let { potentialSuburbs } = this.state

        return (
            <div className="search-suburb">
            <input onFocus={this.suburbSearchFocus} onBlur={this.suburbSearchOutOfFocus} type="text" value={ this.state.suburbInput }  onChange={evt => this.handleSuburbSearch(evt)} placeholder="Set a Suburb..."></input>
            {this.state.searchingForSuburb
                ?
                <div className="suburb-list">
                    {potentialSuburbs.map((suburb) => <p value={suburb} onMouseDown={() => this.setSuburbSearched(suburb)} className="suburb-option">{suburb}</p>)}
                </div>
                :
                null
            }
            </div>
        )
    }

    render(){
        return (
            <div className = "side-panel">
                {this.displayHospitalSearchBar()}
                {this.displaySuburbSearchBar()}
                <SuburbGraph
                    suburb={this.props.suburb}
                />
            </div>
        )
    }
}

export default SidePanel
