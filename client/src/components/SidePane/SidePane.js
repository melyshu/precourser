import React, { Component } from 'react';
import './SidePane.css';
import Tabs from '../Tabs/Tabs';
import SemesterResult from '../SemesterResult/SemesterResult';

class SidePane extends Component {
  render() {
    const selectedCourse = this.props.selectedCourse;
    const semesters = this.props.semesters;

    return (
      <div className="SidePane">
        <Tabs
          labels={this.props.tabLabels}
          onClick={this.props.onTabClick}
          selected={this.props.tab}
        />
        {selectedCourse.courses.map(course =>
          <SemesterResult
            onSelectCourse={this.props.onSelectCourse}
            onUnselectCourse={this.props.onUnselectCourse}
            selectedCourse={selectedCourse}
            course={course}
            semesters={semesters}
            savedCourses={this.props.savedCourses}
          />
        )}
      </div>
    );
  }
}

export default SidePane;
