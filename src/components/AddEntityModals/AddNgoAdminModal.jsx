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
import AddNgoAdminForm from "../Forms/AddNgoAdminForm";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import api from "../../utils/api";
import { NGO_ADMIN, RESPONSE_STATUS_400 } from "../../utils/constants";
import { validationSchema } from "../../utils/validationSchemas";
import { parseErrorResponse } from "../../utils/stringUtils";

class AddNgoAdminModal extends Component {
  render() {
    const {
      adminDetails,
      toggleAddAdminModal,
      ngo,
      isOpen,
      getNgoAdmins
    } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestClose={toggleAddAdminModal}>
        <ModalContent>
          <ModalHeader
            title="Add Ngo Admin"
            toggleModal={toggleAddAdminModal}
          />
          <div className="modal-body">
            <Formik
              initialValues={{ ...adminDetails }}
              validationSchema={validationSchema.AddNgoAdmin}
              onSubmit={(values, actions) => {
                const { key } = ngo;

                let body = Object.assign({}, values);
                body["user_type"] = NGO_ADMIN;

                actions.setSubmitting(true);
                api
                  .addUser(key, body)
                  .then(({ data }) => {
                    api.handleSuccess("NGO admin added successfully");
                    getNgoAdmins();
                    toggleAddAdminModal();
                  })
                  .catch(({ response }) => {
                    if (response.status === RESPONSE_STATUS_400) {
                      const errors = parseErrorResponse(response.data.message);
                      actions.setErrors(errors);
                    } else {
                      api.handleError(response);
                    }
                    actions.setSubmitting(false);
                  });
              }}
              render={props => (
                <AddNgoAdminForm
                  toggleAddAdminModal={toggleAddAdminModal}
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

export default AddNgoAdminModal;
