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
          <div className="Bubble-title">Take note</div>
          <FaClose
            className="Bubble-button"
            onClick={() => {
              this.setState({ closed: true });
            }}
          />
        </div>
        <div className="Bubble-content">
          precourser will be shut down at the end of the 2018-2019 academic
          year. Please save any important user information that you would like
          to keep beyond that date!
        </div>
      </div>
    );
  }
}

export default Bubble;
