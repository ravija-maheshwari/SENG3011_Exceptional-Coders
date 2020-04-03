import React from 'react'
import GoogleMapReact from 'google-map-react'
import { MAPS_API_KEY } from '../config'
import HospitalMarker from './hospitalMarker'
import { getRadius, getAvailableBeds, getTotalBeds } from '../helpers'
import { allNswAreas } from '../datasets/nswAreas'
import { hospitalDetail } from '../datasets/hospitalDetail'

const HOSPITALS_API_URL = "https://myhospitalsapi.aihw.gov.au/api/v0/retired-myhospitals-api/hospitals"
const SUBURBS_API_URL = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/suburbs"

function createMapOptions() {
    return {
        restriction: {
            latLngBounds: { north: -27, south: -38, west: 140, east: 155 },
            strictBounds: false
        },
        minZoom: 6
    }
}

class NSWMap extends React.Component {

    constructor(props){
        super(props)

        // To hold all hospital data from myhospitals API
        this.state = {
            hospitals: [],
            suburbCases: [],
        }
    }

    // Fetching hospital locations before map is mounted on DOM
    async componentWillMount() {
        try {
            const response = await fetch(HOSPITALS_API_URL)
            const hospitals = await response.json()
            const suburbResponse = await fetch(SUBURBS_API_URL)
            const suburbCases = await suburbResponse.json()

            this.setState({ hospitals: hospitals , suburbCases: suburbCases})

    
        } catch (error) {
            console.log(error)
        }
    }

    displayHospitals() {

        let hospitals = this.state.hospitals
        let result = []
        const suburbCases =  this.state.suburbCases
        // Adding markers for each hospital
        hospitals.forEach(h => {
            if (h['ispublic'] && (h['state'] === "NSW")) { // Public hospitals in NSW
                let bedsAvailable = getAvailableBeds(h, hospitalDetail, suburbCases)
                let totalBeds = getTotalBeds(h, hospitalDetail)
                result.push(
                    <HospitalMarker
                        lat={h['latitude']}
                        lng={h['longitude']}
                        name={h['name']}
                        key={h['name']}
                        totalBeds={totalBeds}
                        bedsAvailable={bedsAvailable}
                    />
                )
            }
        })

        return result
    }

    // Only for displayCircles() cos of weird behaviour
    async fetchSuburbs() {
        try {
            const response = await fetch(SUBURBS_API_URL)
            const suburbCases = await response.json()

            return suburbCases

        } catch (error) {
            console.log(error)
            return []
        }
    }

    async displayCircles(map, maps) {
        try {
            const suburbCases = await this.fetchSuburbs()

            allNswAreas.forEach(suburb => {
                let suburbRadius = getRadius(suburbCases, suburb)
                new maps.Circle({
                    // strokeColor: '#FF0000',
                    // strokeOpacity: 0.8,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0.5,
                    map,
                    center: { lat: suburb.lat, lng: suburb.lng },
                    radius: suburbRadius,
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    // Render Map and use displayHospitals() to render markers
    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: MAPS_API_KEY }}
                    defaultCenter={{ lat: -33.5, lng: 149 }}
                    defaultZoom={6}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({map, maps}) => this.displayCircles(map, maps)}
                    options={createMapOptions}
                >
                {this.displayHospitals()}
                </GoogleMapReact>
            </div>
        )
    }
}

export default NSWMap