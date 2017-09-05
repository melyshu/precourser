import React, { Component } from 'react';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaTrash from 'react-icons/lib/fa/trash';
import NavbarItem from '../NavbarItem/NavbarItem';
import NavbarDropdown from '../NavbarDropdown/NavbarDropdown';
import NavbarInput from '../NavbarInput/NavbarInput';
import Logo from '../../images/precourser.svg';
import './Navbar.css';

/*
How to get Google Forms working with ajax:
https://stackoverflow.com/questions/29267773/how-to-post-google-forms-data-via-jquery-and-ajax-to-spreadsheets
*/

const BASE_URL = 'https://docs.google.com/forms/d/e/';
const FORM_KEY = '1FAIpQLSe8rcxHhUEkKIi5BsCBbwnJTsbQovNoO9A-HCFXTE732ZYG0w';
const ENTRY_ID = 'entry.438515020';

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

    const handleSubmitFeedback = text => {
      const feedback = encodeURIComponent(text);
      const url = `${BASE_URL}${FORM_KEY}/formResponse?${ENTRY_ID}=${feedback}`;

      fetch(url, { method: 'POST' }).catch(err => {
        // ignore if it's a cors issue, it goes through anyway
        if (
          err.includes(
            "No 'Access-Control-Allow-Origin' header is present on the requested resource."
          )
        ) {
          return;
        }
        console.error(err);
      });
    };

    const handleLogoutClick = () => {
      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/auth/logout';
      } else {
        window.location.href = '/home';
      }
    };

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
                  isShort={true}
                  onSubmit={onRenameSchedule}
                  verb="Rename"
                />
              </NavbarItem>,
              <NavbarItem key="create" display={<FaCalendarPlusO />}>
                <NavbarInput
                  prompt="Create a new schedule:"
                  defaultValue="New Schedule"
                  isShort={true}
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
              </NavbarItem>
            ]}
        <div className="Navbar-stretch" />
        <NavbarItem display="Feedback" alignRight={true}>
          <NavbarInput
            prompt={
              <span>
                All feedback welcome! Access the full form{' '}
                <a
                  className="Navbar-feedback"
                  href="https://goo.gl/forms/R5EIfruDGJlIrkG33"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  here
                </a>.
              </span>
            }
            defaultValue="Enter any thoughts!"
            isShort={false}
            onSubmit={handleSubmitFeedback}
            verb="Submit"
          />
        </NavbarItem>
        {isEmpty
          ? null
          : <NavbarItem display={user._id} alignRight={true}>
              <NavbarInput
                prompt="Would you like to logout?"
                onSubmit={handleLogoutClick}
                verb="Logout"
              />
            </NavbarItem>}
      </nav>
    );
  }
}

export default Navbar;
