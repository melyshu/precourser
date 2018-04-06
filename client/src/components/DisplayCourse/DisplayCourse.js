import React, { Component } from 'react';
import ReactGA from 'react-ga';
import FaStar from 'react-icons/lib/fa/star';
import FaClose from 'react-icons/lib/fa/close';
import FaListAlt from 'react-icons/lib/fa/list-alt';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
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
    const departmentLookup = this.props.departmentLookup;
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
              departmentLookup={departmentLookup}
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
            <ReactGA.OutboundLink
              className="DisplayCourse-button"
              title="Registrar course information page"
              eventLabel="Clicked registrar course information page"
              to={`https://registrar.princeton.edu/course-offerings/course_details.xml?courseid=${selectedCourse.systemId}&term=${selectedCourse.semester}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaListAlt />
            </ReactGA.OutboundLink>
            <ReactGA.OutboundLink
              className="DisplayCourse-button"
              title="Registrar course evaluation page"
              eventLabel="Clicked registrar course evaluation page"
              to={`https://reg-captiva.princeton.edu/chart/index.php?terminfo=${selectedCourse.semester}&courseinfo=${selectedCourse.systemId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaBarChart />
            </ReactGA.OutboundLink>
            {selectedCourse.website
              ? <ReactGA.OutboundLink
                  className="DisplayCourse-button"
                  title="Course website"
                  eventLabel="Clicked course website"
                  to={selectedCourse.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaHome />
                </ReactGA.OutboundLink>
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
          departmentLookup={departmentLookup}
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
