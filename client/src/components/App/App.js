import React, { Component } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchJson(`/api/semester/all`).then(semesters => {
      this.setState({
        semester: semesters[0]._id,
        semesters: semesters
      });
    });
    this.state = {
      search: '',
      courses: [],
      semester: null,
      semesters: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSemesterChange = this.handleSemesterChange.bind(this);
  }

  fetchJson(string) {
    return fetch(string)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        console.log(error); // eslint-disable-line no-console
        throw error;
      })
      .then(res => res.json());
  }

  handleSearchChange(event) {
    if (event.target.value.length < 3) return;

    this.fetchJson(
      `/api/course/semester/${this.state.semester}/search/${event.target.value}`
    ).then(courses => {
      this.setState({ courses: courses });
    });
  }

  handleSemesterChange(semester) {
    this.setState({ semester: semester });
  }

  render() {
    return (
      <div className="App">
        <Navbar
          semesters={this.state.semesters}
          semester={this.state.semester}
          onSemesterChange={this.handleSemesterChange}
        />
        <div className="App-page">
          <MenuPane
            onSearchChange={this.handleSearchChange}
            results={this.state.courses}
          />
          <DisplayPane />
        </div>
      </div>
    );
  }
}

export default App;
