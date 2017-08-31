import React, { Component } from 'react';
import './CourseSummary.css';
import FaStar from 'react-icons/lib/fa/star';
import CourseRating from '../CourseRating/CourseRating';

class CourseSummary extends Component {
  render() {
    const savedCourses = this.props.savedCourses;
    const course = this.props.course;
    const isSemester = this.props.isSemester;
    const inInstructor = this.props.inInstructor;
    const semesters = this.props.semesters;

    let saved = false;
    for (let i = 0; i < savedCourses.length; i++) {
      saved |= savedCourses[i]._id === course._id;
    }

    return (
      <div className="CourseSummary">
        <div className="CourseSummary-top">
          <span className="CourseSummary-listing">
            {isSemester
              ? semesters[course.semester].name
              : course.department + course.catalogNumber}
          </span>
          {isSemester
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
          {inInstructor &&
            <span className="CourseSummary-semester">
              {semesters[course.semester].name}
            </span>}
          {saved
            ? <span className="CourseSummary-saved">
                <FaStar />
              </span>
            : null}
        </div>
        <div className="CourseSummary-middle">
          <span className="CourseSummary-title">
            {isSemester
              ? course.instructors
                  .map(instructor => instructor.fullName)
                  .join(', ')
              : course.title}
          </span>
        </div>
        <div className="CourseSummary-bottom">
          <CourseRating score={course.rating} new={course.new} />
          <span className="CourseSummary-stretch" />
          <span className="CourseSummary-seats">
            {(course.seatsTaken >= 0 ? course.seatsTaken : '-') +
              ' / ' +
              (course.seatsTotal >= 0 ? course.seatsTotal : '-')}
          </span>
        </div>
      </div>
    );
  }
}

export default CourseSummary;
