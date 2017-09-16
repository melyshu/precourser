import React, { Component } from 'react';
import FaSearch from 'react-icons/lib/fa/search';
import FaUser from 'react-icons/lib/fa/user';
import FaStar from 'react-icons/lib/fa/star';
import FaCalendar from 'react-icons/lib/fa/calendar';
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc';
import FaSortAlphaDesc from 'react-icons/lib/fa/sort-alpha-desc';
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc';
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc';
import FaSortNumericAsc from 'react-icons/lib/fa/sort-numeric-asc';
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
    const now = this.props.now;
    const colorLookup = this.props.colorLookup;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
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
    const tabDescriptions = [
      'Course search',
      'Instructor search',
      'Saved courses',
      'Courses in schedule'
    ];
    const sortLabels = [
      [
        [<FaSortAmountAsc />, <FaSortAmountDesc />],
        [<FaSortAlphaAsc />, <FaSortAlphaDesc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ],
      [
        [<FaSortAlphaAsc />, <FaSortAlphaDesc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ],
      [
        [<FaSortAmountAsc />, <FaSortAmountDesc />],
        [<FaSortAlphaAsc />, <FaSortAlphaDesc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ],
      [
        [<FaSortAmountAsc />, <FaSortAmountDesc />],
        [<FaSortAlphaAsc />, <FaSortAlphaDesc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ]
    ];
    const sortDescriptions = [
      ['Sort by department code', 'Sort by title', 'Sort by rating'],
      ['Sort by name', 'Sort by rating'],
      ['Sort by department code', 'Sort by title', 'Sort by rating'],
      ['Sort by department code', 'Sort by title', 'Sort by rating']
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

    // s is sign in sorting functions

    const courseSortDepartmentCode = (s, a, b) => {
      const codeA = a.department + a.catalogNumber;
      const codeB = b.department + b.catalogNumber;

      return s * ((codeA > codeB) - (codeB > codeA));
    };

    const courseSortTitle = (s, a, b) => {
      return s * ((a.title > b.title) - (b.title > a.title));
    };

    const courseSortRating = (s, a, b) => {
      if (!a.rating && !b.rating) {
        if (!a.new && !b.new) return courseSortDepartmentCode(1, a, b);
        if (!a.new) return 1;
        if (!b.new) return -1;
        return courseSortDepartmentCode(1, a, b);
      }
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      return (
        s * (b.rating.score - a.rating.score) ||
        courseSortDepartmentCode(1, a, b)
      );
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

    const instructorSortName = (s, a, b) => {
      return s * ((a.fullName > b.fullName) - (b.fullName - a.fullName));
    };

    const instructorSortRating = (s, a, b) => {
      const ratingA = getInstructorRating(a);
      const ratingB = getInstructorRating(b);
      if (!ratingA.score && !ratingB.score) {
        if (!ratingA.new && !ratingB.new) return instructorSortName(1, a, b);
        if (!ratingA.new) return 1;
        if (!ratingB.new) return -1;
        return instructorSortName(1, a, b);
      }
      if (!ratingA.score) return 1;
      if (!ratingB.score) return -1;
      return s * (ratingB.score - ratingA.score) || instructorSortName(1, a, b);
    };

    const courseLists = [
      searchedCourses,
      null,
      user.savedCourses.filter(course => course.semester === selectedSemester),
      selectedSchedule.courses
    ];
    const renderContent = (tab, sort, sign) => {
      if (tab === 1) {
        return searchedInstructors
          .slice()
          .sort(
            (sort ? instructorSortRating : instructorSortName).bind(null, sign)
          )
          .map(instructor =>
            <InstructorResult
              selectedSemester={selectedSemester}
              user={user}
              selectedSchedule={selectedSchedule}
              selectedCourse={selectedCourse}
              now={now}
              semesterLookup={semesterLookup}
              colorLookup={colorLookup}
              distributionLookup={distributionLookup}
              pdfLookup={pdfLookup}
              auditLookup={auditLookup}
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
          (sort === 2
            ? courseSortRating
            : sort ? courseSortTitle : courseSortDepartmentCode).bind(
            null,
            sign
          )
        )
        .map(course =>
          <CourseResult
            selectedSemester={selectedSemester}
            user={user}
            selectedSchedule={selectedSchedule}
            selectedCourse={selectedCourse}
            now={now}
            semesterLookup={semesterLookup}
            colorLookup={colorLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
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
        tabDescriptions={tabDescriptions}
        sortLabels={sortLabels}
        sortDescriptions={sortDescriptions}
        renderInput={renderInput}
        renderSpinner={renderSpinner}
        renderContent={renderContent}
        captionNouns={captionNouns}
      />
    );
  }
}

export default MenuPane;
