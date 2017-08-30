import React, { Component } from 'react';
import './DisplayCourseEvaluations.css';
import CourseRating from '../CourseRating/CourseRating';

class DisplayCourseEvaluations extends Component {
  render() {
    const selectedCourse = this.props.selectedCourse;

    return (
      <div className="DisplayCourseEvaluations">
        <div className="DisplayCourseEvaluations-section">
          <div className="DisplayCourseEvaluations-title">
            {selectedCourse.evaluations.description}
          </div>
          <table className="DisplayCourseEvaluations-content">
            <tbody>
              {selectedCourse.evaluations.numeric.map(item =>
                <tr
                  key={item.field}
                  className="DisplayCourseEvaluations-numeric"
                >
                  <td className="DisplayCourseEvaluations-score">
                    <CourseRating score={item.score} />
                  </td>
                  <td className="DisplayCourseEvaluations-field">
                    {item.field}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="DisplayCourseEvaluations-section">
          <div className="DisplayCourseEvaluations-title">Comments</div>
          <ul className="DisplayCourseEvaluations-content">
            {selectedCourse.evaluations.written.map(item =>
              <li key={item} className="DisplayCourseEvaluations-written">
                {item}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default DisplayCourseEvaluations;
