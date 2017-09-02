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
    // const onSubmit = this.props.onSubmit;
    const verb = this.props.verb;

    const setRef = this.setRef;

    const handleChange = this.handleChange;
    const handleSubmitClick = this.handleSubmitClick;

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
              maxLength="25"
              onChange={handleChange}
            />
          : null}
        <div className="NavbarInput-buttons">
          <button className="NavbarInput-cancel" onClick={collapseParent}>
            Cancel
          </button>
          <button className="NavbarInput-submit" onClick={handleSubmitClick}>
            {verb}
          </button>
        </div>
        {error
          ? <div className="NavbarInput-error">
              {error}
            </div>
          : null}
      </div>
    );
  }
}

export default NavbarInput;
