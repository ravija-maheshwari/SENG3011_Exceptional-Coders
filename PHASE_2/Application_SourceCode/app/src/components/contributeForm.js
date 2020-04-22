import React from 'react'
import { getPotentialHospitalList, getHospitalSuburb } from '../helpers'
import { hospitalDetail } from '../datasets/hospitalDetail'

const HOSPITAL_INFO_URL = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/hospital"

class ContributeForm extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            hospitalInput: "",
            hospitalEntered: "",
            bedsInput: "",
            isEnteringHospital: false,
            potentialHospitals: [],
            hospitalSuburb: ""
        }

        this.submitHospitalInfo = this.submitHospitalInfo.bind(this)
    }

    async submitHospitalInfo(evt) {
        evt.preventDefault()
        let { hospitalEntered, bedsInput, hospitalSuburb } = this.state

        try {
            let postBody = {
                name: hospitalEntered,
                suburb: hospitalSuburb,
                beds: bedsInput
            }

            const response = await fetch(HOSPITAL_INFO_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            })

            if (response.status === 200) {
                this.props.addUpdatedHospitalInfo(postBody)
                alert("Information Updated for " + hospitalEntered + ".")
            }
            else {
                alert("Something went wrong, please try again.")
            }

        } catch (error) {
            alert("Something went wrong, please try again.")
        }
    }

    handleHospitalSearch(evt){
        let hospitalsInNSW = this.props.hospitals.filter(h => h["ispublic"] && h["state"] === "NSW")
        this.setState({
            hospitalInput: evt.target.value,
            potentialHospitals: getPotentialHospitalList(evt.target.value, hospitalsInNSW)
        });
    }

    setHospitalEntered(hospital) {
        let suburb = getHospitalSuburb(hospital, hospitalDetail)
        this.setState({ 
            hospitalEntered: hospital, 
            hospitalInput: hospital,
            hospitalSuburb: suburb
        })
    }

    setBedsEntered(beds) {
        this.setState({ bedsInput: beds })
    }

    hospitalSearchFocus() {
        this.setState({ isEnteringHospital: true })
    }

    hospitalSearchOutOfFocus() {
        this.setState({ isEnteringHospital: false })
    }

    closeForm() {
        this.props.closeForm()
    }

    render(){
        let { potentialHospitals } = this.state

        return(
            this.props.isFormOpen?
                <div className="contribute-modal">
                    <div className="contribute-form">
                        <span className="close-info-box" onClick={this.closeForm.bind(this)}> &#x2715; </span>
                        <p className="contribute-title"> Are you a hospital admin? Contribute to our data</p>
                        <form onSubmit={(evt) => this.submitHospitalInfo(evt)}>
                            <div className="hospital-form-name">
                                <p> Hospital Name: </p>
                                <input placeholder="Enter hospital name..."
                                       value={this.state.hospitalInput}
                                       onChange={evt => this.handleHospitalSearch(evt)}
                                       type="text"
                                       onFocus={this.hospitalSearchFocus.bind(this)}
                                       onBlur={this.hospitalSearchOutOfFocus.bind(this)}>
                                </input>
                                {this.state.isEnteringHospital ?
                                    <div className="hospital-list">
                                        {potentialHospitals.map((hospital) => <p value={hospital} onMouseDown={() => this.setHospitalEntered(hospital)} className="hospital-option">{hospital}</p>)}
                                    </div>
                                    :
                                    null
                                }
                            </div>

                            <div className="hospital-form-beds">
                                <p> Total beds: </p>
                                <input placeholder="Enter total beds in hospital..."
                                       value={this.state.bedsInput}
                                       onChange={e => this.setState({bedsInput: e.target.value})}
                                       type="text"
                                       pattern="[0-9]+">
                                </input>
                            </div>
                            <div className="submit-hospital">
                                <input type="submit" value="Submit"/>
                            </div>

                        </form>
                    </div>
                </div>
            :
                null
        )
    }
}

export default ContributeForm;