import React, { Component } from 'react';
import './DisplayScheduleDay.css';
import DisplayScheduleSession from '../DisplayScheduleSession/DisplayScheduleSession';

class DisplayScheduleDay extends Component {
  constructor(props) {
    super(props);

    this.renderSessions = this.renderSessions.bind(this);
    this.renderCells = this.renderCells.bind(this);
  }

  // position the sessions
  renderSessions() {
    //
    // first sort sessions by start time then length
    const compare = (a, b) => {
      return (
        a.startTime - b.startTime ||
        b.endTime - a.endTime ||
        (a.course.department > b.course.department) -
          (a.course.department < b.course.department) ||
        (a.course.catalogNumber > b.course.catalogNumber) -
          (a.course.catalogNumber < b.course.catalogNumber) ||
        (a.section.name > b.section.name) - (a.section.name < b.section.name)
      );
    };
    const orderedSessions = this.props.sessions.slice().sort(compare);

    //
    // place each session in an 'entry' to hold metadata
    // arrange entries in columns flushing left based on start / end times
    // create graph links between entries

    // an index is an ill-named column
    const indexes = [];

    // virtual entries to represent the left and right edges
    const virtualFirstEntry = { position: { right: 0 } };
    const virtualLastEntry = { position: { left: 100 } };
    // positioning for both left and right is done on an absolute percentage-
    // based x-axis where 0 is the left edge and 100 is the right edge.
    // this is different from the css positioning

    // process each session
    for (let i = 0; i < orderedSessions.length; i++) {
      const session = orderedSessions[i];

      // find leftmost index that fits, or create new index
      for (let j = 0; j < indexes.length + 1; j++) {
        // add index if not enough
        if (j === indexes.length) indexes.push([]);

        const index = indexes[j];
        const lastEntryInIndex = index[index.length - 1];

        // found the index!
        if (
          index.length === 0 ||
          session.meeting.startTime >= lastEntryInIndex.session.meeting.endTime
        ) {
          // create a new entry for this session
          const indexEntry = {
            session: session,
            upLeft: undefined,
            upRight: undefined,
            downLeft: [],
            downRight: []
          };
          /*
          Graph links:

          upLeft: the unique entry in the index to the left that prevented this
            entry from being placed into that index, or the virtualFirstEntry if
            in the first index.

          downRight: the entries for which this entry is the upLeft (i.e. the
            reverse of the upLeft links).

          upRight: the unique entry in the closest index to the right that would
            prevent this entry from being placed into that index (due to
            overlap), or the virtualLastEntry if none exist.

          downLeft: the entries for which this entry is the upRight (i.e. the
            reverse of the upRight links).

          */

          // update left links
          if (j > 0) {
            // find entry to the top left
            const prevIndex = indexes[j - 1];
            const lastEntryInPrevIndex = prevIndex[prevIndex.length - 1];

            indexEntry.upLeft = lastEntryInPrevIndex;
            lastEntryInPrevIndex.downRight.push(indexEntry);
          } else {
            // use left edge
            indexEntry.upLeft = virtualFirstEntry;
          }

          // update right links
          for (let k = j + 1; k < indexes.length + 1; k++) {
            if (k === indexes.length) {
              // use right edge
              indexEntry.upRight = virtualLastEntry;
              break;
            }

            // find entry to the top right
            const nextIndex = indexes[k];
            const lastEntryInNextIndex = nextIndex[nextIndex.length - 1];
            if (
              session.meeting.startTime <
              lastEntryInNextIndex.session.meeting.endTime
            ) {
              // this entry would have overlapped in nextIndex
              indexEntry.upRight = lastEntryInNextIndex;
              lastEntryInNextIndex.downLeft.push(indexEntry);
              break;
            }
          } // end update right links

          // insert into index
          index.push(indexEntry);

          break;
        } // end found the index
      } // end for each index
    } // end for each session

    //
    // position the entries (set their widths)

    // go through indexes backwards from right to left
    for (let i = indexes.length - 1; i >= 0; i--) {
      const index = indexes[i];

      // process index from top to bottom
      for (let j = 0; j < index.length; j++) {
        const entry = index[j];

        // skip already positioned entries
        if (entry.position) continue;

        // collect linked list towards up left until hit positioned entry
        // we want to stretch these entries to fill the space to the right
        const entryChain = [];
        for (
          let currentEntry = entry;
          !currentEntry.position;
          currentEntry = currentEntry.upLeft
        ) {
          entryChain.push(currentEntry);
        }

        // try a fit
        const length = entryChain.length;
        const xStart = entryChain[length - 1].upLeft.position.right;
        const xEnd = entry.upRight.position.left;
        const widthPer = (xEnd - xStart) / length;

        // validate potential positions of this fit
        let effectiveLength;
        for (let k = 0; k < entryChain.length; k++) {
          const currentEntry = entryChain[k];
          const currentRight = xEnd - k * widthPer;

          // uh oh... we stretched too far to the right and it's overlapping!
          if (
            currentEntry.upRight &&
            currentEntry.upRight.position.left < currentRight
          ) {
            // this is how many we can fit without overlapping
            effectiveLength = k;
            break;
          }
        }

        // finalise positions
        if (!effectiveLength) {
          for (let k = 0; k < length; k++) {
            const currentEntry = entryChain[k];
            currentEntry.position = {
              left: xEnd - (k + 1) * widthPer,
              right: xEnd - k * widthPer
            };
          }
        } else {
          // if overlap happened we cut the linked list short and position up
          // to the cut (how many we can fit without overlapping)
          // the entries positioned will now stretch to the left so we won't
          // create any new overlaps
          const xStartActual =
            entryChain[effectiveLength].upRight.position.left;
          const widthPerActual = (xEnd - xStartActual) / effectiveLength;

          for (let k = 0; k < effectiveLength; k++) {
            const currentEntry = entryChain[k];
            currentEntry.position = {
              left: xEnd - (k + 1) * widthPerActual,
              right: xEnd - k * widthPerActual
            };
          }
        } // end overlap happened
      } // end loop through index top to bottom
    } // end loop through indexes right to left

    // create session components
    const returnedSessions = [];
    for (let i = 0; i < indexes.length; i++) {
      for (let j = 0; j < indexes[i].length; j++) {
        const entry = indexes[i][j];

        // css position
        const position = {
          left: entry.position.left + '%',
          right: 100 - entry.position.right + '%'
        };
        returnedSessions.push(
          <DisplayScheduleSession
            onAddSectionToSchedule={this.props.onAddSectionToSchedule}
            onRemoveSectionFromSchedule={this.props.onRemoveSectionFromSchedule}
            onMouseOverSection={this.props.onMouseOverSection}
            onMouseOutSection={this.props.onMouseOutSection}
            hoveredSection={this.props.hoveredSection}
            hoveredCourse={this.props.hoveredCourse}
            key={entry.session.section._id}
            session={entry.session}
            position={position}
            minTime={this.props.minTime}
            maxTime={this.props.maxTime}
            colorLookup={this.props.colorLookup}
          />
        );
      }
    }

    return returnedSessions;
  }

