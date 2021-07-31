/*
google-apps-script-zlema - Compute ZLEMA with Google Sheets
Copyright (C) 2021  Kyle Alexander Buan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
 * Simple Moving Average
 * @param {Array} values - The values you want to get the average of
 * @returns {number}
 */
function SMA(values) {
  if (!(values instanceof Array)) {
    return values;
  }

  var sum = values.reduce((prev, cur) => prev + parseFloat(cur[0]), 0);
  return sum / values.length;
}

/*
 * Exponential Moving Average
 * @param {(Array|Number)} values - The values you want to get the average of
 * @param {number} period - The length of the period
 * @returns {number}
 */
function EMA(values, period) {
  if (!(values instanceof Array)) {
    return values;
  }

  if (period > values.length) {
    return SMA(values);
  }

  var smoothing_constant = 2.0 / (period + 1);

  // get the initial value
  var current = SMA(values.slice(0, period));

  var i = period;

  while (i < values.length) {
    current = (values[i][0] - current) * smoothing_constant + current;
    i++;
  }

  return current;
}

/*
 * Zero Lag Exponential Moving Average
 * @param {(Array|Number)} values - The values you want to get the average of
 * @param {number} period - The length of the period
 * @returns {number}
 */
function ZLEMA(values, period) {
  if (!(values instanceof Array)) {
    return values;
  }

  if (period > values.length) {
    return SMA(values);
  }

  var lag = Math.floor((period - 1) / 2);

  var data = [];

  for (var i = 0; i < values.length; i++) {
    if ((i - lag) < 0) {
      data.push([values[i][0] + (values[i][0] - values[0][0])]);
    } else {
      data.push([values[i][0] + (values[i][0] - values[i - lag][0])]);
    }
  }

  return EMA(data, period);
}
