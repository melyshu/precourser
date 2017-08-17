import React, { Component } from 'react';
import './NavbarInput.css';

class NavbarInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue,
      error: null
    };

    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  handleCancelClick() {
    this.props.collapseParent();
  }

  handleSubmitClick() {
    if (!this.props.defaultValue) {
      this.props.onSubmit();
      this.props.collapseParent();
      return;
    }

    if (!this.state.value) {
      this.setState({ error: 'Please enter a valid name' });
      return;
    }

    const trimmedValue = this.state.value.trim().replace(/\s+/g, ' ');
    if (trimmedValue.length > 25) {
      this.setState({ error: 'Please enter a shorter name' });
      return;
    }

    this.props.onSubmit(this.state.value);
    this.props.collapseParent();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  setRef(node) {
    this.inputRef = node;
  }

  componentDidMount() {
    if (this.props.defaultValue) this.inputRef.select();
  }

  render() {
    let error;
    if (this.state.error) {
      error = (
        <div className="NavbarInput-error">
          {this.state.error}
        </div>
      );
    }

    let input;
    if (this.props.defaultValue) {
      input = (
        <input
          ref={this.setRef}
          className="NavbarInput-input"
          type="text"
          value={this.state.value}
          maxLength="25"
          onChange={this.handleChange}
        />
      );
    }

    return (
      <div className="NavbarInput">
        <label className="NavbarInput-prompt">
          {this.props.prompt}
        </label>
        {input}
        <div className="NavbarInput-buttons">
          <button
            className="NavbarInput-cancel"
            onClick={this.handleCancelClick}
          >
            Cancel
          </button>
          <button
            className="NavbarInput-submit"
            onClick={this.handleSubmitClick}
          >
            {this.props.verb}
          </button>
        </div>
        {error}
      </div>
    );
  }
}

export default NavbarInput;
