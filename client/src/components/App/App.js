import React, { Component } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      courses: [],
      selectedSemester: null,
      semesters: [],
      selectedSchedule: { courses: [] },
      schedules: []
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSemesterChange = this.handleSemesterChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handleScheduleCreate = this.handleScheduleCreate.bind(this);
    this.handleScheduleRename = this.handleScheduleRename.bind(this);
    this.handleScheduleDelete = this.handleScheduleDelete.bind(this);
    this.handleAddCourseToSchedule = this.handleAddCourseToSchedule.bind(this);
    this.handleRemoveCourseFromSchedule = this.handleRemoveCourseFromSchedule.bind(
      this
    );
  }

  fetchJson(string, init) {
    return fetch(string, init)
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
      `/api/course/semester/${this.state.selectedSemester}/search/${event.target
        .value}`
    ).then(courses => {
      this.setState({ courses: courses });
    });
  }

  handleSemesterChange(semester) {
    this.setState({ selectedSemester: semester });
    this.fetchJson(`/api/schedule/semester/${semester}`).then(object =>
      this.setState(object)
    );
  }

  handleScheduleChange(scheduleId) {
    this.fetchJson(`/api/schedule/${scheduleId}`).then(object =>
      this.setState(object)
    );
  }

  handleScheduleCreate(name) {
    this.fetchJson(
      `/api/schedule/semester/${this.state.selectedSemester}/name/${name}`,
      { method: 'POST' }
    ).then(object => this.setState(object));
  }

  handleScheduleRename(name) {
    this.fetchJson(
      `/api/schedule/${this.state.selectedSchedule._id}/name/${name}`,
      { method: 'PUT' }
    ).then(object => this.setState(object));
  }

  handleScheduleDelete() {
    this.fetchJson(`/api/schedule/${this.state.selectedSchedule._id}`, {
      method: 'DELETE'
    }).then(object => this.setState(object));
  }

  handleAddCourseToSchedule(id) {
    this.fetchJson(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${id}`,
      { method: 'PUT' }
    ).then(object => this.setState(object));
  }

  handleRemoveCourseFromSchedule(id) {
    this.fetchJson(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${id}`,
      { method: 'DELETE' }
    ).then(object => this.setState(object));
  }

  componentDidMount() {
    this.fetchJson(`/api/startup`).then(object => this.setState(object));
  }

  render() {
    const courses = this.state.courses.slice();
    const coursesInSchedule = [];
    for (let i = 0; i < this.state.selectedSchedule.courses.length; i++) {
      console.log('i am in here');
      coursesInSchedule.push(this.state.selectedSchedule.courses[i]._id);
    }
    for (let i = 0; i < courses.length; i++) {
      if (coursesInSchedule.indexOf(courses[i]._id) > -1) {
        courses[i].inSchedule = true;
      } else {
        courses[i].inSchedule = false;
      }
    }

    return (
      <div className="App">
        <Navbar
          semesters={this.state.semesters}
          selectedSemester={this.state.selectedSemester}
          onSemesterChange={this.handleSemesterChange}
          schedules={this.state.schedules}
          selectedSchedule={this.state.selectedSchedule}
          onScheduleChange={this.handleScheduleChange}
          onScheduleCreate={this.handleScheduleCreate}
          onScheduleRename={this.handleScheduleRename}
          onScheduleDelete={this.handleScheduleDelete}
        />
        <div className="App-page">
          <MenuPane
            onSearchChange={this.handleSearchChange}
            onAddCourseToSchedule={this.handleAddCourseToSchedule}
            onRemoveCourseFromSchedule={this.handleRemoveCourseFromSchedule}
            results={courses}
          />
          <DisplayPane selectedSchedule={this.state.selectedSchedule} />
        </div>
      </div>
    );
  }
}

export default App;
