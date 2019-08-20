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
          <div className="Bubble-title">Note</div>
          <FaClose
            className="Bubble-button"
            onClick={() => {
              this.setState({ closed: true });
            }}
          />
        </div>
        <div className="Bubble-content">
          Please note that for the foreseeable future, precourser will not be
          updated, but will still be available at{' '}
          <a
            className="Bubble-link"
            href="https:/precourser.herokuapp.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            precourser.herokuapp.com
          </a>
          . The codebase is publicly available{' '}
          <a
            className="Bubble-link"
            href="https://github.com/melyshu/precourser"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </div>
      </div>
    );
  }
}

export default Bubble;
