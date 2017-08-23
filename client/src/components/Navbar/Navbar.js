import React, { Component } from 'react';
import './Navbar.css';
import Logo from '../../precourser.svg';
import NavbarItem from '../NavbarItem/NavbarItem';
import NavbarDropdown from '../NavbarDropdown/NavbarDropdown';
import NavbarInput from '../NavbarInput/NavbarInput';
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import FaCaretDown from 'react-icons/lib/fa/caret-down';

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

    const semesterDisplay = (
      <span>
        {selectedSemesterLabel}
        <FaCaretDown />
      </span>
    );

    const scheduleDisplay = (
      <span>
        {selectedScheduleLabel}
        <FaCaretDown />
      </span>
    );

    return (
      <nav className="Navbar">
        <div className="Navbar-brand">
          <img src={Logo} alt="precourser logo" className="Navbar-logo" />
          <span>precourser</span>
        </div>
        <NavbarItem display={semesterDisplay}>
          <NavbarDropdown
            values={semesterValues}
            labels={semesterLabels}
            selectedValue={selectedSemester}
            onSelect={this.props.onChangeSemester}
          />
        </NavbarItem>
        <NavbarItem display={scheduleDisplay}>
          <NavbarDropdown
            values={scheduleValues}
            labels={scheduleLabels}
            selectedValue={selectedSchedule}
            onSelect={this.props.onChangeSchedule}
          />
        </NavbarItem>
        <NavbarItem display={<FaPencil />}>
          <NavbarInput
            prompt="Rename your schedule:"
            defaultValue={selectedScheduleLabel}
            onSubmit={this.props.onRenameSchedule}
            verb="Rename"
          />
        </NavbarItem>
        <NavbarItem display={<FaCalendarPlusO />}>
          <NavbarInput
            prompt="Create a new schedule:"
            defaultValue="New Schedule"
            onSubmit={this.props.onCreateSchedule}
            verb="Create"
          />
        </NavbarItem>
        <NavbarItem display={<FaTrashO />}>
          <NavbarInput
            prompt={
              "Are you sure you want to delete the schedule '" +
              selectedScheduleLabel +
              "'?"
            }
            onSubmit={this.props.onDeleteSchedule}
            verb="Delete"
          />
        </NavbarItem>
      </nav>
    );
  }
}

export default Navbar;
