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
import Select from "../Select/Select";
import Radio from "../Radio/Radio";
// import DatePicker from "react-datepicker";
import { TextArea } from "../TextArea/TextArea";
import { Button } from "../Button/Button";
import Checkbox from "../Checkbox/Checkbox";

import {
  WEEKDAYS,
  RADIO_ONE_TIME,
  RADIO_RECURRING,
  REGULAR,
  EVALUATION,
  BOOK_LENDING,
  SESSION_DATE_FORMAT
} from "../../utils/constants";
import moment from "moment";
import DatePicker from "../DatePicker/DatePicker";

class AddSessionForm extends Component {
  setField = (selected, setFieldValue, onChange, name) => {
    setFieldValue(name, selected);
    if (onChange) {
      onChange(selected);
      if (name === "school") setFieldValue("classroom", []);
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
      schools,
      classrooms,
      academicYears,
      bookFairies,
      isVerified,
      isCancelled,
      selectedRadio,
      recurringDate,
      errors,
      setFieldValue,
      isEdit,
      onSchoolChange,
      onDateRadioChange,
      selectedDate,
      onOneTimeDateChange,
      onRecurringDateChange,
      recurringFromDate,
      onFromDateChange,
      recurringToDate,
      onToDateChange,
      onIsVerified,
      onIsCancelled,
      isError,
      sessionErrors,
      t
    } = this.props;

    const defaultClass = "row";

    const READ_SESSION_TYPE = [
      { value: REGULAR, label: t(REGULAR) },
      { value: EVALUATION, label: t(EVALUATION) },
      { value: BOOK_LENDING, label: t(BOOK_LENDING) }
    ];

    const oneTimeDateclass =
      selectedRadio !== "session-radio-one-time"
        ? `${defaultClass} session-radio-readyOnly`
        : defaultClass;

    const recurringDateClass =
      selectedRadio !== "session-radio-recurring"
        ? `${defaultClass} session-radio-readyOnly`
        : defaultClass;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-md-4 col-lg-4">
            <Select
              name="school"
              label={t("LABEL_SCHOOL")}
              onChange={value => {
                this.setField(value, setFieldValue, onSchoolChange, "school");
              }}
              onBlur={handleBlur}
              value={values.school || {}}
              options={schools}
              required
            />
            {errors.school ? (
              <div className="form-error mt-2">{errors.school}</div>
            ) : null}
          </div>
          <div className="col-md-4 col-lg-4">
            <Select
              name="classroom"
              label={t("LABEL_CLASSROOM")}
              onChange={value => {
                this.setField(value, setFieldValue, null, "classroom");
              }}
              onBlur={handleBlur}
              value={values.classroom || null}
              options={classrooms}
              isMulti={true}
              closeMenuOnSelect={false}
              required
            />
            {errors.classroom ? (
              <div className="form-error mt-2">{errors.classroom}</div>
            ) : null}
          </div>
          <div className="col-md-4 col-lg-4">
            <Select
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
        <div className="form-row mt20">
          <div className="col-md-4">
            <DatePicker
              selected={values.start_time}
              id="session-start-date-time"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              required={true}
              minTime={moment()
                .hours(7)
                .toDate()}
              maxTime={moment()
                .hours(22)
                .toDate()}
              label="Start time"
              onChange={value => {
                this.setField(value, setFieldValue, null, "start_time");
              }}
            />
            {errors.start_time ? (
              <div className="form-error mt-2">{errors.start_time}</div>
            ) : null}
          </div>
          <div className="col-md-4">
            <DatePicker
              selected={values.end_time}
              id="session-end-date-time"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              required={true}
              label="End time"
              minTime={
                values.start_time ||
                moment()
                  .hours(7)
                  .toDate()
              }
              maxTime={moment()
                .hours(22)
                .toDate()}
              onChange={value => {
                this.setField(value, setFieldValue, null, "end_time");
              }}
            />
            {errors.end_time ? (
              <div className="form-error mt-2">{errors.end_time}</div>
            ) : null}
          </div>
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={170}
              name="type"
              label={t("FIELD_LABEL_READ_SESSION_TYPE")}
              onChange={value => {
                this.setField(value, setFieldValue, null, "type");
              }}
              onBlur={handleBlur}
              value={values.type || []}
              options={READ_SESSION_TYPE}
              required
            />
            {errors.type ? (
              <div className="form-error mt-2">{errors.type}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row mt20">
          <div className="col-lg-4 col-md-4">
            <Select
              maxMenuHeight={170}
              name="book_fairy"
              label={t("LABEL_BOOK_FAIRY")}
              onChange={value => {
                this.setField(value, setFieldValue, null, "book_fairy");
              }}
              onBlur={handleBlur}
              value={values.book_fairy || []}
              options={bookFairies}
              isMulti={true}
              closeMenuOnSelect={false}
              required
            />
            {errors.book_fairy ? (
              <div className="form-error mt-2">{errors.book_fairy}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row mt20">
          <div className="col">
            {t("LABEL_ADD_READ_SESSION_RECURRENCE_PATTERN")}
          </div>
        </div>
        <div className="form-row mt20">
          <div className="col">
            <div className="row">
              <div className="col">
                <Radio
                  name="session-radio"
                  id="session-radio-one-time"
                  label={t("LABEL_ADD_READ_SESSION_ONE_TIME_SESSION")}
                  checked={selectedRadio === RADIO_ONE_TIME}
                  onChange={onDateRadioChange}
                />
              </div>
            </div>
            <div className={oneTimeDateclass}>
              <div className="col-lg-4 col-md-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={value => {
                    this.setField(
                      value,
                      setFieldValue,
                      onOneTimeDateChange,
                      "one_time_date"
                    );
                  }} //only when value has changed
                  dateFormat="MMMM d, yyyy"
                  name="one_time_date"
                  label="For date"
                  id="one-time-date"
                  required={selectedRadio === RADIO_ONE_TIME}
                />
                {errors.one_time_date ? (
                  <div className="form-error mt-2">{errors.one_time_date}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="form-row mt20">
          <div className="col">
            <div className="row">
              <div className="col">
                <Radio
                  name="session-radio"
                  id="session-radio-recurring"
                  label={t("LABEL_ADD_READ_SESSION_RECURRING")}
                  checked={selectedRadio === RADIO_RECURRING}
                  onChange={onDateRadioChange}
                />
              </div>
            </div>
            <div className={recurringDateClass}>
              <div className="col">
                <div className="row">
                  <div className="col-lg-4 col-md-4 pl28 pt-2 ">
                    Repeat every week on
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <Select
                      name="recurring_date"
                      onChange={value => {
                        this.setField(
                          value,
                          setFieldValue,
                          onRecurringDateChange,
                          "recurring_date"
                        );
                      }}
                      onBlur={handleBlur}
                      value={recurringDate}
                      options={WEEKDAYS}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      required={selectedRadio === RADIO_RECURRING}
                    />
                    {errors.recurring_date ? (
                      <div className="form-error mt-2">
                        {errors.recurring_date}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="row mt20">
                  <div className="col-lg-4 col-md-4">
                    {/* <div className="mt-2">Start date</div> */}
                    <DatePicker
                      selected={recurringFromDate}
                      onChange={value => {
                        this.setField(
                          value,
                          setFieldValue,
                          onFromDateChange,
                          "start_date_recurring"
                        );
                      }} //only when value has changed
                      dateFormat="MMMM d, yyyy"
                      name="start_date_recurring"
                      label="Start date"
                      id="start-date-recurring"
                      required={selectedRadio === RADIO_RECURRING}
                    />
                    {errors.start_date_recurring ? (
                      <div className="form-error mt-2">
                        {errors.start_date_recurring}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-lg-4 col-md-4">
                    {/* <div className="mt-2">End date</div> */}
                    <DatePicker
                      selected={recurringToDate}
                      onChange={value => {
                        this.setField(
                          value,
                          setFieldValue,
                          onToDateChange,
                          "end_date_recurring"
                        );
                      }} //only when value has changed
                      dateFormat="MMMM d, yyyy"
                      minDate={recurringFromDate}
                      name="end_date_recurring"
                      label="End date"
                      id="end-date-recurring"
                      required={selectedRadio === RADIO_RECURRING}
                    />
                    {errors.end_date_recurring ? (
                      <div className="form-error mt-2">
                        {errors.end_date_recurring}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isEdit ? (
          <div className="form-row mt20">
            <div className="col-lg-4 col-md-4">
              <TextArea
                name="notes"
                label={t("FIELD_LABEL_READ_SESSION_NOTES")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.notes || ""}
              />
            </div>
          </div>
        ) : null}
        {isEdit ? (
          <div className="form-row mt20">
            <div className="col-lg-4 col-md-4">
              <Checkbox
                id="checkbox-isVerified"
                name="verified"
                label={t("FIELD_LABEL_READ_SESSION_IS_VERIFIED")}
                onBlur={handleBlur}
                checked={isVerified}
                onChange={onIsVerified}
              />
            </div>
            <div className="col-lg-4 col-md-4">
              <Checkbox
                id="checkbox-isCancelled"
                name="cancelled"
                label={t("FIELD_LABEL_READ_SESSION_IS_CANCELLED")}
                onBlur={handleBlur}
                checked={isCancelled}
                onChange={onIsCancelled}
              />
            </div>
          </div>
        ) : null}
        {isError
          ? sessionErrors.map((item, i) => {
              return (
                <div
                  className="row text-danger mr-5 mt-1 font-weight-bold text-center"
                  key={i}
                >
                  <div className="col">
                    {`Session is already scheduled for book fairies - ${
                      item.book_fairy
                    } for ${moment(item.start_date).format(
                      SESSION_DATE_FORMAT
                    ) +
                      " to " +
                      moment(item.end_date).format("h:mm a")}`}
                  </div>
                </div>
              );
            })
          : null}
        <Button className="mt20" disabled={isSubmitting} primary type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default AddSessionForm;