  renderCells(labels) {
    const cells = [];
    const minTime = this.props.minTime;
    const maxTime = this.props.maxTime;
    for (let i = 0; i < 24; i++) {
      if (i * 60 < minTime || i * 60 > maxTime) continue;
      const topTime = Math.max(i * 60, minTime);
      const bottomTime = Math.min((i + 1) * 60, maxTime);
      const top = (topTime - minTime) / (maxTime - minTime) * 100 + '%';
      const bottom = (maxTime - bottomTime) / (maxTime - minTime) * 100 + '%';
      const style = { top: top, bottom: bottom };
      cells.push(
        <div key={i} className="DisplayScheduleDay-cell" style={style}>
          {labels ? (i - 1) % 12 + 1 : ''}
        </div>
      );
    }

    return cells;
  }

  render() {
    const labels = this.props.labels;
    const displayScheduleSessions = labels ? null : this.renderSessions();
    const cells = this.renderCells(labels);
    const className = labels
      ? 'DisplayScheduleDay DisplayScheduleDay-labels'
      : 'DisplayScheduleDay';

    const day =
      ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][
        this.props.day
      ] || '';

    return (
      <div className={className}>
        <div className="DisplayScheduleDay-header">
          {day}
        </div>
        <div className="DisplayScheduleDay-body">
          {cells}
          {displayScheduleSessions}
        </div>
      </div>
    );
  }
}

export default DisplayScheduleDay;
