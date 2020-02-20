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
import AddBookModal from "../../components/AddEntityModals/AddBookModal";
import { withRouter } from "react-router-dom";
import api from "../../utils/api";
import BookDetails from "../../components/BookDetails/BookDetails";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import find from "lodash/find";
import XLSX from "xlsx";
import { isValid } from "../../utils/stringUtils";
import download from "downloadjs";
import {
  INVENTORY_FILE_EXPORT_NAME,
  INVENTORY_STATUS,
  IMPORT_FILE_ERROR,
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_SORT_INVENTORY_SERIAL_NUMBER
} from "../../utils/constants";
import reduce from "lodash/reduce";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
import { isValidUser } from "../../utils/validations";

class BookDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddBookModal: false,
      bookData: null,
      title: null,
      showDeactivateBookConfirmationModal: false,

      selectedFileToImport: null,
      selectedFileName: null,
      importedBookData: [],
      importError: false,
      loading: true,
      importBookLoading: false,
      showImportBookModal: false,
      books: [],
      showEditInventory: false,
      selectedInventoryData: null,
      checkedInventoryBooks: [],
      showDeactivateInventoryConfirmationModal: false,
      page: 0,
      pages: 0,
      desc: DEFAULT_SORT_INVENTORY_SERIAL_NUMBER
    };
  }

  async componentDidMount() {
    let validUser = await isValidUser();

    if (validUser) {
      this.getBookDetails();
      this.fetchInventoryBooks();
      api.getBookLevels().then(({ data }) => {
        this.setState({
          levels: data
        });
      });
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getBookDetails = () => {
    const { key } = this.props.match.params;
    api
      .getBookDetails(key)
      .then(({ data }) => {
        let bookData = cloneDeep(data);
        this.setState({
          bookData
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  fetchInventoryBooks = (page = 0, sort = null) => {
    const { key } = this.props.match.params;
    const sortBy = sort === null ? this.state.desc : sort;
    api
      .getInventoryForBook(key, page, sortBy)
      .then(({ data }) => {
        let inventoryData = [];
        const { results, count } = data;
        forEach(results, book => {
          const { key, serial_number, status, added_date_time } = book;
          const book_status = this.getInventoryStatus(status);
          inventoryData.push({
            key,
            serial_number,
            status: book_status.label || null,
            added_date_time
          });
        });
        this.setState({
          books: inventoryData,
          loading: false,
          page: page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE)
        });
      })
      .catch(({ response }) => {
        // api.handleError(response);
        // this.setState({
        //   loading: false
        // });
      });
  };

  getInventoryStatus = status => {
    return find(INVENTORY_STATUS, item => {
      if (item.value === status) return item;
      if (item.label === status) return item;
    });
  };

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

  handleInventoryBookClick = inventory => {
    let inventoryData = cloneDeep(inventory);
    inventoryData.status = this.getInventoryStatus(inventoryData.status);
    this.setState({
      selectedInventoryData: inventoryData
    });
    this.toggleEditInventoryModal();
  };

  toggleImportBookModal = () => {
    this.setState(p => ({
      showImportBookModal: !p.showImportBookModal,
      importedBookData: [],
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null
    }));
  };

  toggleEditInventoryModal = () => {
    this.setState(p => ({
      showEditInventory: !p.showEditInventory
    }));
  };

  handleBookImport = () => {
    const { selectedFileToImport, importedBookData } = this.state;
    if (!selectedFileToImport) {
      const data = { message: IMPORT_FILE_ERROR };
      api.handleError({ data });
      return;
    }
    this.setState({
      importBookLoading: true
    });

    const ngo = localStorage.getItem("ngo");
    const { key } = this.props.match.params;
    api
      .importBooksToInventory(ngo, { file: selectedFileToImport, book: key })
      .then(({ data }) => {
        if (isValid(data.message)) {
          const { result, error } = mapModelDataWithImportErrors(
            importedBookData,
            data.message
          );
          api.handleError(data);
          this.setState({
            importBookLoading: false,
            importError: error,
            importedBookData: result,
            selectedFileToImport: null,
            selectedFileName: null
          });
        } else {
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedBookData: [],
            importBookLoading: false
          });
          this.toggleImportBookModal();
          this.fetchInventoryBooks();
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

  handleBookExport = () => {
    const ngo = localStorage.getItem("ngo");
    const ngoName = localStorage.getItem("ngoName");
    const { bookData } = this.state;
    const { key } = this.props.match.params;
    api.exportInventory(ngo, key).then(({ data }) => {
      const name = `${bookData.name}`;
      const fileName = formatFileExportNames(
        INVENTORY_FILE_EXPORT_NAME,
        ngoName,
        name
      );
      download(atob(data), fileName, "application/vnd.ms-excel;");
    });
  };

  handleBookInventoryClick = books => {
    const { checkedInventoryBooks } = this.state;
    const updatedInventoryBooks = checkedInventoryBooks.addOrUpdate(books);
    this.setState({
      checkedInventoryBooks: updatedInventoryBooks
    });
  };

  handleInventoryBookDelete = () => {
    const { checkedInventoryBooks } = this.state;
    let inventoryKeys = reduce(
      checkedInventoryBooks,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    api
      .deleteInventory({ keys: JSON.stringify(inventoryKeys) })
      .then(({ data }) => {
        this.fetchInventoryBooks();
        api.handleSuccess(data);
        this.toggleDeactivateInventoryConfirmationModal();
        this.setState({
          checkedInventoryBooks: []
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
        this.toggleDeactivateInventoryConfirmationModal();
      });
  };

  toggleDeactivateInventoryConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateInventoryConfirmationModal: !p.showDeactivateInventoryConfirmationModal
    }));
  };

  toggleEditBookModal = () => {
    this.setState(p => ({
      showAddBookModal: !p.showAddBookModal,
      title: "Edit Book"
    }));
  };

  handleBookTypeChange = value => {
    this.setState({
      selectedBookType: value
    });
  };

  handleDeleteBook = () => {
    const { key } = this.props.match.params;
    let keys = JSON.stringify([key]);
    api
      .deleteBooks({ keys })
      .then(({ data }) => {
        api.handleSuccess(data);
        this.toggleDeactivateBookConfirmationModal();
        this.props.history.push("/home/books");
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleDeactivateBookConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateBookConfirmationModal: !p.showDeactivateBookConfirmationModal
    }));
  };

  handlePageChange = nextPage => {
    this.fetchInventoryBooks(nextPage);
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    let sortBy = desc ? id : `-${id}`;
    this.fetchInventoryBooks(0, sortBy);
  };

  render() {
    const {
      showAddBookModal,
      bookData,
      title,
      showDeactivateBookConfirmationModal,
      selectedFileName,
      importedBookData,
      importBookLoading,
      importError,
      showImportBookModal,
      books,
      loading,
      showEditInventory,
      selectedInventoryData,
      checkedInventoryBooks,
      showDeactivateInventoryConfirmationModal,
      levels,
      pages,
      page
    } = this.state;

    const { t, history } = this.props;

    return (
      <div className="container-fluid">
        <BookDetails
          details={bookData}
          showDeactivateBookConfirmationModal={
            showDeactivateBookConfirmationModal
          }
          toggleDeactivateBookConfirmationModal={
            this.toggleDeactivateBookConfirmationModal
          }
          toggleEditBookModal={this.toggleEditBookModal}
          onBookDelete={this.handleDeleteBook}
          toggleImportBookModal={this.toggleImportBookModal}
          inventoryCheckedItems={checkedInventoryBooks}
          onDeleteInventoryBooks={
            this.toggleDeactivateInventoryConfirmationModal
          }
          onExportInventoryBooks={this.handleBookExport}
          inventoryBooks={books}
          inventoryLoading={loading}
          onInventoryBookClick={this.handleInventoryBookClick}
          onInventoryBookCheckboxToggle={this.handleBookInventoryClick}
          checkedInventoryBooks={checkedInventoryBooks}
          toggleEditInventoryModal={this.toggleEditInventoryModal}
          showEditInventory={showEditInventory}
          inventoryData={selectedInventoryData}
          getInventory={this.fetchInventoryBooks}
          selectedFileName={selectedFileName}
          importedBookData={importedBookData}
          importError={importError}
          onImportInventoryBookFileInput={this.handleFileSelected}
          showImportBookModal={showImportBookModal}
          toggleImportModal={this.toggleImportBookModal}
          onImportBook={this.handleBookImport}
          importBookLoading={importBookLoading}
          showDeactivateInventoryConfirmationModal={
            showDeactivateInventoryConfirmationModal
          }
          onInventoryBookDelete={this.handleInventoryBookDelete}
          toggleDeactivateInventoryConfirmationModal={
            this.toggleDeactivateInventoryConfirmationModal
          }
          page={page}
          pages={pages}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          history={history}
          t={t}
        />
        <AddBookModal
          isOpen={showAddBookModal}
          toggleModal={this.toggleEditBookModal}
          onAddShoolInputChange={this.handleAddBookInputChange}
          onBookTypeChange={this.handleBookTypeChange}
          getBookDetails={this.getBookDetails}
          bookData={bookData}
          title={title}
          levels={levels}
          t={t}
        />
      </div>
    );
  }
}

export default withRouter(BookDetailContainer);
