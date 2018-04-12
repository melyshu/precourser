import React, { Component } from 'react';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';
import './Demo.css';
import pic0 from '../../images/demo_0.png';
import pic1 from '../../images/demo_1.png';
import pic2 from '../../images/demo_2.png';
import pic3 from '../../images/demo_3.png';
import pic4 from '../../images/demo_4.png';
import pic5 from '../../images/demo_5.png';
import pic6 from '../../images/demo_6.png';
import pic7 from '../../images/demo_7.png';
import pic8 from '../../images/demo_8.png';

const PAGES = [
  {
    image: pic0,
    text:
      "Welcome to precourser! Here is a quick tour of the features you'll find useful for your course selection."
  },
  {
    image: pic1,
    text:
      'Enter any search terms in the search bar. You can search by title, department, distribution, P/D/F options and more!'
  },
  {
    image: pic2,
    text:
      'Click on a result to show/hide course information. Click the buttons to add a course to your schedule, or to save it.'
  },
  {
    image: pic3,
    text:
      'The courses added to your schedule will appear to the right. Click on a section to select it for your schedule.'
  },
  {
    image: pic4,
    text:
      'Click the buttons at the top of the page to change semester or to add/rename/delete schedules.'
  },
  {
    image: pic5,
    text:
      'Click on the buttons at the top of the search pane to search for instructors, or view your saved/selected courses.'
  },
  {
    image: pic6,
    text:
      'Click on an instructor result to display their contact information and all the courses they have taught.'
  },
  {
    image: pic7,
    text:
      "Click on these buttons to save the course or access the registrar's official course offering pages."
  },
  {
    image: pic8,
    text:
      'You can use the link provided to export your precourser schedule into Google Calendar. Happy course selection!'
  }
];

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    if (page < 0) page = PAGES.length - 1;
    if (page >= PAGES.length) page = 0;

    this.setState({ page: page });
  }

  render() {
    const collapseParent = this.props.collapseParent;

    const page = this.state.page;
    const changePage = this.changePage;

    const image = PAGES[page].image;
    const text = PAGES[page].text;

    return (
      <div
        className="Demo"
        onClick={e => {
          collapseParent();
          e.stopPropagation();
        }}
      >
        <div
          className="Demo-popup"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div
            className="Demo-top"
            style={{ backgroundImage: `url(${image})` }}
          />
          <ul className="Demo-text">
            {text}
          </ul>
          <div className="Demo-buttons">
            <div
              className="Demo-page"
              title={`Page ${page + 1} of ${PAGES.length}`}
            >
              {`${page + 1} / ${PAGES.length}`}
            </div>
            <button
              className="Demo-button"
              title="Previous page"
              onClick={e => {
                changePage(page - 1);
                e.stopPropagation();
              }}
            >
              <FaAngleLeft />
            </button>
            <button
              className="Demo-button"
              title="Next page"
              onClick={e => {
                changePage(page + 1);
                e.stopPropagation();
              }}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
