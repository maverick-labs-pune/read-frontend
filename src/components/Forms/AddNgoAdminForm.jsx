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

class AddNgoAdminForm extends Component {
  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      serverError,
      toggleAddAdminModal
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="first_name"
              label="First Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.first_name || ""}
              required
            />
            {errors.first_name ? (
              <div className="form-error">{errors.first_name}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="last_name"
              label="Last Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.last_name || ""}
              required
            />
            {errors.last_name ? (
              <div className="form-error">{errors.last_name}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="email"
              label="Email Address"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email || ""}
            />
            {errors.email ? (
              <div className="form-error">{errors.email}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="username"
              label="Username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username || ""}
              required
            />
            {errors.username ? (
              <div className="form-error">{errors.username}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="password"
              label="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
              value={values.password || ""}
              required
            />
            {errors.password ? (
              <div className="form-error">{errors.password}</div>
            ) : null}
          </div>
        </div>
        {serverError ? <div>{serverError.message}</div> : null}
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Add Admin
        </Button>
        <Button
          className="mt20 ml20"
          disabled={isSubmitting}
          secondary
          onClick={toggleAddAdminModal}
        >
          Cancel
        </Button>
      </form>
    );
  }
}

export default AddNgoAdminForm;
