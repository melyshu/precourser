import React, { Component } from 'react';
import './DisplayPane.css';
import DisplaySchedule from '../DisplaySchedule/DisplaySchedule';
import DisplayCourse from '../DisplayCourse/DisplayCourse';

class DisplayPane extends Component {
  render() {
    const user = this.props.user;
    const selectedSchedule = this.props.selectedSchedule;
    const selectedCourse = this.props.selectedCourse;
    const hoveredCourse = this.props.hoveredCourse;
    const hoveredSection = this.props.hoveredSection;
    const now = this.props.now;
    const departmentLookup = this.props.departmentLookup;
    const colorLookup = this.props.colorLookup;
    const semesterLookup = this.props.semesterLookup;
    const distributionLookup = this.props.distributionLookup;
    const pdfLookup = this.props.pdfLookup;
    const auditLookup = this.props.auditLookup;
    const onSelectCourse = this.props.onSelectCourse;
    const onUnselectCourse = this.props.onUnselectCourse;
    const onSaveCourse = this.props.onSaveCourse;
    const onUnsaveCourse = this.props.onUnsaveCourse;
    const onAddSectionToSchedule = this.props.onAddSectionToSchedule;
    const onRemoveSectionFromSchedule = this.props.onRemoveSectionFromSchedule;
    const onMouseOverSection = this.props.onMouseOverSection;
    const onMouseOutSection = this.props.onMouseOutSection;

    return (
      <div className="DisplayPane">
        {selectedCourse
          ? <DisplayCourse
              user={user}
              selectedCourse={selectedCourse}
              now={now}
              departmentLookup={departmentLookup}
              semesterLookup={semesterLookup}
              distributionLookup={distributionLookup}
              pdfLookup={pdfLookup}
              auditLookup={auditLookup}
              onSelectCourse={onSelectCourse}
              onUnselectCourse={onUnselectCourse}
              onSaveCourse={onSaveCourse}
              onUnsaveCourse={onUnsaveCourse}
            />
          : <DisplaySchedule
              selectedSchedule={selectedSchedule}
              hoveredCourse={hoveredCourse}
              hoveredSection={hoveredSection}
              colorLookup={colorLookup}
              onAddSectionToSchedule={onAddSectionToSchedule}
              onRemoveSectionFromSchedule={onRemoveSectionFromSchedule}
              onMouseOverSection={onMouseOverSection}
              onMouseOutSection={onMouseOutSection}
            />}
      </div>
    );
  }
}

export default DisplayPane;
