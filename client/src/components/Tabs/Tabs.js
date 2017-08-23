import React, { Component } from 'react';
import './Tabs.css';

class Tabs extends Component {
  render() {
    const labels = this.props.labels;

    const tabs = [];
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const className =
        i === this.props.selected ? 'Tabs-tab Tabs-selected' : 'Tabs-tab';
      tabs.push(
        <div
          key={i}
          className={className}
          onClick={this.props.onClick.bind(null, i)}
        >
          {label}
        </div>
      );
    }

    return (
      <nav className="Tabs">
        {tabs}
      </nav>
    );
  }
}

export default Tabs;
