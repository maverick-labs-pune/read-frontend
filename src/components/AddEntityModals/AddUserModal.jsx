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
import ModalHeader from "../Modal/ModalHeader";
import ModalContent from "../Modal/ModalContent";
import { Formik } from "formik";
import AddUserForm from "../Forms/AddUserForm";
import api from "../../utils/api";
import { validationSchema } from "../../utils/validationSchemas";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import { parseErrorResponse, isValid } from "../../utils/stringUtils";

Modal.setAppElement("#root");
class AddUserModal extends Component {
  render() {
    const {
      isOpen,
      userData,
      onUserTypeChange,
      selectedUserType,
      title,
      toggleModal,
      usersList,
      location,
      t
    } = this.props;

    let user =
      userData && selectedUserType == null
        ? userData.user_type
        : selectedUserType
        ? selectedUserType.value
        : false;

    return (
      <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
        <ModalContent className="custom-modal-content">
          <ModalHeader title={title} toggleModal={toggleModal} />
          <div className="modal-body custom-modal-body">
            <Formik
              initialValues={{ ...userData }}
              validationSchema={
                isValid(userData) > 0 && user === "Book Fairy"
                  ? validationSchema.UpdateBookfairyUser
                  : isValid(userData) > 0
                  ? validationSchema.UpdateUser
                  : user === "Book Fairy"
                  ? validationSchema.AddUserBookfairy
                  : validationSchema.AddUser
              }
              onSubmit={(values, actions) => {
                let body = Object.assign({}, values);
                const ngo = localStorage.getItem("ngo");
                body["is_active"] = true;
                body["user_type"] = selectedUserType
                  ? selectedUserType.value
                  : values.user_type;
                if (Object.keys(userData).length > 0) {
                  const key = userData.key;
                  api
                    .updateUser(key, body)
                    .then(({ data }) => {
                      usersList();
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
                      actions.setSubmitting(false);
                    });
                } else {
                  api
                    .addUser(ngo, body)
                    .then(({ data }) => {
                      usersList();
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
                      actions.setSubmitting(false);
                    });
                }
              }}
              render={props => (
                <AddUserForm
                  selectedType={selectedUserType}
                  userTypeChange={onUserTypeChange}
                  location={location}
                  t={t}
                  {...props}
                />
              )}
            />
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default AddUserModal;
