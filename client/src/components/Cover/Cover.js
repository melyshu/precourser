import React, { Component } from 'react';
import Logo from '../../precourser.svg';
import './Cover.css';

const SUBTITLES = [
  'redefining course selection',
  'elegant scheduling',
  'synchronized course details',
  'intuitive search',
  'beautiful interface',
  'integrated course evaluations',
  'comprehensive instructor history'
];

const INTERVAL = 3500;
class Cover extends Component {
  constructor(props) {
    super(props);

    const subtitle = 1 + Math.floor(Math.random() * (SUBTITLES.length - 1));

    this.state = {
      previousSubtitle: 0,
      currentSubtitle: subtitle,
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

    const loading = this.props.loading;

    return (
      <div className="Cover">
        <div className="Cover-top">
          <img src={Logo} alt="logo" className="Cover-logo" />
          <span className="Cover-title">precourser</span>
        </div>
        <div className="Cover-middle">
          {[
            <div key={subtitleCount + 2} className="Cover-subtitle-0">
              {SUBTITLES[nextSubtitle]}
            </div>,
            <div key={subtitleCount + 1} className="Cover-subtitle-1">
              {SUBTITLES[currentSubtitle]}
            </div>,
            <div key={subtitleCount} className="Cover-subtitle-2">
              {SUBTITLES[previousSubtitle]}
            </div>
          ]}
        </div>
        <div className="Cover-bottom">
          {loading
            ? <span className="Cover-loading">loading...</span>
            : <a
                href={
                  process.env.NODE_ENV === 'production' ? '/auth/login' : '/'
                }
                className="Cover-button"
              >
                select courses
              </a>}
        </div>
        <div className="Cover-narrow">
          Your screen may be too narrow. For the best experience, use a larger
          device.
        </div>
      </div>
    );
  }
}

export default Cover;
