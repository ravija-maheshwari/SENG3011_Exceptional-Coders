import React from "react";
import NSWMap from "./nswMap";
import MenuBar from "./menuBar";
import Articles from "./article";
import LandingPage from "./landingPage";

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currPage: "landing-page",
    };

    this.switchToNSWMaps = this.switchToNSWMaps.bind(this);
    this.switchToLandingPage = this.switchToLandingPage.bind(this);
  }

  switchToNSWMaps() {
    let currPage = this.state.currPage;
    if (currPage !== "nsw-map") {
      this.setState({ currPage: "nsw-map" });
    }
  }

  switchToLandingPage() {
    let currPage = this.state.currPage;
    if (currPage !== "landing-page") {
      this.setState({ currPage: "landing-page" });
    }
  }

  render() {
    let currPage = this.state.currPage;

    return (
        currPage === "nsw-map" ?
            <NSWMap />
        :
            <LandingPage
                switchToMap={this.switchToNSWMaps}
            />
    );
  }
}

export default Homepage;
