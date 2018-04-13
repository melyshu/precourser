import React, { Component } from 'react';
import FaHistory from 'react-icons/lib/fa/history';
import FaUser from 'react-icons/lib/fa/user';
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc';
import FaSortAlphaDesc from 'react-icons/lib/fa/sort-alpha-desc';
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc';
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc';
import FaSortNumericAsc from 'react-icons/lib/fa/sort-numeric-asc';
import FaSortNumericDesc from 'react-icons/lib/fa/sort-numeric-desc';
import SideMenu from '../SideMenu/SideMenu';
import CourseResult from '../CourseResult/CourseResult';
import InstructorResult from '../InstructorResult/InstructorResult';
import './SidePane.css';

class SidePane extends Component {
  render() {
    const user = this.props.user;
    const selectedCourse = this.props.selectedCourse;
    const now = this.props.now;
    const departmentLookup = this.props.departmentLookup;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const onSelectCourse = this.props.onSelectCourse;

    const tabLabels = [<FaHistory />, <FaUser />];
    const tabDescriptions = ['All semesters', 'Instructors'];
    const sortLabels = [
      [
        [<FaSortAmountDesc />, <FaSortAmountAsc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ],
      [
        [<FaSortAlphaAsc />, <FaSortAlphaDesc />],
        [<FaSortNumericDesc />, <FaSortNumericAsc />]
      ]
    ];
    const sortDescriptions = [
      ['Sort by semester', 'Sort by rating'],
      ['Sort by name', 'Sort by rating']
    ];
    const captionNouns = ['Semester', 'Instructor'];

    const renderInput = tab => {
      return;
    };

    const renderIcon = tab => {
      return;
    };

    // s is sign in sorting functions

    const courseSortSemester = (s, a, b) => {
      return s * ((b.semester > a.semester) - (a.semester > b.semester));
    };

    const courseSortRating = (s, a, b) => {
      if (!a.rating && !b.rating) {
        if (!a.new && !b.new) return courseSortSemester(1, a, b);
        if (!a.new) return 1;
        if (!b.new) return -1;
        return courseSortSemester(1, a, b);
      }
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      return (
        s * (b.rating.score - a.rating.score) || courseSortSemester(1, a, b)
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
      return s * ((a.fullName > b.fullName) - (b.fullName > a.fullName));
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

    const renderContent = (tab, sort, sign) => {
      if (!tab) {
        return selectedCourse.courses
          .slice()
          .sort((sort ? courseSortRating : courseSortSemester).bind(null, sign))
          .map(course =>
            <CourseResult
              user={user}
              selectedCourse={selectedCourse}
              now={now}
              departmentLookup={departmentLookup}
              semesterLookup={semesterLookup}
              distributionLookup={distributionLookup}
              pdfLookup={pdfLookup}
              auditLookup={auditLookup}
              onSelectCourse={onSelectCourse}
              key={course._id}
              course={course}
              showButtons={false}
              showInstructors={true}
              showStrictRatings={true}
              showSemester={false}
            />
          );
      }

      return selectedCourse.instructors
        .slice()
        .sort(
          (sort ? instructorSortRating : instructorSortName).bind(null, sign)
        )
        .map(instructor =>
          <InstructorResult
            user={user}
            now={now}
            departmentLookup={departmentLookup}
            selectedCourse={selectedCourse}
            semesterLookup={semesterLookup}
            distributionLookup={distributionLookup}
            pdfLookup={pdfLookup}
            auditLookup={auditLookup}
            onSelectCourse={onSelectCourse}
            key={instructor._id}
            instructor={instructor}
            showButtons={false}
          />
        );
    };

    const renderFilter = tab => {
      return;
    };

    const keys = ['semester', 'instructor'];

    return (
      <SideMenu
        tabLabels={tabLabels}
        tabDescriptions={tabDescriptions}
        sortLabels={sortLabels}
        sortDescriptions={sortDescriptions}
        renderInput={renderInput}
        renderIcon={renderIcon}
        renderContent={renderContent}
        renderFilter={renderFilter}
        captionNouns={captionNouns}
        edge="right"
        keys={keys}
      />
    );
  }
}

export default SidePane;
