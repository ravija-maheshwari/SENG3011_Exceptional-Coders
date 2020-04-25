import React from 'react'
import Chart from "chart.js"
import { getCasesDateCount } from '../helpers'
import regression from "regression"

class NswGraph extends React.Component{
    constructor(props) {
        super(props);
    }

    //Convert 1-4 types of numbers to min value = 1
    getIntegerCases(caseCount){
        if(caseCount.indexOf('-') > -1){
            //1-4 type of caseCount
            return Number(caseCount.split("-")[1])- 3
        }else{
            return Number(caseCount)
        }
    }

    getCurrentPoints(){
        const NUM_DAYS = getCasesDateCount(this.props.allSuburbCases); //This is number of points on x axis. UPDATE THIS IF DATASET IS UPDATED
        let points = []
        for(let i = 0; i < NUM_DAYS; i++){
            let day = this.props.allSuburbCases[i].date;
            // console.log("Day  = " + day)
            let aggregate = 0;
            for(let j = 0 ; j < this.props.allSuburbCases.length; j++){
                if(day === this.props.allSuburbCases[j].date){
                    aggregate = aggregate + this.getIntegerCases(this.props.allSuburbCases[j].count);
                }
            }
            points.push({x: day, y: aggregate})
        }
        return points;
    }

    componentDidMount() {
        const node = this.node
        let allPoints = this.getCurrentPoints()
        // console.log(allPoints)

        this.myChart = new Chart(node, {
            type: 'line',
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
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
                datasets: [{
                    label: "COVID-19 Cases in NSW",
                    data: allPoints.map(obj => obj.y),
                    fill: true,
                    backgroundColor: "#F9C52F",
                    responsive: true
                }]
            }
        });
    }

    render(){
        return(
            <canvas
                style={{ width: 800, height: 400 }}
                ref={node => (this.node = node)}
            />
        );
    }



    }

export default NswGraph;