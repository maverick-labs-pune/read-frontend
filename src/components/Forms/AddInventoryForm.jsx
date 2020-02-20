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
import find from "lodash/find";
import { INVENTORY_STATUS } from "../../utils/constants";

class AddInventoryForm extends Component {
  getInventoryStatusType = () => {
    const { initialValues } = this.props;
    if (Object.keys(initialValues).length > 0) {
      const { status } = initialValues;
      const inventoryStatus = find(INVENTORY_STATUS, { label: status });
      return inventoryStatus;
    }
    return null;
  };

  setField = (selected, setFieldValue, name) => {
    setFieldValue(name, selected);
  };

  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      setFieldValue
    } = this.props;
    const { t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-5 col-md-5">
            <Input
              name="serial_number"
              label={t("FIELD_LABEL_INVENTORY_SERIAL_NUMBER")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.serial_number || ""}
              required
            />
            {errors.serial_number ? (
              <div className="form-error">{errors.serial_number}</div>
            ) : null}
          </div>
          <div className="col-lg-6 col-md-6">
            <Select
              name="status"
              label={t("FIELD_LABEL_INVENTORY_STATUS")}
              onChange={value => {
                this.setField(value, setFieldValue, "status");
              }}
              onBlur={handleBlur}
              value={values.status}
              options={INVENTORY_STATUS}
              required
            />
            {errors.status ? (
              <div className="form-error mt-2">{errors.status}</div>
            ) : null}
          </div>
        </div>
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default AddInventoryForm;
