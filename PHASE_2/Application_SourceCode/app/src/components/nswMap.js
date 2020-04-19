import React from "react";
import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../config";
import HospitalMarker from "./hospitalMarker";
import SidePanel from "./sidePanel";
import { getRadius, getAvailableBeds, getTotalBeds, getHospitalSuburb } from "../helpers";
import { allNswAreas } from "../datasets/nswAreas";
import { hospitalDetail } from "../datasets/hospitalDetail";
import { suburbInfection } from "../datasets/suburbInfection";
import hospitalRed from '../mapIcons/hospitalRed.png'
import hospitalOrange from '../mapIcons/hospitalOrange.png'
import hospitalGreen from '../mapIcons/hospitalGreen.png'

const HOSPITALS_API_URL =
  "https://myhospitalsapi.aihw.gov.au/api/v0/retired-myhospitals-api/hospitals";
const SUBURBS_API_URL =
  "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/suburbs";

function createMapOptions() {
  return {
    restriction: {
      latLngBounds: { north: -20, south: -45, west: 130, east: 165 },
      strictBounds: false
    },
    gestureHandling: "greedy",
    fullscreenControl: false,
    minZoom: 6
  };
}

class NSWMap extends React.Component {
  constructor(props) {
		super(props);

    // To hold all hospital data from myhospitals API
    this.state = {
      mapCenter: { lat: -33.5, lng: 149 },
      hospitals: [],
      suburbCases: [],
      hospitalSearched: '',
      selectedSuburb:'',
		};
  }

  // Fetching hospital locations before map is mounted on DOM
  async componentWillMount() {
    try {
      const response = await fetch(HOSPITALS_API_URL);
      const hospitals = await response.json();
      
      // Uncomment when testing real data from Firestore,
      // and add in 'suburbCases' in this.setState()
      // const suburbResponse = await fetch(SUBURBS_API_URL)
      // const suburbCases = await suburbResponse.json()

      this.setState({ hospitals: hospitals });
    } catch (error) {
      console.log(error);
    }
  }

  displayHospitals() {
    let hospitals = this.state.hospitals;
	let result = [];
    //const suburbCases =  this.state.suburbCases
    const suburbCases = suburbInfection;
    // Adding markers for each hospital
    hospitals.forEach(h => {
      if (h["ispublic"] && h["state"] === "NSW") {
        // Public hospitals in NSW
        let bedsAvailable = getAvailableBeds(h, hospitalDetail, suburbCases);
        let totalBeds = getTotalBeds(h, hospitalDetail);
        let suburb = getHospitalSuburb(h["name"], hospitalDetail)

        result.push(
          <HospitalMarker
            lat={h["latitude"]}
            lng={h["longitude"]}
            name={h["name"]}
            key={h["name"]}
            suburb={suburb}
            totalBeds={totalBeds}
            bedsAvailable={bedsAvailable}
            selectedSuburb={this.state.selectedSuburb}
            allSuburbCases={this.state.suburbCases}
          />
        );
      }
    });

    return result;
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
      // const suburbCases = await this.fetchSuburbs()
      const suburbCases = suburbInfection;
      allNswAreas.forEach(suburb => {
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
          radius: suburbRadius // Default radius when not using fetchSuburbs()
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  setHospitalSearched(position, hospital) {
    this.setState({
      mapCenter: position,
      hospitalSearched: hospital    
    })
  }

  openClosestHospital(position){
    this.setState({
      mapCenter: position
    })
  }

  setSuburbSearched(selectedSuburb) {
    this.setState({
      selectedSuburb: selectedSuburb
    })
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
        />
        <GoogleMapReact
          bootstrapURLKeys={{ key: MAPS_API_KEY }}
          center={this.state.mapCenter}
          defaultZoom={6}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.displayCircles(map, maps)}
          options={createMapOptions}
        >
          {this.displayHospitals()}
        </GoogleMapReact>
        <div className="marker-legend">
          <p className="legend-text"> <img className="legend-icon" src={hospitalRed}/> Hospital has low availability of beds (totalBeds/availableBeds &lt;= 0.3) </p>
          <p className="legend-text"> <img className="legend-icon" src={hospitalOrange}/> Hospital has some availability of beds (0.3 &lt; totalBeds/availableBeds &lt;= 0.7) </p>
          <p className="legend-text"> <img className="legend-icon" src={hospitalGreen}/> Hospital has high availability of beds (totalBeds/availableBeds &gt; 0.7)  </p>
        </div>
      </div>
    );
  }
}

export default NSWMap;
