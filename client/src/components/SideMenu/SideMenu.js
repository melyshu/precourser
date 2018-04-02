import React, { Component } from 'react';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import './SideMenu.css';

const MAX_ENTRIES = 20;

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keys: props.keys.slice(),
      position: props.tabLabels.slice().fill(0),
      tab: 0,
      sort: props.tabLabels.slice().fill(0),
      sign: props.tabLabels.slice().fill(1)
    };

    this.handlePositionUp = this.handlePositionUp.bind(this);
    this.handlePositionDown = this.handlePositionDown.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
  }

  handlePositionUp() {
    const position = this.state.position.slice();
    const tab = this.state.tab;

    position[tab] -= MAX_ENTRIES;
    this.setState({ position: position }, () => {
      this.contentBottom.scrollIntoView();
    });
  }

  handlePositionDown() {
    const position = this.state.position.slice();
    const tab = this.state.tab;

    position[tab] += MAX_ENTRIES;
    this.setState({ position: position }, () => {
      this.contentTop.scrollIntoView();
    });
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

  componentWillReceiveProps(nextProps) {
    const position = this.state.position.slice();
    let updated = false;

    for (let i = 0; i < position.length; i++) {
      if (nextProps.keys[i] !== this.state.keys[i]) {
        position[i] = 0;
        updated = true;
      }
    }

    if (updated) this.setState({ position: position, keys: nextProps.keys });
  }

  render() {
    const tab = this.state.tab;
    const position = this.state.position[tab];
    const sort = this.state.sort[tab];
    const sign = this.state.sign[tab];

    const tabLabels = this.props.tabLabels;
    const tabDescriptions = this.props.tabDescriptions;
    const sortLabels = this.props.sortLabels;
    const sortDescriptions = this.props.sortDescriptions;
    const renderInput = this.props.renderInput;
    const renderIcon = this.props.renderIcon;
    const renderContent = this.props.renderContent;
    const captionNouns = this.props.captionNouns;
    const edge = this.props.edge;

    const handlePositionUp = this.handlePositionUp;
    const handlePositionDown = this.handlePositionDown;
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
    const icon = renderIcon(tab);
    const content = renderContent(tab, sort, sign);

    const noun = captionNouns[tab];
    const plural = content.length === 1 ? '' : 's';
    const start = position + 1;
    const end =
      content.length > position + MAX_ENTRIES
        ? position + MAX_ENTRIES
        : content.length;
    const caption =
      content.length > MAX_ENTRIES
        ? `${start}\u2013${end} of ${content.length} ${noun}${plural}`
        : `${content.length} ${noun}${plural}`;

    const contentHeader = [];
    if (position > 0) {
      contentHeader.push(
        <li
          className="SideMenu-content-header"
          onClick={handlePositionUp}
          key="up"
        >
          <FaAngleUp />
        </li>
      );
    }

    const contentFooter = [];
    if (position + MAX_ENTRIES < content.length) {
      contentFooter.push(
        <li
          className="SideMenu-content-footer"
          onClick={handlePositionDown}
          key="down"
        >
          <FaAngleDown />
        </li>
      );
    }

    return (
      <div className={'SideMenu' + (edge ? ' SideMenu-' + edge : '')}>
        <div className="SideMenu-buttons">
          {tabs}
          <div className="SideMenu-stretch" />
        </div>
        {input
          ? <div className="SideMenu-header">
              {input}
              {icon}
            </div>
          : null}
        <div className="SideMenu-buttons SideMenu-sorts">
          <div className="SideMenu-caption" title={caption}>
            {caption}
          </div>
          <div className="SideMenu-stretch" />
          {sorts}
        </div>
        <ul className="SideMenu-content">
          <li
            ref={ref => {
              this.contentTop = ref;
            }}
            key="top"
          />
          {contentHeader}
          {content.slice(position, position + MAX_ENTRIES)}
          {contentFooter}
          <li
            ref={ref => {
              this.contentBottom = ref;
            }}
            key="bottom"
          />
        </ul>
      </div>
    );
  }
}

export default SideMenu;
