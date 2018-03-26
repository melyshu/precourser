import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Navbar from '../Navbar/Navbar';
import Logo from '../../images/precourser.svg';
import './Home.css';

class Home extends Component {
  componentDidMount() {
    ReactGA.pageview(`/home`);
  }

  render() {
    return (
      <div className="Home">
        <Navbar isEmpty={true} />
        <div className="Home-page">
          <div className="Home-box">
            <div className="Home-top">
              <img src={Logo} alt="logo" className="Home-logo" />
              <span className="Home-title">precourser</span>
            </div>
            <div className="Home-middle">
              <div className="Home-subtitle">
                redefining course selection at Princeton
              </div>
            </div>
            <div className="Home-bottom">
              <a
                href={
                  process.env.NODE_ENV === 'production' ? '/auth/login' : '/'
                }
                className="Home-button"
              >
                select courses
              </a>
            </div>
            <div className="Home-narrow">
              Your screen may be too narrow. For the best experience, use a
              larger device.
            </div>
            <div className="Home-message">
              By using precourser, you agree to your data being stored and
              analyzed to improve this service.
            </div>
          </div>
          <div className="Home-footer-right">
            code by{' '}
            <a className="Home-link" href="mailto:mshu@princeton.edu">
              mshu
            </a>
          </div>
          <div className="Home-footer-left">
            logo by{' '}
            <a className="Home-link" href="mailto:linht@princeton.edu">
              linht
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
