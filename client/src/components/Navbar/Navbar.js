import React, { Component } from 'react';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaTrash from 'react-icons/lib/fa/trash';
import Logo from '../../precourser.svg';
import NavbarItem from '../NavbarItem/NavbarItem';
import NavbarDropdown from '../NavbarDropdown/NavbarDropdown';
import NavbarInput from '../NavbarInput/NavbarInput';
import './Navbar.css';

class Navbar extends Component {
  render() {
    const semesters = this.props.semesters;
    const selectedSemester = this.props.selectedSemester;
    const schedules = this.props.schedules;
    const selectedSchedule = this.props.selectedSchedule;
    const semesterLookup = this.props.semesterLookup;
    const onChangeSemester = this.props.onChangeSemester;
    const onChangeSchedule = this.props.onChangeSchedule;
    const onCreateSchedule = this.props.onCreateSchedule;
    const onRenameSchedule = this.props.onRenameSchedule;
    const onDeleteSchedule = this.props.onDeleteSchedule;

    return (
      <nav className="Navbar">
        <div className="Navbar-brand">
          <img src={Logo} alt="logo" className="Navbar-logo" />
          <span>precourser</span>
        </div>
        <NavbarItem
          display={
            <span>
              {semesterLookup[selectedSemester].name}
              <FaCaretDown />
            </span>
          }
        >
          <NavbarDropdown
            items={semesters.map(semester => ({
              value: semester._id,
              label: semester.name
            }))}
            selectedValue={selectedSemester}
            onSelect={onChangeSemester}
          />
        </NavbarItem>
        <NavbarItem
          display={
            <span>
              {selectedSchedule.name}
              <FaCaretDown />
            </span>
          }
        >
          <NavbarDropdown
            items={schedules.map(schedule => ({
              value: schedule._id,
              label: schedule.name
            }))}
            selectedValue={selectedSchedule._id}
            onSelect={onChangeSchedule}
          />
        </NavbarItem>
        <NavbarItem display={<FaPencil />}>
          <NavbarInput
            prompt="Rename your schedule:"
            defaultValue={selectedSchedule.name}
            onSubmit={onRenameSchedule}
            verb="Rename"
          />
        </NavbarItem>
        <NavbarItem display={<FaCalendarPlusO />}>
          <NavbarInput
            prompt="Create a new schedule:"
            defaultValue="New Schedule"
            onSubmit={onCreateSchedule}
            verb="Create"
          />
        </NavbarItem>
        <NavbarItem display={<FaTrash />}>
          <NavbarInput
            prompt={
              "Are you sure you want to delete the schedule '" +
              selectedSchedule.name +
              "'?"
            }
            onSubmit={onDeleteSchedule}
            verb="Delete"
          />
        </NavbarItem>
      </nav>
    );
  }
}

export default Navbar;
