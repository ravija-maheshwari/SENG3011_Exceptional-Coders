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
            points.push( [date, count, dateString] )
        }
        return points
    }


    //Predicted cases coordinates
    getPredictedPoints(){
        let currentPoints = this.getCurrentPoints()
        if(currentPoints.length === 0){
            return currentPoints
        }

        currentPoints = currentPoints.sort( (a,b) => (a[0] < b[0] ? 1: -1))
        let latestDate = currentPoints[0][0]

        const result = regression.linear(currentPoints.map( point => [point[0], point[1]] ) )
        const firstPredictedPoint = result.predict(latestDate + 2 )
        const secondPredictedPoint = result.predict(latestDate + 4 )
        const thirdPredictedPoint = result.predict(latestDate + 6 )
        const fourthPredictedPoint = result.predict(latestDate + 8 )

        let predictedPoints = []
        predictedPoints.push(firstPredictedPoint, secondPredictedPoint, thirdPredictedPoint, fourthPredictedPoint)
        predictedPoints = this.formatPoints(predictedPoints, currentPoints[0][2])
        for(var i = 0; i < predictedPoints.length; i++){
            currentPoints.push(predictedPoints[i])
        }
        return currentPoints
    }


    formatPoints(predictedPoints, dateString){
        let finalPoints = []
        var count =  2;
        for(var i = 0; i < predictedPoints.length; i++){
            let finalDate = new Date(dateString)
            finalDate.setDate(finalDate.getDate() + count)
            finalDate = this.formatDate(finalDate)
            finalPoints.push([predictedPoints[i][0], predictedPoints[i][1], finalDate.toString()])
            count += 2
        }
        return finalPoints
    }

    formatDate(date){

        let month = date.getMonth() + 1;
        let day = date.getDay()

        if (month < 10) { month = "0" + month; }
        if (day < 10) { day = "0" + day; }
        return date.getFullYear() + "-" + month + "-" + day
    }

    componentDidMount() {
        const node = this.node
        // let data = this.getMatchingData(this.props.suburb)
        let currentPoints = this.getPredictedPoints()
        this.myChart = new Chart(node, {
            type: 'line',
            data: {
                labels: currentPoints.map(obj => obj[2]),
                datasets: [{
                    label: "cases in " + this.props.suburb,
                    data: currentPoints.map(obj => obj[1]),
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