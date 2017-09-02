import React, { Component } from 'react';
import Logo from '../../precourser.svg';
import './Loading.css';

class Loading extends Component {
  render() {
    const text = 'Loading...';
    const spans = [];
    for (let i = 0; i < text.length; i++) {
      spans.push(
        <span key={i} className={'Loading-character' + i}>
          {text[i]}
        </span>
      );
    }

    return (
      <div className="Loading">
        <div className="Loading-content">
          <img src={Logo} alt="logo" className="Loading-logo" />
          <div className="Loading-text">
            {spans}
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
