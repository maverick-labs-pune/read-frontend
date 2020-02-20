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
import api from "../../utils/api";
import { validationSchema } from "../../utils/validationSchemas";
import { parseErrorResponse, isValid } from "../../utils/stringUtils";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import AddLevelForm from "../Forms/AddLevelForm";
Modal.setAppElement("#root");

class AddLevelModal extends Component {
  render() {
    const { isOpen, toggleModal, levelData, getlevels, t } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader title={"Edit Level"} toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body">
              <Formik
                initialValues={{ ...levelData }}
                validationSchema={validationSchema.AddLevel}
                onSubmit={(values, actions) => {
                  let body = Object.assign({}, values);
                  api
                    .updateLevel(body.key, body)
                    .then(({ data }) => {
                      toggleModal();
                      getlevels();
                      api.handleSuccess(data);
                      actions.setSubmitting(false);
                    })
                    .catch(({ response }) => {
                      if (response.status === RESPONSE_STATUS_400) {
                        let error =
                          isValid(response.data.message.non_field_errors) > 0
                            ? response.data.message.non_field_errors[0]
                            : response.data.message;
                        api.handleError({
                          data: {
                            message: error
                          }
                        });
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
                render={props => <AddLevelForm t={t} {...props} />}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default AddLevelModal;
