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
import AddInventoryForm from "../Forms/AddInventoryForm";
Modal.setAppElement("#root");

class AddInventoryModal extends Component {
  render() {
    const {
      inventoryData,
      isOpen,
      toggleModal,
      history,
      getInventory,
      t
    } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader title="Add Inventory" toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body">
              <Formik
                initialValues={{ ...inventoryData }}
                validationSchema={validationSchema.AddInventory}
                onSubmit={(values, actions) => {
                  let body = Object.assign({}, values);
                  const inventoryKey = body.key;
                  const { key } = history.match.params;
                  body["status"] = body.status ? body.status.value : null;
                  body["book"] = key;
                  api
                    .updateInventory(inventoryKey, body)
                    .then(({ data }) => {
                      api.handleSuccess(data);
                      toggleModal();
                      getInventory();
                    })
                    .catch(({ response }) => {
                      api.handleError(response);
                    });
                  actions.setSubmitting(false);
                }}
                render={props => <AddInventoryForm t={t} {...props} />}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default AddInventoryModal;
