import React, { Component } from 'react';
import './NavbarDropdown.css';

class NavbarDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
  }

  handleListItemClick(value) {
    return () => {
      this.props.onSelect(value);
      this.props.collapseParent();
    };
  }

  renderListItem(value, label) {
    let className = 'NavbarDropdown-item';
    if (this.props.selectedValue === value)
      className = 'NavbarDropdown-item NavbarDropdown-selected';

    return (
      <li
        key={value}
        onClick={this.handleListItemClick(value)}
        className={className}
        tabIndex="0"
      >
        {label}
      </li>
    );
  }

  render() {
    const values = this.props.values || [];
    const labels = this.props.labels || [];

    const listItems = [];
    for (let i = 0; i < values.length; i++) {
      listItems.push(this.renderListItem(values[i], labels[i]));
    }

    return (
      <ul className="NavbarDropdown">
        {listItems}
      </ul>
    );
  }
}

export default NavbarDropdown;
