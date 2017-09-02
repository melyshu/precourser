import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';
import './App.css';

const TIMEOUT_DELAY = 250;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      semesters: [],
      selectedSemester: null,
      user: { savedCourses: [] },
      schedules: [],
      selectedSchedule: { courses: [] },
      courseSearch: '',
      searchedCourses: [],
      selectedCourse: null,
      instructorSearch: '',
      searchedInstructors: [],
      hoveredCourse: null,
      hoveredSection: null,
      loading: true
    };

    const functionsToBind = [
      'fetchJsonAndSetState',
      'handleChangeSemester',
      'handleChangeSchedule',
      'handleCreateSchedule',
      'handleRenameSchedule',
      'handleDeleteSchedule',
      'handleChangeCourseSearch',
      'handleSelectCourse',
      'handleUnselectCourse',
      'handleSaveCourse',
      'handleUnsaveCourse',
      'handleAddCourseToSchedule',
      'handleRemoveCourseFromSchedule',
      'handleAddSectionToSchedule',
      'handleRemoveSectionFromSchedule',
      'handleChangeInstructorSearch',
      'handleMouseOverCourse',
      'handleMouseOutCourse',
      'handleMouseOverSection',
      'handleMouseOutSection'
    ];

    for (let i = 0; i < functionsToBind.length; i++) {
      this[functionsToBind[i]] = this[functionsToBind[i]].bind(this);
    }
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

  handleChangeSemester(semesterId) {
    const courseSearch = this.state.courseSearch;
    if (courseSearch.length < 3) {
      this.fetchJsonAndSetState(`/api/semester/${semesterId}`);
    } else {
      this.fetchJsonAndSetState(
        `/api/semester/${semesterId}?courseSearch=${courseSearch}`
      );
    }
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
      {
        method: 'PUT'
      }
    );
  }

  handleDeleteSchedule() {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}`,
      {
        method: 'DELETE'
      }
    );
  }

  handleChangeCourseSearch(event) {
    const query = event.target.value;
    const semesterId = this.state.selectedSemester;
    this.setState({ courseSearch: query });

    if (query.length < 3) return;

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fetchJson(
        `/api/course/semester/${this.state.selectedSemester}/search/${query}`
      ).then(object => {
        if (
          this.state.courseSearch === query &&
          this.state.selectedSemester === semesterId
        ) {
          this.setState(object);
        }
      });
    }, TIMEOUT_DELAY);
  }

  handleSelectCourse(courseId) {
    this.fetchJsonAndSetState(`/api/course/${courseId}`);
  }

  handleUnselectCourse() {
    this.setState({ selectedCourse: null });
  }

  handleSaveCourse(courseId) {
    this.fetchJsonAndSetState(`/api/save/course/${courseId}`, {
      method: 'PUT'
    });
  }

  handleUnsaveCourse(courseId) {
    this.fetchJsonAndSetState(`/api/save/course/${courseId}`, {
      method: 'DELETE'
    });
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

  handleChangeInstructorSearch(event) {
    const query = event.target.value;
    this.setState({ instructorSearch: query });

    if (query.length < 3) return;

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fetchJson(`/api/instructor/search/${query}`).then(object => {
        if (this.state.instructorSearch === query) this.setState(object);
      });
    }, TIMEOUT_DELAY);
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

  componentDidMount() {
    this.fetchJsonAndSetState(`/api/startup`);
  }

  render() {
    const departments = this.state.departments;
    const semesters = this.state.semesters;
    const selectedSemester = this.state.selectedSemester;
    const user = this.state.user;
    const schedules = this.state.schedules;
    const selectedSchedule = this.state.selectedSchedule;
    const courseSearch = this.state.courseSearch;
    const searchedCourses = this.state.searchedCourses;
    const selectedCourse = this.state.selectedCourse;
    const instructorSearch = this.state.instructorSearch;
    const searchedInstructors = this.state.searchedInstructors;
    const hoveredCourse = this.state.hoveredCourse;
    const hoveredSection = this.state.hoveredSection;
    const loading = this.state.loading;

    const handleChangeSemester = this.handleChangeSemester;
    const handleChangeSchedule = this.handleChangeSchedule;
    const handleCreateSchedule = this.handleCreateSchedule;
    const handleRenameSchedule = this.handleRenameSchedule;
    const handleDeleteSchedule = this.handleDeleteSchedule;
    const handleChangeCourseSearch = this.handleChangeCourseSearch;
    const handleSelectCourse = this.handleSelectCourse;
    const handleUnselectCourse = this.handleUnselectCourse;
    const handleSaveCourse = this.handleSaveCourse;
    const handleUnsaveCourse = this.handleUnsaveCourse;
    const handleAddCourseToSchedule = this.handleAddCourseToSchedule;
    const handleRemoveCourseFromSchedule = this.handleRemoveCourseFromSchedule;
    const handleAddSectionToSchedule = this.handleAddSectionToSchedule;
    const handleRemoveSectionFromSchedule = this
      .handleRemoveSectionFromSchedule;
    const handleChangeInstructorSearch = this.handleChangeInstructorSearch;
    const handleMouseOverCourse = this.handleMouseOverCourse;
    const handleMouseOutCourse = this.handleMouseOutCourse;
    const handleMouseOverSection = this.handleMouseOverSection;
    const handleMouseOutSection = this.handleMouseOutSection;

    // make department lookup
    const departmentLookup = {};
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      departmentLookup[department._id] = department;
    }

    // make semester lookup
    const semesterLookup = {};
    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i];
      semesterLookup[semester._id] = semester;
    }

    // make color lookup
    const colorLookup = {};
    for (let i = 0; i < selectedSchedule.courses.length; i++) {
      colorLookup[selectedSchedule.courses[i]._id] = 'color' + i % 10;
    }
    if (hoveredCourse && !colorLookup[hoveredCourse._id]) {
      colorLookup[hoveredCourse._id] =
        'color' + selectedSchedule.courses.length % 10;
    }

    if (loading) return <Loading />;

    return (
      <div className="App">
        <Navbar
          semesters={semesters}
          selectedSemester={selectedSemester}
          schedules={schedules}
          selectedSchedule={selectedSchedule}
          semesterLookup={semesterLookup}
          onChangeSemester={handleChangeSemester}
          onChangeSchedule={handleChangeSchedule}
          onCreateSchedule={handleCreateSchedule}
          onRenameSchedule={handleRenameSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
        <div className="App-page">
          <MenuPane
            selectedSemester={selectedSemester}
            user={user}
            selectedSchedule={selectedSchedule}
            courseSearch={courseSearch}
            searchedCourses={searchedCourses}
            selectedCourse={selectedCourse}
            instructorSearch={instructorSearch}
            searchedInstructors={searchedInstructors}
            colorLookup={colorLookup}
            semesterLookup={semesterLookup}
            onChangeCourseSearch={handleChangeCourseSearch}
            onSelectCourse={handleSelectCourse}
            onUnselectCourse={handleUnselectCourse}
            onSaveCourse={handleSaveCourse}
            onUnsaveCourse={handleUnsaveCourse}
            onAddCourseToSchedule={handleAddCourseToSchedule}
            onRemoveCourseFromSchedule={handleRemoveCourseFromSchedule}
            onChangeInstructorSearch={handleChangeInstructorSearch}
            onMouseOverCourse={handleMouseOverCourse}
            onMouseOutCourse={handleMouseOutCourse}
          />
          <DisplayPane
            user={user}
            selectedSchedule={selectedSchedule}
            selectedCourse={selectedCourse}
            hoveredCourse={hoveredCourse}
            hoveredSection={hoveredSection}
            colorLookup={colorLookup}
            semesterLookup={semesterLookup}
            onSelectCourse={handleSelectCourse}
            onUnselectCourse={handleUnselectCourse}
            onSaveCourse={handleSaveCourse}
            onUnsaveCourse={handleUnsaveCourse}
            onAddSectionToSchedule={handleAddSectionToSchedule}
            onRemoveSectionFromSchedule={handleRemoveSectionFromSchedule}
            onMouseOverSection={handleMouseOverSection}
            onMouseOutSection={handleMouseOutSection}
          />
        </div>
      </div>
    );
  }
}

export default App;
