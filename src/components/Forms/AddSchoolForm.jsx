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
import { getYearOfInterventionDropdown } from "../../utils/dates";
import { TextArea } from "../TextArea/TextArea";

class AddSchoolForm extends Component {
  getSchoolType = () => {
    const { schoolTypes, initialValues } = this.props;
    if (Object.keys(initialValues).length > 0) {
      const { school_type } = initialValues;
      const type = find(schoolTypes, item => {
        return item.value === school_type.name;
      });
      return type;
    }
    return {};
  };

  getSchoolMedium = () => {
    const { schoolMediums, initialValues } = this.props;
    if (Object.keys(initialValues).length > 0) {
      const { medium } = initialValues;
      const schoolMedium = find(schoolMediums, item => {
        return item.value === medium.name;
      });
      return schoolMedium;
    }
    return {};
  };

  getSchoolCategory = () => {
    const { schoolCategories, initialValues } = this.props;
    if (Object.keys(initialValues).length > 0) {
      const { school_category } = initialValues;
      const category = find(schoolCategories, item => {
        return item.value === school_category.name;
      });
      return category;
    }
    return {};
  };

  setField = (value, setFieldValue, onChange, name) => {
    setFieldValue(name, value);
    onChange(value);
  };

  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      schoolTypes,
      schoolCategories,
      schoolMediums,
      selectedType,
      selectedMedium,
      selectedCategory,
      errors,
      setFieldValue,
      onYearOfInterventionChange,
      onSchoolCategoryChange,
      onSchoolTypeChange,
      onSchoolMediumChange,
      t
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="name"
              label={t("FIELD_LABEL_SCHOOL_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name || ""}
              required
            />
            {errors.name ? (
              <div className="form-error">{errors.name}</div>
            ) : null}
          </div>
          <div className="col-lg-6 col-md-6">
            <TextArea
              name="address"
              label={t("FIELD_LABEL_SCHOOL_ADDRESS")}
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
        <div className="form-row mt-2">
          <div className="col-lg-2 col-md-2">
            <Input
              name="pin_code"
              label={t("FIELD_LABEL_SCHOOL_PIN_CODE")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.pin_code || ""}
              required
            />
            {errors.pin_code ? (
              <div className="form-error">{errors.pin_code}</div>
            ) : null}
          </div>
          <div className="col-lg-4">
            <Input
              name="ward_number"
              label={t("FIELD_LABEL_SCHOOL_WARD_NUMBER")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.ward_number || ""}
            />
          </div>
          <div className="col-lg-4">
            <Input
              name="school_number"
              label={t("FIELD_LABEL_SCHOOL_SCHOOL_NUMBER")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.school_number || ""}
            />
            {errors.school_number ? (
              <div className="form-error">{errors.school_number}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4 mb-3">
            <Select
              name="school_category"
              label={t("FIELD_LABEL_SCHOOL_SCHOOL_CATEGORY")}
              onChange={onSchoolCategoryChange}
              onBlur={handleBlur}
              value={selectedCategory || this.getSchoolCategory()}
              options={schoolCategories}
              required
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={170}
              name="school_type"
              label={t("FIELD_LABEL_SCHOOL_SCHOOL_TYPE")}
              onChange={onSchoolTypeChange}
              onBlur={handleBlur}
              value={selectedType || this.getSchoolType()}
              options={schoolTypes}
              required
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={170}
              name="medium"
              label={t("FIELD_LABEL_SCHOOL_MEDIUM")}
              onChange={onSchoolMediumChange}
              onBlur={handleBlur}
              value={selectedMedium || this.getSchoolMedium()}
              options={schoolMediums}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="organization_name"
              label={t("FIELD_LABEL_SCHOOL_ORGANIZATION_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.organization_name || ""}
            />
          </div>
          <div className="col=lg-4 col-md-4">
            <Select
              maxMenuHeight={170}
              name="year_of_intervention"
              label={t("FIELD_LABEL_SCHOOL_YEAR_OF_INTERVENTION")}
              onChange={value =>
                this.setField(
                  value,
                  setFieldValue,
                  onYearOfInterventionChange,
                  "year_of_intervention"
                )
              }
              onBlur={handleBlur}
              value={values.year_of_intervention}
              options={getYearOfInterventionDropdown()}
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

export default AddSchoolForm;
