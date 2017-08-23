import React, { Component } from 'react';
import './DisplayCourse.css';

class DisplayCourse extends Component {
  render() {
    const course = this.props.selectedCourse;

    let listings = course.department + course.catalogNumber;
    for (let i = 0; i < course.crossListings.length; i++) {
      const crossListing = course.crossListings[i];
      listings += '/' + crossListing.department + crossListing.catalogNumber;
    }

    return (
      <div className="DisplayCourse">
        <div className="DisplayCourse-title">
          {listings + ' ' + course.title}
        </div>
        <div className="DisplayCourse-description">
          {course.description}
        </div>
      </div>
    );
  }
}

export default DisplayCourse;
