import React, { Component } from 'react';
import './InstructorResult.css';
import CourseResult from '../CourseResult/CourseResult';
import CourseRating from '../CourseRating/CourseRating';

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
    const instructor = this.props.instructor;
    const savedCourses = this.props.savedCourses;
    const selectedCourse = this.props.selectedCourse;
    const semesters = this.props.semesters;
    const onSelectCourse = this.props.onSelectCourse;

    let scoreSum = 0;
    let scoreCount = 0;
    for (let i = 0; i < instructor.courses.length; i++) {
      if (instructor.courses[i].rating) {
        scoreCount++;
        scoreSum += instructor.courses[i].rating;
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
        <div
          className={
            'InstructorResult-courses' +
            (this.state.expanded ? ' InstructorResult-expanded' : '')
          }
        >
          {instructor.courses.map(course =>
            <CourseResult
              course={course}
              selectedCourse={selectedCourse}
              savedCourses={savedCourses}
              inInstructor={true}
              semesters={semesters}
              onSelectCourse={onSelectCourse}
            />
          )}
        </div>
      </li>
    );
  }
}

export default InstructorResult;
