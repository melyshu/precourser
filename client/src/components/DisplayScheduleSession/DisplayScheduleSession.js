import React, { Component } from 'react';
import './DisplayScheduleSession.css';

class DisplayScheduleSession extends Component {
  render() {
    const session = this.props.session;
    const meeting = session.meeting;
    const section = session.section;
    const course = session.course;
    const selected = session.selected;
    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    const minTime = this.props.minTime;
    const maxTime = this.props.maxTime;
    const top = (startTime - minTime) / (maxTime - minTime) * 100 + '%';
    const bottom = (maxTime - endTime) / (maxTime - minTime) * 100 + '%';
    const style = {
      top: top,
      bottom: bottom,
      left: this.props.position.left,
      right: this.props.position.right
    };

    const handleClick = selected
      ? this.props.onRemoveSectionFromSchedule.bind(null, section._id)
      : this.props.onAddSectionToSchedule.bind(null, section._id);

    const sectionHovered = section._id === this.props.hoveredSection;
    const sectionTypeHovered =
      this.props.hoveredSection &&
      section._id.substring(0, 11) ===
        this.props.hoveredSection.substring(0, 11);
    const courseHovered =
      this.props.hoveredCourse && course._id === this.props.hoveredCourse._id;

    const color = this.props.colors[course._id];
    const className =
      'DisplayScheduleSession' +
      (color ? ' DisplayScheduleSession-' + color : '') +
      (selected ? ' DisplayScheduleSession-selected' : '') +
      (sectionHovered ? ' DisplayScheduleSession-section-hovered' : '') +
      (courseHovered ? ' DisplayScheduleSession-course-hovered' : '') +
      (sectionTypeHovered
        ? ' DisplayScheduleSession-section-type-hovered'
        : '');

    return (
      <div
        className={className}
        style={style}
        onClick={handleClick}
        onMouseOver={this.props.onMouseOverSection.bind(null, section._id)}
        onMouseOut={this.props.onMouseOutSection.bind(null, section._id)}
      >
        <div className="DisplayScheduleSession-top">
          <span className="DisplayScheduleSession-listing">
            {course.department + course.catalogNumber}
          </span>
          <span className="DisplayScheduleSession-section">
            {section.name}
          </span>
          <span className="DisplayScheduleSession-seats">
            {(section.seatsTaken >= 0 ? section.seatsTaken : '-') +
              '\u00a0/ ' +
              (section.seatsTotal >= 0 ? section.seatsTotal : '-')}
          </span>
        </div>
        <div className="DisplayScheduleSession-bottom">
          <span className="DisplayScheduleSession-location">
            {meeting.building && meeting.buildingNumber
              ? meeting.building + ' ' + meeting.buildingNumber
              : ''}
          </span>
        </div>
      </div>
    );
  }
}

export default DisplayScheduleSession;
