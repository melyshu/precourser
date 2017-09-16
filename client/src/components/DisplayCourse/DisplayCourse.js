import React, { Component } from 'react';
import FaStar from 'react-icons/lib/fa/star';
import FaClose from 'react-icons/lib/fa/close';
import FaExternalLink from 'react-icons/lib/fa/external-link';
import FaHome from 'react-icons/lib/fa/home';
import CourseSummary from '../CourseSummary/CourseSummary';
import DisplayCourseDetails from '../DisplayCourseDetails/DisplayCourseDetails';
import SidePane from '../SidePane/SidePane';
import './DisplayCourse.css';

class DisplayCourse extends Component {
  render() {
    const user = this.props.user;
    const selectedCourse = this.props.selectedCourse;
    const now = this.props.now;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
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
              now={now}
              semesterLookup={semesterLookup}
              distributionLookup={distributionLookup}
              pdfLookup={pdfLookup}
              auditLookup={auditLookup}
              course={selectedCourse}
              showInstructors={false}
              showStrictRatings={false}
              showSemester={true}
            />
          </div>
          <div className="DisplayCourse-buttons">
            <button
              className="DisplayCourse-button DisplayCourse-close"
              title="Hide course information"
              onClick={onUnselectCourse.bind(null, selectedCourse._id)}
            >
              <FaClose />
            </button>
            <button
              className={
                'DisplayCourse-button ' +
                (saved ? 'DisplayCourse-unsave' : 'DisplayCourse-save')
              }
              title={saved ? 'Unsave course' : 'Save course'}
              onClick={(saved ? onUnsaveCourse : onSaveCourse).bind(
                null,
                selectedCourse._id
              )}
            >
              <FaStar />
            </button>
            <div className="DisplayCourse-stretch" />
            <a
              className="DisplayCourse-button"
              title="Registrar page"
              href={`https://registrar.princeton.edu/course-offerings/course_details.xml?courseid=${selectedCourse.systemId}&term=${selectedCourse.semester}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaExternalLink />
            </a>
            {selectedCourse.website
              ? <a
                  className="DisplayCourse-button"
                  title="Course website"
                  href={selectedCourse.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaHome />
                </a>
              : null}
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
          now={now}
          selectedCourse={selectedCourse}
          semesterLookup={semesterLookup}
          distributionLookup={distributionLookup}
          pdfLookup={pdfLookup}
          auditLookup={auditLookup}
          onSelectCourse={onSelectCourse}
        />
      </div>
    );
  }
}

export default DisplayCourse;
