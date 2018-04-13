import React, { Component } from 'react';
import FaFilter from 'react-icons/lib/fa/filter';
import './FilterSelector.css';

class FilterSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      hovered: null,
      tab: 0
    };

    this.toggle = this.toggle.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleChangeTab(tab) {
    this.setState({
      tab: tab
    });
  }

  handleHover(term) {
    this.setState({
      hovered: term
    });
  }

  render() {
    const expanded = this.state.expanded;
    const hovered = this.state.hovered;
    const tab = this.state.tab;

    const selectedSemester = this.props.selectedSemester;
    const departmentLookup = this.props.departmentLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const onChangeCourseSearch = this.props.onChangeCourseSearch;

    const toggle = this.toggle;
    const handleChangeTab = this.handleChangeTab;
    const handleHover = this.handleHover;

    const filters = [
      {
        title: 'Departments',
        values: Object.keys(departmentLookup).sort()
      },
      {
        title: 'Distributions',
        values: Object.keys(distributionLookup).sort()
      },
      {
        title: 'P/D/F options',
        values: Object.keys(pdfLookup).sort()
      },
      {
        title: 'Audit options',
        values: Object.keys(auditLookup).sort()
      }
    ];

    const lookups = [
      departmentLookup,
      distributionLookup,
      pdfLookup,
      auditLookup
    ];

    const menuItems = [];
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];
      menuItems.push(
        <li
          className={
            'FilterSelector-menu-item' +
            (i === tab ? ' FilterSelector-menu-selected' : '')
          }
          onClick={() => handleChangeTab(i)}
          key={f.title}
        >
          {f.title}
        </li>
      );
    }

    const filterItems = [];
    const values = filters[tab].values;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      filterItems.push(
        <li
          className="FilterSelector-filter"
          onClick={() => onChangeCourseSearch(v, selectedSemester._id)}
          onMouseOver={() => handleHover(v)}
          onMouseOut={() => handleHover(null)}
          title={lookups[tab][v]}
          key={v}
        >
          {v}
        </li>
      );
    }

    return (
      <div className="FilterSelector">
        <button
          className={
            'FilterSelector-toggle' +
            (expanded ? ' FilterSelector-expanded' : '')
          }
          onClick={toggle}
          title="Toggle filters"
        >
          <FaFilter />
        </button>
        {expanded
          ? <div className="FilterSelector-popup">
              <div className="FilterSelector-main">
                <ul className="FilterSelector-menu">
                  {menuItems}
                </ul>
                <ul className="FilterSelector-filters">
                  {filterItems}
                </ul>
              </div>
              <div className="FilterSelector-description">
                {hovered
                  ? `${hovered}: ${lookups[tab][hovered]}`
                  : 'Hint: you may combine filters!'}
              </div>
            </div>
          : null}
      </div>
    );
  }
}

export default FilterSelector;
