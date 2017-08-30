import React, { Component } from 'react';
import './MenuPane.css';
import CourseResult from '../CourseResult/CourseResult';
import Tabs from '../Tabs/Tabs';
import FaSearch from 'react-icons/lib/fa/search';
import FaStar from 'react-icons/lib/fa/star';
import FaCalendar from 'react-icons/lib/fa/calendar';
import FaThLarge from 'react-icons/lib/fa/th-large';

class MenuPane extends Component {
  constructor(props) {
    super(props);

    this.state = { tab: 0 };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(tab) {
    this.setState({ tab: tab });
  }

  render() {
    const tabLabels = [<FaSearch />, <FaStar />, <FaCalendar />, <FaThLarge />];

    let input;
    if (this.state.tab === 0) {
      input = (
        <input
          className="MenuPane-input"
          type="text"
          onChange={this.props.onChangeSearch}
          placeholder="search"
        />
      );
    }

    const courses =
      this.state.tab === 0
        ? this.props.searchedCourses
        : this.state.tab === 1
          ? this.props.savedCourses
          : this.props.selectedScheduleCourses;

    const courseResults = [];
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      courseResults.push(
        <CourseResult
          key={course._id}
          course={course}
          onAddCourseToSchedule={this.props.onAddCourseToSchedule}
          onRemoveCourseFromSchedule={this.props.onRemoveCourseFromSchedule}
          onSaveCourse={this.props.onSaveCourse}
          onUnsaveCourse={this.props.onUnsaveCourse}
          onMouseOverCourse={this.props.onMouseOverCourse}
          onMouseOutCourse={this.props.onMouseOutCourse}
          onSelectCourse={this.props.onSelectCourse}
          onUnselectCourse={this.props.onUnselectCourse}
          colors={this.props.colors}
          selectedScheduleCourses={this.props.selectedScheduleCourses}
          savedCourses={this.props.savedCourses}
          selectedCourse={this.props.selectedCourse}
        />
      );
    }

    const noun =
      this.state.tab === 0
        ? ' Search Result'
        : this.state.tab === 1 ? ' Saved Course' : ' Selected Course';
    const plural = courses.length === 1 ? '' : 's';
    let caption = courses.length + noun + plural;

    return (
      <div className="MenuPane">
        <Tabs
          labels={tabLabels}
          onClick={this.handleTabClick}
          selected={this.state.tab}
        />
        <div className="MenuPane-content">
          {input}
          <div className="MenuPane-caption">
            {caption}
          </div>
          <ul className="MenuPane-results">
            {courseResults}
          </ul>
        </div>
      </div>
    );
  }
}

export default MenuPane;
