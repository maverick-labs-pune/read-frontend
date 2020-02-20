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

class ForgotPasswordTokenForm extends Component {
  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col">
            <Input
              name="new_password"
              type="password"
              label="New password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.new_password || ""}
              required
            />
            {errors.new_password ? (
              <div className="form-error">{errors.new_password}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <Input
              name="confirm_password"
              type="password"
              label="Confirm password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirm_password || ""}
              required
            />
            {errors.confirm_password ? (
              <div className="form-error">{errors.confirm_password}</div>
            ) : null}
          </div>
        </div>
        <Button disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default ForgotPasswordTokenForm;
