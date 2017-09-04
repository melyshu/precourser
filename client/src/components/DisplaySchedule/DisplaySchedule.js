import React, { Component } from 'react';
import './DisplaySchedule.css';
import DisplayScheduleDay from '../DisplayScheduleDay/DisplayScheduleDay';

const MIN_TIME = 8 * 60;
const MAX_TIME = 24 * 60;

class DisplaySchedule extends Component {
  render() {
    const selectedSchedule = this.props.selectedSchedule;
    const hoveredCourse = this.props.hoveredCourse;
    const hoveredSection = this.props.hoveredSection;
    const colorLookup = this.props.colorLookup;
    const onAddSectionToSchedule = this.props.onAddSectionToSchedule;
    const onRemoveSectionFromSchedule = this.props.onRemoveSectionFromSchedule;
    const onMouseOverSection = this.props.onMouseOverSection;
    const onMouseOutSection = this.props.onMouseOutSection;

    const sessionsByDay = [[], [], [], [], [], []];
    const selectedCourses = selectedSchedule.courses.slice();

    if (hoveredCourse) {
      let hoveredCourseSelected = false;
      for (let i = 0; i < selectedCourses.length; i++) {
        hoveredCourseSelected |= hoveredCourse._id === selectedCourses[i]._id;
      }
      if (!hoveredCourseSelected) selectedCourses.push(hoveredCourse);
    }

    const selectedSections = selectedSchedule.sections;

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
            continue;
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
          hoveredCourse={hoveredCourse}
          hoveredSection={hoveredSection}
          colorLookup={colorLookup}
          onAddSectionToSchedule={onAddSectionToSchedule}
          onRemoveSectionFromSchedule={onRemoveSectionFromSchedule}
          onMouseOverSection={onMouseOverSection}
          onMouseOutSection={onMouseOutSection}
          key={i}
          day={i}
          sessions={sessionsByDay[i]}
          minTime={MIN_TIME}
          maxTime={MAX_TIME}
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

    return (
      <div className="DisplaySchedule">
        {displayScheduleDays}
      </div>
    );
  }
}

export default DisplaySchedule;
