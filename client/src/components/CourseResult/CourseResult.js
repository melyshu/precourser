import React, { Component } from 'react';
import './CourseResult.css';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaStar from 'react-icons/lib/fa/star';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';
import CourseSummary from '../CourseSummary/CourseSummary';
//import FaCalendarO from 'react-icons/lib/fa/calendar-o';

class CourseResult extends Component {
  render() {
    const course = this.props.course;

    let inSchedule = false;
    for (let i = 0; i < this.props.selectedScheduleCourses.length; i++) {
      inSchedule |= this.props.selectedScheduleCourses[i]._id === course._id;
    }

    let saved = false;
    for (let i = 0; i < this.props.savedCourses.length; i++) {
      saved |= this.props.savedCourses[i]._id === course._id;
    }

    const selected =
      this.props.selectedCourse && course._id === this.props.selectedCourse._id;

    const color = this.props.colors[course._id];

    return (
      <li
        className="CourseResult"
        onMouseOver={this.props.onMouseOverCourse.bind(null, course)}
        onMouseOut={this.props.onMouseOutCourse.bind(null, course)}
      >
        <div
          className={
            'CourseResult-main' + (color ? ' CourseResult-' + color : '')
          }
        >
          <CourseSummary
            course={course}
            savedCourses={this.props.savedCourses}
          />
        </div>
        <div className="CourseResult-buttons">
          <button
            className={
              'CourseResult-button CourseResult-' +
              (selected ? 'unselect' : 'select')
            }
            onClick={(selected
              ? this.props.onUnselectCourse
              : this.props.onSelectCourse).bind(null, course._id)}
          >
            <FaInfoCircle />
          </button>
          <button
            className={
              'CourseResult-button CourseResult-' + (saved ? 'unsave' : 'save')
            }
            onClick={(saved
              ? this.props.onUnsaveCourse
              : this.props.onSaveCourse).bind(null, course._id)}
          >
            <FaStar />
          </button>
          <button
            className={
              'CourseResult-button CourseResult-' +
              (inSchedule ? 'remove' : 'add')
            }
            onClick={(inSchedule
              ? this.props.onRemoveCourseFromSchedule
              : this.props.onAddCourseToSchedule).bind(null, course._id)}
          >
            {inSchedule ? <FaMinus /> : <FaPlus />}
          </button>
        </div>
      </li>
    );
  }
}

export default CourseResult;
