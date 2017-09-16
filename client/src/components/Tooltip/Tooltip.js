import React, { Component } from 'react';
import Layer from 'ak-layer';
import './Tooltip.css';

class Tooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    this.setState({ hovered: true });
  }

  handleMouseOut() {
    this.setState({ hovered: false });
  }

  render() {
    const tooltip = this.props.tooltip;
    const position = this.props.position;
    const children = this.props.children;

    const hovered = this.state.hovered;

    const handleMouseOver = this.handleMouseOver;
    const handleMouseOut = this.handleMouseOut;

    return (
      <Layer
        position={position}
        content={
          <div className="Tooltip-tooltip">
            {tooltip}
          </div>
        }
        className="Tooltip-wrapper"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {children}
      </Layer>
    );
  }
}

export default Tooltip;
