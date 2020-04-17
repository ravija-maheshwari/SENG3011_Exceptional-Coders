import React from "react";
import landingImage from '../LandingPageSENG.png';

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className = "landing-page" >
                <img className="landing-image" src = {landingImage} />
                <button onClick={this.props.switchToMap} className="get-started-button" > Get Started </button>
            </div>
        )
    }
}

export default LandingPage;