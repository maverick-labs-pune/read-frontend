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
import React from "react";
import { default as Picker } from "react-datepicker";
import PropTypes from "prop-types";

function DatePicker(props) {
  const { label, required, customStyles, id } = props;
  return (
    <div>
      {label ? (
        <label htmlFor={id}>
          {label} {required ? <span className="required ">*</span> : null}
        </label>
      ) : null}
      <Picker styles={customStyles} {...props} />
    </div>
  );
}

export default DatePicker;

DatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
