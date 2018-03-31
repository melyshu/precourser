import React, { Component } from 'react';
import './NavbarInput.css';

const MAX_NAME_LENGTH = 25;
const MAX_FEEDBACK_LENGTH = 200;

class NavbarInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue,
      copied: false,
      error: null
    };

    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  handleSubmitClick() {
    const value = this.state.value;

    const collapseParent = this.props.collapseParent;
    const defaultValue = this.props.defaultValue;
    const isFeedback = this.props.isFeedback;
    const onSubmit = this.props.onSubmit;
    const isReadOnly = this.props.isReadOnly;

    if (!defaultValue) {
      onSubmit();
      return collapseParent();
    }

    const trimmedValue = value.trim().replace(/\s+/g, ' ');
    if (isFeedback) {
      if (trimmedValue.length > MAX_FEEDBACK_LENGTH) {
        return this.setState({
          error: 'Use the link for longer responses!'
        });
      }
      if (!trimmedValue.length) {
        return this.setState({
          error: 'Tongue tied?'
        });
      }
    } else if (!isReadOnly) {
      if (trimmedValue.length > MAX_NAME_LENGTH) {
        return this.setState({ error: 'Please enter a shorter name' });
      }

      if (!trimmedValue.length) {
        return this.setState({ error: 'Please enter a valid name' });
      }
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

  handleCopy() {
    this.inputRef.select();
    document.execCommand('Copy');
    this.setState({ copied: true });
  }

  setRef(node) {
    this.inputRef = node;
  }

  // componentDidMount() {
  //   if (this.props.defaultValue) this.inputRef.select();
  // }

  render() {
    const value = this.state.value;
    const error = this.state.error;
    const copied = this.state.copied;

    const collapseParent = this.props.collapseParent;
    const prompt = this.props.prompt;
    const defaultValue = this.props.defaultValue;
    const isFeedback = this.props.isFeedback;
    // const onSubmit = this.props.onSubmit;
    const verb = this.props.verb;
    const isReadOnly = this.props.isReadOnly;

    const handleSubmitClick = this.handleSubmitClick;
    const handleChange = this.handleChange;
    const handleKeyDown = this.handleKeyDown;
    const handleCopy = this.handleCopy;
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
              maxLength={isFeedback ? MAX_FEEDBACK_LENGTH : MAX_NAME_LENGTH}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={event => {
                event.target.select();
              }}
              onClick={
                isReadOnly
                  ? event => {
                      event.target.select();
                    }
                  : null
              }
              autoFocus={true}
              readOnly={isReadOnly}
            />
          : null}
        {error
          ? <div className="NavbarInput-error">
              {error}
            </div>
          : null}
        <div className="NavbarInput-buttons">
          <button
            className={isReadOnly ? 'NavbarInput-submit' : 'NavbarInput-cancel'}
            onClick={isReadOnly ? handleCopy : collapseParent}
            onMouseOut={() => {
              this.setState({ copied: false });
            }}
          >
            {isReadOnly ? (copied ? 'Copied' : 'Copy') : 'Cancel'}
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
