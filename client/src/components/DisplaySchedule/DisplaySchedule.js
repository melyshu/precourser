import React, { Component } from 'react';
import './DisplaySchedule.css';

class DisplaySchedule extends Component {
  render() {
    return (
      <div className="DisplaySchedule">
        {JSON.stringify(this.props.selectedSchedule, null, 2)}
      </div>
    );
  }
}

export default DisplaySchedule;
