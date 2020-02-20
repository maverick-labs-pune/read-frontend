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
import AddNgoForm from "../Forms/AddNgoForm";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import { validationSchema } from "../../utils/validationSchemas";
import api from "../../utils/api";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import { parseErrorResponse } from "../../utils/stringUtils";
Modal.setAppElement("#root");

class AddNgoModal extends Component {
  render() {
    const {
      modalData,
      isOpen,
      toggleModal,
      updateNgo,
      getNgos,
      t
    } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader
              title={t(`LABEL_ADD_NEW`) + " " + t(`LABEL_NGO`)}
              toggleModal={toggleModal}
            />
            <div className="modal-body">
              <Formik
                initialValues={{ ...modalData }}
                validationSchema={validationSchema.NGO}
                onSubmit={(values, actions) => {
                  if (Object.keys(modalData).length > 0) {
                    const { key } = values;
                    api
                      .updateNgo(key, values)
                      .then(response => {
                        api.handleSuccess(response);
                        updateNgo(response.data);
                        toggleModal();
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
                  } else {
                    api
                      .addNgo(values)
                      .then(response => {
                        api.handleSuccess(response);
                        getNgos();
                        toggleModal();
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
                render={props => <AddNgoForm t={t} {...props} />}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default AddNgoModal;

AddNgoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};
