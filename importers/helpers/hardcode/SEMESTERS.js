// Hard-coded semester data for the database
// Most recent data is at the top and should be updated manually

// Notes: written evaluations started in 1092
//        numeric evaluations started in 1102

/*
Some hints:
- the _id is of the form 1xxy where 20xx is the graduating year and y indicates
  the term: 1 for summer, 2 for fall, 3 for winter (nonexistent), 4 for spring
- the startDate and endDate are the first and last days of class according to
  the registrar's academic calendar (not including reading period, exams, breaks)
*/

// prettier-ignore
module.exports = [
  { _id: '1182', name:   'Fall 2017', abbr: 'F17', startDate: '2017-09-13', endDate: '2017-12-15' },
  { _id: '1174', name: 'Spring 2017', abbr: 'S17', startDate: '2017-02-06', endDate: '2017-05-05' },
  { _id: '1172', name:   'Fall 2016', abbr: 'F16', startDate: '2016-09-14', endDate: '2016-12-16' },
  { _id: '1164', name: 'Spring 2016', abbr: 'S16', startDate: '2016-02-01', endDate: '2016-04-29' },
  { _id: '1162', name:   'Fall 2015', abbr: 'F15', startDate: '2015-09-16', endDate: '2015-12-18' },
  { _id: '1154', name: 'Spring 2015', abbr: 'S15', startDate: '2015-02-02', endDate: '2015-05-01' },
  { _id: '1152', name:   'Fall 2014', abbr: 'F14', startDate: '2014-09-10', endDate: '2014-12-12' },
  { _id: '1144', name: 'Spring 2014', abbr: 'S14', startDate: '2014-02-03', endDate: '2014-05-02' },
  { _id: '1142', name:   'Fall 2013', abbr: 'F13', startDate: '2013-09-11', endDate: '2013-12-13' },
  { _id: '1134', name: 'Spring 2013', abbr: 'S13', startDate: '2013-02-04', endDate: '2013-05-03' },
  { _id: '1132', name:   'Fall 2012', abbr: 'F12', startDate: '2012-09-13', endDate: '2012-12-14' },
  { _id: '1124', name: 'Spring 2012', abbr: 'S12', startDate: '2012-02-06', endDate: '2012-05-04' },
  { _id: '1122', name:   'Fall 2011', abbr: 'F11', startDate: '2011-09-15', endDate: '2011-12-16' },
  { _id: '1114', name: 'Spring 2011', abbr: 'S11', startDate: '2011-01-31', endDate: '2011-04-29' },
  { _id: '1112', name:   'Fall 2010', abbr: 'F10', startDate: '2010-09-16', endDate: '2010-12-17' },
  { _id: '1104', name: 'Spring 2010', abbr: 'S10', startDate: '2010-02-01', endDate: '2010-04-30' }, // dates are a guess (calendar unavailable)
  { _id: '1102', name:   'Fall 2009', abbr: 'F09', startDate: '2009-09-17', endDate: '2009-12-18' }  // dates are a guess (calendar unavailable)
];
