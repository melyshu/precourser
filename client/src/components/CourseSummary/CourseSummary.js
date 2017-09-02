import React, { Component } from 'react';
import './CourseSummary.css';
import FaStar from 'react-icons/lib/fa/star';
import CourseRating from '../CourseRating/CourseRating';

class CourseSummary extends Component {
  render() {
    const user = this.props.user;
    const semesterLookup = this.props.semesterLookup;
    const course = this.props.course;
    const showInstructors = this.props.showInstructors;
    const showStrictRatings = this.props.showStrictRatings;
    const showSemester = this.props.showSemester;

    let saved = false;
    for (let i = 0; i < user.savedCourses.length; i++) {
      saved |= user.savedCourses[i]._id === course._id;
    }

    return (
      <div className="CourseSummary">
        <div className="CourseSummary-top">
          <span className="CourseSummary-listing">
            {showInstructors
              ? semesterLookup[course.semester].name
              : course.department + course.catalogNumber}
          </span>
          {showInstructors
            ? null
            : <span className="CourseSummary-crosslistings">
                {course.crossListings.map(crossListing =>
                  <span
                    key={crossListing.department}
                    className="CourseSummary-crosslisting"
                  >
                    {'/ ' +
                      crossListing.department +
                      crossListing.catalogNumber}
                  </span>
                )}
              </span>}
          {course.distribution
            ? <span className="CourseSummary-distribution">
                {course.distribution}
              </span>
            : null}
          {course.pdf
            ? <span className={'CourseSummary-' + course.pdf.toLowerCase()}>
                {course.pdf}
              </span>
            : null}
          {course.audit
            ? <span className={'CourseSummary-' + course.audit.toLowerCase()}>
                {course.audit.slice(0, -4)}
              </span>
            : null}
          <span className="CourseSummary-stretch" />
          {showSemester
            ? <span className="CourseSummary-semester">
                {semesterLookup[course.semester].name}
              </span>
            : null}
          {saved
            ? <span className="CourseSummary-saved">
                <FaStar />
              </span>
            : null}
        </div>
        <div className="CourseSummary-middle">
          <span className="CourseSummary-title">
            {showInstructors
              ? course.instructors
                  .map(instructor => instructor.fullName)
                  .join(', ')
              : course.title}
          </span>
        </div>
        <div className="CourseSummary-bottom">
          <CourseRating
            score={
              course.rating &&
              (!showStrictRatings || course.rating.semester === course.semester)
                ? course.rating.score
                : null
            }
            new={course.new}
          />
          <span className="CourseSummary-stretch" />
          <span className="CourseSummary-seats">
            {(course.seatsTaken >= 0 ? course.seatsTaken : '\u2013') +
              ' / ' +
              (course.seatsTotal >= 0 ? course.seatsTotal : '\u2013')}
          </span>
        </div>
      </div>
    );
  }
}

export default CourseSummary;
