import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Step1(props) {
  console.log("@@@", props);
  const symptoms = [
    ["Fever"],
    ["Cough"],
    ["Sore Throat"],
    ["Shortness of Breath"],
    ["Fatigue"],
  ];
  const [fever, setFever] = useState(false);
  const [cough, setCough] = useState(false);
  const [sore, setSore] = useState(false);

  return (
    <>
      <Form onSubmit={props.handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            min="0"
            placeholder="Enter age"
            onChange={props.updateAge}
          />
          <Form.Text className="text-muted">
            We'll never share your age with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Select Gender</Form.Label>
          <Form.Control as="select" onChange={props.updateSex}>
            <option>Prefer not to disclose</option>
            <option>Male</option>
            <option>Female</option>
          </Form.Control>
        </Form.Group>
        Please select at least one symptom you are experiencing
        <Form.Group>
          <input onChange={props.updateFever} type="checkbox" value="fever" />
          Fever
          <input onChange={props.updateCough} type="checkbox" value="cough" />
          Cough
          <input onChange={props.updateThroat} type="checkbox" value="cough" />
          Sore Throat
          <input onChange={props.updateBreath} type="checkbox" value="cough" />
          Shortness of Breath
          <input onChange={props.updateFatigue} type="checkbox" value="cough" />
          Fatigue
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      age: "",
      sex: "",
      initalised: false,
      radio: "",
      evidence: [
        { id: "s_98", choice_id: "unknown" },
        { id: "s_102", choice_id: "unknown" },
        { id: "s_252", choice_id: "unknown" },
        { id: "s_1462", choice_id: "unknown" },
        { id: "s_2100", choice_id: "present" },
      ],
      id: [],
    };
    this.updateFever = this.updateFever.bind(this);
    this.updateCough = this.updateCough.bind(this);
    this.updateThroat = this.updateThroat.bind(this);
    this.updateBreath = this.updateBreath.bind(this);
    this.updateFatigue = this.updateFatigue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAge = this.updateAge.bind(this);
    this.updateSex = this.updateSex.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.myChangeHandler = this.myChangeHandler.bind(this);
  }

  handleRadio(event) {
    console.log(event.target);
    this.setState({ radio: event.target.value });
  }

  updateAge(event) {
    this.setState({ age: event.target.value });
  }
  updateSex(event) {
    const sex = event.target.value === "Male" ? "male" : "female";
    this.setState({ sex: sex });
  }
  handleSubmit(event) {
    this.callApi();
    this.setState({ initalised: true });

    event.preventDefault();
    event.target.reset();
  }

  handleSecondSubmit(event) {
    event.preventDefault();
  }

  myChangeHandler(event) {
    let evidence = this.state.evidence;
    console.log("@@@, ", evidence);
    evidence = evidence.filter(function (s) {
      return s.id !== event.target.name;
    });
    evidence.push({ id: event.target.name, choice_id: event.target.id });
    console.log(evidence);
    this.setState({ evidence: evidence });
    console.log(event.target);
  }

  callApi() {
    const data = {
      sex: this.state.sex,
      age: this.state.age,
      evidence: this.state.evidence,
    };
    console.log("CALLING WTIH THIS", data);
    fetch("https://api.infermedica.com/v2/diagnosis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Id": "51d21264",
        "App-Key": "262b5c53728e7763043616dd2e3d6f28",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => this.setState({ response: result }));
  }

  updateEvidence(index) {
    let evidence = this.state.evidence;
    const curr = evidence[0]["choice_id"];
    evidence[index]["choice_id"] = curr == "unknown" ? "present" : "unknown";
    this.setState({ evidence: evidence });
    // console.log(this.state.evidence);
  }

  updateFever(event) {
    this.updateEvidence(0);
    event.preventDefault();
  }

  updateCough(event) {
    this.updateEvidence(1);
    event.preventDefault();
  }
  updateThroat(event) {
    this.updateEvidence(2);
    event.preventDefault();
  }

  updateBreath(event) {
    this.updateEvidence(3);
    event.preventDefault();
  }
  updateFatigue(event) {
    this.updateEvidence(4);
    event.preventDefault();
  }

  closeQuizModal() {
    this.props.closeQuizModal();
  }

  render() {
    let single = false;
    let questions = [];
    const myObject = this.state.response;
    console.log("ASDASD,", myObject);
    if (this.state.initalised && myObject) {
      questions = myObject["question"]["items"];
      if (!single) {
        console.log(myObject);
      }
      //   var form = "";
      //   if (type === "single") {
      //     console.log("making radio q");
      //     form = `
      //     <Form>
      //       <Form.Label>{myObject["question"]["text"]}</Form.Label>
      //     </Form>`;
      //   }
      //   console.log(myObject["question"]);
    }
    if (this.state.initalised && !myObject) {
      return <h1> Loading </h1>;
    }
    return this.props.isVisible ? (
      !this.state.initalised ? (
        <div className="quiz-modal">
          <div className="quiz-body">
            {/* Close button has that className cos style is already there for close button */}
            <span
              className="close-info-box"
              onClick={this.closeQuizModal.bind(this)}
            >
              {" "}
              &#x2715;{" "}
            </span>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Step1
                updateAge={this.updateAge}
                handleSubmit={this.handleSubmit}
                updateSex={this.updateSex}
                updateFever={this.updateFever}
                updateCough={this.updateCough}
                updateThroat={this.updateThroat}
                updateBreath={this.updateBreath}
                updateFatigue={this.updateFatigue}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-modal">
          <div className="quiz-body">
            {/* Close button has that className cos style is already there for close button */}
            <span
              className="close-info-box"
              onClick={this.closeQuizModal.bind(this)}
            >
              {" "}
              &#x2715;{" "}
            </span>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Label>
                    <h3>{myObject["question"]["text"]}</h3>
                  </Form.Label>
                  <Form.Group>
                    {questions.map((question) => {
                      return (
                        <>
                          <Form.Label>{question.name}</Form.Label>
                          <p>
                            {question.choices.map((choice) => {
                              return (
                                <Form.Check
                                  inline
                                  type="radio"
                                  label={choice.label}
                                  name={question.id}
                                  id={choice.id}
                                  onChange={this.myChangeHandler}
                                />
                              );
                            })}
                          </p>
                        </>
                      );
                    })}
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
      )
    ) : null;
  }
}

export default Quiz;
