import React, { Component } from 'react';
import CourseResult from '../CourseResult/CourseResult';
import CourseRating from '../CourseRating/CourseRating';
import './InstructorResult.css';

class InstructorResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const selectedSemester = this.props.selectedSemester; // if showButtons is enabled
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule; // if showButtons is enabled
    const selectedCourse = this.props.selectedCourse;
    const semesterLookup = this.props.semesterLookup;
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

    const instructor = this.props.instructor;
    const showButtons = this.props.showButtons;

    let scoreSum = 0;
    let scoreCount = 0;
    for (let i = 0; i < instructor.courses.length; i++) {
      const course = instructor.courses[i];

      if (course.rating && course.rating.semester === course.semester) {
        scoreCount++;
        scoreSum += course.rating.score;
      }
    }
    const score = scoreCount ? scoreSum / scoreCount : null;
    const _new = instructor.courses.length === 0;

    return (
      <li className="InstructorResult">
        <div className="InstructorResult-header" onClick={this.toggle}>
          <div className="InstructorResult-top">
            <span className="InstructorResult-name">
              {instructor.fullName}
            </span>
            <span className="InstructorResult-count">
              {instructor.courses.length}
            </span>
          </div>
          <div className="InstructorResult-middle">
            <span className="InstructorResult-position">
              {instructor.position}
            </span>
            <CourseRating score={score} new={_new} />
          </div>
          <ul className="InstructorResult-bottom">
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
        <ul
          className={
            'InstructorResult-courses' +
            (this.state.expanded ? ' InstructorResult-expanded' : '')
          }
        >
          {instructor.courses.map(course =>
            <CourseResult
              selectedSemester={selectedSemester}
              user={user}
              selectedSchedule={selectedSchedule}
              selectedCourse={selectedCourse}
              semesterLookup={semesterLookup}
              colorLookup={colorLookup}
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
          )}
        </ul>
      </li>
    );
  }
}

export default InstructorResult;
