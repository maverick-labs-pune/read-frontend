/*
 *  Copyright (c) 2020 Maverick Labs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as,
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import moment from "moment";

export const getAllRecurringDates = (
  startDate,
  endDate,
  dayOfWeek,
  start_time_hours,
  start_time_minutes,
  end_time_hours,
  end_time_minutes
) => {
  let weekNo = moment(startDate).weeks();
  let day = moment()
    .week(weekNo)
    .days(dayOfWeek);
  let arr = [];
  while (day.isBefore(endDate)) {
    if (day.isAfter(startDate)) {
      let start_date_time = moment(day)
        .startOf("days")
        .add(start_time_hours, "hours")
        .add(start_time_minutes, "minutes")
        .toISOString();
      let end_date_time = moment(day)
        .startOf("days")
        .add(end_time_hours, "hours")
        .add(end_time_minutes, "minutes")
        .toISOString();
      arr.push({ start_date_time, end_date_time });

      day.add("days", 7);
    } else {
      day.add("days", 7);
      continue;
    }
  }
  return arr;
};

export const getYearOfInterventionDropdown = () => {
  let startDate = moment()
    .year(1970)
    .startOf("years");

  let startYear = startDate.year();
  let endYear = moment().year();
  let yearOfInterventions = [];
  while (startYear <= endYear) {
    yearOfInterventions.push({
      label: startYear,
      value: moment()
        .year(startYear)
        .startOf("years")
        .format("YYYY-MM-DD")
    });
    startYear++;
  }
  return yearOfInterventions;
};
