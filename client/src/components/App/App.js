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
      hoveredCourse: null,
      hoveredSection: null
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
    this.handleMouseOverSection = this.handleMouseOverSection.bind(this);
    this.handleMouseOutSection = this.handleMouseOutSection.bind(this);
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

  handleMouseOverSection(sectionId) {
    this.setState({ hoveredSection: sectionId });
  }

  handleMouseOutSection(sectionId) {
    this.setState({ hoveredSection: null });
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
    const searchedCourses = this.state.searchedCourses;
    const savedCourses = this.state.user.savedCourses;
    const selectedCourse = this.state.selectedCourse;
    const selectedSchedule = this.state.selectedSchedule;
    const selectedScheduleCourses = selectedSchedule.courses;
    const hoveredCourse = this.state.hoveredCourse;
    const colors = {};

    // assign colors
    for (let i = 0; i < selectedScheduleCourses.length; i++) {
      colors[selectedScheduleCourses[i]._id] = 'color' + i % 10;
    }
    if (hoveredCourse && !colors[hoveredCourse._id]) {
      colors[hoveredCourse._id] = 'color' + selectedScheduleCourses.length % 10;
    }

    // set flags
    const coursesInSchedule = selectedScheduleCourses.map(course => course._id);
    const coursesInUser = savedCourses.map(course => course._id);
    const selectedCourseId = selectedCourse ? selectedCourse._id : null;

    for (let i = 0; i < searchedCourses.length; i++) {
      const course = searchedCourses[i];
      course.inSchedule = coursesInSchedule.indexOf(course._id) > -1;
      course.saved = coursesInUser.indexOf(course._id) > -1;
      course.selected = course._id === selectedCourseId;
    }

    for (let i = 0; i < savedCourses.length; i++) {
      const course = savedCourses[i];
      course.inSchedule = coursesInSchedule.indexOf(course._id) > -1;
      course.saved = true;
      course.selected = course._id === selectedCourseId;
    }

    return (
      <div className="App">
        <Navbar
          semesters={this.state.semesters}
          selectedSemester={this.state.selectedSemester}
          onChangeSemester={this.handleChangeSemester}
          schedules={this.state.schedules}
          selectedSchedule={selectedSchedule}
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
            selectedScheduleCourses={selectedScheduleCourses}
            colors={colors}
          />
          <DisplayPane
            selectedCourse={selectedCourse}
            hoveredCourse={hoveredCourse}
            hoveredSection={this.state.hoveredSection}
            selectedSchedule={selectedSchedule}
            onAddSectionToSchedule={this.handleAddSectionToSchedule}
            onRemoveSectionFromSchedule={this.handleRemoveSectionFromSchedule}
            onMouseOverSection={this.handleMouseOverSection}
            onMouseOutSection={this.handleMouseOutSection}
            colors={colors}
          />
        </div>
      </div>
    );
  }
}

export default App;
