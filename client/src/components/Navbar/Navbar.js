import React, { Component } from 'react';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaTrash from 'react-icons/lib/fa/trash';
import NavbarItem from '../NavbarItem/NavbarItem';
import NavbarDropdown from '../NavbarDropdown/NavbarDropdown';
import NavbarInput from '../NavbarInput/NavbarInput';
import Logo from '../../precourser.svg';
import './Navbar.css';

class Navbar extends Component {
  render() {
    // only required when isEmpty is false
    const semesters = this.props.semesters;
    const selectedSemester = this.props.selectedSemester;
    const user = this.props.user;
    const schedules = this.props.schedules;
    const selectedSchedule = this.props.selectedSchedule;
    const semesterLookup = this.props.semesterLookup;
    const onChangeSemester = this.props.onChangeSemester;
    const onChangeSchedule = this.props.onChangeSchedule;
    const onCreateSchedule = this.props.onCreateSchedule;
    const onRenameSchedule = this.props.onRenameSchedule;
    const onDeleteSchedule = this.props.onDeleteSchedule;

    const isEmpty = this.props.isEmpty;

    return (
      <nav className="Navbar">
        <div className="Navbar-brand">
          <img src={Logo} alt="logo" className="Navbar-logo" />
          <a href="/home" className="Navbar-title">
            precourser
          </a>
        </div>
        {isEmpty
          ? null
          : [
              <NavbarItem
                key="semester"
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
              </NavbarItem>,
              <NavbarItem
                key="schedule"
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
              </NavbarItem>,
              <NavbarItem key="rename" display={<FaPencil />}>
                <NavbarInput
                  prompt="Rename your schedule:"
                  defaultValue={selectedSchedule.name}
                  onSubmit={onRenameSchedule}
                  verb="Rename"
                />
              </NavbarItem>,
              <NavbarItem key="create" display={<FaCalendarPlusO />}>
                <NavbarInput
                  prompt="Create a new schedule:"
                  defaultValue="New Schedule"
                  onSubmit={onCreateSchedule}
                  verb="Create"
                />
              </NavbarItem>,
              <NavbarItem key="delete" display={<FaTrash />}>
                <NavbarInput
                  prompt={
                    "Are you sure you want to delete the schedule '" +
                    selectedSchedule.name +
                    "'?"
                  }
                  onSubmit={onDeleteSchedule}
                  verb="Delete"
                />
              </NavbarItem>,
              <div key="stretch" className="Navbar-stretch" />,
              <NavbarItem key="logout" display={user._id}>
                <NavbarInput
                  prompt="Would you like to logout?"
                  onSubmit={function() {}}
                  verb="Logout"
                />
              </NavbarItem>
            ]}
      </nav>
    );
  }
}

export default Navbar;
