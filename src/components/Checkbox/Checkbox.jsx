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
import PropTypes from "prop-types";

import "./Checkbox.scss";

class Checkbox extends Component {
  render() {
    const { label, checked, id, ...checkboxProps } = this.props;
    return (
      <div className="r-checkbox">
        <input
          className="styled-checkbox"
          id={id}
          type="checkbox"
          checked={checked}
          {...checkboxProps}
        />
        <label className="checkbox-label" htmlFor={id}>
          {label ? label : ""}
        </label>
      </div>
    );
  }
}

export default Checkbox;
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string
};
