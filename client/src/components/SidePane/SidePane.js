import React, { Component } from 'react';
import './SidePane.css';
import Tabs from '../Tabs/Tabs';
import CourseResult from '../CourseResult/CourseResult';
import InstructorResult from '../InstructorResult/InstructorResult';
import FaClose from 'react-icons/lib/fa/close';
import FaClockO from 'react-icons/lib/fa/clock-o';
import FaUser from 'react-icons/lib/fa/user';

class SidePane extends Component {
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
    const savedCourses = this.props.savedCourses;
    const selectedCourse = this.props.selectedCourse;
    const semesters = this.props.semesters;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;

    const tabLabels = [<FaClose />, <FaClockO />, <FaUser />];

    const listItems =
      this.state.tab === 1
        ? selectedCourse.courses.map(course =>
            <CourseResult
              key={course._id}
              onSelectCourse={onSelectCourse}
              selectedCourse={selectedCourse}
              course={course}
              semesters={semesters}
              savedCourses={savedCourses}
              isSemester={true}
            />
          )
        : selectedCourse.instructors.map(instructor =>
            <InstructorResult
              key={instructor._id}
              instructor={instructor}
              savedCourses={savedCourses}
              selectedCourse={selectedCourse}
              onSelectCourse={onSelectCourse}
              semesters={semesters}
            />
          );

    return (
      <div className="SidePane">
        <Tabs
          labels={tabLabels}
          onClick={this.handleTabClick}
          selected={this.state.tab}
        />
        <ul className="SidePane-content">{listItems}
        </ul>
      </div>
    );
  }
}

export default SidePane;
