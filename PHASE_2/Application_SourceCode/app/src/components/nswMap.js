import React from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import { MAPS_API_KEY } from '../config'
import hospitalIcon from '../mapIcons/hospital.png'

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

        // Hospital icon to be shown on map
        let hIcon = {
            url: hospitalIcon,
            scaledSize: new this.props.google.maps.Size(20,20)
        }

        // Adding markers for each hospital
        hospitals.forEach(h => {
            if (h['ispublic'] && (h['state'] === "NSW")) { // Public hospitals in NSW
                result.push(
                    <Marker
                        icon={hIcon}
                        key={h['name']}
                        title={h['name']}
                        name={h['name']}
                        position={{ lat: h['latitude'], lng: h['longitude'] }} >
                    </Marker>
                )
            }
        })

        return result
    }

    // Render Map and use displayHospitals() to render markers
    render() {
        return (
            <Map
                google={this.props.google}
                zoom={6}
                minZoom={6}
                initialCenter={{ lat: -32.5, lng: 150 }} 
                streetViewControl={false}
                fullscreenControl={false}
                mapTypeControl={false} >
                {this.displayHospitals()}
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: MAPS_API_KEY
}) (NSWMap)