import React from 'react'
import { suburbInfection } from '../datasets/suburbInfection'
import Chart from "chart.js"
import regression from "regression"

class HospitalGraph extends React.Component{
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();

        this.state = {
            casesDataset: {},
            bedsDataset: {},
            allPoints: []
        }
    }

    //Gets all data about one suburb
    getMatchingData(suburb){
        let allData = []
        suburbInfection.forEach(doc => {
            if(doc.name.includes(suburb)){
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

    //Convert 1-4 types of numbers to min value = 1
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
        currentPoints = currentPoints.sort( (a,b) => (a[0] > b[0] ? 1: -1))
        for(var i = 0; i < predictedPoints.length; i++){
            currentPoints.push(predictedPoints[i])
        }
        // console.log(currentPoints)
        //Convert array to object for scatter plot
        let finalData = []
        for(var i = 0; i < currentPoints.length; i++){
            let val = {x: currentPoints[i][2], y: currentPoints[i][1]}
            finalData.push(val)
        }
        // console.log(finalData)
        return finalData

    }

    getBedCoordinates(){
        let currentPoints = []
        let suburbData = this.getMatchingData(this.props.suburb)
        //Get current points
        for(var i = 0; i < suburbData.length; i++){
            let cases = this.getIntegerCases(suburbData[i].count)
            let beds = Math.floor( this.props.totalBeds - cases)
            let date = this.getIntegerDate(suburbData[i].date)
            let dateString = suburbData[i].date
            if(beds > 0){
                currentPoints.push([date, beds, dateString])
            }else{
                currentPoints.push([date, 0, dateString])
            }

        }
        if(currentPoints.length === 0){
            return currentPoints
        }
        //Get predicted points
        currentPoints.sort( (a,b) => (a[0] < b[0] ? 1: -1))
        let latestDate = currentPoints[0][0]
        const result = regression.linear(currentPoints.map( point => [point[0], point[1]] ) )
        const firstPredictedPoint = result.predict(latestDate + 2 )
        const secondPredictedPoint = result.predict(latestDate + 4 )
        const thirdPredictedPoint = result.predict(latestDate + 6 )
        const fourthPredictedPoint = result.predict(latestDate + 8 )
        let predictedPoints = []
        predictedPoints.push(firstPredictedPoint, secondPredictedPoint, thirdPredictedPoint, fourthPredictedPoint)
        predictedPoints = this.formatPoints(predictedPoints, currentPoints[0][2])
        currentPoints = currentPoints.sort( (a,b) => (a[0] > b[0] ? 1: -1))

        for(var i = 0; i < predictedPoints.length; i++){
            currentPoints.push(predictedPoints[i])
        }

        let finalData = []
        for(var i = 0; i < currentPoints.length; i++){
            let val = {x: currentPoints[i][2], y: Math.floor(currentPoints[i][1])}
            finalData.push(val)
        }
        // console.log(finalData)
        return finalData
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
        let day = date.getDate()

        if (month < 10) { month = "0" + month; }
        if (day < 10) { day = "0" + day; }
        return date.getFullYear() + "-" + month + "-" + day
    }


    componentDidMount() {
        const node = this.node
        // let data = this.getMatchingData(this.props.suburb)
        let allPoints = this.getPredictedPoints()
        this.setState({ allPoints: allPoints })
        let bedsCoordinates = this.getBedCoordinates()

        let casesDataset = {
            label: 'Predicted Cases',
            data: allPoints,
            showLine: true,
            fill: false,
            borderColor: 'rgb(200,58,74)'
        }

        let bedsDataset = {
            label: 'Predicted Beds Available',
            data: bedsCoordinates,
            showLine: true,
            fill: false,
            borderColor: 'rgb(16,200,187)'
        }
        
        this.setState({
            casesDataset: casesDataset,
            bedsDataset: bedsDataset
        })

        this.myChart = new Chart(node, {
            type: 'line',
            options: {
                legend: {
                    labels: {
                        fontColor: 'black',
                        fontWeight: "bold"
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 12,
                            fontColor: 'black',
                            fontWeight: "bold"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 10,
                            fontColor: 'black',
                            fontWeight: "bold"
                        }
                    }]
                }
            },
            data: {
                labels: allPoints.map(obj => obj.x),
                datasets: [casesDataset]
            }
        });
    }

    componentDidUpdate(prevProps) {
        const node = this.node
        if (this.props.casesOrBeds !== prevProps.casesOrBeds) {
            if (this.props.casesOrBeds === "cases") {
                this.myChart.clear()
                this.myChart = new Chart(node, {
                    type: 'line',
                    data: {
                        labels: this.state.allPoints.map(obj => obj.x),
                        datasets: [this.state.casesDataset]
                    }
                });
            }
            else {
                this.myChart.clear()
                this.myChart = new Chart(node, {
                    type: 'line',
                    data: {
                        labels: this.state.allPoints.map(obj => obj.x),
                        datasets: [this.state.bedsDataset]
                    }
                });   
            }
        }
    }

    render(){
        return(
            <div className="info-box-hospital-graph">
                <canvas
                    style={{ width: 800, height: 300,  backgroundColor: 'white' }}
                    ref={node => (this.node = node)}
                />
            </div>

        );
    }
}
export default HospitalGraph