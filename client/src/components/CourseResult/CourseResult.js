import React, { Component } from 'react';
import './CourseResult.css';
import FaClose from 'react-icons/lib/fa/close';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaStar from 'react-icons/lib/fa/star';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';
import CourseSummary from '../CourseSummary/CourseSummary';
//import FaCalendarO from 'react-icons/lib/fa/calendar-o';

class CourseResult extends Component {
  render() {
    const selectedSemester = this.props.selectedSemester; // if showButtons is enabled
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule; // if showButtons is enabled
    const selectedCourse = this.props.selectedCourse;
    const semesterLookup = this.props.semesterLookup;
    const colorLookup = this.props.colorLookup; // if showButtons is enabled
    const onSelectCourse = this.props.onSelectCourse;

    // handlers below are only required if showButtons is enabled
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;
    const onMouseOverCourse = this.props.onMouseOverCourse;
    const onMouseOutCourse = this.props.onMouseOutCourse;

    const course = this.props.course;
    const showButtons = this.props.showButtons;
    const showInstructors = this.props.showInstructors;
    const showStrictRatings = this.props.showStrictRatings;
    const showSemester = this.props.showSemester;

    let inSchedule = false;
    if (showButtons) {
      for (let i = 0; i < selectedSchedule.courses.length; i++) {
        inSchedule |= selectedSchedule.courses[i]._id === course._id;
      }
    }

    let saved = false;
    for (let i = 0; i < user.savedCourses.length; i++) {
      saved |= user.savedCourses[i]._id === course._id;
    }

    const selected = selectedCourse && course._id === selectedCourse._id;

    const color = colorLookup && colorLookup[course._id];

    const validButtons = showButtons && course.semester === selectedSemester;

    return (
      <li
        className={
          'CourseResult' +
          (showButtons ? '' : ' CourseResult-clickable') +
          (selected ? ' CourseResult-selected' : '')
        }
        onClick={showButtons ? null : onSelectCourse.bind(null, course._id)}
        onMouseOver={validButtons ? onMouseOverCourse.bind(null, course) : null}
        onMouseOut={validButtons ? onMouseOutCourse.bind(null, course) : null}
      >
        <div
          className={
            'CourseResult-main' + (color ? ' CourseResult-' + color : '')
          }
        >
          <CourseSummary
            user={user}
            semesterLookup={semesterLookup}
            course={course}
            showInstructors={showInstructors}
            showStrictRatings={showStrictRatings}
            showSemester={showSemester}
          />
        </div>
        {showButtons
          ? <div className="CourseResult-buttons">
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
                {selected ? <FaClose /> : <FaInfoCircle />}
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
              {validButtons
                ? <button
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
                : null}
            </div>
          : null}
      </li>
    );
  }
}

export default CourseResult;
