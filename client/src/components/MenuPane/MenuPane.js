import React, { Component } from 'react';
import FaSearch from 'react-icons/lib/fa/search';
import FaUser from 'react-icons/lib/fa/user';
import FaStar from 'react-icons/lib/fa/star';
import FaCalendar from 'react-icons/lib/fa/calendar';
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc';
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc';
import FaSortNumericDesc from 'react-icons/lib/fa/sort-numeric-desc';
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
    const sortLabels = [
      [<FaSortAmountAsc />, <FaSortAlphaAsc />, <FaSortNumericDesc />],
      [<FaSortAlphaAsc />, <FaSortNumericDesc />],
      [<FaSortAmountAsc />, <FaSortAlphaAsc />, <FaSortNumericDesc />],
      [<FaSortAmountAsc />, <FaSortAlphaAsc />, <FaSortNumericDesc />]
    ];
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

    const courseSortDepartmentCode = (a, b) => {
      const codeA = a.department + a.catalogNumber;
      const codeB = b.department + b.catalogNumber;

      return (codeA > codeB) - (codeB > codeA);
    };

    const courseSortTitle = (a, b) => {
      return (a.title > b.title) - (b.title > a.title);
    };

    const courseSortRating = (a, b) => {
      if (!a.rating && !b.rating) {
        if (!a.new && !b.new) return courseSortDepartmentCode(a, b);
        if (!a.new) return 1;
        if (!b.new) return -1;
        return courseSortDepartmentCode(a, b);
      }
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      return b.rating.score - a.rating.score || courseSortDepartmentCode(a, b);
    };

    const getInstructorRating = instructor => {
      let scoreSum = 0;
      let scoreCount = 0;
      for (let i = 0; i < instructor.courses.length; i++) {
        const course = instructor.courses[i];

        if (course.rating && course.rating.semester === course.semester) {
          scoreCount++;
          scoreSum += course.rating.score;
        }
      }
      const score = scoreCount ? scoreSum / scoreCount : null;
      const _new = instructor.courses.length === 0;

      return {
        score: score,
        new: _new
      };
    };

    const instructorSortName = (a, b) => {
      return (a.fullName > b.fullName) - (b.fullName - a.fullName);
    };

    const instructorSortRating = (a, b) => {
      const ratingA = getInstructorRating(a);
      const ratingB = getInstructorRating(b);
      if (!ratingA.score && !ratingB.score) {
        if (!ratingA.new && !ratingB.new) return instructorSortName(a, b);
        if (!ratingA.new) return 1;
        if (!ratingB.new) return -1;
        return instructorSortName(a, b);
      }
      if (!ratingA.score) return 1;
      if (!ratingB.score) return -1;
      return ratingB.score - ratingA.score || instructorSortName(a, b);
    };

    const courseLists = [
      searchedCourses,
      null,
      user.savedCourses.filter(course => course.semester === selectedSemester),
      selectedSchedule.courses
    ];
    const renderContent = (tab, sort) => {
      if (tab === 1) {
        return searchedInstructors
          .slice()
          .sort(sort ? instructorSortRating : instructorSortName)
          .map(instructor =>
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

      return courses
        .slice()
        .sort(
          sort === 2
            ? courseSortRating
            : sort ? courseSortTitle : courseSortDepartmentCode
        )
        .map(course =>
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
        sortLabels={sortLabels}
        renderInput={renderInput}
        renderSpinner={renderSpinner}
        renderContent={renderContent}
        captionNouns={captionNouns}
      />
    );
  }
}

export default MenuPane;
