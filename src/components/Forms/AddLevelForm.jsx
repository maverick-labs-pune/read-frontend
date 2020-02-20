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

class AddLevelForm extends Component {
  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors
    } = this.props;
    const { t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="rank"
              label={t("FIELD_LABEL_LEVEL_RANK")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.rank || ""}
              required
              disabled
            />
            {errors.rank ? (
              <div className="form-error">{errors.rank}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="mr_in"
              label={t("FIELD_LABEL_RANK_MR_IN")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.mr_in || ""}
              required
            />
            {errors.mr_in ? (
              <div className="form-error">{errors.mr_in}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="en_in"
              label={t("FIELD_LABEL_RANK_EN_IN")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.en_in || ""}
              required
            />
            {errors.en_in ? (
              <div className="form-error">{errors.en_in}</div>
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

export default AddLevelForm;
