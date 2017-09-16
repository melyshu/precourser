import React, { Component } from 'react';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import './SideMenu.css';

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      sort: props.tabLabels.slice().fill(0),
      sign: props.tabLabels.slice().fill(1)
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
  }

  handleTabClick(tab) {
    this.setState({ tab: tab });
  }

  handleSortClick(sort) {
    const sortState = this.state.sort.slice();
    const signState = this.state.sign.slice();
    if (sortState[this.state.tab] === sort) {
      signState[this.state.tab] *= -1;
      this.setState({ sign: signState });
    } else {
      sortState[this.state.tab] = sort;
      signState[this.state.tab] = 1;
      this.setState({ sort: sortState, sign: signState });
    }
  }

  render() {
    const tab = this.state.tab;
    const sort = this.state.sort[tab];
    const sign = this.state.sign[tab];

    const tabLabels = this.props.tabLabels;
    const tabDescriptions = this.props.tabDescriptions;
    const sortLabels = this.props.sortLabels;
    const sortDescriptions = this.props.sortDescriptions;
    const renderInput = this.props.renderInput;
    const renderSpinner = this.props.renderSpinner;
    const renderContent = this.props.renderContent;
    const captionNouns = this.props.captionNouns;

    const handleTabClick = this.handleTabClick;
    const handleSortClick = this.handleSortClick;

    const tabs = [];
    for (let i = 0; i < tabLabels.length; i++) {
      tabs.push(
        <button
          key={i}
          onClick={handleTabClick.bind(null, i)}
          className={
            'SideMenu-button' + (i === tab ? ' SideMenu-button-selected' : '')
          }
          title={tabDescriptions[i]}
        >
          {tabLabels[i]}
        </button>
      );
    }

    const sorts = [];
    for (let i = 0; i < sortLabels[tab].length; i++) {
      sorts.push(
        <button
          key={i}
          onClick={handleSortClick.bind(null, i)}
          className={
            'SideMenu-button SideMenu-sort' +
            (i === sort ? ' SideMenu-button-selected' : '')
          }
          title={sortDescriptions[tab][i]}
        >
          {sortLabels[tab][i][i === sort ? (1 - sign) / 2 : 0]}
        </button>
      );
    }

    const input = renderInput(tab);
    const hasSpinner = renderSpinner(tab);
    const content = renderContent(tab, sort, sign);

    const noun = captionNouns[tab];
    const plural = content.length === 1 ? '' : 's';
    const caption = content.length + ' ' + noun + plural;

    return (
      <div className="SideMenu">
        <div className="SideMenu-buttons">
          {tabs}
          <div className="SideMenu-stretch" />
        </div>
        {input
          ? <div className="SideMenu-header">
              {input}
              {hasSpinner
                ? <FaCircleONotch className="SideMenu-spinner" />
                : null}
            </div>
          : null}
        <div className="SideMenu-buttons SideMenu-sorts">
          <div className="SideMenu-caption">
            {caption}
          </div>
          <div className="SideMenu-stretch" />
          {sorts}
        </div>
        <ul className="SideMenu-content">
          {content}
        </ul>
      </div>
    );
  }
}

export default SideMenu;
