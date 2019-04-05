import React, { Component } from 'react';
import FaClose from 'react-icons/lib/fa/close';
import './Bubble.css';

class Bubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: false
    };
  }

  render() {
    const closed = this.state.closed;

    if (closed) return null;

    return (
      <div className="Bubble">
        <div className="Bubble-top">
          <div className="Bubble-title">Update</div>
          <FaClose
            className="Bubble-button"
            onClick={() => {
              this.setState({ closed: true });
            }}
          />
        </div>
        <div className="Bubble-content">
          Due to the new Registrar website, precourser will take longer than
          usual to update for the 2019-2020 Fall semester. There are plans to
          merge precourser with the other TigerApps course selection tools. If
          you would be interested in joining this effort please fill out{' '}
          <a
            className="Bubble-link"
            href="https://forms.gle/5iSPAhoJMVMSPeuC6"
            rel="noopener noreferrer"
            target="_blank"
          >
            this form
          </a>.
        </div>
      </div>
    );
  }
}

export default Bubble;
