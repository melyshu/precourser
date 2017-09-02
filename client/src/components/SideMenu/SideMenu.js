import React, { Component } from 'react';
import './SideMenu.css';

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { tab: 0 };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(tab) {
    this.setState({ tab: tab });
  }

  render() {
    const tab = this.state.tab;

    const tabLabels = this.props.tabLabels;
    const renderInput = this.props.renderInput;
    const renderContent = this.props.renderContent;
    const captionNouns = this.props.captionNouns;
    const buttons = this.props.buttons;

    const tabs = [];
    for (let i = 0; i < tabLabels.length; i++) {
      tabs.push(
        <button
          key={i}
          onClick={this.handleTabClick.bind(null, i)}
          className={
            'SideMenu-button' +
            (i === this.state.tab ? ' SideMenu-button-selected' : '')
          }
        >
          {tabLabels[i]}
        </button>
      );
    }

    const input = renderInput(tab);
    const content = renderContent(tab);

    const noun = captionNouns[tab];
    const plural = content.length === 1 ? '' : 's';
    const caption = content.length + ' ' + noun + plural;

    return (
      <div className="SideMenu">
        <div className="SideMenu-buttons">
          {tabs}
          <div className="SideMenu-stretch" />
          {buttons}
        </div>
        {input ? input : null}
        <div className="SideMenu-caption">
          {caption}
        </div>
        <ul className="SideMenu-content">
          {content}
        </ul>
      </div>
    );
  }
}

export default SideMenu;
