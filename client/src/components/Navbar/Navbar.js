import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleFocus(event) {
    console.log('hi');
    this.setState({ open: true });
  }

  handleBlur(event) {
    this.setState({ open: false });
  }

  render() {
    const compare = function(a, b) {
      if (a._id > b._id) return -1;
      if (a._id < b._id) return 1;
      return 0;
    };
    const semesters = this.props.semesters.sort(compare);
    const thisSemester = this.props.semester;
    let displayedSemester;
    const semesterOptions = [];
    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i];

      if (semester._id === thisSemester) {
        displayedSemester = semester.name;

        semesterOptions.push(
          <li key={semester._id} className="Navbar-semester-option selected">
            {semester.name}
          </li>
        );
      } else {
        semesterOptions.push(
          <li
            key={semester._id}
            className="Navbar-semester-option"
            onClick={() => {
              this.props.onSemesterChange(semester._id);
              this.handleBlur();
            }}
          >
            {semester.name}
          </li>
        );
      }
    }

    if (!displayedSemester) displayedSemester = 'Loading...';

    let dropdown;
    if (this.state.open)
      dropdown = (
        <ul className="Navbar-semester-dropdown">
          {semesterOptions}
        </ul>
      );

    return (
      <div className="Navbar">
        <div className="Navbar-brand">precourser</div>
        <button
          className="Navbar-semester"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          <div className="Navbar-semester-current">
            {displayedSemester}
          </div>
          {dropdown}
        </button>
      </div>
    );
  }
}

export default Navbar;
