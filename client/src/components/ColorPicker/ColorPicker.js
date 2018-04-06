import React, { Component } from 'react';
import './ColorPicker.css';

class ColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.renderColorPick = this.renderColorPick.bind(this);
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  handleClickOutside(event) {
    if (!this.ref.contains(event.target)) this.setState({ expanded: false });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  renderColorPick(c) {
    const onChangeCourseColorInSchedule = this.props
      .onChangeCourseColorInSchedule;
    const course = this.props.course;

    const handleClick = e => {
      onChangeCourseColorInSchedule(course._id, c._id);
      this.setState({ expanded: false });
      e.stopPropagation();
    };

    return (
      <div
        className="ColorPicker-pick"
        style={{ backgroundColor: `#${c._id}` }}
        onClick={handleClick}
        title={c.name[0].toUpperCase() + c.name.substr(1).toLowerCase()}
        key={c.name}
      />
    );
  }

  render() {
    const colors = this.props.colors;
    const colorLookup = this.props.colorLookup;
    // const onChangeCourseColorInSchedule = this.props.onChangeCourseColorInSchedule;

    const course = this.props.course;
    const color = this.props.color;

    const expanded = this.state.expanded;

    const toggle = this.toggle;
    const renderColorPick = this.renderColorPick;

    if (!colorLookup[course._id]) {
      return (
        <div
          className="ColorPicker"
          ref={ref => {
            this.ref = ref;
          }}
        />
      );
    }

    return (
      <div
        className={'ColorPicker' + (expanded ? ' ColorPicker-expanded' : '')}
        style={{ backgroundColor: color }}
        ref={ref => {
          this.ref = ref;
        }}
        onClick={e => {
          toggle();
          e.stopPropagation();
        }}
        title="Change color"
      >
        {expanded
          ? <div
              className="ColorPicker-picker"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {colors.map(c => renderColorPick(c))}
            </div>
          : null}
      </div>
    );
  }
}

export default ColorPicker;
