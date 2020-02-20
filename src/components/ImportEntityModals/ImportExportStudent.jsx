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
import Select from "../Select/Select";
import { isValid } from "../../utils/stringUtils";
import ImportStudentTable from "../ItemTables/ImportStudentTable";
Modal.setAppElement("#root");

class ImportExportStudent extends Component {
  render() {
    const {
      isImport,
      selectedAcademicYear,
      selectedFileName,
      students,
      importError,
      onFileInput,
      isOpen,
      toggleImportExport,
      onAcademicYearChange,
      academicYearDropdown,
      onImportStudent,
      fileUploadLoading,
      onExportStudent,
      t
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
    if (isImport) {
      importComponent = (
        <div className="row mt20">
          <div className="col">
            <div className="row mt20">
              {isFileSelected}
              <div className="col-md-12 col-lg-12 mt20">
                <FileInput onFileInput={onFileInput} />
                <div className="text-help">
                  Only xls,xlsx format is allowed.
                </div>
              </div>
            </div>
            {isValid(students) > 0 && importError ? (
              <div className="row mt20 mb-2">
                <div className="col">
                  <ImportStudentTable students={students || []} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleImportExport}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
      >
        <ModalContent>
          <ModalHeader
            title={isImport ? "Import Student" : "Export Students"}
            toggleModal={toggleImportExport}
          />
          <div className="modal-body custom-modal-body">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <Select
                  name="academic_year"
                  label={t("LABEL_ACADEMIC_YEAR")}
                  onChange={onAcademicYearChange}
                  value={selectedAcademicYear}
                  options={academicYearDropdown}
                  required
                />
              </div>
            </div>
            {importComponent}
          </div>
          <div className="justify-content-start modal-footer">
            {isImport ? (
              <Button
                onClick={onImportStudent}
                primary
                loading={fileUploadLoading}
              >
                Upload
              </Button>
            ) : (
              <Button onClick={onExportStudent} primary>
                Export
              </Button>
            )}
            <Button secondary onClick={toggleImportExport}>
              Cancel
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default ImportExportStudent;
