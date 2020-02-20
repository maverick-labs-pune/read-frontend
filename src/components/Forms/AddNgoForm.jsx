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
import { TextArea } from "../TextArea/TextArea";

class AddNgoForm extends Component {
  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      t
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="name"
              label={t("FIELD_LABEL_NGO_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name || ""}
              // hasError={errors.name}
              required
            />
            {errors.name ? (
              <div className="form-error">{errors.name}</div>
            ) : null}
          </div>
          <div className="col-lg-8 col-md-8">
            <TextArea
              name="address"
              label={t("FIELD_LABEL_NGO_ADDRESS")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address || ""}
              required
            />
            {errors.address ? (
              <div className="form-error mt-1">{errors.address}</div>
            ) : null}
          </div>
        </div>
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          {t("LABEL_SUBMIT")}
        </Button>
      </form>
    );
  }
}

export default AddNgoForm;
