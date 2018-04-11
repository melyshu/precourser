import React, { Component } from 'react';
import ReactGA from 'react-ga';
import MdArrowDropDown from 'react-icons/lib/md/arrow-drop-down';
import MdEdit from 'react-icons/lib/md/edit';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';
import MdDelete from 'react-icons/lib/md/delete';
import MdFeedback from 'react-icons/lib/md/feedback';
import MdFileDownload from 'react-icons/lib/md/file-download';
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
const FORM_KEY = '1FAIpQLSfsJpCwzmklLlp4ziUqsAwLOQ3M9b3gRUQisMyoh-qPBqRYew';
const NETID_ENTRY = 'entry.1377308274';
const TEXT_ENTRY = 'entry.438515020';

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
      ReactGA.event({
        category: 'Navigation',
        action: 'Submitted Feedback'
      });

      const feedback = encodeURIComponent(text);
      const url = `${BASE_URL}${FORM_KEY}/formResponse?${NETID_ENTRY}=${user._id}&${TEXT_ENTRY}=${feedback}`;

      fetch(url, { method: 'POST' }).catch(err => {
        // ignore if it's a cors issue, it goes through anyway
        if (
          err &&
          err.message &&
          err.message.includes(
            "No 'Access-Control-Allow-Origin' header is present on the requested resource."
          )
        ) {
          return;
        }
        console.error(err);
      });
    };

    const handleLogout = () => {
      ReactGA.event({
        category: 'Navigation',
        action: 'Logged out'
      });

      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/auth/logout';
      } else {
        window.location.href = '/home';
      }
    };

    const handleDownloadIcal = () => {
      ReactGA.event({
        category: 'Navigation',
        action: 'Downloaded iCal'
      });

      window.location.href = `/ical/${selectedSchedule._id}.ics`;
    };

    return (
      <nav className="Navbar">
        <div className="Navbar-brand">
          <img src={Logo} alt="logo" className="Navbar-logo" />
          <a href="/home" className="Navbar-title" title="Home">
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
                    {semesterLookup[selectedSemester].name} <MdArrowDropDown />
                  </span>
                }
                description="Change semester"
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
                    {selectedSchedule.name} <MdArrowDropDown />
                  </span>
                }
                description="Change schedule"
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
              <NavbarItem
                key="rename"
                display={<MdEdit />}
                description="Rename schedule"
              >
                <NavbarInput
                  prompt="Rename your schedule:"
                  defaultValue={selectedSchedule.name}
                  onSubmit={onRenameSchedule}
                  verb="Rename"
                />
              </NavbarItem>,
              <NavbarItem
                key="create"
                display={<MdAddCircleOutline />}
                description="Create schedule"
              >
                <NavbarInput
                  prompt="Create a new schedule:"
                  defaultValue="New Schedule"
                  onSubmit={onCreateSchedule}
                  verb="Create"
                />
              </NavbarItem>,
              <NavbarItem
                key="delete"
                display={<MdDelete />}
                description="Delete schedule"
              >
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
              <NavbarItem
                key="ical"
                display={<MdFileDownload />}
                description="Export schedule to iCal"
              >
                <NavbarInput
                  prompt={'Add to Google Calendar or save to iCal:'}
                  defaultValue={`${window.location
                    .origin}/ical/${selectedSchedule._id}.ics`}
                  onSubmit={handleDownloadIcal}
                  verb="Save"
                  isReadOnly={true}
                />
              </NavbarItem>
            ]}
        <div className="Navbar-stretch" />
        <NavbarItem
          display={<MdFeedback />}
          description={'Feedback'}
          alignRight={true}
        >
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
            isFeedback={true}
            onSubmit={handleSubmitFeedback}
            verb="Submit"
          />
        </NavbarItem>
        {isEmpty
          ? null
          : <NavbarItem display={user._id} alignRight={true}>
              <NavbarInput
                prompt="Would you like to logout?"
                onSubmit={handleLogout}
                verb="Logout"
              />
            </NavbarItem>}
      </nav>
    );
  }
}

export default Navbar;
