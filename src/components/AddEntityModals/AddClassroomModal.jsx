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
import PropTypes from "prop-types";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import { Button } from "../Button/Button";
import AddClassroomForm from "../Forms/AddClassroomForm";
import api from "../../utils/api";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import { parseErrorResponse } from "../../utils/stringUtils";
Modal.setAppElement("#root");

class AddClassroomModal extends Component {
  addClassroom = body => {};

  render() {
    const {
      classroomData,
      standards,
      onStandardChange,
      selectedStandard,
      schoolDetails,
      isOpen,
      toggleModal,
      fetchClassrooms
    } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader title="Add Classroom" toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body small-padding">
              <Formik
                initialValues={{ ...classroomData }}
                onSubmit={(values, actions) => {
                  let body = Object.assign({}, values);
                  const ngo = localStorage.getItem("ngo");
                  body.school = schoolDetails.key;
                  body.standard = selectedStandard.value;
                  api
                    .addClassroom(ngo, body)
                    .then(({ data }) => {
                      toggleModal();
                      fetchClassrooms();
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
                }}
                render={props => (
                  <AddClassroomForm
                    standards={standards}
                    onStandardChange={onStandardChange}
                    selectedStandard={selectedStandard}
                    schoolDetails={schoolDetails}
                    {...props}
                  />
                )}
              />
            </div>
            <div className="modal-footer">
              <Button secondary onClick={toggleModal}>
                Close
              </Button>
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default AddClassroomModal;
AddClassroomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClassroomAdded: PropTypes.func,
  classroomData: PropTypes.object,
  toggleAddClassroomModal: PropTypes.func
};
