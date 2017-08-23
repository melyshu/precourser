import React, { Component } from 'react';
import './CourseResult.css';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaStar from 'react-icons/lib/fa/star';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';

class CourseResult extends Component {
  render() {
    const course = this.props.course;

    const top = [];
    top.push(
      <span className="CourseResult-listing">
        {course.department + course.catalogNumber}
      </span>
    );

    if (course.crossListings.length) {
      let crossListings = '';
      for (let i = 0; i < course.crossListings.length; i++) {
        const crossListing = course.crossListings[i];
        crossListings +=
          ' / ' + crossListing.department + crossListing.catalogNumber;
      }
      top.push(
        <span className="CourseResult-crosslistings">
          {crossListings}
        </span>
      );
    }

    if (course.distribution) {
      top.push(
        <span className="CourseResult-distribution">
          {course.distribution}
        </span>
      );
    }

    if (course.pdf) {
      const className =
        course.pdf === 'PDF'
          ? 'CourseResult-success'
          : course.pdf === 'PDFO'
            ? 'CourseResult-warning'
            : 'CourseResult-danger';
      top.push(
        <span className={className}>
          {course.pdf}
        </span>
      );
    }

    if (course.audit) {
      const className =
        course.audit === 'AUDIT'
          ? 'CourseResult-success'
          : 'CourseResult-danger';
      top.push(
        <span className={className}>
          {course.audit}
        </span>
      );
    }

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

    return (
      <li
        className="CourseResult"
        onMouseOver={this.props.onMouseOverCourse.bind(null, course)}
        onMouseOut={this.props.onMouseOutCourse.bind(null, course)}
      >
        <div className="CourseResult-main">
          <div className="CourseResult-top">
            {top}
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
