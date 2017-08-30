import React, { Component } from 'react';
import './DisplaySchedule.css';
import DisplayScheduleDay from '../DisplayScheduleDay/DisplayScheduleDay';

const MIN_TIME = 8 * 60;
const MAX_TIME = 24 * 60;

class DisplaySchedule extends Component {
  constructor(props) {
    super(props);

    this.renderDays = this.renderDays.bind(this);
  }

  renderDays() {
    const sessionsByDay = [[], [], [], [], [], []];
    const hoveredCourse = this.props.hoveredCourse;
    const selectedCourses = this.props.selectedSchedule.courses.slice();

    if (hoveredCourse) {
      let hoveredCourseSelected = false;
      for (let i = 0; i < selectedCourses.length; i++) {
        hoveredCourseSelected |= hoveredCourse._id === selectedCourses[i]._id;
      }
      if (!hoveredCourseSelected) selectedCourses.push(hoveredCourse);
    }

    const selectedSections = this.props.selectedSchedule.sections;

    for (let i = 0; i < selectedCourses.length; i++) {
      const course = selectedCourses[i];
      const sections = course.sections;

      for (let j = 0; j < sections.length; j++) {
        const section = sections[j];

        // skip sections whose type (L, S, P, ...) is taken but isn't selected
        let similarButNotSelected = false;
        let selected = false;
        for (let k = 0; k < selectedSections.length; k++) {
          if (selectedSections[k].substr(0, 11) === section._id.substr(0, 11)) {
            if (selectedSections[k] === section._id) {
              selected = true;
              break;
            } else {
              similarButNotSelected = true;
              break;
            }
          }
        }
        if (similarButNotSelected) continue;

        const meetings = section.meetings;
        for (let k = 0; k < meetings.length; k++) {
          const meeting = meetings[k];
          let days = meeting.days;
          if (
            !days ||
            days.length === 0 ||
            !meeting.startTime ||
            !meeting.endTime
          ) {
            days = [0];
          }

          for (let l = 0; l < days.length; l++) {
            const day = days[l];
            sessionsByDay[day].push({
              course: course,
              section: section,
              meeting: meeting,
              startTime: meeting.startTime,
              endTime: meeting.endTime,
              selected: selected
            });
          } // each day
        } // each meeting
      } // each section
    } // each course

    const displayScheduleDays = [];
    displayScheduleDays.push(
      <DisplayScheduleDay
        key={-1}
        minTime={MIN_TIME}
        maxTime={MAX_TIME}
        labels={true}
      />
    );
    for (let i = 1; i < 6; i++) {
      displayScheduleDays.push(
        <DisplayScheduleDay
          key={i}
          day={i}
          sessions={sessionsByDay[i]}
          minTime={MIN_TIME}
          maxTime={MAX_TIME}
          onAddSectionToSchedule={this.props.onAddSectionToSchedule}
          onRemoveSectionFromSchedule={this.props.onRemoveSectionFromSchedule}
          onMouseOverSection={this.props.onMouseOverSection}
          onMouseOutSection={this.props.onMouseOutSection}
          hoveredSection={this.props.hoveredSection}
          hoveredCourse={this.props.hoveredCourse}
          colors={this.props.colors}
        />
      );
    }
    displayScheduleDays.push(
      <DisplayScheduleDay
        key={-2}
        minTime={MIN_TIME}
        maxTime={MAX_TIME}
        labels={true}
      />
    );

    return displayScheduleDays;
  }

  render() {
    const displayScheduleDays = this.renderDays();

    //{JSON.stringify(this.props.selectedSchedule, null, 2)}
    return (
      <div className="DisplaySchedule">
        {displayScheduleDays}
      </div>
    );
  }
}

export default DisplaySchedule;
