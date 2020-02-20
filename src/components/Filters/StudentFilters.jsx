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
import { Input } from "../Input/Input";
import Select from "../Select/Select";

class StudentFilters extends Component {
  state = {};
  render() {
    const {
      text,
      onFilterTextChange,
      open,
      selectedSchool,
      onSchoolFilterChange,
      schools,
      academicYears,
      onAcademicYearFilterChange,
      selectedAcademicYear
    } = this.props;
    return (
      <Collapse open={open}>
        {open ? (
          <div className="row">
            <div className="col-md-3 col-lg-3">
              <Input
                placeholder="Enter student to search"
                value={text}
                onChange={onFilterTextChange}
              />
            </div>
            <div className="col-md-3 col-lg-3">
              <Select
                placeholder="Select School"
                value={selectedSchool}
                onChange={onSchoolFilterChange}
                options={schools}
              />
            </div>
            <div className="col-md-3 col-lg-3">
              <Select
                placeholder="Select Academic Year"
                value={selectedAcademicYear}
                onChange={onAcademicYearFilterChange}
                options={academicYears}
              />
            </div>
          </div>
        ) : null}
      </Collapse>
    );
  }
}

export default StudentFilters;
