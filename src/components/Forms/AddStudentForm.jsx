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
import { TextArea } from "../TextArea/TextArea";
import Checkbox from "../Checkbox/Checkbox";
import { GENDER } from "../../utils/constants";

class AddStudentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setField = (selected, setFieldValue, onChange, name) => {
    setFieldValue(name, selected);

    // Changing classroom value to empty on school change
    if (onChange) {
      onChange(selected);
      setFieldValue("classroom", {});
    }
  };

  setAcademicYear = () => {
    const { selectedAcademicYear, setFieldValue } = this.props;
    this.setField(selectedAcademicYear, setFieldValue, null, "academic_year");
    return selectedAcademicYear;
  };

  render() {
    const {
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      values,
      errors,
      schools,
      classrooms,
      academicYears,
      isDropout,
      hasAttendedPreSchool,
      setFieldValue,
      isEdit,
      onIsDropoutCheckboxChange,
      onHasAttendedPreSchool,
      onSchoolChange,
      t,
      readOnly
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-lg-4 col-md-4">
            <Input
              name="first_name"
              label={t("FIELD_LABEL_STUDENT_FIRST_NAME")}
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
              label={t("FIELD_LABEL_STUDENT_MIDDLE_NAME")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.middle_name || ""}
            />
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="last_name"
              label={t("FIELD_LABEL_STUDENT_LAST_NAME")}
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
            <Select
              name="gender"
              label={t("FIELD_LABEL_STUDENT_GENDER")}
              onChange={value => {
                this.setField(value, setFieldValue, null, "gender");
              }}
              onBlur={handleBlur}
              value={values.gender || {}}
              options={GENDER}
              required
            />
            {errors.gender ? (
              <div className="form-error mt-2">{errors.gender}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="birth_date"
              label={t("FIELD_LABEL_STUDENT_BIRTH_DATE")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.birth_date || ""}
              placeholder="YYYY-MM-DD"
              required
            />
            {errors.birth_date ? (
              <div className="form-error">{errors.birth_date}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Input
              name="mother_tongue"
              label={t("FIELD_LABEL_STUDENT_MOTHER_TONGUE")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.mother_tongue || ""}
              required
            />
            {errors.mother_tongue ? (
              <div className="form-error">{errors.mother_tongue}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row mt-2">
          <div className="col-lg-4 col-md-4">
            <TextArea
              name="address"
              label={t("FIELD_LABEL_STUDENT_ADDRESS")}
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

        {isEdit ? null : (
          <div className="form-row">
            <div className="col-lg-4 col-md-4">
              <Select
                maxMenuHeight={170}
                name="school"
                label={t("LABEL_SCHOOL")}
                onChange={value => {
                  this.setField(value, setFieldValue, onSchoolChange, "school");
                }}
                onBlur={handleBlur}
                value={values.school || {}}
                isDisabled={readOnly || false}
                options={schools}
                required
              />
              {errors.school ? (
                <div className="form-error mt-2">{errors.school}</div>
              ) : null}
            </div>

            <div className="col-lg-4 col-md-4">
              <Select
                maxMenuHeight={170}
                name="classroom"
                label={t("LABEL_CLASSROOM")}
                onChange={value => {
                  this.setField(value, setFieldValue, null, "classroom");
                }}
                onBlur={handleBlur}
                value={values.classroom || {}}
                isDisabled={readOnly || false}
                options={classrooms}
                required
              />
              {errors.classroom ? (
                <div className="form-error mt-2">{errors.classroom}</div>
              ) : null}
            </div>

            <div className="col-lg-4 col-md-4">
              <Select
                maxMenuHeight={170}
                name="academic_year"
                label={t("LABEL_ACADEMIC_YEAR")}
                onChange={value => {
                  this.setField(value, setFieldValue, null, "academic_year");
                }}
                onBlur={handleBlur}
                value={values.academic_year || this.setAcademicYear()}
                options={academicYears}
                required
              />
              {errors.academic_year ? (
                <div className="form-error mt-2">{errors.academic_year}</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="form-row mt-4">
          <div className="col-lg-4 col-md-4">
            <Checkbox
              id="checkbox-preschool"
              name="preschool"
              label={t("FIELD_LABEL_STUDENT_HAS_ATTENDED_PRESCHOOL")}
              onBlur={handleBlur}
              checked={hasAttendedPreSchool}
              onChange={onHasAttendedPreSchool}
            />
          </div>
          {isEdit ? (
            <div className="col-lg-4 col-md-4">
              <Checkbox
                id="checkbox-dropout"
                name="dropout"
                label={t("FIELD_LABEL_STUDENT_IS_DROPOUT")}
                onBlur={handleBlur}
                checked={isDropout}
                onChange={onIsDropoutCheckboxChange}
              />
            </div>
          ) : null}
        </div>
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default AddStudentForm;
