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
import { Button } from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";

class CancelSessionForm extends Component {
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
          <div className="col">
            <h4>
              Are you sure you want to cancel session? Add comments below to
              cancel the session.
            </h4>
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <TextArea
              name="comments"
              label="Comments"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.comments || ""}
              required
            />
            {errors.comments ? (
              <div className="form-error mt-2">{errors.comments}</div>
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

export default CancelSessionForm;
