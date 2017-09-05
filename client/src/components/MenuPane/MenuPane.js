import React, { Component } from 'react';
import FaSearch from 'react-icons/lib/fa/search';
import FaUser from 'react-icons/lib/fa/user';
import FaStar from 'react-icons/lib/fa/star';
import FaCalendar from 'react-icons/lib/fa/calendar';
import SideMenu from '../SideMenu/SideMenu';
import CourseResult from '../CourseResult/CourseResult';
import InstructorResult from '../InstructorResult/InstructorResult';
import './MenuPane.css';

class MenuPane extends Component {
  render() {
    const selectedSemester = this.props.selectedSemester;
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule;
    const courseSearch = this.props.courseSearch;
    const loadingCourseSearch = this.props.loadingCourseSearch;
    const searchedCourses = this.props.searchedCourses;
    const selectedCourse = this.props.selectedCourse;
    const instructorSearch = this.props.instructorSearch;
    const loadingInstructorSearch = this.props.loadingInstructorSearch;
    const searchedInstructors = this.props.searchedInstructors;
    const colorLookup = this.props.colorLookup;
    const semesterLookup = this.props.semesterLookup;
    const onChangeCourseSearch = this.props.onChangeCourseSearch;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;
    const onChangeInstructorSearch = this.props.onChangeInstructorSearch;
    const onMouseOverCourse = this.props.onMouseOverCourse;
    const onMouseOutCourse = this.props.onMouseOutCourse;

    const tabLabels = [<FaSearch />, <FaUser />, <FaStar />, <FaCalendar />];
    const captionNouns = [
      'Course',
      'Instructor',
      'Saved Course',
      'Selected Course'
    ];

    const renderInput = tab => {
      if (tab > 1) return;
      return (
        <input
          className="SideMenu-input"
          type="text"
          value={tab ? instructorSearch : courseSearch}
          onChange={tab ? onChangeInstructorSearch : onChangeCourseSearch}
          placeholder="search"
        />
      );
    };

    const renderSpinner = tab => {
      return (
        (tab === 0 && loadingCourseSearch) ||
        (tab === 1 && loadingInstructorSearch)
      );
    };

    const courseLists = [
      searchedCourses,
      null,
      user.savedCourses.filter(course => course.semester === selectedSemester),
      selectedSchedule.courses
    ];
    const renderContent = tab => {
      if (tab === 1) {
        return searchedInstructors.map(instructor =>
          <InstructorResult
            selectedSemester={selectedSemester}
            user={user}
            selectedSchedule={selectedSchedule}
            selectedCourse={selectedCourse}
            semesterLookup={semesterLookup}
            colorLookup={colorLookup}
            onSelectCourse={onSelectCourse}
            onUnselectCourse={onUnselectCourse}
            onSaveCourse={onSaveCourse}
            onUnsaveCourse={onUnsaveCourse}
            onAddCourseToSchedule={onAddCourseToSchedule}
            onRemoveCourseFromSchedule={onRemoveCourseFromSchedule}
            onMouseOverCourse={onMouseOverCourse}
            onMouseOutCourse={onMouseOutCourse}
            key={instructor._id}
            instructor={instructor}
            showButtons={true}
          />
        );
      }

      const courses = courseLists[tab];

      return courses.map(course =>
        <CourseResult
          selectedSemester={selectedSemester}
          user={user}
          selectedSchedule={selectedSchedule}
          selectedCourse={selectedCourse}
          semesterLookup={semesterLookup}
          colorLookup={colorLookup}
          onSelectCourse={onSelectCourse}
          onUnselectCourse={onUnselectCourse}
          onSaveCourse={onSaveCourse}
          onUnsaveCourse={onUnsaveCourse}
          onAddCourseToSchedule={onAddCourseToSchedule}
          onRemoveCourseFromSchedule={onRemoveCourseFromSchedule}
          onMouseOverCourse={onMouseOverCourse}
          onMouseOutCourse={onMouseOutCourse}
          key={course._id}
          course={course}
          showButtons={true}
          showInstructors={false}
          showStrictRatings={false}
          showSemester={false}
        />
      );
    };

    return (
      <SideMenu
        tabLabels={tabLabels}
        renderInput={renderInput}
        renderSpinner={renderSpinner}
        renderContent={renderContent}
        captionNouns={captionNouns}
      />
    );
  }
}

export default MenuPane;
