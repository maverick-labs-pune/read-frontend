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
import { withRouter } from "react-router-dom";
import ExportQRCode from "../../components/ImportEntityModals/ExportQRCode";
import api from "../../utils/api";
import {
  IMPORT_FILE_ERROR,
  BOOK_QRCODE_EXPORT_NAME
} from "../../utils/constants";
import { isValid } from "../../utils/stringUtils";
import XLSX from "xlsx";
import download from "downloadjs";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
class QRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: null,
      title: null,
      selectedFileToImport: null,
      selectedFileName: null,
      importedBookData: [],
      showImportBookModal: true,
      importBookLoading: false,
      importError: false
    };
  }

  handleFileSelected = e => {
    const {
      target: { files }
    } = e;
    if (isValid(files) > 0) {
      const selectedFile = files[0];
      const selectedFileName = files[0].name;
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        let workSheetName = workbook.SheetNames[0];
        let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);
        this.setState({
          importedBookData: jsonData
        });
      };
      reader.readAsBinaryString(selectedFile);
      this.setState({
        selectedFileToImport: selectedFile,
        selectedFileName,
        importError: false
      });
    }
  };

  handleQRCodeExport = () => {
    const {
      selectedFileToImport,
      selectedFileName,
      importedBookData
    } = this.state;
    if (!selectedFileToImport) {
      const data = { message: IMPORT_FILE_ERROR };
      api.handleError({ data });
      return;
    }
    this.setState({
      importBookLoading: true
    });

    api
      .generateQRCode({
        file: selectedFileToImport,
        file_name: selectedFileName
      })
      .then(({ data }) => {
        if (isValid(data.message)) {
          const { error, result } = mapModelDataWithImportErrors(
            importedBookData,
            data.message
          );
          api.handleError(data);
          this.setState({
            importBookLoading: false,
            importedBookData: result,
            importError: error,
            selectedFileToImport: null,
            selectedFileName: null
          });
        } else {
          const fileName = formatFileExportNames(
            BOOK_QRCODE_EXPORT_NAME,
            null,
            selectedFileName.split(".")[0]
          );
          download(atob(data), fileName, "application/pdf;");
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedBookData: [],
            importBookLoading: false
          });
        }
      })
      .catch(({ response }) => {
        api.handleError(response);
        this.toggleImportBookModal();
        this.setState({
          importBookLoading: false
        });
      });
  };

  toggleImportBookModal = () => {
    this.setState(p => ({
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null,
      importedBookData: []
    }));
  };

  render() {
    const { t } = this.props;
    const {
      showImportBookModal,
      selectedFileName,
      importedBookData,
      importError,
      importBookLoading
    } = this.state;
    return (
      <div className="container-fluid">
        <ExportQRCode
          t={t}
          selectedFileName={selectedFileName}
          books={importedBookData}
          importError={importError}
          onFileInput={this.handleFileSelected}
          isOpen={showImportBookModal}
          onImportBook={this.handleQRCodeExport}
          fileUploadLoading={importBookLoading}
        />
      </div>
    );
  }
}

export default withRouter(QRCode);
