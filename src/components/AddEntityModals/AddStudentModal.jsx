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
import { Formik } from "formik";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import AddStudentForm from "../Forms/AddStudentForm";
import api from "../../utils/api";
import { validationSchema } from "../../utils/validationSchemas";
import { isValid, parseErrorResponse } from "../../utils/stringUtils";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import { withRouter } from "react-router-dom";

Modal.setAppElement("#root");

class AddStudentModal extends Component {
  getbody = values => {
    let body = Object.assign({}, values);

    const { classroom, academic_year, gender, school } = values;
    const { isDropout, hasAttendedPreSchool } = this.props;

    body.is_dropout = isDropout;
    body.has_attended_preschool = hasAttendedPreSchool;
    body.gender = gender.value;
    body.academic_year = academic_year.value;
    body.classroom = classroom.value;
    body.school = school.value;

    return body;
  };

  render() {
    const {
      studentModalData,
      title,
      isEdit,
      isOpen,
      toggleModal,
      updateStudentDetails,
      getStudents,
      schools,
      classrooms,
      academicYears,
      isDropout,
      hasAttendedPreSchool,
      onIsDropoutCheckboxChange,
      onHasAttendedPreSchool,
      onSchoolChange,
      t,
      selectedSchool,
      selectedClassroom,
      readOnly,
      selectedAcademicYear
    } = this.props;

    //for the add student inside classroomDetails
    let school = selectedSchool;
    let classroom = selectedClassroom;
    let initialData = { school, classroom };

    return (
      <div>
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <ModalContent>
            <ModalHeader title={title} toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body medium-padding">
              <Formik
                initialValues={readOnly ? initialData : { ...studentModalData }}
                validationSchema={validationSchema.AddStudent}
                onSubmit={(values, actions) => {
                  let body = this.getbody(values);

                  if (isValid(studentModalData) > 0) {
                    const { studentModalData } = this.props;
                    const { key } = studentModalData;
                    api
                      .updateStudent(key, body)
                      .then(({ data }) => {
                        updateStudentDetails(data);
                        toggleModal();
                        api.handleSuccess(data);
                      })
                      .catch(({ response }) => {
                        if (response.status === RESPONSE_STATUS_400) {
                          const errors = parseErrorResponse(
                            response.data.message
                          );
                          actions.setErrors(errors);
                        } else {
                          api.handleError(response);
                        }
                      });
                  } else {
                    api
                      .addStudent(body.classroom, body)
                      .then(({ data }) => {
                        toggleModal();
                        getStudents();
                        api.handleSuccess(data);
                      })
                      .catch(({ response }) => {
                        if (response.status === RESPONSE_STATUS_400) {
                          const errors = parseErrorResponse(
                            response.data.message
                          );
                          actions.setErrors(errors);
                        } else {
                          api.handleError(response);
                        }
                        actions.setSubmitting(false);
                      });
                  }
                }}
                render={props => (
                  <AddStudentForm
                    isEdit={isEdit}
                    schools={schools}
                    classrooms={classrooms}
                    academicYears={academicYears}
                    isDropout={isDropout}
                    hasAttendedPreSchool={hasAttendedPreSchool}
                    onIsDropoutCheckboxChange={onIsDropoutCheckboxChange}
                    onHasAttendedPreSchool={onHasAttendedPreSchool}
                    onSchoolChange={onSchoolChange}
                    selectedAcademicYear={selectedAcademicYear}
                    t={t}
                    {...props} //formic props
                  />
                )}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default withRouter(AddStudentModal);
