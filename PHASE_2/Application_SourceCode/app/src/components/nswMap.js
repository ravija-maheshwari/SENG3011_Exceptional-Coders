import React from "react";
import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../config";
import HospitalMarker from "./hospitalMarker";
import { getRadius, getAvailableBeds, getTotalBeds, getHospitalSuburb, getPotentialHospitalList, getPotentialSuburbList } from "../helpers";
import { allNswAreas } from "../datasets/nswAreas";
import { hospitalDetail } from "../datasets/hospitalDetail";
import { suburbInfection } from "../datasets/suburbInfection";
import {Nav} from "react-bootstrap";

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

    this.handleHospitalSearch = this.handleHospitalSearch.bind(this);
    this.hospitalSearchFocus = this.hospitalSearchFocus.bind(this);
    this.hospitalSearchOutOfFocus = this.hospitalSearchOutOfFocus.bind(this);
    this.setHospitalSearched = this.setHospitalSearched.bind(this);
    this.setSuburbSearched = this.setSuburbSearched.bind(this);
    this.suburbSearchFocus = this.suburbSearchFocus.bind(this);
    this.suburbSearchOutOfFocus = this.suburbSearchOutOfFocus.bind(this);

    // To hold all hospital data from myhospitals API
    this.state = {
			mapCenter: { lat: -33.5, lng: 149 },
      hospitals: [],
      suburbCases: [],
      potentialHospitals: [],
      hospitalInput: '',
      searchingForHospital: false,
      hospitalSearched: '',
      suburbInput:'',
      suburbSearched:'',
      potentialSuburbs: [],
      searchingForSuburb: false
    };
  }

  // Fetching hospital locations before map is mounted on DOM
  async componentWillMount() {
    try {
      const response = await fetch(HOSPITALS_API_URL);
      const hospitals = await response.json();
      // COMMENTED DUE TO QUOTA LIMITS
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
            suburb={suburb} //FOR TESTING ONLY
            totalBeds={totalBeds}
            bedsAvailable={bedsAvailable}
            selectedSuburb={"Randwick"}
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

  handleHospitalSearch(evt){
		let hospitalsInNSW = this.state.hospitals.filter(h => h["ispublic"] && h["state"] === "NSW")
    this.setState({
			hospitalSearched: "",
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

  handleSuburbSearch(evt){
    this.setState({
      suburbInput: evt.target.value,
      potentialSuburbs: getPotentialSuburbList(evt.target.value, allNswAreas)
    });
  }

  setSuburbSearched(suburb){
    this.setState({suburbSearched: suburb})
    console.log(suburb)
  }

  suburbSearchFocus() {
    this.setState({ searchingForSuburb: true })
  }

  suburbSearchOutOfFocus() {
    this.setState({ searchingForSuburb: false })
  }

  setHospitalSearched(hospital) {
		let position
		let { hospitals } = this.state

		for (var i=0; i<hospitals.length; i++) {
			if (hospitals[i].name.includes(hospital)) {
				position = { lat: hospitals[i].latitude, lng: hospitals[i].longitude }
			}
		}

		let hospitalMarker = document.getElementById(hospital)
		hospitalMarker.click()

    this.setState({
			mapCenter: position,
			hospitalSearched: hospital,
			hospitalInput: hospital
		})
  }

  displaySearchBar() {
      return (
          <div className="search-hospital">
            <input onFocus={this.hospitalSearchFocus} onBlur={this.hospitalSearchOutOfFocus} type="text" value={ this.state.hospitalInput } onChange={ evt => this.handleHospitalSearch(evt) } placeholder="Search for a Hospital..."></input>
            {this.state.searchingForHospital
            ?
                <div className="hospital-list">
                        {this.state.potentialHospitals.map((hospital) => <p value={hospital} onMouseDown={() => this.setHospitalSearched(hospital)} className="hospital-option">{hospital}</p>)}
                </div>
            :
              null
            }
          </div>
      )
  }



  displaySuburbBar() {
    return (
        <div className="search-suburb">
          <input onFocus={this.suburbSearchFocus} onBlur={this.suburbSearchOutOfFocus} type="text" value={ this.state.suburbInput }  onChange={evt => this.handleSuburbSearch(evt)} placeholder="Set a Suburb..."></input>
          {this.state.searchingForSuburb
            ?
              <div className="suburb-list">
                {this.state.potentialSuburbs.map((suburb) => <p value={suburb} onMouseDown={() => this.setSuburbSearched(suburb)} className="suburb-option">{suburb}</p>)}
              </div>
            :
              null
          }
        </div>
    )
  }

  // Render Map and use displayHospitals() to render markers
  render() {
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        {this.displaySearchBar()}
        {this.displaySuburbBar()}
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
      </div>
    );
  }
}

export default NSWMap;
