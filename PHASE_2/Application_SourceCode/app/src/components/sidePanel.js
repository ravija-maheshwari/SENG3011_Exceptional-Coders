import React from "react";
import SuburbGraph from "./suburbGraph";
import {
  getPotentialHospitalList,
  getPotentialSuburbList,
  getSortedHospitals,
} from "../helpers";
import { allNswAreas } from "../datasets/nswAreas";
import downArrow from "../mapIcons/down-arrow.png";
import upArrow from "../mapIcons/up-arrow.png";
import NswGraph from "./nswGraph";
import { allHospitals } from "../datasets/allHospitals";
import { Button } from "react-bootstrap";

class SidePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hospitalInput: "",
      suburbInput: "",
      searchingForHospital: false,
      searchingForSuburb: false,
      potentialHospitals: [],
      potentialSuburbs: [],
      isSidePanelOpen: false,
    };

    this.handleHospitalSearch = this.handleHospitalSearch.bind(this);
    this.hospitalSearchFocus = this.hospitalSearchFocus.bind(this);
    this.hospitalSearchOutOfFocus = this.hospitalSearchOutOfFocus.bind(this);
    this.setHospitalSearched = this.setHospitalSearched.bind(this);
    this.setSuburbSearched = this.setSuburbSearched.bind(this);
    this.suburbSearchFocus = this.suburbSearchFocus.bind(this);
    this.suburbSearchOutOfFocus = this.suburbSearchOutOfFocus.bind(this);
    this.openSidePanel = this.openSidePanel.bind(this);
    this.closeSidePanel = this.closeSidePanel.bind(this);
    this.openClosestHospital = this.openClosestHospital.bind(this);
  }

  handleHospitalSearch(evt) {
    let hospitalsInNSW = this.props.hospitals.filter(
      (h) => h["ispublic"] && h["state"] === "NSW"
    );
    this.setState({
      hospitalInput: evt.target.value,
      potentialHospitals: getPotentialHospitalList(
        evt.target.value,
        hospitalsInNSW
      ),
    });
  }

  hospitalSearchFocus() {
    this.setState({ searchingForHospital: true });
  }

  hospitalSearchOutOfFocus() {
    this.setState({ searchingForHospital: false });
  }

  setHospitalSearched(hospital) {
    let position;
    let { hospitals } = this.props;

    for (var i = 0; i < hospitals.length; i++) {
      if (hospitals[i].name.includes(hospital)) {
        position = {
          lat: hospitals[i].latitude - 0.31,
          lng: hospitals[i].longitude + 0.35,
        };
      }
    }

    let hospitalMarker = document.getElementById(hospital);
    hospitalMarker.click();

    this.setState({
      hospitalInput: hospital,
    });

    this.props.setHospitalSearched(position, hospital);
  }

  openClosestHospital(hospital) {
    let position;
    let hospitals = this.props.hospitals;

    for (var i = 0; i < hospitals.length; i++) {
      if (hospitals[i].name.includes(hospital)) {
        position = {
          lat: hospitals[i].latitude - 0.31,
          lng: hospitals[i].longitude + 0.35,
        };
      }
    }

    this.props.openClosestHospital(position);
    let hospitalMarker = document.getElementById(hospital);
    hospitalMarker.click();
  }

  handleSuburbSearch(evt) {
    this.setState({
      suburbInput: evt.target.value,
      potentialSuburbs: getPotentialSuburbList(evt.target.value, allNswAreas),
    });
  }

  setSuburbSearched(suburb) {
    this.setState({
      suburbInput: suburb,
    });
    this.props.setSuburbSearched(suburb);
  }

  suburbSearchFocus() {
    this.setState({ searchingForSuburb: true });
  }

  suburbSearchOutOfFocus() {
    this.setState({ searchingForSuburb: false });
  }

  displayHospitalSearchBar() {
    let { potentialHospitals } = this.state;

    return (
      <div className="search-hospital">
        <input
          onFocus={this.hospitalSearchFocus}
          onBlur={this.hospitalSearchOutOfFocus}
          type="text"
          value={this.state.hospitalInput}
          onChange={(evt) => this.handleHospitalSearch(evt)}
          placeholder="Search for a Hospital..."
        ></input>
        {this.state.searchingForHospital ? (
          <div className="hospital-list">
            {potentialHospitals.map((hospital) => (
              <p
                value={hospital}
                onMouseDown={() => this.setHospitalSearched(hospital)}
                className="hospital-option"
              >
                {hospital}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  displaySuburbSearchBar() {
    let { potentialSuburbs } = this.state;

    return (
      <div className="search-suburb">
        <input
          onFocus={this.suburbSearchFocus}
          onBlur={this.suburbSearchOutOfFocus}
          type="text"
          value={this.state.suburbInput}
          onChange={(evt) => this.handleSuburbSearch(evt)}
          placeholder="Set a Suburb..."
        ></input>
        {this.state.searchingForSuburb ? (
          <div className="suburb-list">
            {potentialSuburbs.map((suburb) => (
              <p
                value={suburb}
                onMouseDown={() => this.setSuburbSearched(suburb)}
                className="suburb-option"
              >
                {suburb}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  openSidePanel() {
    this.setState({ isSidePanelOpen: true });
  }

  closeSidePanel() {
    this.setState({ isSidePanelOpen: false });
  }

  openQuizModal() {
    this.props.openQuizModal();
  }

  displayOpenSidePanel() {
    return (
      <div className="open-side-panel" onClick={this.openSidePanel}>
        {/* <img src={sidePanelIcon} className="open-side-panel-icon"/> */}
        <img src={downArrow} className="down-arrow" />
        <p> Set suburb, view statewide trends and nearest hospitals </p>
      </div>
    );
  }

  render() {
    let currDate = new Date();
    let month = currDate.getMonth() < 10 ? "0" + (currDate.getMonth()+1) : currDate.getMonth()+1
    let currDateString = currDate.getDate() + "-" + month + "-" + currDate.getFullYear()
    let { selectedSuburb } = this.props;
    let closeHospitals = getSortedHospitals(
      this.props.selectedSuburb,
      allNswAreas,
      allHospitals
    );
    let closeHospital1 = closeHospitals[0].name;
    let closeHospital2 = closeHospitals[1].name;
    let closeHospital3 = closeHospitals[2].name;
    let closeHospital4 = closeHospitals[3].name;

    return !this.state.isSidePanelOpen ? (
      <div className="side-panel-mini">
        {this.displayHospitalSearchBar()}
        {this.displayOpenSidePanel()}
      </div>
    ) : (
      <div className="side-panel">
        {this.displayHospitalSearchBar()}
        {this.displaySuburbSearchBar()}

        {selectedSuburb.length !== 0 ? (
          <div className="closest-hospitals">
            <div className="closest-hospital-list">
              <div className="closest-hospital-title">
                <p> Hospitals near {this.props.selectedSuburb}: </p>
              </div>
              <li onClick={() => this.openClosestHospital(closeHospital1)}>
                {" "}
                {closeHospital1}({closeHospitals[0].distance} kms)
              </li>
              <li onClick={() => this.openClosestHospital(closeHospital2)}>
                {" "}
                {closeHospital2} ({closeHospitals[1].distance} kms)
              </li>
              <li onClick={() => this.openClosestHospital(closeHospital3)}>
                {" "}
                {closeHospital3} ({closeHospitals[2].distance} kms)
              </li>
              <li onClick={() => this.openClosestHospital(closeHospital4)}>
                {" "}
                {closeHospital4} ({closeHospitals[3].distance} kms)
              </li>
            </div>
          </div>
        ) : null}

        <div className="graph-rectangle">
          {selectedSuburb.length !== 0 ? (
            <SuburbGraph
                allSuburbCases={this.props.allSuburbCases} 
                selectedSuburb={selectedSuburb} />
          ) : (
            <NswGraph allSuburbCases={this.props.allSuburbCases}/>
          )}
          <p className="disclaimer">
            {" "}
            <p className="disclaimer-red">Disclaimer:</p> Last updated {currDateString}. 
            This model updates every 2 days and is intended to help make fast
            decisions, not predict the future{" "}
          </p>
        </div>
        <div className="quiz-button">
            <button onClick={this.openQuizModal.bind(this)}> Take the COVID-19 Screening Quiz </button>
        </div>

        <div className="close-side-panel" onClick={this.closeSidePanel}>
          <img src={upArrow} className="up-arrow" />
          <p> Hide Side Panel </p>
        </div>
      </div>
    );
  }
}

export default SidePanel;
