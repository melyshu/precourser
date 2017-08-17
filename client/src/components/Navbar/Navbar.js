import React, { Component } from 'react';
import './Navbar.css';
import NavbarItem from '../NavbarItem/NavbarItem';
import NavbarDropdown from '../NavbarDropdown/NavbarDropdown';
import NavbarInput from '../NavbarInput/NavbarInput';

class Navbar extends Component {
  render() {
    const semesters = this.props.semesters;
    const selectedSemester = this.props.selectedSemester;
    let selectedSemesterLabel;

    const semesterValues = [];
    const semesterLabels = [];
    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i];
      semesterValues.push(semester._id);
      semesterLabels.push(semester.name);
      if (semester._id === selectedSemester)
        selectedSemesterLabel = semester.name;
    }

    const schedules = this.props.schedules;
    let selectedSchedule;
    let selectedScheduleLabel;
    if (this.props.selectedSchedule) {
      selectedSchedule = this.props.selectedSchedule._id;
      selectedScheduleLabel = this.props.selectedSchedule.name;
    }

    const scheduleValues = [];
    const scheduleLabels = [];
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      scheduleValues.push(schedule._id);
      scheduleLabels.push(schedule.name);
    }

    return (
      <nav className="Navbar">
        <div className="Navbar-brand">precourser</div>
        <NavbarItem display={selectedSemesterLabel}>
          <NavbarDropdown
            values={semesterValues}
            labels={semesterLabels}
            selectedValue={selectedSemester}
            onSelect={this.props.onSemesterChange}
          />
        </NavbarItem>
        <NavbarItem display={selectedScheduleLabel}>
          <NavbarDropdown
            values={scheduleValues}
            labels={scheduleLabels}
            selectedValue={selectedSchedule}
            onSelect={this.props.onScheduleChange}
          />
        </NavbarItem>
        <NavbarItem display="plus">
          <NavbarInput
            prompt="Create a new schedule:"
            defaultValue="New Schedule"
            onSubmit={this.props.onScheduleCreate}
            verb="Create"
          />
        </NavbarItem>
        <NavbarItem display="pencil">
          <NavbarInput
            prompt="Rename your schedule:"
            defaultValue={selectedScheduleLabel}
            onSubmit={this.props.onScheduleRename}
            verb="Rename"
          />
        </NavbarItem>
        <NavbarItem display="bin">
          <NavbarInput
            prompt={
              "Are you sure you want to delete the schedule '" +
              selectedScheduleLabel +
              "'?"
            }
            onSubmit={this.props.onScheduleDelete}
            verb="Delete"
          />
        </NavbarItem>
      </nav>
    );
  }
}

export default Navbar;
