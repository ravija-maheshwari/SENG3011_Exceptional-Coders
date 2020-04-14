import React from "react";
import SuburbGraph from "./suburbGraph"

class SidePanel extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className = "side-panel">
            <SuburbGraph
                suburb={this.props.suburb}
            />
            </div>
        )
    }
}

export default SidePanel
