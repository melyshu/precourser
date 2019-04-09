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
          <div className="Bubble-title">Thanks for your patience!</div>
          <FaClose
            className="Bubble-button"
            onClick={() => {
              this.setState({ closed: true });
            }}
          />
        </div>
        <div className="Bubble-content">
          Finally, the Registrar's new website has been tamed and courses for
          the 2019-2020 Fall semester are up! If you notice anything odd please
          use the feedback form in the top right of the window. Also, please
          note that there are potential plans to merge precourser with the other
          TigerApps course selection tools this upcoming summer, so regularly
          save any valuable user data as a precautionary measure. If you would
          be interested in joining this effort please fill out{' '}
          <a
            className="Bubble-link"
            href="https://forms.gle/5iSPAhoJMVMSPeuC6"
            rel="noopener noreferrer"
            target="_blank"
          >
            this form
          </a>!
        </div>
      </div>
    );
  }
}

export default Bubble;
