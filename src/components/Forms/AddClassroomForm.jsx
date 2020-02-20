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
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import Select from "../Select/Select";

class AddClassroomForm extends Component {
  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      standards,
      selectedStandard,
      schoolDetails,
      onStandardChange
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="school"
              label="School"
              onBlur={handleBlur}
              value={schoolDetails.name}
              readOnly
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={165}
              name="standard"
              label="Standard"
              onChange={onStandardChange}
              onBlur={handleBlur}
              value={selectedStandard}
              options={standards}
              required
              defaultValue={standards[0]}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="division"
              label="Division"
              onBlur={handleBlur}
              value={values.division || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default AddClassroomForm;
