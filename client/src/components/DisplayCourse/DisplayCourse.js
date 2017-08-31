import React, { Component } from 'react';
import './DisplayCourse.css';
import CourseSummary from '../CourseSummary/CourseSummary';
import DisplayCourseDetails from '../DisplayCourseDetails/DisplayCourseDetails';
import SidePane from '../SidePane/SidePane';

class DisplayCourse extends Component {
  constructor(props) {
    super(props);

    this.state = { tab: 1 };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(tab) {
    if (!tab) {
      return this.props.onUnselectCourse(this.props.selectedCourse);
    }
    this.setState({ tab: tab });
  }

  render() {
    const semesters = this.props.semesters;
    const selectedCourse = this.props.selectedCourse;
    const savedCourses = this.props.savedCourses;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;

    return (
      <div className="DisplayCourse">
        <div className="DisplayCourse-body">
          <div className="DisplayCourse-header">
            <CourseSummary
              course={selectedCourse}
              savedCourses={savedCourses}
              inInstructor={true}
              semesters={semesters}
            />
          </div>
          <div className="DisplayCourse-content">
            <DisplayCourseDetails
              selectedCourse={selectedCourse}
              semesters={semesters}
            />
          </div>
        </div>
        <SidePane
          onSelectCourse={onSelectCourse}
          onUnselectCourse={onUnselectCourse}
          semesters={semesters}
          selectedCourse={selectedCourse}
          savedCourses={savedCourses}
        />
      </div>
    );
  }
}

export default DisplayCourse;
