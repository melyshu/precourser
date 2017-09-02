import React, { Component } from 'react';
import './NavbarDropdown.css';

class NavbarDropdown extends Component {
  render() {
    const collapseParent = this.props.collapseParent;
    const items = this.props.items;
    const selectedValue = this.props.selectedValue;
    const onSelect = this.props.onSelect;

    const handleListItemClick = value => {
      onSelect(value);
      collapseParent();
    };

    return (
      <ul className="NavbarDropdown">
        {items.map(item =>
          <li
            key={item.value}
            className={
              'NavbarDropdown-item' +
              (selectedValue === item.value ? ' NavbarDropdown-selected' : '')
            }
            onClick={handleListItemClick.bind(null, item.value)}
            tabIndex="0"
          >
            {item.label}
          </li>
        )}
      </ul>
    );
  }
}

export default NavbarDropdown;
