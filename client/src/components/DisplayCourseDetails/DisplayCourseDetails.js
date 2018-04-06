import React, { Component } from 'react';
import CourseRating from '../CourseRating/CourseRating';
import './DisplayCourseDetails.css';

class DisplayCourseDetails extends Component {
  renderBanner(banner) {
    if (!banner) return;
    return (
      <div className="DisplayCourseDetails-field DisplayCourseDetails-banner">
        {banner}
      </div>
    );
  }

  renderReservedSeats(reservedSeats) {
    if (!reservedSeats || !reservedSeats.length) return;
    return (
      <div className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">Reserved Seats</div>
        <ul className="DisplayCourseDetails-field-content">
          {reservedSeats.map(reservedSeat =>
            <li
              key={reservedSeat}
              className="DisplayCourseDetails-reserved-seat"
            >
              {reservedSeat}
            </li>
          )}
        </ul>
      </div>
    );
  }

  renderGrading(grading) {
    if (!grading || !grading.length) return;

    grading = grading.slice().sort((i1, i2) => i2.percent - i1.percent);

    return (
      <div className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">Grading</div>
        <table className="DisplayCourseDetails-field-content">
          <tbody>
            {grading.map(item =>
              <tr key={item.component} className="DisplayCourseDetails-grading">
                <td className="DisplayCourseDetails-grading-percent">
                  {item.percent}
                </td>
                <td className="DisplayCourseDetails-grading-component">
                  {item.component}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  renderReadings(readings) {
    if (!readings || !readings.length) return;
    return (
      <div className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">Readings</div>
        <ul className="DisplayCourseDetails-field-content">
          {readings.map(reading =>
            <li key={reading.title} className="DisplayCourseDetails-reading">
              <div className="DisplayCourseDetails-reading-title">
                {reading.title}
              </div>
              <div className="DisplayCourseDetails-reading-author">
                {reading.author}
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }

  renderText(heading, text) {
    if (!text) return;

    return (
      <div className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">
          {heading}
        </div>
        <p className="DisplayCourseDetails-field-content">
          {text}
        </p>
      </div>
    );
  }

  renderNumericEvaluations(evaluations, semesterLookup) {
    return evaluations.semester &&
    evaluations.numeric &&
    evaluations.written &&
    Object.keys(evaluations.numeric).length
      ? <div key="numeric" className="DisplayCourseDetails-field">
          <div className="DisplayCourseDetails-field-title">
            {'Numeric Evaluations from ' +
              semesterLookup[evaluations.semester].name}
          </div>
          <ul className="DisplayCourseDetails-field-content">
            {evaluations.numeric
              .slice()
              .sort((i1, i2) => i2.score - i1.score)
              .map(item =>
                <li
                  key={item.field}
                  className="DisplayCourseDetails-evaluations-numeric"
                >
                  <CourseRating score={item.score} />
                  <span className="DisplayCourseDetails-evaluations-field">
                    {item.field}
                  </span>
                </li>
              )}
          </ul>
        </div>
      : null;
  }

  renderWrittenEvaluations(evaluations, semesterLookup) {
    return (
      <div key="written" className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">
          {evaluations.semester &&
          evaluations.numeric &&
          evaluations.written &&
          Object.keys(evaluations.numeric).length
            ? evaluations.written.length +
              ' Comments from ' +
              semesterLookup[evaluations.semester].name
            : 'No Course Evaluations Available'}
        </div>
        {evaluations.semester &&
        evaluations.numeric &&
        evaluations.written &&
        Object.keys(evaluations.numeric).length
          ? <ul className="DisplayCourseDetails-field-content">
              {evaluations.written.map(item =>
                <li
                  key={item}
                  className="DisplayCourseDetails-evaluations-written"
                >
                  {item}
                </li>
              )}
            </ul>
          : null}
      </div>
    );
  }

  render() {
    const selectedCourse = this.props.selectedCourse;
    const semesterLookup = this.props.semesterLookup;

    return (
      <div className="DisplayCourseDetails">
        {this.renderBanner(selectedCourse.banner)}
        {this.renderText('Description', selectedCourse.description)}
        {this.renderNumericEvaluations(
          selectedCourse.evaluations,
          semesterLookup
        )}
        {this.renderGrading(selectedCourse.grading)}
        {this.renderText('Assignments', selectedCourse.assignments)}
        {this.renderText('Prerequisites', selectedCourse.prerequisites)}
        {this.renderText(
          'Equivalent Courses',
          selectedCourse.equivalentCourses
        )}
        {this.renderText('Other Information', selectedCourse.otherInformation)}
        {this.renderText(
          'Other Requirements',
          selectedCourse.otherRequirements
        )}
        {this.renderReservedSeats(selectedCourse.reservedSeats)}
        {this.renderReadings(selectedCourse.readings)}
        {this.renderWrittenEvaluations(
          selectedCourse.evaluations,
          semesterLookup
        )}
      </div>
    );
  }
}

export default DisplayCourseDetails;
