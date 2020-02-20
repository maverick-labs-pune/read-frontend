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
import FileInput from "../FileInput/FileInput";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import { Button } from "../Button/Button";
Modal.setAppElement("#root");

class Import extends Component {
  render() {
    const { isOpen, toggleModal, title, onFileInput, onImport } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
        <ModalContent>
          <ModalHeader title={title} toggleModal={toggleModal} />
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12 col-lg-12">
                Please select a file to import.
              </div>
              <div className="col-md-12 col-lg-12 mt20">
                <FileInput onFileInput={onFileInput} />
                <div className="text-help">
                  Only xls,xlsx format is allowed.
                </div>
              </div>
            </div>
          </div>
          <div className="justify-content-start modal-footer">
            <Button onClick={onImport} primary>
              Upload
            </Button>
            <Button secondary onClick={toggleModal}>
              Cancel
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default Import;
