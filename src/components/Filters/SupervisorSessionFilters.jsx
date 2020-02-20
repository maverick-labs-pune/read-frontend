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
import React, { Component } from "react";
import Collapse from "../Collapse/Collapse";
import Select from "../Select/Select";
import DatePicker from "../DatePicker/DatePicker";

class SupervisorSessionFilters extends Component {
  state = {};
  render() {
    const {
      open,
      selectedBookFairy,
      onBookFairyFilterChange,
      bookFairies,
      fromDate,
      onFromDateChange,
      toDate,
      onToDateChange
    } = this.props;
    return (
      <Collapse open={open}>
        {open ? (
          <div className="row">
            <div className="col-md-3 col-lg-3">
              <Select
                label="Select Book Fairy"
                value={selectedBookFairy}
                onChange={onBookFairyFilterChange}
                options={bookFairies}
              />
            </div>
            <div className="col-md-3 col-lg-3">
              <DatePicker
                selected={fromDate}
                onChange={onFromDateChange}
                dateFormat="YYYY-MM-dd"
                name="start_date_recurring"
                label="Start date"
                id="start-date-recurring"
              />
            </div>
            <div className="col-md-3 col-lg-3">
              <DatePicker
                selected={toDate}
                onChange={onToDateChange}
                dateFormat="YYYY-MM-dd"
                minDate={fromDate}
                name="end_date_recurring"
                label="End date"
                id="end-date-recurring"
              />
            </div>
          </div>
        ) : null}
      </Collapse>
    );
  }
}

export default SupervisorSessionFilters;
