import React, { Component } from 'react';
import FaStar from 'react-icons/lib/fa/star';
import FaClose from 'react-icons/lib/fa/close';
import CourseSummary from '../CourseSummary/CourseSummary';
import DisplayCourseDetails from '../DisplayCourseDetails/DisplayCourseDetails';
import SidePane from '../SidePane/SidePane';
import './DisplayCourse.css';

class DisplayCourse extends Component {
  render() {
    const user = this.props.user;
    const selectedCourse = this.props.selectedCourse;
    const semesterLookup = this.props.semesterLookup;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;

    let saved = false;
    for (let i = 0; i < user.savedCourses.length; i++) {
      saved |= user.savedCourses[i]._id === selectedCourse._id;
    }

    return (
      <div className="DisplayCourse">
        <div className="DisplayCourse-body">
          <div className="DisplayCourse-summary">
            <CourseSummary
              user={user}
              semesterLookup={semesterLookup}
              course={selectedCourse}
              showInstructors={false}
              showStrictRatings={false}
              showSemester={true}
            />
          </div>
          <div className="DisplayCourse-content">
            <DisplayCourseDetails
              selectedCourse={selectedCourse}
              semesterLookup={semesterLookup}
            />
          </div>
        </div>
        <SidePane
          user={user}
          selectedCourse={selectedCourse}
          semesterLookup={semesterLookup}
          onSelectCourse={onSelectCourse}
          buttons={[
            <button
              key="save"
              className={
                'SideMenu-button ' +
                (saved ? 'SideMenu-unsave' : 'SideMenu-save')
              }
              onClick={(saved ? onUnsaveCourse : onSaveCourse).bind(
                null,
                selectedCourse._id
              )}
            >
              <FaStar />
            </button>,
            <button
              key="close"
              className="SideMenu-button SideMenu-close"
              onClick={onUnselectCourse.bind(null, selectedCourse._id)}
            >
              <FaClose />
            </button>
          ]}
        />
      </div>
    );
  }
}

export default DisplayCourse;
