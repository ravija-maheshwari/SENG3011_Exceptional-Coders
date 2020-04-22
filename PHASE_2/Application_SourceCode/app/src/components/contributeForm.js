import React from 'react'

class ContributeForm extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            this.props.isFormOpen?
                <div className="contribute-form">
                    {/*<form >*/}
                    {/*    Hospital Name:*/}
                    {/*    <input placeholder="Enter hospital name"*/}
                    {/*           value={this.state.hospitalInput}*/}
                    {/*           // onChange={e => this.setState({hospitalInput: e.target.value})}*/}
                    {/*           type="text">*/}
                    {/*    </input>*/}
                    {/*    Total beds:*/}
                    {/*    <input placeholder="Enter total beds"*/}
                    {/*           value={this.state.bedsInput}*/}
                    {/*           // onChange={e => this.setState({bedsInput: e.target.value})}*/}
                    {/*           type="text">*/}
                    {/*    </input>*/}
                    {/*    <input type="submit" value="Submit "/>*/}
                    {/*</form>*/}
                </div>
            :
                null
        )
    }
}

export default ContributeForm;