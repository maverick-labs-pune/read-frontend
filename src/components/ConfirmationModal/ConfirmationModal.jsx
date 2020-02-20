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
import { Button } from "../Button/Button";
Modal.setAppElement("#root");

class ConfirmationModal extends Component {
  render() {
    const {
      title,
      onPositiveAction,
      toggleModal,
      isOpen,
      isSubmitting
    } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
        <ModalContent>
          <ModalHeader title={title} toggleModal={toggleModal} />
          <div className="modal-body">
            Are you sure you want to perform this action?
          </div>
          <div className="modal-footer mt10">
            <Button onClick={onPositiveAction} disabled={isSubmitting} primary>
              Yes
            </Button>
            <Button
              onClick={toggleModal}
              disabled={isSubmitting}
              secondary
              className="ml20"
            >
              Cancel
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default ConfirmationModal;
