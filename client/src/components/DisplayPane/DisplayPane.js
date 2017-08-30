import React, { Component } from 'react';
import './DisplayPane.css';
import DisplaySchedule from '../DisplaySchedule/DisplaySchedule';
import DisplayCourse from '../DisplayCourse/DisplayCourse';

class DisplayPane extends Component {
  render() {
    let content;
    if (this.props.selectedCourse) {
      content = (
        <DisplayCourse
          semesters={this.props.semesters}
          selectedCourse={this.props.selectedCourse}
          onSelectCourse={this.props.onSelectCourse}
          onUnselectCourse={this.props.onUnselectCourse}
          savedCourses={this.props.savedCourses}
        />
      );
    } else {
      content = (
        <DisplaySchedule
          hoveredCourse={this.props.hoveredCourse}
          hoveredSection={this.props.hoveredSection}
          selectedSchedule={this.props.selectedSchedule}
          onAddSectionToSchedule={this.props.onAddSectionToSchedule}
          onRemoveSectionFromSchedule={this.props.onRemoveSectionFromSchedule}
          onMouseOverSection={this.props.onMouseOverSection}
          onMouseOutSection={this.props.onMouseOutSection}
          colors={this.props.colors}
        />
      );
    }

    return (
      <div className="DisplayPane">
        {content}
      </div>
    );
  }
}

export default DisplayPane;
