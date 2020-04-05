import React from "react";
import { Navbar, Nav } from "react-bootstrap";

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.switchToNSWMaps = this.switchToNSWMaps.bind(this);
    this.switchToArticlesMaps = this.switchToArticlesMaps.bind(this);
  }

  switchToNSWMaps() {
    this.props.switchToNSWMaps();
  }

  switchToArticlesMaps() {
    this.props.switchToArticlesMaps();
  }

  render() {
    return (
      // <div className="menu-bar">
      //     <div className="menu-options">
      //         <p className="articles-menu" onClick={this.switchToArticlesMaps}> Articles </p>
      //         <p className="nsw-map-menu" onClick={this.switchToNSWMaps}> NSW Map </p>
      //     </div>
      // </div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="https://svgsilh.com/svg/29243-ffffff.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Exceptional Coders
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={this.switchToArticlesMaps}>Articles</Nav.Link>
            <Nav.Link onClick={this.switchToNSWMaps}>NSW Map</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default MenuBar;
