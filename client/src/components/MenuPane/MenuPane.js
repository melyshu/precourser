import React, { Component } from 'react';
import './MenuPane.css';
import CourseResult from '../CourseResult/CourseResult';

class MenuPane extends Component {
  render() {
    const courses = this.props.results;
    const courseResults = [];
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      courseResults.push(<CourseResult course={course} />);
    }

    return (
      <div className="MenuPane">
        <div className="MenuPane-search">
          <input
            className="MenuPane-searchbox"
            type="text"
            onChange={this.props.onSearchChange}
          />
        </div>
        <ul className="MenuPane-results">
          {courseResults}
        </ul>
      </div>
    );
  }
}

export default MenuPane;
