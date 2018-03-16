import React, { Component } from 'react';
import Logo from '../../images/precourser.svg';
import './SimpleCover.css';

class SimpleCover extends Component {
  render() {
    const loading = this.props.loading;

    return (
      <div className="SimpleCover">
        <div className="SimpleCover-box">
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
            By using precourser, you agree to your data being stored and
            analyzed to improve this service.
          </div>
        </div>
        <div className="SimpleCover-footer-right">
          code by{' '}
          <a className="SimpleCover-link" href="mailto:mshu@princeton.edu">
            mshu
          </a>
        </div>
        <div className="SimpleCover-footer-left">
          logo by{' '}
          <a className="SimpleCover-link" href="mailto:linht@princeton.edu">
            linht
          </a>
        </div>
      </div>
    );
  }
}

export default SimpleCover;
