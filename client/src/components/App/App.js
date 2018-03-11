import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';
import Virtual from '../Virtual/Virtual';
import './App.css';

const TIMEOUT_DELAY = 200;
const REFRESH_INTERVAL = 60000;

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
      loadingCourseSearch: false,
      searchedCourses: [],
      selectedCourse: null,
      instructorSearch: '',
      loadingInstructorSearch: false,
      searchedInstructors: [],
      hoveredCourse: null,
      hoveredSection: null,
      colors: [],
      loading: true,
      now: new Date()
    };

    this.fetchJson = Virtual.fetchJson;
    this.fetchJsonAndSetState = Virtual.fetchJsonAndSetState;

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

  handleChangeSemester(semesterId) {
    const courseSearch = this.state.courseSearch;
    if (courseSearch.length < 3) {
      this.fetchJsonAndSetState(`/api/semester/${semesterId}`);
    } else {
      this.fetchJsonAndSetState(
        `/api/semester/${semesterId}?courseSearch=${encodeURIComponent(
          courseSearch
        )}`
      );
    }
  }

  handleChangeSchedule(scheduleId) {
    this.fetchJsonAndSetState(`/api/schedule/${scheduleId}`);
  }

  handleCreateSchedule(name) {
    this.fetchJsonAndSetState(
      `/api/schedule/semester/${this.state
        .selectedSemester}/name/${encodeURIComponent(name)}`,
      { method: 'POST' }
    );
  }

  handleRenameSchedule(name) {
    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule
        ._id}/name/${encodeURIComponent(name)}`,
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
    this.setState({ courseSearch: query, loadingCourseSearch: true });
    if (query.length < 3) {
      this.setState({ searchedCourses: [], loadingCourseSearch: false });
      return;
    }

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fetchJson(
        `/api/course/semester/${this.state
          .selectedSemester}/search/${encodeURIComponent(query)}`
      ).then(object => {
        if (
          this.state.courseSearch === query &&
          this.state.selectedSemester === semesterId
        ) {
          this.searchTimeout = null;
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
    this.setState({ instructorSearch: query, loadingInstructorSearch: true });
    if (query.length < 3) {
      this.setState({
        searchedInstructors: [],
        loadingInstructorSearch: false
      });
      return;
    }

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fetchJson(
        `/api/instructor/search/${encodeURIComponent(query)}`
      ).then(object => {
        if (this.state.instructorSearch === query) {
          this.searchTimeout = null;
          this.setState(object);
        }
      });
    }, TIMEOUT_DELAY);
  }

  handleMouseOverCourse(course) {
    clearTimeout(this.hoveredCourseTimeout);
    this.hoveredCourseTimeout = setTimeout(
      () => this.setState({ hoveredCourse: course, hoveredSection: null }),
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
    this.setState({ hoveredCourse: null, hoveredSection: sectionId });
  }

  handleMouseOutSection(sectionId) {
    this.setState({ hoveredSection: null });
  }

  componentDidMount() {
    this.fetchJsonAndSetState(`/api/startup`);
    this.nowInterval = setInterval(
      () => this.setState({ now: new Date() }),
      REFRESH_INTERVAL
    );
  }

  componentWillUnmount() {
    clearInterval(this.nowInterval);
  }

  render() {
    const loading = this.state.loading;
    if (loading) return <Loading />;

    const departments = this.state.departments;
    const semesters = this.state.semesters;
    const selectedSemester = this.state.selectedSemester;
    const user = this.state.user;
    const schedules = this.state.schedules;
    const selectedSchedule = this.state.selectedSchedule;
    const courseSearch = this.state.courseSearch;
    const loadingCourseSearch = this.state.loadingCourseSearch;
    const searchedCourses = this.state.searchedCourses;
    const selectedCourse = this.state.selectedCourse;
    const instructorSearch = this.state.instructorSearch;
    const loadingInstructorSearch = this.state.loadingInstructorSearch;
    const searchedInstructors = this.state.searchedInstructors;
    const hoveredCourse = this.state.hoveredCourse;
    const hoveredSection = this.state.hoveredSection;
    const colors = this.state.colors;
    const now = this.state.now;

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

    /*
    // make a hash for randomizing colors based on schedule id
    let N = parseInt(selectedSchedule._id, 16);
    const remainders = [1];
    for (let i = 2; i <= COLORS; i++) {
      remainders.push(N % i + 1);
      N = Math.floor(N / i);
    }
    const hash = {};
    let position = 0;
    for (let i = 0; i < COLORS; i++) {
      let placesToMove = remainders[COLORS - i];
      while (placesToMove) {
        position = (position + 1) % COLORS;
        if (hash[position] === undefined) {
          placesToMove--;
        }
      }
      hash[position] = i;
    }*/

    // make color name lookup
    const colorNameLookup = {};
    for (let i = 0; i < colors.length; i++) {
      colorNameLookup[colors[i]._id] = colors[i].name;
    }

    // make color lookup
    const colorLookup = {};
    for (let i = 0; i < selectedSchedule.colors.length; i++) {
      colorLookup[selectedSchedule.colors[i].course] =
        '#' + selectedSchedule.colors[i].color;
    }

    if (hoveredCourse && !colorLookup[hoveredCourse._id]) {
      colorLookup[hoveredCourse._id] = '#7F7F7F';
    }

    const distributionLookup = {
      EC: 'Epistemology and Cognition',
      EM: 'Ethical Thought and Moral Values',
      HA: 'Historical Analysis',
      LA: 'Literature and the Arts',
      SA: 'Social Analysis',
      QR: 'Quantitative Reasoning',
      ST: 'Science and Technology', // deprecated
      STL: 'Science and Technology with Laboratory',
      STN: 'Science and Technology without Laboratory',
      STX: 'Science and Technology', // deprecated
      W: 'Writing'
    };

    const pdfLookup = {
      PDF: 'PDF available',
      NPDF: 'No PDF',
      PDFO: 'PDF only',
      XPDF: 'No PDF data'
    };

    const auditLookup = {
      AUDIT: 'Audit available',
      NAUDIT: 'No audit',
      XAUDIT: 'No audit data'
    };

    return (
      <div className="App">
        <Navbar
          semesters={semesters}
          selectedSemester={selectedSemester}
          user={user}
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
            loadingCourseSearch={loadingCourseSearch}
            searchedCourses={searchedCourses}
            selectedCourse={selectedCourse}
            instructorSearch={instructorSearch}
            loadingInstructorSearch={loadingInstructorSearch}
            searchedInstructors={searchedInstructors}
            now={now}
            colorLookup={colorLookup}
            semesterLookup={semesterLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
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
            now={now}
            colorLookup={colorLookup}
            semesterLookup={semesterLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
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
