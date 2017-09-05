import React, { Component } from 'react';
import FaHistory from 'react-icons/lib/fa/history';
import FaUser from 'react-icons/lib/fa/user';
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
    const captionNouns = ['Semester', 'Instructor'];

    const renderInput = tab => {
      return;
    };

    const renderSpinner = tab => {
      return false;
    };

    const renderContent = tab => {
      switch (tab) {
        case 0:
          return selectedCourse.courses.map(course =>
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
        case 1:
          return selectedCourse.instructors.map(instructor =>
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
        default:
          return;
      }
    };

    return (
      <SideMenu
        tabLabels={tabLabels}
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
