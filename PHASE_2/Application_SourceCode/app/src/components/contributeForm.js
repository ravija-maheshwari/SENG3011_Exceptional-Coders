import React from 'react'
import { getPotentialHospitalList, getHospitalSuburb } from '../helpers'
import { hospitalDetail } from '../datasets/hospitalDetail'

const HOSPITAL_INFO_URL = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/hospital"
const ADMIN_PASS = "hospadmin123"

class ContributeForm extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            passwordInput: "",
            hospitalInput: "",
            hospitalEntered: "",
            bedsInput: "",
            kitsInput: "",
            isEnteringHospital: false,
            potentialHospitals: [],
            hospitalSuburb: "",
            // isSubmittedCorrectly -> 0: No message, 1: submitted successfully 2: submission gave error
            isSubmittedCorrectly: 0
        }

        this.submitHospitalInfo = this.submitHospitalInfo.bind(this)
    }

    async submitHospitalInfo(evt) {
        evt.preventDefault()
        let { passwordInput, hospitalEntered, bedsInput, kitsInput, hospitalSuburb } = this.state

        if (passwordInput !== ADMIN_PASS) {
            this.setState({ isSubmittedCorrectly: 2 })
        }

        else if (hospitalEntered.length === 0 || bedsInput.length === 0 || kitsInput.length === 0) {
            this.setState({ isSubmittedCorrectly: 0 })
            // Since we don't want to show any message if they haven't entered all the info
        }

        else {
            try {
                let postBody = {
                    name: hospitalEntered,
                    suburb: hospitalSuburb,
                    beds: bedsInput,
                    kits: kitsInput
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
                    // isSubmittedCorrectly -> 0: No message, 1: submitted successfully 2: submission gave error
                    this.setState({ isSubmittedCorrectly: 1 })
                }
                else {
                    // isSubmittedCorrectly -> 0: No message, 1: submitted successfully 2: submission gave error
                    this.setState({ isSubmittedCorrectly: 2 })
                }

            } catch (error) {
                // isSubmittedCorrectly -> 0: No message, 1: submitted successfully 2: submission gave error
                this.setState({ isSubmittedCorrectly: 2 })
            }
        }
    }

    handlePasswordChange(evt) {
        this.setState({ passwordInput: evt.target.value })
    }

    handleKitsChange(evt) {
        this.setState({ kitsInput: evt.target.value })
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
        this.setState({ isSubmittedCorrectly: 0 })
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
                            <label className="hospital-info-label--auth"> Password: </label>
                            <input placeholder="Enter password..."
                                    className="hospital-auth-input"
                                    value={this.state.passwordInput}
                                    onChange={evt => this.handlePasswordChange(evt)}
                                    type="password">
                            </input>
                            <label className="hospital-info-label--name"> Hospital Name: </label>
                            <input placeholder="Enter hospital name..."
                                    className="hospital-name-input"
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
                            <br />
                            <label className="hospital-info-label--beds"> Total beds: </label>
                            <input placeholder="Enter total beds in hospital..."
                                    className="hospital-beds-input"
                                    value={this.state.bedsInput}
                                    onChange={e => this.setState({bedsInput: e.target.value})}
                                    type="text"
                                    pattern="[0-9]+">
                            </input>
                            <label className="hospital-info-label--kits"> Test kits: </label>
                            <input placeholder="Enter kits available..."
                                    className="hospital-kits-input"
                                    value={this.state.kitsInput}
                                    onChange={evt => this.handleKitsChange(evt)}
                                    type="text"
                                    pattern="[0-9]+">
                            </input>
                            <div className="submit-hospital">
                                <input type="submit" value="Submit"/>
                            </div>
                        </form>
                        {this.state.isSubmittedCorrectly === 0 ?
                            null
                        : (this.state.isSubmittedCorrectly === 1) ?
                            <p className="submit-message-green"> Information Updated for {this.state.hospitalEntered}. </p>
                        :
                            <p className="submit-message-red"> Invalid Credentials. </p>
                        }
                    </div>
                </div>
            :
                null
        )
    }
}

export default ContributeForm;