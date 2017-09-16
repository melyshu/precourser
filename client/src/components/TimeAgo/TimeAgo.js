import React, { Component } from 'react';
import FaClockO from 'react-icons/lib/fa/clock-o';
import './TimeAgo.css';

class TimeAgo extends Component {
  render() {
    const now = this.props.now;
    const then = this.props.then;

    const diff = now - then;

    let number;
    let unit;

    if (diff < 1000 * 60 * 60) {
      number = Math.round(diff / 1000 / 60);
      unit = 'minute';
    } else if (diff < 1000 * 60 * 60 * 24) {
      number = Math.round(diff / 1000 / 60 / 60);
      unit = 'hour';
    } else if (diff < 1000 * 60 * 60 * 24 * 7) {
      number = Math.round(diff / 1000 / 60 / 60 / 24);
      unit = 'day';
    } else {
      number = Math.round(diff / 1000 / 60 / 60 / 24 / 7);
      unit = 'week';
    }

    const text = number + unit.substr(0, 1);
    const description =
      'Last updated about ' +
      number +
      ' ' +
      unit +
      (number === 1 ? '' : 's') +
      ' ago';

    return (
      <span className="TimeAgo" title={description}>
        <FaClockO />
        {text}
      </span>
    );
  }
}

export default TimeAgo;
