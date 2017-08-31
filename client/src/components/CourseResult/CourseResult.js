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
    const isSemester = this.props.isSemester;
    const inInstructor = this.props.inInstructor;

    const course = this.props.course;
    const selectedScheduleCourses = this.props.selectedScheduleCourses;
    const savedCourses = this.props.savedCourses;
    const selectedCourse = this.props.selectedCourse;
    const colors = this.props.colors;
    const semesters = this.props.semesters;

    // click handlers
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;
    const onMouseOverCourse = this.props.onMouseOverCourse;
    const onMouseOutCourse = this.props.onMouseOutCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;

    let inSchedule = false;
    if (selectedScheduleCourses) {
      for (let i = 0; i < selectedScheduleCourses.length; i++) {
        inSchedule |= selectedScheduleCourses[i]._id === course._id;
      }
    }

    let saved = false;
    for (let i = 0; i < savedCourses.length; i++) {
      saved |= savedCourses[i]._id === course._id;
    }

    const selected = selectedCourse && course._id === selectedCourse._id;

    const color = colors && colors[course._id];

    return (
      <li
        className={
          'CourseResult' +
          (isSemester ? ' CourseResult-semester' : '') +
          (inInstructor ? ' CourseResult-instructor' : '') +
          (selected ? ' CourseResult-selected' : '')
        }
        onClick={
          isSemester || inInstructor
            ? onSelectCourse.bind(null, course._id)
            : null
        }
        onMouseOver={
          isSemester || inInstructor
            ? null
            : onMouseOverCourse.bind(null, course)
        }
        onMouseOut={
          isSemester || inInstructor
            ? null
            : onMouseOutCourse.bind(null, course)
        }
      >
        <div
          className={
            'CourseResult-main' + (color ? ' CourseResult-' + color : '')
          }
        >
          <CourseSummary
            isSemester={isSemester}
            inInstructor={inInstructor}
            semesters={semesters}
            course={course}
            savedCourses={savedCourses}
          />
        </div>
        {isSemester ||
          inInstructor ||
          <div className="CourseResult-buttons">
            <button
              className={
                'CourseResult-button CourseResult-' +
                (selected ? 'unselect' : 'select')
              }
              onClick={(selected ? onUnselectCourse : onSelectCourse).bind(
                null,
                course._id
              )}
            >
              <FaInfoCircle />
            </button>
            <button
              className={
                'CourseResult-button CourseResult-' +
                (saved ? 'unsave' : 'save')
              }
              onClick={(saved ? onUnsaveCourse : onSaveCourse).bind(
                null,
                course._id
              )}
            >
              <FaStar />
            </button>
            <button
              className={
                'CourseResult-button CourseResult-' +
                (inSchedule ? 'remove' : 'add')
              }
              onClick={(inSchedule
                ? onRemoveCourseFromSchedule
                : onAddCourseToSchedule).bind(null, course._id)}
            >
              {inSchedule ? <FaMinus /> : <FaPlus />}
            </button>
          </div>}
      </li>
    );
  }
}

export default CourseResult;
