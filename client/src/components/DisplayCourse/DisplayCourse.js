import React, { Component } from 'react';
import './DisplayCourse.css';
import Tabs from '../Tabs/Tabs';
import FaClose from 'react-icons/lib/fa/close';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaTasks from 'react-icons/lib/fa/tasks';
import CourseSummary from '../CourseSummary/CourseSummary';
import DisplayCourseDetails from '../DisplayCourseDetails/DisplayCourseDetails';
import DisplayCourseEvaluations from '../DisplayCourseEvaluations/DisplayCourseEvaluations';
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
    const tabLabels = [<FaClose />, <FaInfoCircle />, <FaTasks />];

    const selectedCourse = this.props.selectedCourse;
    const content =
      this.state.tab === 1
        ? <DisplayCourseDetails selectedCourse={selectedCourse} />
        : <DisplayCourseEvaluations selectedCourse={selectedCourse} />;

    return (
      <div className="DisplayCourse">
        <div className="DisplayCourse-body">
          <div className="DisplayCourse-header">
            <CourseSummary
              course={selectedCourse}
              savedCourses={this.props.savedCourses}
            />
          </div>
          <div className="DisplayCourse-content">
            {content}
          </div>
        </div>
        <SidePane
          onSelectCourse={this.props.onSelectCourse}
          onUnselectCourse={this.props.onUnselectCourse}
          tabLabels={tabLabels}
          onTabClick={this.handleTabClick}
          tab={this.state.tab}
          semesters={this.props.semesters}
          selectedCourse={selectedCourse}
          savedCourses={this.props.savedCourses}
        />
      </div>
    );
  }
}

export default DisplayCourse;
