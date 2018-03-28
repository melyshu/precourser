import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Navbar from '../Navbar/Navbar';
import MenuPane from '../MenuPane/MenuPane';
import DisplayPane from '../DisplayPane/DisplayPane';
import Virtual from '../Virtual/Virtual';
import './App.css';

const HOVER_TIMEOUT_DELAY = 200;
const SEARCH_TIMEOUT_DELAY = 2000;
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
      waitingCourseSearch: false,
      loadingCourseSearch: false,
      searchedCourses: [],
      selectedCourse: null,
      instructorSearch: '',
      waitingInstructorSearch: false,
      loadingInstructorSearch: false,
      searchedInstructors: [],
      hoveredCourse: null,
      hoveredSection: null,
      colors: [],
      loading: true,
      now: new Date()
    };

    this.history = props.history;
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
      'handleSearchCourse',
      'handleSelectCourse',
      'handleUnselectCourse',
      'handleSaveCourse',
      'handleUnsaveCourse',
      'handleAddCourseToSchedule',
      'handleRemoveCourseFromSchedule',
      'handleAddSectionToSchedule',
      'handleRemoveSectionFromSchedule',
      'handleChangeInstructorSearch',
      'handleSearchInstructor',
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
    ReactGA.event({
      category: 'Navigation',
      action: 'Changed Semester',
      label: semesterId
    });

    const courseSearch = this.state.courseSearch;
    if (courseSearch.length < 1) {
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
    ReactGA.event({
      category: 'Navigation',
      action: 'Changed Schedule'
    });

    this.fetchJsonAndSetState(`/api/schedule/${scheduleId}`);
  }

  handleCreateSchedule(name) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Created Schedule'
    });

    this.fetchJsonAndSetState(
      `/api/schedule/semester/${this.state
        .selectedSemester}/name/${encodeURIComponent(name)}`,
      { method: 'POST' }
    );
  }

  handleRenameSchedule(name) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Renamed Schedule'
    });

    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule
        ._id}/name/${encodeURIComponent(name)}`,
      {
        method: 'PUT'
      }
    );
  }

  handleDeleteSchedule() {
    ReactGA.event({
      category: 'Schedule',
      action: 'Deleted Schedule'
    });

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

    this.setState({
      courseSearch: query,
      waitingCourseSearch: true,
      loadingCourseSearch: false
    });
    if (query.length < 1) {
      this.setState({
        searchedCourses: [],
        waitingCourseSearch: false,
        loadingCourseSearch: false
      });
      return;
    }

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.handleSearchCourse(query, semesterId);
    }, SEARCH_TIMEOUT_DELAY);
  }

  handleSearchCourse(query, semesterId) {
    if (
      this.state.courseSearch === query &&
      this.state.selectedSemester === semesterId &&
      !this.state.waitingCourseSearch
    ) {
      return;
    }

    ReactGA.pageview(`/search?sc=course&q=${encodeURIComponent(query)}`);
    ReactGA.event({
      category: 'Search',
      action: 'Searched Course'
    });
    this.setState({ waitingCourseSearch: false, loadingCourseSearch: true });

    this.fetchJson(
      `/api/course/semester/${semesterId}/search/${encodeURIComponent(query)}`
    ).then(object => {
      if (
        this.state.courseSearch === query &&
        this.state.selectedSemester === semesterId &&
        this.state.loadingCourseSearch
      ) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
        this.setState(object);
      }
    });
  }

  handleSelectCourse(courseId) {
    ReactGA.pageview(`/course/${courseId}`);
    ReactGA.event({
      category: 'Course',
      action: 'Opened Course',
      label: courseId
    });

    this.history.push(`/course/${courseId}`);
  }

  handleUnselectCourse() {
    ReactGA.pageview('/');
    ReactGA.event({
      category: 'Course',
      action: 'Closed Course'
    });

    this.setState({ selectedCourse: null });
    this.history.push(`/`);
  }

  handleSaveCourse(courseId) {
    ReactGA.event({
      category: 'Course',
      action: 'Saved Course',
      label: courseId
    });

    this.fetchJsonAndSetState(`/api/save/course/${courseId}`, {
      method: 'PUT'
    });
  }

  handleUnsaveCourse(courseId) {
    ReactGA.event({
      category: 'Course',
      action: 'Unsaved Course',
      label: courseId
    });

    this.fetchJsonAndSetState(`/api/save/course/${courseId}`, {
      method: 'DELETE'
    });
  }

  handleAddCourseToSchedule(courseId) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Added Course',
      label: courseId
    });

    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${courseId}`,
      { method: 'PUT' }
    );
  }

  handleRemoveCourseFromSchedule(courseId) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Removed Course',
      label: courseId
    });

    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/course/${courseId}`,
      { method: 'DELETE' }
    );
  }

  handleAddSectionToSchedule(sectionId) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Added Section',
      label: sectionId
    });

    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/section/${sectionId}`,
      { method: 'PUT' }
    );
  }

  handleRemoveSectionFromSchedule(sectionId) {
    ReactGA.event({
      category: 'Schedule',
      action: 'Removed Section',
      label: sectionId
    });

    this.fetchJsonAndSetState(
      `/api/schedule/${this.state.selectedSchedule._id}/section/${sectionId}`,
      { method: 'DELETE' }
    );
  }

  handleChangeInstructorSearch(event) {
    const query = event.target.value;

    this.setState({
      instructorSearch: query,
      waitingInstructorSearch: true,
      loadingInstructorSearch: false
    });
    if (query.length < 1) {
      this.setState({
        searchedInstructors: [],
        waitingInstructorSearch: false,
        loadingInstructorSearch: false
      });
      return;
    }

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.handleSearchInstructor(query);
    }, SEARCH_TIMEOUT_DELAY);
  }

  handleSearchInstructor(query) {
    if (
      this.state.instructorSearch === query &&
      !this.state.waitingInstructorSearch
    ) {
      return;
    }

    ReactGA.pageview(`/search?sc=instructor&q=${encodeURIComponent(query)}`);
    ReactGA.event({
      category: 'Search',
      action: 'Searched Instructor'
    });
    this.setState({
      waitingInstructorSearch: false,
      loadingInstructorSearch: true
    });

    this.fetchJson(
      `/api/instructor/search/${encodeURIComponent(query)}`
    ).then(object => {
      if (
        this.state.instructorSearch === query &&
        this.state.loadingInstructorSearch
      ) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
        this.setState(object);
      }
    });
  }

  handleMouseOverCourse(course) {
    clearTimeout(this.hoveredCourseTimeout);
    this.hoveredCourseTimeout = setTimeout(
      () => this.setState({ hoveredCourse: course, hoveredSection: null }),
      HOVER_TIMEOUT_DELAY
    );
  }

  handleMouseOutCourse(course) {
    clearTimeout(this.hoveredCourseTimeout);
    this.hoveredCourseTimeout = setTimeout(
      () => this.setState({ hoveredCourse: null }),
      HOVER_TIMEOUT_DELAY
    );
  }

  handleMouseOverSection(sectionId) {
    this.setState({ hoveredCourse: null, hoveredSection: sectionId });
  }

  handleMouseOutSection(sectionId) {
    this.setState({ hoveredSection: null });
  }

  componentDidMount() {
    this.fetchJson(`/api/startup`).then(object => {
      this.setState(object);
      ReactGA.set({ userId: object.user._id });
      ReactGA.pageview(this.history.location.pathname);
    });

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
    if (loading)
      return (
        <div className="App">
          <Navbar isEmpty={true} />
        </div>
      );

    const departments = this.state.departments;
    const semesters = this.state.semesters;
    const selectedSemester = this.state.selectedSemester;
    const user = this.state.user;
    const schedules = this.state.schedules;
    const selectedSchedule = this.state.selectedSchedule;
    const courseSearch = this.state.courseSearch;
    const waitingCourseSearch = this.state.waitingCourseSearch;
    const loadingCourseSearch = this.state.loadingCourseSearch;
    const searchedCourses = this.state.searchedCourses;
    const selectedCourse = this.state.selectedCourse;
    const instructorSearch = this.state.instructorSearch;
    const waitingInstructorSearch = this.state.waitingInstructorSearch;
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
    const handleSearchCourse = this.handleSearchCourse;
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
    const handleSearchInstructor = this.handleSearchInstructor;
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

    const urlCourseId = this.props.match.params.courseId;
    if (
      urlCourseId &&
      (!selectedCourse || selectedCourse._id !== urlCourseId)
    ) {
      this.fetchJsonAndSetState(`/api/course/${urlCourseId}`).catch(err => {
        console.error(err);
        this.history.replace(`/`);
      });
    }

    if (selectedCourse) {
      document.title = `precourser | ${selectedCourse.department}${selectedCourse.catalogNumber} ${selectedCourse.title}`;
    } else {
      document.title = `precourser | ${selectedSchedule.name}`;
    }

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
            waitingCourseSearch={waitingCourseSearch}
            loadingCourseSearch={loadingCourseSearch}
            searchedCourses={searchedCourses}
            selectedCourse={selectedCourse}
            instructorSearch={instructorSearch}
            waitingInstructorSearch={waitingInstructorSearch}
            loadingInstructorSearch={loadingInstructorSearch}
            searchedInstructors={searchedInstructors}
            now={now}
            colorLookup={colorLookup}
            semesterLookup={semesterLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
            onChangeCourseSearch={handleChangeCourseSearch}
            onSearchCourse={handleSearchCourse}
            onSelectCourse={handleSelectCourse}
            onUnselectCourse={handleUnselectCourse}
            onSaveCourse={handleSaveCourse}
            onUnsaveCourse={handleUnsaveCourse}
            onAddCourseToSchedule={handleAddCourseToSchedule}
            onRemoveCourseFromSchedule={handleRemoveCourseFromSchedule}
            onChangeInstructorSearch={handleChangeInstructorSearch}
            onSearchInstructor={handleSearchInstructor}
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
