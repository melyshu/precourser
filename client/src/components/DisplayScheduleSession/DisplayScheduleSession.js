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
      right: this.props.position.right,
      background: selected ? 'blue' : ''
    };

    const handleClick = selected
      ? this.props.onRemoveSectionFromSchedule.bind(null, section._id)
      : this.props.onAddSectionToSchedule.bind(null, section._id);

    return (
      <div
        className="DisplayScheduleSession"
        style={style}
        onClick={handleClick}
      >
        <div>
          {course.department + course.catalogNumber + section.name}
        </div>
        <div>
          {meeting.building + ' ' + meeting.buildingNumber}
        </div>
      </div>
    );
  }
}

export default DisplayScheduleSession;
