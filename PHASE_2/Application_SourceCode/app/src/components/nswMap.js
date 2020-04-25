import React from "react";
import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../config";
import HospitalMarker from "./hospitalMarker";
import SidePanel from "./sidePanel";
import Quiz from "./quiz";
import ContributeForm from "./contributeForm";
import { suburbInfection } from '../datasets/suburbInfection'
import {
  getRadius,
  getAvailableBeds,
  getTotalBeds,
  getHospitalSuburb,
} from "../helpers";
import { allNswAreas } from "../datasets/nswAreas";
import { hospitalDetail } from "../datasets/hospitalDetail";
import hospitalRed from "../mapIcons/hospitalRed.png";
import hospitalOrange from "../mapIcons/hospitalOrange.png";
import hospitalGreen from "../mapIcons/hospitalGreen.png";
import hospitalBedIcon from "../mapIcons/bedIcon.svg";
import { Toast } from "react-bootstrap";

const HOSPITALS_API_URL =
  "https://myhospitalsapi.aihw.gov.au/api/v0/retired-myhospitals-api/hospitals";
const SUBURBS_API_URL =
  "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/suburbs";
const HOSPITAL_INFO_URL =
  "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/hospital";

function createMapOptions() {
  return {
    restriction: {
      latLngBounds: { north: -20, south: -45, west: 120, east: 175 },
      strictBounds: false,
    },
    gestureHandling: "greedy",
    fullscreenControl: false,
    minZoom: 6,
  };
}

class NSWMap extends React.Component {
  constructor(props) {
    super(props);

    // To hold all hospital data from myhospitals API
    this.state = {
      mapCenter: { lat: -33.5, lng: 149 },
      mapZoom: 6,
      hospitals: [],
      suburbCases: [],
      hospitalSearched: "",
      selectedSuburb: "",
      whichInfoBoxOpen: null,
      bedsInput: 0,
      hospitalInput: "",
      isFormOpen: false,
      isQuizOpen: false,
      updatedHospitalInfo: [],
    };

    this.autoCloseInfoBox = this.autoCloseInfoBox.bind(this);
    this.closedInfoBoxes = this.closedInfoBoxes.bind(this);
    this.setMapZoom = this.setMapZoom.bind(this);
  }

  // Fetching hospital locations before map is mounted on DOM
  async componentWillMount() {
    try {
      const response = await fetch(HOSPITALS_API_URL);
      const hospitals = await response.json();

      const hospInfoResponse = await fetch(HOSPITAL_INFO_URL);
      const updatedHospitalInfo = await hospInfoResponse.json();
      // Uncomment when testing real data from Firestore,
      // and add in 'suburbCases' in this.setState()
    //   const suburbResponse = await fetch(SUBURBS_API_URL)
    //   const suburbCases = await suburbResponse.json()

      this.setState({
        hospitals: hospitals,
        suburbCases: suburbInfection,
        updatedHospitalInfo: updatedHospitalInfo,
      });
    } catch (error) {
      console.log(error);
    }
  }

  addUpdatedHospitalInfo(hospitalObject) {
    let { updatedHospitalInfo } = this.state;
    updatedHospitalInfo.push(hospitalObject);

    this.setState({ updatedHospitalInfo: updatedHospitalInfo });
  }

  displayHospitals() {
    let { hospitals, updatedHospitalInfo } = this.state;
    let result = [];
    //const suburbCases =  this.state.suburbCases
    const suburbCases = this.state.suburbCases;
    // Adding markers for each hospital
    hospitals.forEach((h) => {
      if (h["ispublic"] && h["state"] === "NSW") {
        // Public hospitals in NSW
        let bedsAvailable;
        let totalBeds;

        if (updatedHospitalInfo.length === 0) {
            bedsAvailable = getAvailableBeds(h, hospitalDetail, suburbCases);
            totalBeds = getTotalBeds(h, hospitalDetail);
        }

        else {
            for (var i=0; i<updatedHospitalInfo.length; i++) {
                if (updatedHospitalInfo[i].name === h["name"]) {
                    bedsAvailable = getAvailableBeds(h, updatedHospitalInfo, suburbCases)
                    totalBeds = updatedHospitalInfo[i].beds
                }
                else {
                    bedsAvailable = getAvailableBeds(h, hospitalDetail, suburbCases);
                    totalBeds = getTotalBeds(h, hospitalDetail);
                }
            }
        }
        let suburb = getHospitalSuburb(h["name"], hospitalDetail);

        result.push(
          <HospitalMarker
            lat={h["latitude"]}
            lng={h["longitude"]}
            name={h["name"]}
            key={h["name"]}
            suburb={suburb}
            hospitals={this.state.hospitals}
            totalBeds={totalBeds}
            bedsAvailable={bedsAvailable}
            selectedSuburb={this.state.selectedSuburb}
            allSuburbCases={this.state.suburbCases}
            autoCloseInfoBox={this.autoCloseInfoBox}
            closedInfoBoxes={this.closedInfoBoxes}
            setCenter={this.openClosestHospital.bind(this)}
          />
        );
      }
    });

    return result;
  }

