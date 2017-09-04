import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Logo from '../../precourser.svg';
import './Home.css';

const SUBTITLES = [
  'course selection made easy',
  'elegant scheduling',
  'synchronized course details',
  'intuitive search',
  'beautiful interface',
  'integrated course evaluations',
  'comprehensive instructor history'
];
const INTERVAL = 3500;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previousSubtitle: 4,
      currentSubtitle: 4,
      nextSubtitle: 0,
      subtitleCount: 0
    };

    this.changeSubtitle = this.changeSubtitle.bind(this);
  }

  changeSubtitle() {
    const previousSubtitle = this.state.currentSubtitle;
    const currentSubtitle = this.state.nextSubtitle;
    const subtitleCount = this.state.subtitleCount;

    let nextSubtitle = Math.floor(Math.random() * SUBTITLES.length);
    while (
      nextSubtitle === previousSubtitle ||
      nextSubtitle === currentSubtitle
    ) {
      nextSubtitle = Math.floor(Math.random() * SUBTITLES.length);
    }

    this.setState({
      previousSubtitle: previousSubtitle,
      currentSubtitle: currentSubtitle,
      nextSubtitle: nextSubtitle,
      subtitleCount: subtitleCount + 1
    });
  }

  componentDidMount() {
    this.subtitleInterval = setInterval(this.changeSubtitle, INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.subtitleInterval);
  }

  render() {
    const previousSubtitle = this.state.previousSubtitle;
    const currentSubtitle = this.state.currentSubtitle;
    const nextSubtitle = this.state.nextSubtitle;
    const subtitleCount = this.state.subtitleCount;

    return (
      <div className="Home">
        <Navbar isEmpty={true} />
        <div className="Home-page">
          <div className="Home-cover">
            <div className="Home-title">
              <img src={Logo} alt="logo" className="Home-title-logo" />
              <span className="Home-title-title">precourser</span>
            </div>
            <div className="Home-subtitles">
              {[
                <div key={subtitleCount + 2} className="Home-subtitle-0">
                  {SUBTITLES[nextSubtitle]}
                </div>,
                <div key={subtitleCount + 1} className="Home-subtitle-1">
                  {SUBTITLES[currentSubtitle]}
                </div>,
                <div key={subtitleCount} className="Home-subtitle-2">
                  {SUBTITLES[previousSubtitle]}
                </div>
              ]}
            </div>
            <a href="/" className="Home-button">
              select courses
            </a>
            <div className="Home-narrow">
              Your screen may be too narrow. For the best experience, use a
              larger device.
            </div>
          </div>
          <div className="Home-features">
            <div className="Home-heading">combining the best from</div>
            <div className="Home-apps">
              <div className="Home-app">
                <a
                  href="https://princetoncourses.com"
                  className="Home-app-princetoncourses"
                >
                  Princeton Courses
                </a>
                <ul className="Home-app-features">
                  <li>course evaluations</li>
                  <li>instructor history</li>
                  <li>saving courses</li>
                  <li>text search</li>
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
                <a href="https://recal.io" className="Home-app-recal">
                  ReCal
                </a>
                <ul className="Home-app-features">
                  <li>beautiful schedules</li>
                  <li>intuitive interface</li>
                  <li>colorful design</li>
                  <li>instant search</li>
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
