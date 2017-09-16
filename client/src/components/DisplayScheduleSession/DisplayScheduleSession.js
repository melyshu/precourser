import React, { Component } from 'react';
import './DisplayScheduleSession.css';

const DAYS = ['', 'M', 'T', 'W', 'Th', 'F'];

class DisplayScheduleSession extends Component {
  minsToString(mins) {
    const h = (Math.floor(mins / 60) - 1) % 12 + 1;
    const m = mins % 60;
    const p = mins >= 12 * 60 ? 'pm' : 'am';

    return h + ':' + ('00' + m).substr(-2) + ' ' + p;
  }

  render() {
    const hoveredCourse = this.props.hoveredCourse;
    const hoveredSection = this.props.hoveredSection;
    const colorLookup = this.props.colorLookup;
    const onAddSectionToSchedule = this.props.onAddSectionToSchedule;
    const onRemoveSectionFromSchedule = this.props.onRemoveSectionFromSchedule;
    const onMouseOverSection = this.props.onMouseOverSection;
    const onMouseOutSection = this.props.onMouseOutSection;
    const minTime = this.props.minTime;
    const maxTime = this.props.maxTime;
    const session = this.props.session;
    const position = this.props.position;

    const minsToString = this.minsToString;

    const meeting = session.meeting;
    const section = session.section;
    const course = session.course;
    const selected = session.selected;
    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    const top = (startTime - minTime) / (maxTime - minTime) * 100 + '%';
    const bottom = (maxTime - endTime) / (maxTime - minTime) * 100 + '%';

    const sectionHovered = section._id === this.props.hoveredSection;

    const sectionTypeHovered =
      hoveredSection &&
      section._id.substring(0, 11) === hoveredSection.substring(0, 11);

    const courseHovered = hoveredCourse && course._id === hoveredCourse._id;

    const color = colorLookup[course._id];

    return (
      <div
        className={
          'DisplayScheduleSession' +
          (color ? ' DisplayScheduleSession-' + color : '') +
          (selected ? ' DisplayScheduleSession-selected' : '') +
          (sectionHovered ? ' DisplayScheduleSession-section-hovered' : '') +
          (courseHovered ? ' DisplayScheduleSession-course-hovered' : '') +
          (sectionTypeHovered
            ? ' DisplayScheduleSession-section-type-hovered'
            : '')
        }
        title={
          course.department +
          course.catalogNumber +
          ' ' +
          section.name +
          '\n' +
          section.meetings
            .map(
              meeting =>
                meeting.days.map(day => DAYS[day]).join('') +
                ' ' +
                minsToString(meeting.startTime) +
                ' \u2013 ' +
                minsToString(meeting.endTime) +
                '\n'
            )
            .join('') +
          section.status +
          ' ' +
          (section.seatsTaken >= 0 ? section.seatsTaken : '\u2013') +
          ' / ' +
          (section.seatsTotal >= 0 ? section.seatsTotal : '\u2013') +
          '\n' +
          (meeting.building && meeting.room
            ? meeting.building + ' ' + meeting.room + '\n'
            : '')
        }
        style={{
          top: top,
          bottom: bottom,
          left: position.left,
          right: position.right
        }}
        onClick={(selected
          ? onRemoveSectionFromSchedule
          : onAddSectionToSchedule).bind(null, section._id)}
        onMouseOver={onMouseOverSection.bind(null, section._id)}
        onMouseOut={onMouseOutSection.bind(null, section._id)}
      >
        <div className="DisplayScheduleSession-top">
          <span className="DisplayScheduleSession-listing">
            {course.department + course.catalogNumber}
          </span>
          <span className="DisplayScheduleSession-section">
            {section.name}
          </span>
          <span className="DisplayScheduleSession-seats">
            {(section.seatsTaken >= 0 ? section.seatsTaken : '\u2013') +
              '\u00a0/ ' +
              (section.seatsTotal >= 0 ? section.seatsTotal : '\u2013')}
          </span>
        </div>
        <div className="DisplayScheduleSession-bottom">
          <span className="DisplayScheduleSession-location">
            {meeting.building && meeting.room
              ? meeting.building + ' ' + meeting.room
              : ''}
          </span>{' '}
          <span className="DisplayScheduleSession-status">
            {section.status}
          </span>
        </div>
      </div>
    );
  }
}

export default DisplayScheduleSession;
