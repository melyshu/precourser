import React, { Component } from 'react';
import './SemesterResult.css';
import CourseSummary from '../CourseSummary/CourseSummary';

class SemesterResult extends Component {
  render() {
    const selectedCourse = this.props.selectedCourse;
    const course = this.props.course;
    const semesters = this.props.semesters;
    const savedCourses = this.props.savedCourses;

    return (
      <div
        className="SemesterResult"
        onClick={this.props.onSelectCourse.bind(null, course._id)}
      >
        <div
          className={
            'SemesterResult-main' +
            (selectedCourse._id === course._id
              ? ' SemesterResult-selected'
              : '')
          }
        >
          <CourseSummary
            isSemester={true}
            course={course}
            semesters={semesters}
            savedCourses={savedCourses}
          />
        </div>
      </div>
    );
  }
}

export default SemesterResult;
