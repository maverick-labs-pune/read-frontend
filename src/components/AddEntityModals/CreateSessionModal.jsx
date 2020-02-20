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
import Modal from "react-modal";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import moment from "moment";
import reduce from "lodash/reduce";
import AddSessionForm from "../Forms/AddSessionForm";
import { Formik } from "formik";
import api from "../../utils/api";
import { RADIO_RECURRING, RESPONSE_STATUS_400 } from "../../utils/constants";
import { getAllRecurringDates } from "../../utils/dates";
import { validationSchema } from "../../utils/validationSchemas";

Modal.setAppElement("#root");
/**
 * Modal used to create a sessions using this schedule.
 * There is no functionality to edit the schedule as of.
 * Having local state makes sense here to save schedule data
 * and api call here.
 *
 */
class CreateSessionModal extends Component {
  state = { slide: false };

  getbody = values => {
    let body = Object.assign({}, values);
    const {
      selectedDate,
      isVerified,
      isCancelled,
      selectedRadio,
      recurringFromDate,
      recurringToDate,
      recurringDate
    } = this.props;

    const classroomKeys = reduce(
      values.classroom,
      (result, item) => {
        result.push(item.value);
        return result;
      },
      []
    );

    const fairyKeys = reduce(
      values.book_fairy,
      (result, item) => {
        result.push(item.value);
        return result;
      },
      []
    );

    let start_time_hours = moment(values.start_time).format("HH");
    let start_time_minutes = moment(values.start_time).format("mm");
    let end_time_hours = moment(values.end_time).format("HH");
    let end_time_minutes = moment(values.end_time).format("mm");

    let dates = [];
    // Getting recurring dates
    if (selectedRadio === RADIO_RECURRING) {
      recurringDate.forEach(item => {
        dates.push(
          ...getAllRecurringDates(
            moment(recurringFromDate)
              .startOf("days")
              .toISOString(),
            moment(recurringToDate)
              .endOf("days")
              .toISOString(),
            item.value,
            start_time_hours,
            start_time_minutes,
            end_time_hours,
            end_time_minutes
          )
        );
      });
    } else {
      let start_date_time = moment(selectedDate)
        .add(start_time_hours, "hours")
        .add(start_time_minutes, "minutes")
        .toISOString();
      let end_date_time = moment(selectedDate)
        .add(end_time_hours, "hours")
        .add(end_time_minutes, "minutes")
        .toISOString();
      dates.push({ start_date_time, end_date_time });
    }

    body.academic_year = values.academic_year.value;
    body.dates = JSON.stringify(dates);
    body.classrooms = JSON.stringify(classroomKeys);
    body.fairies = JSON.stringify(fairyKeys);
    body.type = values.type.value;
    body.is_verified = isVerified;
    body.is_cancelled = isCancelled;

    body.start_time = moment(values.start_time).format("hh:mm:ss");
    body.end_time = moment(values.end_time).format("hh:mm:ss");
    return body;
  };

  render() {
    const {
      isOpen,
      toggleModal,
      getSessions,
      schools,
      classrooms,
      academicYears,
      bookFairies,
      isVerified,
      isCancelled,
      selectedRadio,
      recurringDate,
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
      selectedAcademicYear,
      sessionErrors,
      isError,
      t
    } = this.props;

    return (
      <Modal isOpen={isOpen} onRequestClose={toggleModal} className="">
        <ModalContent>
          <ModalHeader title="Create Session" toggleModal={toggleModal} />
          <div className="modal-body custom-modal-body medium-padding">
            <Formik
              validationSchema={
                selectedRadio === null
                  ? validationSchema.AddSession
                  : selectedRadio === RADIO_RECURRING
                  ? validationSchema.RecusringSession
                  : validationSchema.OneTimeSession
              }
              onSubmit={(values, actions) => {
                let body = this.getbody(values);
                const ngo = localStorage.getItem("ngo");
                api
                  .addSession(ngo, body)
                  .then(({ data }) => {
                    toggleModal();
                    getSessions();
                    api.handleSuccess(data);
                  })
                  .catch(({ response }) => {
                    if (response.status === RESPONSE_STATUS_400) {
                      this.props.onSessionConflicts(response.data);
                    }
                    actions.setSubmitting(false);
                  });
              }}
              render={props => (
                <AddSessionForm
                  schools={schools}
                  classrooms={classrooms}
                  academicYears={academicYears}
                  bookFairies={bookFairies}
                  isVerified={isVerified}
                  isCancelled={isCancelled}
                  selectedRadio={selectedRadio}
                  recurringDate={recurringDate}
                  onSchoolChange={onSchoolChange}
                  onDateRadioChange={onDateRadioChange}
                  selectedDate={selectedDate}
                  onOneTimeDateChange={onOneTimeDateChange}
                  onRecurringDateChange={onRecurringDateChange}
                  recurringFromDate={recurringFromDate}
                  onFromDateChange={onFromDateChange}
                  recurringToDate={recurringToDate}
                  onToDateChange={onToDateChange}
                  onIsVerified={onIsVerified}
                  onIsCancelled={onIsCancelled}
                  t={t}
                  selectedAcademicYear={selectedAcademicYear}
                  sessionErrors={sessionErrors}
                  isError={isError}
                  {...props} //formic props
                />
              )}
            />
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default CreateSessionModal;
