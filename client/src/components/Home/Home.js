import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Logo from '../../images/precourser.svg';
//import heroku from '../../images/heroku.png';
//import mongodb from '../../images/mongodb.png';
//import nodejs from '../../images/nodejs.png';
//import reactjs from '../../images/reactjs.png';
import './Home.css';

class Home extends Component {
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
                redefining Princeton course selection
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
    /*
    <div className="Home-features">
      <div className="Home-heading">combining the best from</div>
      <div className="Home-apps">
        <div className="Home-app">
          <a
            className="Home-app-princetoncourses"
            href="https://princetoncourses.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Princeton Courses
          </a>
          <ul className="Home-app-features">
            <li>course evaluations</li>
            <li>instructor history</li>
            <li>save courses</li>
            <li>text-based search</li>
          </ul>
          <ul className="Home-app-contributors">
            <li className="Home-app-contributor">bsicim@</li>{' '}
            <li className="Home-app-contributor">cgolner@</li>{' '}
            <li className="Home-app-contributor">karab@</li>{' '}
            <li className="Home-app-contributor">mshu@</li>{' '}
            <li className="Home-app-contributor">smclarke@</li>
          </ul>
        </div>
        <div className="Home-app">
          <a
            className="Home-app-recal"
            href="https://recal.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            ReCal
          </a>
          <ul className="Home-app-features">
            <li>beautiful schedules</li>
            <li>colorful design</li>
            <li>instant search</li>
            <li>intuitive interface</li>
          </ul>

          <ul className="Home-app-contributors">
            <li className="Home-app-contributor">dxue@</li>{' '}
            <li className="Home-app-contributor">maximz@</li>{' '}
            <li className="Home-app-contributor">naphats@</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="Home-tools">
      <div className="Home-heading">built with</div>
      <ul className="Home-tools-logos">
        <img alt="node.js" src={nodejs} className="Home-tools-logo" />
        <img alt="React.js" src={reactjs} className="Home-tools-logo" />
        <img alt="mongoDB" src={mongodb} className="Home-tools-logo" />
        <img alt="heroku" src={heroku} className="Home-tools-logo" />
      </ul>
    </div>
    <div className="Home-footer">
      <div className="Home-footer-name">
        code by <strong>mshu@</strong>
      </div>
      <div className="Home-footer-name">
        logo by <strong>linht@</strong>
      </div>
    </div>
    */
  }
}

export default Home;
