import React, { Component } from 'react';
import CourseRating from '../CourseRating/CourseRating';
import './DisplayCourseDetails.css';

class DisplayCourseDetails extends Component {
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

  renderEvaluations(evaluations, semesterLookup) {
    return [
      <div key="numeric" className="DisplayCourseDetails-field">
        <div className="DisplayCourseDetails-field-title">
          {evaluations.semester
            ? 'Course evaluations from ' +
              semesterLookup[evaluations.semester].name
            : 'No course evaluations available'}
        </div>
        {evaluations.semester &&
          <table className="DisplayCourseDetails-field-content">
            <tbody>
              {evaluations.numeric.map(item =>
                <tr
                  key={item.field}
                  className="DisplayCourseDetails-evaluations-numeric"
                >
                  <td className="DisplayCourseDetails-evaluations-score">
                    <CourseRating score={item.score} />
                  </td>
                  <td className="DisplayCourseDetails-evaluations-field">
                    {item.field}
                  </td>
                </tr>
              )}
            </tbody>
          </table>}
      </div>,
      evaluations.written && evaluations.written.length
        ? <div key="written" className="DisplayCourseDetails-field">
            <div className="DisplayCourseDetails-field-title">Comments</div>
            <ul className="DisplayCourseDetails-field-content">
              {evaluations.written.map(item =>
                <li
                  key={item}
                  className="DisplayCourseDetails-evaluations-written"
                >
                  {item}
                </li>
              )}
            </ul>
          </div>
        : null
    ];
  }

  render() {
    const selectedCourse = this.props.selectedCourse;
    const semesterLookup = this.props.semesterLookup;

    return (
      <div className="DisplayCourseDetails">
        {this.renderText('Description', selectedCourse.description)}
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
        {this.renderEvaluations(selectedCourse.evaluations, semesterLookup)}
      </div>
    );
  }
}

export default DisplayCourseDetails;
