import React, { Component } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';

const TIMEOUT_DELAY = 250;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchedCourses: [],
      selectedCourse: null,
      selectedSemester: null,
      semesters: [],
      selectedSchedule: { courses: [] },
      schedules: [],
      user: { savedCourses: [] },
      hoveredCourseTimeout: null,
      hoveredCourse: null
    };

    this.fetchJsonAndSetState = this.fetchJsonAndSetState.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleChangeSemester = this.handleChangeSemester.bind(this);
    this.handleChangeSchedule = this.handleChangeSchedule.bind(this);
    this.handleCreateSchedule = this.handleCreateSchedule.bind(this);
    this.handleRenameSchedule = this.handleRenameSchedule.bind(this);
    this.handleDeleteSchedule = this.handleDeleteSchedule.bind(this);
    this.handleAddCourseToSchedule = this.handleAddCourseToSchedule.bind(this);
    this.handleRemoveCourseFromSchedule = this.handleRemoveCourseFromSchedule.bind(
      this
    );
    this.handleAddSectionToSchedule = this.handleAddSectionToSchedule.bind(
      this
    );
    this.handleRemoveSectionFromSchedule = this.handleRemoveSectionFromSchedule.bind(
      this
    );
    this.handleSaveCourse = this.handleSaveCourse.bind(this);
    this.handleUnsaveCourse = this.handleUnsaveCourse.bind(this);
    this.handleMouseOverCourse = this.handleMouseOverCourse.bind(this);
    this.handleMouseOutCourse = this.handleMouseOutCourse.bind(this);
    this.handleSelectCourse = this.handleSelectCourse.bind(this);
    this.handleUnselectCourse = this.handleUnselectCourse.bind(this);
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
        console.error(error); // eslint-disable-line no-console
        throw error;
      })
      .then(res => res.json());
  }

  fetchJsonAndSetState(string, init) {
    return this.fetchJson(string, init).then(object => this.setState(object));
  }

  handleChangeSearch(event) {
    const query = event.target.value;
    if (query.length < 3) return;

    this.setState({ search: query });

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fetchJson(
        `/api/course/semester/${this.state.selectedSemester}/search/${query}`
      ).then(object => {
        if (this.state.search === query) this.setState(object);
      });
    }, TIMEOUT_DELAY);
  }

  handleChangeSemester(semesterId) {
    this.fetchJsonAndSetState(`/api/semester/${semesterId}`);
  }

  handleChangeSchedule(scheduleId) {
    this.fetchJsonAndSetState(`/api/schedule/${scheduleId}`);
  }

  handleCreateSchedule(name) {
    this.fetchJsonAndSetState(
      `/api/schedule/semester/${this.state.selectedSemester}/name/${name}`,
      { method: 'POST' }
    );
  }

  handleRenameSchedule(name) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/name/${name}`,
      { method: 'PUT' }
    );
  }

  handleDeleteSchedule() {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}`,
      { method: 'DELETE' }
    );
  }

  handleAddCourseToSchedule(courseId) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${courseId}`,
      { method: 'PUT' }
    );
  }

  handleRemoveCourseFromSchedule(courseId) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${courseId}`,
      { method: 'DELETE' }
    );
  }

  handleAddSectionToSchedule(sectionId) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/section/${sectionId}`,
      { method: 'PUT' }
    );
  }

  handleRemoveSectionFromSchedule(sectionId) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/section/${sectionId}`,
      { method: 'DELETE' }
    );
  }

  handleSaveCourse(courseId) {
    this.fetchJsonAndSetState(
      `/api/save/semester/${this.state.selectedSemester}/course/${courseId}`,
      { method: 'PUT' }
    );
  }

  handleUnsaveCourse(courseId) {
    this.fetchJsonAndSetState(
      `/api/save/semester/${this.state.selectedSemester}/course/${courseId}`,
      { method: 'DELETE' }
    );
  }

  handleMouseOverCourse(course) {
    clearTimeout(this.hoveredCourseTimeout);
    this.hoveredCourseTimeout = setTimeout(
      () => this.setState({ hoveredCourse: course }),
      TIMEOUT_DELAY
    );
  }

  handleMouseOutCourse(course) {
    clearTimeout(this.hoveredCourseTimeout);
    this.hoveredCourseTimeout = setTimeout(
      () => this.setState({ hoveredCourse: null }),
      TIMEOUT_DELAY
    );
  }

  handleSelectCourse(courseId) {
    this.fetchJsonAndSetState(`/api/course/${courseId}`);
  }

  handleUnselectCourse() {
    this.setState({ selectedCourse: null });
  }

  componentDidMount() {
    this.fetchJsonAndSetState(`/api/startup`);
  }

  render() {
    const searchedCourses = this.state.searchedCourses.slice();
    const savedCourses = this.state.user.savedCourses.slice();

    const coursesInSchedule = [];
    for (let i = 0; i < this.state.selectedSchedule.courses.length; i++) {
      coursesInSchedule.push(this.state.selectedSchedule.courses[i]._id);
    }
    const coursesInUser = [];
    for (let i = 0; i < this.state.user.savedCourses.length; i++) {
      coursesInUser.push(this.state.user.savedCourses[i]._id);
    }
    const selectedCourseId = this.state.selectedCourse
      ? this.state.selectedCourse._id
      : null;

    for (let i = 0; i < searchedCourses.length; i++) {
      searchedCourses[i].inSchedule =
        coursesInSchedule.indexOf(searchedCourses[i]._id) > -1;
      searchedCourses[i].saved =
        coursesInUser.indexOf(searchedCourses[i]._id) > -1;
      searchedCourses[i].selected = searchedCourses[i]._id === selectedCourseId;
    }

    for (let i = 0; i < savedCourses.length; i++) {
      savedCourses[i].inSchedule =
        coursesInSchedule.indexOf(savedCourses[i]._id) > -1;
      savedCourses[i].saved = coursesInUser.indexOf(savedCourses[i]._id) > -1;
      savedCourses[i].selected = savedCourses[i]._id === selectedCourseId;
    }

    return (
      <div className="App">
        <Navbar
          semesters={this.state.semesters}
          selectedSemester={this.state.selectedSemester}
          onChangeSemester={this.handleChangeSemester}
          schedules={this.state.schedules}
          selectedSchedule={this.state.selectedSchedule}
          onChangeSchedule={this.handleChangeSchedule}
          onCreateSchedule={this.handleCreateSchedule}
          onRenameSchedule={this.handleRenameSchedule}
          onDeleteSchedule={this.handleDeleteSchedule}
        />
        <div className="App-page">
          <MenuPane
            search={this.state.search}
            onChangeSearch={this.handleChangeSearch}
            onAddCourseToSchedule={this.handleAddCourseToSchedule}
            onRemoveCourseFromSchedule={this.handleRemoveCourseFromSchedule}
            onSaveCourse={this.handleSaveCourse}
            onUnsaveCourse={this.handleUnsaveCourse}
            onMouseOverCourse={this.handleMouseOverCourse}
            onMouseOutCourse={this.handleMouseOutCourse}
            onSelectCourse={this.handleSelectCourse}
            onUnselectCourse={this.handleUnselectCourse}
            searchedCourses={searchedCourses}
            savedCourses={savedCourses}
          />
          <DisplayPane
            selectedCourse={this.state.selectedCourse}
            hoveredCourse={this.state.hoveredCourse}
            selectedSchedule={this.state.selectedSchedule}
            onAddSectionToSchedule={this.handleAddSectionToSchedule}
            onRemoveSectionFromSchedule={this.handleRemoveSectionFromSchedule}
          />
        </div>
      </div>
    );
  }
}

export default App;
