import React, { Component } from 'react';
import ReactGA from 'react-ga';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import CourseResult from '../CourseResult/CourseResult';
import CourseRating from '../CourseRating/CourseRating';
import Virtual from '../Virtual/Virtual';
import './InstructorResult.css';

const TIMEOUT_DELAY = 0.05;

class InstructorResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      instructor: this.props.instructor,
      loaded: undefined
    };

    this.toggle = this.toggle.bind(this);
    this.fetchJson = Virtual.fetchJson;
    this.handleLoadInstructor = this.handleLoadInstructor.bind(this);
  }

  toggle() {
    if (this.state.loaded === true) {
      this.setState({ expanded: !this.state.expanded });
    } else {
      this.handleLoadInstructor(this.state.instructor._id);
    }
  }

  handleLoadInstructor(instructorId) {
    if (this.state.loaded === false) return;

    ReactGA.pageview(`/instructor/${this.state.instructor._id}`);
    ReactGA.event({
      category: 'Instructor',
      action: 'Opened Instructor',
      label: instructorId
    });

    this.setState({ loaded: false });
    this.fetchJson(`/api/instructor/${instructorId}`).then(object => {
      object.loaded = true;
      this.setState(object);

      setTimeout(() => {
        this.setState({ expanded: true });
      }, TIMEOUT_DELAY);
    });
  }

  render() {
    const selectedSemester = this.props.selectedSemester; // if showButtons is enabled
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule; // if showButtons is enabled
    const selectedCourse = this.props.selectedCourse;
    const now = this.props.now;
    const departmentLookup = this.props.departmentLookup;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const colorLookup = this.props.colorLookup; // if showButtons is enabled
    const onSelectCourse = this.props.onSelectCourse;

    // handlers below are only required if showButtons is enabled
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;
    const onMouseOverCourse = this.props.onMouseOverCourse;
    const onMouseOutCourse = this.props.onMouseOutCourse;

    const showButtons = this.props.showButtons;

    const expanded = this.state.expanded;
    const instructor = this.state.instructor;
    const loaded = this.state.loaded;

    const toggle = this.toggle;

    return (
      <li
        className={
          'InstructorResult' + (expanded ? ' InstructorResult-expanded' : '')
        }
      >
        <div className="InstructorResult-header" onClick={toggle}>
          <div className="InstructorResult-top">
            <span className="InstructorResult-name">
              {instructor.fullName}
            </span>
            {loaded === false
              ? <FaCircleONotch className="InstructorResult-spinner" />
              : null}
            <CourseRating
              score={instructor.history.rating}
              new={false}
              description={
                instructor.history.ratedCourses
                  ? 'Average rating over ' +
                    instructor.history.ratedCourses +
                    ' courses'
                  : null
              }
            />
          </div>
          <div className="InstructorResult-middle">
            <span className="InstructorResult-position">
              {instructor.position}
            </span>
            <span
              className="InstructorResult-count"
              title={
                instructor.history.courses + ' courses under this instructor'
              }
            >
              {instructor.history.courses}
            </span>
          </div>
          <ul
            className="InstructorResult-bottom"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {instructor.phone &&
              <li className="InstructorResult-detail">
                {instructor.phone}
              </li>}
            {instructor.email &&
              <li className="InstructorResult-detail">
                {instructor.email}
              </li>}
            {instructor.office &&
              <li className="InstructorResult-detail">
                {instructor.office}
              </li>}
          </ul>
        </div>
        {loaded
          ? <ul className="InstructorResult-courses">
              {instructor.courses.map(course =>
                <div key={course._id} className="InstructorResult-course">
                  <CourseResult
                    selectedSemester={selectedSemester}
                    user={user}
                    selectedSchedule={selectedSchedule}
                    selectedCourse={selectedCourse}
                    now={now}
                    departmentLookup={departmentLookup}
                    semesterLookup={semesterLookup}
                    colorLookup={colorLookup}
                    distributionLookup={distributionLookup}
                    pdfLookup={pdfLookup}
                    auditLookup={auditLookup}
                    onSelectCourse={onSelectCourse}
                    onUnselectCourse={onUnselectCourse}
                    onSaveCourse={onSaveCourse}
                    onUnsaveCourse={onUnsaveCourse}
                    onAddCourseToSchedule={onAddCourseToSchedule}
                    onRemoveCourseFromSchedule={onRemoveCourseFromSchedule}
                    onMouseOverCourse={onMouseOverCourse}
                    onMouseOutCourse={onMouseOutCourse}
                    key={course._id}
                    course={course}
                    showButtons={showButtons}
                    showInstructors={false}
                    showStrictRatings={true}
                    showSemester={true}
                  />
                </div>
              )}
            </ul>
          : null}
      </li>
    );
  }
}

export default InstructorResult;
