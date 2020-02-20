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
import { isValid } from "../../utils/stringUtils";
import find from "lodash/find";

class AddBookForm extends Component {
  setField = (value, setFieldValue, name) => {
    setFieldValue(name, value);
  };

  getLevel = () => {
    const { initialValues, levels } = this.props;
    const { level } = initialValues;
    if (isValid(initialValues) > 0 && isValid(level) > 0) {
      return find(levels, { value: initialValues.level.name });
    }
    return null;
  };

  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      levels,
      setFieldValue
    } = this.props;
    const { t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="name"
              label={t("FIELD_LABEL_BOOK_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name || ""}
              required
            />
            {errors.name ? (
              <div className="form-error">{errors.name}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={150}
              name="levels"
              label={t("FIELD_LABEL_BOOK_LEVEL")}
              placeholder="Select Level"
              onChange={value => {
                this.setField(value, setFieldValue, "levels");
              }}
              onBlur={handleBlur}
              value={values.levels || this.getLevel()}
              options={levels}
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="price"
              label={t("FIELD_LABEL_BOOK_PRICE")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.price || ""}
            />
            {errors.price ? (
              <div className="form-error mt-2">{errors.price}</div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="publisher"
              label={t("FIELD_LABEL_BOOK_PUBLISHER")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.publisher || ""}
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="author"
              label={t("FIELD_LABEL_BOOK_AUTHOR")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.author || ""}
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

export default AddBookForm;
