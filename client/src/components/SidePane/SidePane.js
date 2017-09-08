import React, { Component } from 'react';
import FaHistory from 'react-icons/lib/fa/history';
import FaUser from 'react-icons/lib/fa/user';
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc';
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc';
import FaSortNumericDesc from 'react-icons/lib/fa/sort-numeric-desc';
import SideMenu from '../SideMenu/SideMenu';
import CourseResult from '../CourseResult/CourseResult';
import InstructorResult from '../InstructorResult/InstructorResult';
import './SidePane.css';

class SidePane extends Component {
  render() {
    const user = this.props.user;
    const selectedCourse = this.props.selectedCourse;
    const onSelectCourse = this.props.onSelectCourse;
    const semesterLookup = this.props.semesterLookup;

    const buttons = this.props.buttons;

    const tabLabels = [<FaHistory />, <FaUser />];
    const sortLabels = [
      [<FaSortAmountDesc />, <FaSortNumericDesc />],
      [<FaSortAlphaAsc />, <FaSortNumericDesc />]
    ];
    const captionNouns = ['Semester', 'Instructor'];

    const renderInput = tab => {
      return;
    };

    const renderSpinner = tab => {
      return false;
    };

    const courseSortSemester = (a, b) => {
      return (b.semester > a.semester) - (a.semester > b.semester);
    };

    const courseSortRating = (a, b) => {
      if (!a.rating && !b.rating) {
        if (!a.new && !b.new) return courseSortSemester(a, b);
        if (!a.new) return 1;
        if (!b.new) return -1;
        return courseSortSemester(a, b);
      }
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      return b.rating.score - a.rating.score || courseSortSemester(a, b);
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

    const renderContent = (tab, sort) => {
      if (!tab) {
        return selectedCourse.courses
          .slice()
          .sort(sort ? courseSortRating : courseSortSemester)
          .map(course =>
            <CourseResult
              user={user}
              selectedCourse={selectedCourse}
              semesterLookup={semesterLookup}
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
        .sort(sort ? instructorSortRating : instructorSortName)
        .map(instructor =>
          <InstructorResult
            user={user}
            selectedCourse={selectedCourse}
            semesterLookup={semesterLookup}
            onSelectCourse={onSelectCourse}
            key={instructor._id}
            instructor={instructor}
            showButtons={false}
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
        buttons={buttons}
      />
    );
  }
}

export default SidePane;
