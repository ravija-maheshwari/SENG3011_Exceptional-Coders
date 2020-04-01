import React from 'react'
import hospitalIcon from '../mapIcons/hospital.png'

class HospitalMarker extends React.Component {

    // constructor(props) {
    //     super(props)
    // }

    render() {
        return (
            <div>
                <img alt="marker" src={hospitalIcon} style={{ width: 18, height: 18 }}></img>
            </div>
        )
    }
}

export default HospitalMarker