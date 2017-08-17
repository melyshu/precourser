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
    this.setRef = this.setRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  setRef(node) {
    this.ref = node;
  }

  handleClickOutside(event) {
    if (this.ref && !this.ref.contains(event.target)) this.collapse();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    let dropdown;
    if (this.state.expanded && this.props.children) {
      const childrenWithCollapse = React.Children.map(
        this.props.children,
        child => React.cloneElement(child, { collapseParent: this.collapse })
      );
      dropdown = (
        <div className="NavbarItem-dropdown">
          {childrenWithCollapse}
        </div>
      );
    }

    return (
      <div className="NavbarItem" ref={this.setRef}>
        <div className="NavbarItem-display" onClick={this.toggle} tabIndex="0">
          {this.props.display}
        </div>
        {dropdown}
      </div>
    );
  }
}

export default NavbarItem;
