import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import SimpleCover from '../SimpleCover/SimpleCover';
import './Loading.css';

class Loading extends Component {
  render() {
    return (
      <div className="Loading">
        <Navbar isEmpty={true} />
        <SimpleCover loading={true} />
      </div>
    );
  }
}

export default Loading;
