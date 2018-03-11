import React, { Component } from 'react';
import Logo from '../../images/precourser.svg';
import './SimpleCover.css';

class SimpleCover extends Component {
  render() {
    const loading = this.props.loading;

    return (
      <div className="SimpleCover">
        <div className="SimpleCover-top">
          <img src={Logo} alt="logo" className="SimpleCover-logo" />
          <span className="SimpleCover-title">precourser</span>
        </div>
        <div className="SimpleCover-middle">
          <div className="SimpleCover-subtitle">
            redefining Princeton course selection
          </div>
        </div>
        <div className="SimpleCover-bottom">
          {loading
            ? <span className="SimpleCover-loading">loading...</span>
            : <a
                href={
                  process.env.NODE_ENV === 'production' ? '/auth/login' : '/'
                }
                className="SimpleCover-button"
              >
                select courses
              </a>}
        </div>
        <div className="SimpleCover-narrow">
          Your screen may be too narrow. For the best experience, use a larger
          device.
        </div>
        <div className="SimpleCover-message">
          precourser is currently under construction!
          <br />
          If you have any feedback please don't hesitate to use the form{' '}
          <a
            className="SimpleCover-link"
            href="https://goo.gl/forms/R5EIfruDGJlIrkG33"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>.
        </div>
      </div>
    );
  }
}

export default SimpleCover;
