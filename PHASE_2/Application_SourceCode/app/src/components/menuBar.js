import React from 'react'

class MenuBar extends React.Component {

    constructor(props) {
        super(props)

        this.switchToNSWMaps = this.switchToNSWMaps.bind(this)
        this.switchToArticlesMaps = this.switchToArticlesMaps.bind(this)
    }

    switchToNSWMaps() {
        this.props.switchToNSWMaps()
    }

    switchToArticlesMaps() {
        this.props.switchToArticlesMaps()
    }

    render() {
        return (
            <div className="menu-bar">
                <div className="menu-options">
                    <p className="articles-menu" onClick={this.switchToArticlesMaps}> Articles </p>
                    <p className="nsw-map-menu" onClick={this.switchToNSWMaps}> NSW Map </p>
                </div>
            </div>
        )
    }
}

export default MenuBar