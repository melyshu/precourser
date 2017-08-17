import React, { Component } from 'react';
import './CourseResult.css';

class CourseResult extends Component {
  render() {
    const course = this.props.course;

    let scheduleButton = (
      <button
        className="CourseResult-add"
        onClick={this.props.onAddCourseToSchedule.bind(null, course._id)}
      >
        +
      </button>
    );
    if (course.inSchedule) {
      scheduleButton = (
        <button
          className="CourseResult-remove"
          onClick={this.props.onRemoveCourseFromSchedule.bind(null, course._id)}
        >
          -
        </button>
      );
    }

    return (
      <li className="CourseResult">
        <div className="CourseResult-main">
          <div className="CourseResult-top">
            <div>
              {course.department + course.catalogNumber}
            </div>
          </div>
          <div className="CourseResult-bottom">
            <div className="CourseResult-title">
              {course.title}
            </div>
          </div>
        </div>
        <div className="CourseResult-buttons">
          <button className="CourseResult-info" />
          <button className="CourseResult-save" />
          {scheduleButton}
        </div>
      </li>
    );
  }
}

export default CourseResult;
