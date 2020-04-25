import React from "react";
import { Form, Button, Alert, Spinner, Jumbotron } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function Step1(props) {
  return (
    <div>
      <Alert variant="success">
        <Alert.Heading>COVID-19 Screening Tool</Alert.Heading>
        <p>This tool can help you understand what to do next about COVID-19.</p>
        <hr />
        <p className="mb-0">
          Let’s all look out for each other by knowing our status, trying not to
          infect others and reserving care for those in need.
        </p>
      </Alert>
      <Jumbotron>
        <Form onSubmit={props.handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>
              <h2>Age</h2>
            </Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              placeholder="Enter age"
              onChange={props.updateAge}
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>
              <h2>Select Gender</h2>
            </Form.Label>
            <Form.Control required as="select" onChange={props.updateSex}>
              <option>Male</option>
              <option>Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Text className="text-muted">
            Your information will be shared with <i>Infermedica</i> purely for
            the purpose of diagnosis. You can view their privacy policy{" "}
            <a href="https://developer.infermedica.com/privacy-policy">here</a>.
            We do not store your personal information
          </Form.Text>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Jumbotron>
    </div>
  );
}

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      age: 0,
      sex: "male",
      initalised: false,
      triage: false,
      radio: "",
      evidence: [],
      singleEvidence: {},
      id: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitSingle = this.handleSubmitSingle.bind(this);
    this.updateAge = this.updateAge.bind(this);
    this.updateSex = this.updateSex.bind(this);
    this.myChangeHandler = this.myChangeHandler.bind(this);
    this.mySingleChangeHandler = this.mySingleChangeHandler.bind(this);
    this.closeQuizModal = this.closeQuizModal.bind(this);
  }

  updateAge(event) {
    this.setState({ age: parseInt(event.target.value) });
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

  handleSubmitSingle(event) {
    console.log("23424", this.state.evidence, this.state.singleEvidence);
    let evidence = this.state.evidence;
    evidence.push(this.state.singleEvidence);
    this.setState({ evidence: evidence });
    this.callApi();
    this.setState({ singleEvidence: {} });

    event.preventDefault();
    event.target.reset();
  }

  mySingleChangeHandler(event) {
    console.log(event.target);
    const myEvidence = { id: event.target.id, choice_id: "present" };
    this.setState({ singleEvidence: myEvidence });
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
    var evidence = this.state.evidence;
    evidence = evidence.filter(function (s) {
      return s.choice_id !== "unknown";
    });
    const data = {
      sex: this.state.sex,
      age: this.state.age,
      evidence: evidence,
    };
    console.log("CALLING WTIH THIS", data);
    fetch("https://api.infermedica.com/covid19/diagnosis", {
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

  callTriageApi() {
    var evidence = this.state.evidence;
    evidence = evidence.filter(function (s) {
      return s.choice_id !== "unknown";
    });
    const data = {
      sex: this.state.sex,
      age: this.state.age,
      evidence: evidence,
    };
    console.log("CALLING TRIAGE WTIH THIS", data);
    this.setState({ triage: true });
    fetch("https://api.infermedica.com/covid19/triage", {
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

  getLevel(triage) {
    var res;
    switch (triage) {
      case "no_risk":
        res = "success";
        break;
      case "self_monitoring":
      case "quarantine":
        res = "warning";
        break;
      default:
        res = "danger";
        break;
    }
    return res;
  }

  closeQuizModal() {
    this.props.closeQuizModal();
    this.setState({ initalised: false });
    this.setState({ evidence: [] });
  }

  render() {
    let single = false;
    let questions = [];
    let stop = "";
    const myObject = this.state.response;
    console.log("ASDASD,", myObject);
    if (this.state.initalised && myObject && !this.state.triage) {
      stop = myObject["should_stop"];
      if (!stop) {
        questions = myObject["question"]["items"];
        if (!single) {
          console.log(myObject);
        }
      } else {
        this.callTriageApi();
      }
    }
    if (this.state.triage) {
      console.log(myObject);
      const level = this.getLevel(myObject.triage_level);
      return this.props.isVisible ? (
        <div className="quiz-modal">
          <div className="quiz-body">
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
              <Alert variant={level}>
                <Alert.Heading>{myObject.description}</Alert.Heading>
                <p>{myObject.label}</p>
              </Alert>
              <p>
                A full list of NSW COVID-19 testing locations can be found{" "}
                <a href="https://www.health.nsw.gov.au/Infectious/covid-19/Pages/testing-locations.aspx">
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      ) : null;
    }
    if (this.state.initalised && !myObject) {
      return (
        <div className="quiz-modal">
          <div className="quiz-body">
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
              <Spinner animation="border" />
            </div>
          </div>
        </div>
      );
    }
    if (myObject && !myObject["question"]) {
      return (
        <div className="quiz-modal">
          <div className="quiz-body">
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
              <Spinner animation="border" />
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.initalised) {
      return this.props.isVisible ? (
        <div className="quiz-modal">
          <div className="quiz-body">
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
              />
            </div>
          </div>
        </div>
      ) : null;
    }
    if (
      this.props.isVisible &&
      myObject["question"]["type"] === "group_single"
    ) {
      return (
        <div className="quiz-modal">
          <div className="quiz-body">
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
              <Form onSubmit={this.handleSubmitSingle}>
                <Form.Group>
                  <Form.Label>
                    <h3>{myObject["question"]["text"]}</h3>
                  </Form.Label>
                  <Form.Group>
                    {stop}
                    {questions.map((question) => {
                      return (
                        <p>
                          <Form.Check
                            inline
                            required
                            type="radio"
                            label={question.name}
                            name="name"
                            id={question.id}
                            onClick={this.mySingleChangeHandler.bind(this)}
                          />
                        </p>
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
      );
    }
    return this.props.isVisible ? (
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
                  {stop}
                  {questions.map((question) => {
                    return (
                      <>
                        <Form.Label>{question.name}</Form.Label>
                        <p>
                          {question.choices.map((choice) => {
                            return (
                              <Form.Check
                                inline
                                required
                                type="radio"
                                label={choice.label}
                                name={question.id}
                                id={choice.id}
                                onClick={this.myChangeHandler.bind(this)}
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
    ) : null;
  }
}

export default Quiz;
