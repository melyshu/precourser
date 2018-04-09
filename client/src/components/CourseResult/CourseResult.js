import React, { Component } from 'react';
import FaStar from 'react-icons/lib/fa/star';
import FaInfoCircle from 'react-icons/lib/fa/info-circle';
import FaClose from 'react-icons/lib/fa/close';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';
import CourseSummary from '../CourseSummary/CourseSummary';
import ColorPicker from '../ColorPicker/ColorPicker';
import './CourseResult.css';

class CourseResult extends Component {
  render() {
    const selectedSemester = this.props.selectedSemester; // if showButtons is enabled
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule; // if showButtons is enabled
    const selectedCourse = this.props.selectedCourse;
    const colors = this.props.colors;
    const now = this.props.now;
    const departmentLookup = this.props.departmentLookup;
    const semesterLookup = this.props.semesterLookup;
    const colorLookup = this.props.colorLookup; // if showButtons is enabled
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const onSelectCourse = this.props.onSelectCourse;

    // handlers below are only required if showButtons is enabled
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;
    const onMouseOverCourse = this.props.onMouseOverCourse;
    const onMouseOutCourse = this.props.onMouseOutCourse;
    const onChangeCourseColorInSchedule = this.props
      .onChangeCourseColorInSchedule;

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

    const validButton = showButtons && course.semester === selectedSemester;

    return (
      <li
        className={'CourseResult' + (selected ? ' CourseResult-selected' : '')}
        onClick={(showButtons && selected
          ? onUnselectCourse
          : onSelectCourse).bind(null, course._id)}
        onMouseOver={validButton ? onMouseOverCourse.bind(null, course) : null}
        onMouseOut={validButton ? onMouseOutCourse.bind(null, course) : null}
      >
        {showButtons
          ? <ColorPicker
              colors={colors}
              colorLookup={colorLookup}
              onChangeCourseColorInSchedule={onChangeCourseColorInSchedule}
              course={course}
              color={color}
            />
          : null}
        <div className="CourseResult-main">
          <CourseSummary
            user={user}
            now={now}
            departmentLookup={departmentLookup}
            semesterLookup={semesterLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
            course={course}
            showInstructors={showInstructors}
            showStrictRatings={showStrictRatings}
            showSemester={showSemester}
          />
        </div>
        {showButtons
          ? <button
              title={
                selected ? 'Hide course information' : 'Show course information'
              }
              className={
                'CourseResult-button CourseResult-' +
                (selected ? 'unselect' : 'select')
              }
              onClick={e => {
                (selected ? onUnselectCourse : onSelectCourse)(course._id);
                e.stopPropagation();
              }}
            >
              {selected ? <FaClose /> : <FaInfoCircle />}
            </button>
          : null}
        {validButton
          ? <button
              title={
                inSchedule
                  ? 'Remove course from schedule'
                  : 'Add course to schedule'
              }
              className={
                'CourseResult-button CourseResult-' +
                (inSchedule ? 'remove' : 'add')
              }
              onClick={e => {
                (inSchedule
                  ? onRemoveCourseFromSchedule
                  : onAddCourseToSchedule)(course._id);
                e.stopPropagation();
              }}
            >
              {inSchedule ? <FaMinus /> : <FaPlus />}
            </button>
          : null}
        {showButtons
          ? <button
              title={saved ? 'Unsave course' : 'Save course'}
              className={
                'CourseResult-button CourseResult-' +
                (saved ? 'unsave' : 'save')
              }
              onClick={e => {
                (saved ? onUnsaveCourse : onSaveCourse)(course._id);
                e.stopPropagation();
              }}
            >
              <FaStar />
            </button>
          : null}
      </li>
    );
  }
}

export default CourseResult;