  setMapZoom = ({ zoom }) => {
    this.setState({ mapZoom: zoom });
  };

  closedInfoBoxes() {
    this.setState({ whichInfoBoxOpen: null });
  }

  autoCloseInfoBox(infoBoxID) {
    let { whichInfoBoxOpen } = this.state;

    if (whichInfoBoxOpen !== null) {
      let infoBox = document.getElementById(whichInfoBoxOpen);
      infoBox.click();
      this.setState({ whichInfoBoxOpen: infoBoxID });
    } else {
      this.setState({ whichInfoBoxOpen: infoBoxID });
    }
  }

  // Only for displayCircles() cos of weird behaviour
  // DON'T CALL THIS FUNCTION EXCESSIVELY
  async fetchSuburbs() {
    try {
      const response = await fetch(SUBURBS_API_URL);
      const suburbCases = await response.json();

      return suburbCases;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async displayCircles(map, maps) {
    try {
      // COMMENTED DUE TO QUOTA LIMITS
    //   const suburbCases = await this.fetchSuburbs()
      const suburbCases = suburbInfection
      allNswAreas.forEach((suburb) => {
        // COMMENTED DUE TO QUOTA LIMITS
        let suburbRadius = getRadius(suburbCases, suburb);
        new maps.Circle({
          // strokeColor: '#FF0000',
          // strokeOpacity: 0.8,
          strokeWeight: 0,
          fillColor: "#d13431",
          fillOpacity: 0.5,
          map,
          center: { lat: suburb.lat, lng: suburb.lng },
          radius: suburbRadius, // Default radius when not using fetchSuburbs()
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  setHospitalSearched(position, hospital) {
    this.setState({
      mapCenter: position,
      hospitalSearched: hospital,
      mapZoom: 10,
    });
  }

  openClosestHospital(position) {
    this.setState({
      mapCenter: position,
      mapZoom: 10,
    });
  }

  setSuburbSearched(selectedSuburb) {
    this.setState({
      selectedSuburb: selectedSuburb,
    });
  }

  openQuizModal() {
    this.setState({ isQuizOpen: true });
  }

  closeQuizModal() {
    this.setState({ isQuizOpen: false });
  }

  openForm() {
    this.setState({ isFormOpen: true });
  }

  closeForm() {
    this.setState({ isFormOpen: false });
  }

  // Render Map and use displayHospitals() to render markers
  render() {
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <SidePanel
          selectedSuburb={this.state.selectedSuburb}
          hospitals={this.state.hospitals}
          setHospitalSearched={this.setHospitalSearched.bind(this)}
          setSuburbSearched={this.setSuburbSearched.bind(this)}
          isSidePanelOpen={this.state.isSidePanelOpen}
          openSidePanel={this.openSidePanel}
          closeSidePanel={this.closeSidePanel}
          openClosestHospital={this.openClosestHospital.bind(this)}
          openQuizModal={this.openQuizModal.bind(this)}
          allSuburbCases={this.state.suburbCases}
        />
        <Quiz
          isVisible={this.state.isQuizOpen}
          closeQuizModal={this.closeQuizModal.bind(this)}
        />
        <ContributeForm
          isFormOpen={this.state.isFormOpen}
          hospitals={this.state.hospitals}
          closeForm={this.closeForm.bind(this)}
          addUpdatedHospitalInfo={this.addUpdatedHospitalInfo.bind(this)}
        />
        <div className="contribute-button">
          <p onClick={() => this.openForm()}>
            {" "}
            <img className="bed-icon" src={hospitalBedIcon} />
          </p>
          <span class="tooltiptext">
            {" "}
            Are you a hospital? Contribute to our data{" "}
          </span>
        </div>

        <GoogleMapReact
          bootstrapURLKeys={{ key: MAPS_API_KEY }}
          center={this.state.mapCenter}
          zoom={this.state.mapZoom}
          onChange={this.setMapZoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.displayCircles(map, maps)}
          options={createMapOptions}
        >
          {this.displayHospitals()}
        </GoogleMapReact>
        <div className="marker-legend">
          <p className="legend-text">
            {" "}
            <img className="legend-icon" src={hospitalRed} /> Hospital has low
            availability of beds (availableBeds/totalBeds) &lt;= 0.3){" "}
          </p>
          <p className="legend-text">
            {" "}
            <img className="legend-icon" src={hospitalOrange} /> Hospital has
            some availability of beds (0.3 &lt; availableBeds/totalBeds &lt;=
            0.7){" "}
          </p>
          <p className="legend-text">
            {" "}
            <img className="legend-icon" src={hospitalGreen} /> Hospital has
            high availability of beds (availableBeds/totalBeds &gt; 0.7){" "}
          </p>
        </div>
      </div>
    );
  }
}

export default NSWMap;
