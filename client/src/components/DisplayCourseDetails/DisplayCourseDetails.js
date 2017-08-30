import React, { Component } from 'react';
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

  render() {
    const selectedCourse = this.props.selectedCourse;
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
      </div>
    );
  }
}

export default DisplayCourseDetails;
