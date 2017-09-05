import React, { Component } from 'react';
import './NavbarInput.css';

class NavbarInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue,
      error: null
    };

    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  handleSubmitClick() {
    const value = this.state.value;

    const collapseParent = this.props.collapseParent;
    const defaultValue = this.props.defaultValue;
    const onSubmit = this.props.onSubmit;

    if (!defaultValue) {
      onSubmit();
      return collapseParent();
    }

    const trimmedValue = value.trim().replace(/\s+/g, ' ');
    if (trimmedValue.length > 25) {
      return this.setState({ error: 'Please enter a shorter name' });
    }

    if (!trimmedValue) {
      return this.setState({ error: 'Please enter a valid name' });
    }

    onSubmit(trimmedValue);
    collapseParent();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmitClick();
    }
  }

  setRef(node) {
    this.inputRef = node;
  }

  componentDidMount() {
    if (this.props.defaultValue) this.inputRef.select();
  }

  render() {
    const value = this.state.value;
    const error = this.state.error;

    const collapseParent = this.props.collapseParent;
    const prompt = this.props.prompt;
    const defaultValue = this.props.defaultValue;
    const isShort = this.props.isShort;
    // const onSubmit = this.props.onSubmit;
    const verb = this.props.verb;

    const handleSubmitClick = this.handleSubmitClick;
    const handleChange = this.handleChange;
    const handleKeyDown = this.handleKeyDown;
    const setRef = this.setRef;

    return (
      <div className="NavbarInput">
        <label className="NavbarInput-prompt">
          {prompt}
        </label>
        {defaultValue
          ? <input
              ref={setRef}
              className="NavbarInput-input"
              type="text"
              value={value}
              maxLength={isShort ? '25' : '200'}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          : null}
        {error
          ? <div className="NavbarInput-error">
              {error}
            </div>
          : null}
        <div className="NavbarInput-buttons">
          <button className="NavbarInput-cancel" onClick={collapseParent}>
            Cancel
          </button>
          <button className="NavbarInput-submit" onClick={handleSubmitClick}>
            {verb}
          </button>
        </div>
      </div>
    );
  }
}

export default NavbarInput;
