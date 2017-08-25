import React, { Component } from 'react';
import './CourseResult.css';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaStar from 'react-icons/lib/fa/star';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';
//import FaCalendarO from 'react-icons/lib/fa/calendar-o';

class CourseResult extends Component {
  render() {
    const course = this.props.course;

    const selectButtonIcon = <FaInfoCircle />;
    const selectButtonClassName = course.selected
      ? 'CourseResult-button CourseResult-unselect'
      : 'CourseResult-button CourseResult-select';
    const selectButtonHandler = course.selected
      ? this.props.onUnselectCourse
      : this.props.onSelectCourse;

    const saveButtonIcon = <FaStar />;
    const saveButtonClassName = course.saved
      ? 'CourseResult-button CourseResult-unsave'
      : 'CourseResult-button CourseResult-save';
    const saveButtonHandler = course.saved
      ? this.props.onUnsaveCourse
      : this.props.onSaveCourse;

    const scheduleButtonIcon = course.inSchedule ? <FaMinus /> : <FaPlus />;
    const scheduleButtonClassName = course.inSchedule
      ? 'CourseResult-button CourseResult-remove'
      : 'CourseResult-button CourseResult-add';
    const scheduleButtonHandler = course.inSchedule
      ? this.props.onRemoveCourseFromSchedule
      : this.props.onAddCourseToSchedule;

    const color = this.props.colors[course._id];

    const mainClassName =
      'CourseResult-main' + (color ? ' CourseResult-' + color : '');

    return (
      <li
        className="CourseResult"
        onMouseOver={this.props.onMouseOverCourse.bind(null, course)}
        onMouseOut={this.props.onMouseOutCourse.bind(null, course)}
      >
        <div className={mainClassName}>
          <div className="CourseResult-top">
            <span className="CourseResult-listing">
              {course.department + course.catalogNumber}
            </span>
            {course.crossListings.map(crossListing =>
              <span
                key={crossListing.department}
                className="CourseResult-crosslisting"
              >
                {crossListing.department + crossListing.catalogNumber}
              </span>
            )}
            {course.distribution
              ? <span className="CourseResult-distribution">
                  {course.distribution}
                </span>
              : null}
            {course.pdf
              ? <span className={'CourseResult-' + course.pdf.toLowerCase()}>
                  {course.pdf}
                </span>
              : null}
            {course.audit
              ? <span className={'CourseResult-' + course.audit.toLowerCase()}>
                  {course.audit.slice(0, -4)}
                </span>
              : null}
            <span className="CourseResult-stretch" />
            {course.saved
              ? <span className="CourseResult-saved">
                  <FaStar />
                </span>
              : null}
          </div>
          <div className="CourseResult-middle">
            <span className="CourseResult-title">
              {course.title}
            </span>
          </div>
          <div className="CourseResult-bottom">
            <span className="CourseResult-seats">
              {(course.seatsTaken >= 0 ? course.seatsTaken : '-') +
                ' / ' +
                (course.seatsTotal >= 0 ? course.seatsTotal : '-')}
            </span>
          </div>
        </div>
        <div className="CourseResult-buttons">
          <button
            className={selectButtonClassName}
            onClick={selectButtonHandler.bind(null, course._id)}
          >
            {selectButtonIcon}
          </button>
          <button
            className={saveButtonClassName}
            onClick={saveButtonHandler.bind(null, course._id)}
          >
            {saveButtonIcon}
          </button>
          <button
            className={scheduleButtonClassName}
            onClick={scheduleButtonHandler.bind(null, course._id)}
          >
            {scheduleButtonIcon}
          </button>
        </div>
      </li>
    );
  }
}

export default CourseResult;
