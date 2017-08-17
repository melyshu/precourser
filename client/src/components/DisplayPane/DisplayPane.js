import React, { Component } from 'react';
import './DisplayPane.css';
import DisplaySchedule from '../DisplaySchedule/DisplaySchedule';

class DisplayPane extends Component {
  render() {
    return (
      <div className="DisplayPane">
        <DisplaySchedule selectedSchedule={this.props.selectedSchedule} />
      </div>
    );
  }
}

export default DisplayPane;
