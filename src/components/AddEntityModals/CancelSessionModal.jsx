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
import CancelSessionForm from "../Forms/CancelSessionForm";
Modal.setAppElement("#root");

class CancelSessionModal extends Component {
  render() {
    const { isOpen, toggleModal, t, sessionKey } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader title="Cancel Session" toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body">
              <Formik
                onSubmit={(values, actions) => {
                  const body = { comments: values.comments };
                  const { key } = sessionKey;
                  api
                    .markSessionAsCancel(key, body)
                    .then(({ data }) => {
                      api.handleSuccess({
                        message: "Session cancelled successfully"
                      });
                      this.props.history.push("/home/sessions");
                    })
                    .catch(({ response }) => {
                      api.handleError(response);
                      this.props.toggleModal();
                    });
                }}
                render={props => <CancelSessionForm t={t} {...props} />}
                validationSchema={validationSchema.CancelSessionSchema}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default CancelSessionModal;
