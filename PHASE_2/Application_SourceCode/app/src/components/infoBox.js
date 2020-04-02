import React from 'react'

class InfoBox extends React.Component{

    constructor(props) {
        super(props)
    }

    render(){
        return(
            <div className="info-box">
               <h1> {this.props.name} </h1>
               <button onClick={this.props.closeInfoDisplayed}> Close </button>
            </div>
        );
    }
}

export default InfoBox