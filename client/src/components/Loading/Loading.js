import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Cover from '../Cover/Cover';
import './Loading.css';

class Loading extends Component {
  render() {
    return (
      <div className="Loading">
        <Navbar isEmpty={true} />
        <Cover loading={true} />
      </div>
    );
  }
}

export default Loading;
