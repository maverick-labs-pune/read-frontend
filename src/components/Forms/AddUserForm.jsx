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
import { NGO_USER_TYPE } from "../../utils/constants";
import { isValid } from "../../utils/stringUtils";

class AddUserForm extends Component {
  getUserType = () => {
    const { initialValues } = this.props;

    if (Object.keys(initialValues).length > 0) {
      const { user_type } = initialValues;
      const userType = find(NGO_USER_TYPE, item => {
        if (item.value === user_type) {
          return item;
        }
      });
      return userType;
    }
    return {};
  };

  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      selectedType,
      initialValues,
      location,
      userTypeChange
    } = this.props;

    let pathName = location ? location.pathname : null;

    const { t } = this.props;
    const loggedInUserkey = localStorage.getItem("key");
    const editUserKey = isValid(initialValues) > 0 ? initialValues.key : null;
    const passwordComponent =
      editUserKey !== loggedInUserkey ? (
        <div className="col-lg-4 col-md-4">
          <Input
            name="password"
            label={
              editUserKey
                ? t("FIELD_LABEL_CHANGE_PASSWORD")
                : t("FIELD_LABEL_USER_PASSWORD")
            }
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password || ""}
            required
          />
          {errors.password ? (
            <div className="form-error">{errors.password}</div>
          ) : null}
        </div>
      ) : null;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="first_name"
              label={t("FIELD_LABEL_USER_FIRST_NAME")}
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
              name="middle_name"
              label={t("FIELD_LABEL_USER_MIDDLE_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.middle_name || ""}
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="last_name"
              label={t("FIELD_LABEL_USER_LAST_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.last_name || ""}
              required
            />
            {errors.last_name ? (
              <div className="form-error">{errors.last_name}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="email"
              label={t("FIELD_LABEL_USER_EMAIL")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email || ""}
              required={
                isValid(
                  initialValues.user_type &&
                    initialValues.user_type !== "Book Fairy"
                )
                  ? true
                  : isValid(selectedType) && selectedType.value !== "Book Fairy"
                  ? true
                  : false
              }
            />
            {errors.email ? (
              <div className="form-error">{errors.email}</div>
            ) : null}
          </div>
          {pathName !== "/home/profile/" ? (
            <div className="col-lg-4 col-md-4 mb-3">
              <Select
                maxMenuHeight={160}
                name="user_type"
                label={t("FIELD_LABEL_USER_TYPE")}
                onChange={userTypeChange}
                onBlur={handleBlur}
                value={selectedType || this.getUserType()}
                options={NGO_USER_TYPE}
                required
              />
              {errors.user_type ? (
                <div className="form-error mt-2">{errors.user_type}</div>
              ) : null}
            </div>
          ) : null}
        </div>
        {pathName !== "/home/profile/" ? (
          <div>
            <div className="form-row">
              <div className="col-lg-4 col-md-4">
                <Input
                  name="username"
                  label={t("FIELD_LABEL_USER_USERNAME")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username || ""}
                  required
                  readOnly={isValid(initialValues)}
                />
                {errors.username ? (
                  <div className="form-error">{errors.username}</div>
                ) : null}
              </div>
              {passwordComponent}
            </div>
          </div>
        ) : null}
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default AddUserForm;
