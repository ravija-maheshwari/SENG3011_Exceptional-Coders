import React from 'react'
import { suburbInfection } from '../datasets/suburbInfection'
import Chart from "chart.js"
import regression from "regression"

class Graph extends React.Component{
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    getMatchingData(suburb){
        let allData = []
        suburbInfection.forEach(doc => {
            if(doc.name === suburb){
                allData.push(doc)
            }
        })
        return allData
    }

    getIntegerDate(datePassed){
        let startingDate = new Date("2020-04-06")
        let date = new Date(datePassed)
        let diffDay = (date - startingDate)/(1000*60*60*24)
        return diffDay
    }

    getIntegerCases(caseCount){
        if(caseCount.indexOf('-') > -1){
            //1-4 type of caseCount
            return Number(caseCount.split("-")[0])
        }else{
            return Number(caseCount)
        }
    }

    //Confirmed cases co-ordinates
    getCurrentPoints(){
        let points = []
        let matchingSuburbs = this.getMatchingData(this.props.suburb)
        for(var i = 0; i < matchingSuburbs.length; i++){
            let date = this.getIntegerDate(matchingSuburbs[i].date)
            let count = this.getIntegerCases(matchingSuburbs[i].count)
            let dateString = matchingSuburbs[i].date
            points.push( [dateString, date, count] )
        }
        return points
    }


    componentDidMount() {

        const node = this.node
        // let data = this.getMatchingData(this.props.suburb)
        let currentPoints = this.getCurrentPoints()
        this.myChart = new Chart(node, {
            type: 'line',
            data: {
                labels: currentPoints.map(obj => obj[0]),
                datasets: [{
                    label: "cases in " + this.props.suburb,
                    data: currentPoints.map(obj => obj[2]),
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