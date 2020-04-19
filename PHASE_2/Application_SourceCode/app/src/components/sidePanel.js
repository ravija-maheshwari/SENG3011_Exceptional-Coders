import React from "react";
import SuburbGraph from "./suburbGraph"
import { getPotentialHospitalList, getPotentialSuburbList, getSortedHospitals } from '../helpers'
import { allNswAreas } from "../datasets/nswAreas";
import downArrow from '../mapIcons/down-arrow.png'
import upArrow from '../mapIcons/up-arrow.png'
import NswGraph from "./nswGraph";
import { allHospitals } from "../datasets/allHospitals"

class SidePanel extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            hospitalInput: "",
            suburbInput: "",
            searchingForHospital: false,
            searchingForSuburb: false,
            potentialHospitals: [],
            potentialSuburbs: [],
            isSidePanelOpen: false
        }

        this.handleHospitalSearch = this.handleHospitalSearch.bind(this);
        this.hospitalSearchFocus = this.hospitalSearchFocus.bind(this);
        this.hospitalSearchOutOfFocus = this.hospitalSearchOutOfFocus.bind(this);
        this.setHospitalSearched = this.setHospitalSearched.bind(this);
        this.setSuburbSearched = this.setSuburbSearched.bind(this);
        this.suburbSearchFocus = this.suburbSearchFocus.bind(this);
        this.suburbSearchOutOfFocus = this.suburbSearchOutOfFocus.bind(this);
        this.openSidePanel = this.openSidePanel.bind(this)
        this.closeSidePanel = this.closeSidePanel.bind(this)
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

    openSidePanel() {
        this.setState({ isSidePanelOpen: true })
    }

    closeSidePanel() {
        this.setState({ isSidePanelOpen: false })
    }

    displayOpenSidePanel() {
        return (
            <div className="open-side-panel" onClick={this.openSidePanel}>
                {/* <img src={sidePanelIcon} className="open-side-panel-icon"/> */}
                <img src={downArrow} className="down-arrow" />
                <p> Set suburb, view statewide trends and nearest hospitals </p>
            </div>
        )
    }

    render(){
        let { selectedSuburb } = this.props
        let closeHospitals = getSortedHospitals(this.props.selectedSuburb, allNswAreas, allHospitals)
        console.log(closeHospitals)
        return (
            !this.state.isSidePanelOpen ?
                <div className = "side-panel-mini">
                    {this.displayHospitalSearchBar()}
                    {this.displayOpenSidePanel()}
                </div>
            :
                <div className = "side-panel">
                    {this.displayHospitalSearchBar()}
                    {this.displaySuburbSearchBar()}
                    {/* {this.displaySuburbSearchBar()} */}
                        {/* {selectedSuburb.length !== 0 ?
                            <div className="selected-suburb-indicator">
                                <p> Your suburb is {selectedSuburb} </p>
                            </div>
                        :
                            null
                        } */}
                        <div className="closest-hospitals">
                            {selectedSuburb.length !== 0 ?
                                <div>
                                    <p> Hospitals near {this.props.selectedSuburb}: </p>
                                    <li> {closeHospitals[0].name}({closeHospitals[0].distance} kms)</li>
                                    <li> {closeHospitals[1].name} ({closeHospitals[1].distance} kms)</li>
                                    <li> {closeHospitals[2].name} ({closeHospitals[2].distance} kms)</li>
                                    <li> {closeHospitals[3].name} ({closeHospitals[3].distance} kms)</li>
                                </div>
                                :
                                null
                            }
                        </div>

                        <div className="graph-rectangle">
                            {selectedSuburb.length !== 0 ?
                                <SuburbGraph
                                    selectedSuburb={selectedSuburb}
                                />
                                :
                                <NswGraph />
                            }
                        </div>
                        <div className="quiz-button">
                            <button> Take the quiz </button>
                        </div>

                    <div className="close-side-panel" onClick={this.closeSidePanel}>
                        <img src={upArrow} className="up-arrow" />
                        <p> Hide Side Panel </p>
                    </div>
                </div>
        )
    }
}

export default SidePanel
