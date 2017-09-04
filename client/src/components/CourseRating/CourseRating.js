import React, { Component } from 'react';
import './CourseRating.css';

const COLORS = [
  '#f44336', // red
  '#f44336',
  '#FF5722',
  '#FF9800',
  '#FFB300',
  '#FDD835',
  '#C0CA33',
  '#8BC34A',
  '#4CAF50' // green
];

class CourseRating extends Component {
  getColor(score) {
    const stringToRgb = function(string) {
      if (string[0] === '#') string = string.substring(1);
      const rr = string.substr(0, 2);
      const gg = string.substr(2, 2);
      const bb = string.substr(4, 2);

      const r = parseInt(rr, 16);
      const g = parseInt(gg, 16);
      const b = parseInt(bb, 16);

      return [r, g, b];
    };

    const rgbToHsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      let h = 0;
      let s = 0;
      let l = (max + min) / 2;
      if (max === min) {
        return [h, s, l];
      }

      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;

      return [h, s, l];
    };

    const hslLinearGradient = function(hsl1, hsl2, x1, x2, x) {
      const hsl = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        hsl[i] = hsl1[i] + (x - x1) / (x2 - x1) * (hsl2[i] - hsl1[i]);
      }
      return hsl;
    };

    const hslToString = function(hsl) {
      return (
        'hsl(' +
        hsl[0] * 360 +
        ', ' +
        hsl[1] * 100 +
        '%, ' +
        hsl[2] * 100 +
        '%)'
      );
    };

    const breakpoints = COLORS.length - 1;
    const scaledScore = (score - 1) / 4 * breakpoints;
    const scoreUpper = Math.ceil(scaledScore) || 1;
    const scoreLower = scoreUpper - 1;
    const colorUpper = COLORS[scoreUpper];
    const colorLower = COLORS[scoreLower];
    const rgbUpper = stringToRgb(colorUpper);
    const rgbLower = stringToRgb(colorLower);
    const hslUpper = rgbToHsl(rgbUpper);
    const hslLower = rgbToHsl(rgbLower);
    const hsl = hslLinearGradient(
      hslLower,
      hslUpper,
      scoreLower,
      scoreUpper,
      scaledScore
    );
    return hslToString(hsl);
  }

  render() {
    const score = this.props.score;
    const _new = this.props.new;

    const getColor = this.getColor;

    return (
      <span
        className={'CourseRating' + (!score && _new ? ' CourseRating-new' : '')}
        style={score ? { color: getColor(score) } : null}
      >
        {score ? score.toFixed(2) : _new ? 'New' : ''}
      </span>
    );
  }
}

export default CourseRating;
