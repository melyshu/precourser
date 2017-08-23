import React, { Component } from 'react';
import './MenuSearch.css';

class MenuSearch extends Component {
  render() {
    return (
      <div className="MenuSearch">
        <input
          className="MenuSearch-input"
          type="text"
          onChange={this.props.onChange}
        />
        <ul className="MenuSearch-results">
          {this.props.children}
        </ul>
      </div>
    );
  }
}

export default MenuSearch;
