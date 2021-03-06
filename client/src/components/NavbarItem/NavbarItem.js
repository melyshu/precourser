import React, { Component } from 'react';
import './NavbarItem.css';

class NavbarItem extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };

    if (
      props.demo &&
      window.location.pathname !== '/home' &&
      !localStorage.getItem('precourser-demo')
    ) {
      this.state = { expanded: true };
      localStorage.setItem('precourser-demo', true);
    }

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
    const description = this.props.description;
    const alignRight = this.props.alignRight;
    const demo = this.props.demo;
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
          title={description}
          onClick={toggle}
          tabIndex="0"
        >
          {display}
        </button>
        {expanded
          ? demo
            ? React.Children.map(children, child =>
                React.cloneElement(child, { collapseParent: collapse })
              )
            : <div
                className={
                  'NavbarItem-dropdown NavbarItem-align-' +
                  (alignRight ? 'right' : 'left')
                }
              >
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
