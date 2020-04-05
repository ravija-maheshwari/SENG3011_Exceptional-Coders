import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Spinner } from "react-bootstrap";
import Moment from "react-moment";

const OUR_LIT_API_URL =
  "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?start_date=2019-03-12T12%3A30%3A00&end_date=2020-05-27T12%3A30%3A00&keyterms=&location=&limit=";

class ArticleRow extends React.Component {
  render() {
    const date = this.props.contact.date_of_publication;
    return (
      <tr>
        <td>{this.props.contact.headline}</td>
        <td>{this.props.contact.reports[0].diseases[0]}</td>
        <td>{this.props.contact.reports[0].locations[0].location}</td>
        <td>
          <Moment fromNow>{date}</Moment>
        </td>
        <td>
          <a href={this.props.contact.url} target="_blank">
            Article
          </a>
        </td>
      </tr>
    );
  }
}

class ArticleTable extends React.Component {
  render() {
    var rows = [];
    this.props.contacts.forEach((contact) => {
      if (
        contact.headline.toLowerCase().indexOf(this.props.filterText) === -1 &&
        this.props.headline
      ) {
        return;
      }

      if (
        contact.reports[0].locations[0].location
          .toLowerCase()
          .indexOf(this.props.filterText) === -1 &&
        this.props.location
      ) {
        return;
      }

      if (
        contact.reports[0].diseases[0]
          .toLowerCase()
          .indexOf(this.props.filterText) === -1 &&
        this.props.disease
      ) {
        return;
      }

      rows.push(<ArticleRow contact={contact} />);
    });
    return (
      <div>
        <p align="right">Showing {rows.length} of {this.props.contacts.length} results</p>
        
        <table className="table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Disease</th>
              <th>Location</th>
              <th>Date</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(
      this
    );
    this.options = this.options.bind(this);
  }

  handleFilterTextInputChange(e) {
    this.props.onFilterTextInput(e.target.value);
  }

  options(e) {
    this.props.options(e.target);
  }

  render() {
    return (
      <Form>
        <input
          className="form-control"
          type="text"
          placeholder="Filter by headline or location..."
          value={this.props.filterText}
          onChange={this.handleFilterTextInputChange}
        />

        {["checkbox"].map((type) => (
          <div key={`inline-${type}`} className="mb-3">
            <Form.Label inline>
              <b>Filters: </b>
            </Form.Label>
            <Form.Check
              inline
              label="Headline"
              type={type}
              id={`headline`}
              onChange={this.options}
            />
            <Form.Check
              inline
              label="Location"
              type={type}
              id={`location`}
              onChange={this.options}
            />
            <Form.Check
              inline
              label="Disease"
              type={type}
              id={`disease`}
              onChange={this.options}
            />
          </div>
        ))}
      </Form>
    );
  }
}

class FilterableContactTable extends React.Component {
  constructor(props) {
    super(props);
    // FilterableContactTable is the owner of the state as the filterText is needed in both nodes (searchbar and table) that are below in the hierarchy tree.
    this.state = {
      filterText: "",
      articles: null,
      headline: false,
      location: false,
      disease: false,
    };

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.checkchecks = this.checkchecks.bind(this);
  }

  componentWillMount() {
    fetch(OUR_LIT_API_URL)
      .then((res) => res.json())
      .then((result) => {
        this.setState({ articles: result.reverse() });
      });
  }

  handleFilterTextInput(filterText) {
    //Call to setState to update the UI
    this.setState({
      filterText: filterText,
    });
    //React knows the state has changed, and calls render() method again to learn what should be on the screen
  }

  checkchecks(check) {
    if (check.id === "headline") {
      this.setState((prevState) => ({
        headline: !prevState.headline,
      }));
    }
    if (check.id === "location") {
      this.setState((prevState) => ({
        location: !prevState.location,
      }));
    }
    if (check.id === "disease") {
      this.setState((prevState) => ({
        disease: !prevState.disease,
      }));
    }
  }

  render() {
    if (this.state.articles == null) {
      return (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Articles</h1>
          <SearchBar
            filterText={this.state.filterText}
            onFilterTextInput={this.handleFilterTextInput}
            options={this.checkchecks}
          />
          <ArticleTable
            headline={this.state.headline}
            location={this.state.location}
            disease={this.state.disease}
            contacts={this.state.articles}
            filterText={this.state.filterText.toLowerCase()}
          />
        </div>
      );
    }
  }
}

export default FilterableContactTable;
