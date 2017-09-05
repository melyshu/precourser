import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Cover from '../Cover/Cover';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Navbar isEmpty={true} />
        <div className="Home-page">
          <Cover loading={false} />
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
            <div className="Home-heading">made with</div>
            <ul className="Home-tools-logos">
              <img
                alt="node.js"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Node.js_logo_2015.svg/591px-Node.js_logo_2015.svg.png"
                className="Home-tools-logo"
              />
              <img
                alt="React.js"
                src="http://blog.koalite.com/wp-content/uploads/logo-reactjs.png"
                className="Home-tools-logo"
              />
              <img
                alt="mongoDB"
                src="https://upload.wikimedia.org/wikipedia/en/thumb/4/45/MongoDB-Logo.svg/640px-MongoDB-Logo.svg.png"
                className="Home-tools-logo"
              />
              <img
                alt="heroku"
                src="http://logos-download.com/wp-content/uploads/2016/09/Heroku_logo.png"
                className="Home-tools-logo"
              />
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
        </div>
      </div>
    );
  }
}

export default Home;
