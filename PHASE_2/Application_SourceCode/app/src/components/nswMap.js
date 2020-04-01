import React from 'react'
import GoogleMapReact from 'google-map-react'
import { MAPS_API_KEY } from '../config'
import HospitalMarker from './hospitalMarker'

const HOSPITALS_API_URL = "https://myhospitalsapi.aihw.gov.au/api/v0/retired-myhospitals-api/hospitals"

class NSWMap extends React.Component {

    constructor(props){
        super(props)

        // To hold all hospital data from myhospitals API
        this.state = {
            hospitals: []
        }
    }

    // Fetching hospital locations before map is mounted on DOM
    async componentWillMount() {
        try {
            const response = await fetch(HOSPITALS_API_URL)
            const hospitals = await response.json()
            
            this.setState({ hospitals: hospitals })
    
        } catch (error) {
            console.log(error)
        }
    }

    displayHospitals() {
        let hospitals = this.state.hospitals
        let result = []

        // Adding markers for each hospital
        hospitals.forEach(h => {
            if (h['ispublic'] && (h['state'] === "NSW")) { // Public hospitals in NSW
                result.push(
                    <HospitalMarker 
                        lat={h['latitude']}
                        lng={h['longitude']}
                        name={h['name']}
                        key={h['name']}
                    />
                )
            }
        })

        return result
    }

    // Render Map and use displayHospitals() to render markers
    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: MAPS_API_KEY }}
                    defaultCenter={{ lat: -33.5, lng: 149 }}
                    defaultZoom={6}
                >
                {this.displayHospitals()}
                </GoogleMapReact>
            </div>
        )
    }
}

export default NSWMap