import React, { Component } from 'react';
import './SectionResult.css';

class SectionResult extends Component {
  render() {
    const section = this.props.section;
    const course = this.props.course;

    return (
      <li className="SectionResult">
        <div className="SectionResult-top">
          {course.department + course.catalogNumber}
        </div>
      </li>
    );
  }
}

export default SectionResult;
