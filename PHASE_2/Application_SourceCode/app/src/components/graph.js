import React from 'react'
import { graphData } from '../datasets/graphTestData'
import Chart from "chart.js"

class Graph extends React.Component{
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    getMatchingData(suburb){
        let allData = []
        graphData.forEach(doc => {
            if(doc.name.includes(suburb)){
                allData.push(doc)
            }
        })
        return allData
    }

    componentDidMount() {
        const node = this.node
        let data = this.getMatchingData(this.props.suburb)
        this.myChart = new Chart(node, {
            type: 'line',
            data: {
                labels: data.map(obj => obj.date),
                datasets: [{
                    label: "cases in " + this.props.suburb,
                    data: data.map(obj => obj.count),
                    backgroundColor: "#70CAD1"
                }]
            }
        });
    }

    render(){
        return(
            <canvas
                style={{ width: 800, height: 300 }}
                ref={node => (this.node = node)}
            />
        );
    }
}
export default Graph