import React, { Component } from 'react';
import './CourseResult.css';

class CourseResult extends Component {
  render() {
    const course = this.props.course;
    return (
      <li className="CourseResult">
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
      </li>
    );
  }
}

export default CourseResult;
