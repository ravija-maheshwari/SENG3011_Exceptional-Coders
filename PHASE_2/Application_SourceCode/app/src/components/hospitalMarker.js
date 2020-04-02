import React from 'react'
import hospitalIcon from '../mapIcons/hospital.png'

class HospitalMarker extends React.Component {

    // constructor(props) {
    //     super(props)
    // }

    onClick(name){
        console.log(name)

    }

    render() {
        return (
            <div>
                <img alt="marker" src={hospitalIcon} style={{ width: 18, height: 18 }} onClick={ () => this.onClick(this.props.name)}></img>
            </div>
        )
    }
}

export default HospitalMarker