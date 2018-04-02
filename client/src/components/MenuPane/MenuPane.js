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
import FaEllipsisH from 'react-icons/lib/fa/ellipsis-h';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
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
    const waitingCourseSearch = this.props.waitingCourseSearch;
    const loadingCourseSearch = this.props.loadingCourseSearch;
    const searchedCourses = this.props.searchedCourses;
    const selectedCourse = this.props.selectedCourse;
    const instructorSearch = this.props.instructorSearch;
    const waitingInstructorSearch = this.props.waitingInstructorSearch;
    const loadingInstructorSearch = this.props.loadingInstructorSearch;
    const searchedInstructors = this.props.searchedInstructors;
    const now = this.props.now;
    const departmentLookup = this.props.departmentLookup;
    const colorLookup = this.props.colorLookup;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const onChangeCourseSearch = this.props.onChangeCourseSearch;
    const onSearchCourse = this.props.onSearchCourse;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddCourseToSchedule = this.props.onAddCourseToSchedule;
    const onRemoveCourseFromSchedule = this.props.onRemoveCourseFromSchedule;
    const onChangeInstructorSearch = this.props.onChangeInstructorSearch;
    const onSearchInstructor = this.props.onSearchInstructor;
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

    const handleKeyDown = tab => {
      return event => {
        if (event.key === 'Enter') {
          if (tab === 0) onSearchCourse(courseSearch, selectedSemester);
          if (tab === 1) onSearchInstructor(instructorSearch);
        }
      };
    };

    const renderInput = tab => {
      if (tab > 1) return;
      return (
        <input
          key={tab}
          className="SideMenu-input"
          type="text"
          value={tab ? instructorSearch : courseSearch}
          onChange={tab ? onChangeInstructorSearch : onChangeCourseSearch}
          onKeyDown={handleKeyDown(tab)}
          placeholder="search"
          autoFocus={true}
          onFocus={event => {
            event.target.select();
          }}
        />
      );
    };

    const renderIcon = tab => {
      if (tab > 1) return;
      if (
        (tab === 0 && waitingCourseSearch) ||
        (tab === 1 && waitingInstructorSearch)
      ) {
        return <FaEllipsisH className="SideMenu-waiting" />;
      } else if (
        (tab === 0 && loadingCourseSearch) ||
        (tab === 1 && loadingInstructorSearch)
      ) {
        return <FaCircleONotch className="SideMenu-loading" />;
      }
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

    const instructorSortName = (s, a, b) => {
      return s * ((a.fullName > b.fullName) - (b.fullName - a.fullName));
    };

    const instructorSortRating = (s, a, b) => {
      const ratingA = a.history.rating;
      const ratingB = b.history.rating;
      if (!ratingA && !ratingB) return instructorSortName(1, a, b);
      if (!ratingA) return 1;
      if (!ratingB) return -1;
      return s * (ratingB - ratingA) || instructorSortName(1, a, b);
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
              departmentLookup={departmentLookup}
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
            departmentLookup={departmentLookup}
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
        renderIcon={renderIcon}
        renderContent={renderContent}
        captionNouns={captionNouns}
        edge="left"
      />
    );
  }
}

export default MenuPane;
