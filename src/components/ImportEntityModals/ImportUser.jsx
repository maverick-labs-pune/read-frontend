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
import { isValid } from "../../utils/stringUtils";
import ImportUserTable from "../ItemTables/ImportUserTable";
Modal.setAppElement("#root");

class ImportUser extends Component {
  render() {
    const {
      selectedFileName,
      users,
      importError,
      onFileInput,
      isOpen,
      toggleImportUserModal,
      onImportUser,
      importUserLoading
    } = this.props;

    let importComponent = null;
    let isFileSelected = null;

    isFileSelected =
      isValid(selectedFileName) > 0 ? (
        <div className="col-md-12 col-lg-12">
          Selected File: <b>{selectedFileName}</b>
        </div>
      ) : (
        <div className="col-md-12 col-lg-12">
          Please select a file to import.
        </div>
      );
    importComponent = (
      <div className="row mt20">
        <div className="col">
          <div className="row mt20">
            {isFileSelected}
            <div className="col-md-12 col-lg-12 mt20">
              <FileInput onFileInput={onFileInput} />
              <div className="text-help">Only xls,xlsx format is allowed.</div>
            </div>
          </div>
          {isValid(users) > 0 && importError ? (
            <div className="row mt20 mb-2">
              <div className="col">
                <ImportUserTable users={users || []} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleImportUserModal}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
      >
        <ModalContent>
          <ModalHeader
            title="Import User"
            toggleModal={toggleImportUserModal}
          />
          <div className="modal-body custom-modal-body">{importComponent}</div>
          <div className="justify-content-start modal-footer">
            <Button onClick={onImportUser} primary loading={importUserLoading}>
              Upload
            </Button>

            <Button secondary onClick={toggleImportUserModal}>
              Cancel
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default ImportUser;
