import React, { Component } from 'react';
import './NavbarItem.css';

class NavbarItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.toggle = this.toggle.bind(this);
    this.collapse = this.collapse.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  handleClickOutside(event) {
    if (!this.ref.contains(event.target)) this.collapse();
  }

  setRef(node) {
    this.ref = node;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const expanded = this.state.expanded;

    const display = this.props.display;
    const children = this.props.children;

    const toggle = this.toggle;
    const collapse = this.collapse;
    const setRef = this.setRef;

    return (
      <div className="NavbarItem" ref={setRef}>
        <button
          className={
            'NavbarItem-display' + (expanded ? ' NavbarItem-active' : '')
          }
          onClick={toggle}
          tabIndex="0"
        >
          {display}
        </button>
        {expanded
          ? <div className="NavbarItem-dropdown">
              {React.Children.map(children, child =>
                React.cloneElement(child, { collapseParent: collapse })
              )}
            </div>
          : null}
      </div>
    );
  }
}

export default NavbarItem;
