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
import BookTable from "../../components/ItemTables/BookTable";
import AddBookModal from "../../components/AddEntityModals/AddBookModal";
import BookActions from "../../components/Actions/BookActions";
import { withRouter } from "react-router-dom";
import api from "../../utils/api";
import reduce from "lodash/reduce";
import BookFilters from "../../components/Filters/BookFilters";
import {
  NGO_BOOK_SEARCH,
  BOOK_FILE_EXPORT_NAME,
  IMPORT_FILE_ERROR,
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_SORT_NAME
} from "../../utils/constants";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import ImportBook from "../../components/ImportEntityModals/ImportBook";
import { isValid } from "../../utils/stringUtils";
import XLSX from "xlsx";
import download from "downloadjs";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
import { isValidUser } from "../../utils/validations";

class BookContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddBookModal: false,
      showImportBookModal: false,
      modalData: null,
      bookList: [],
      checkedBooks: [],
      bookData: {},
      title: null,
      filterText: "",
      showFilter: false,
      showDeactivateBookConfirmationModal: false,
      selectedFileToImport: null,
      selectedFileName: null,
      importedBookData: [],
      importError: false,
      loading: true,
      importBookLoading: false,
      clear: false,
      levels: [],
      pages: 0,
      page: 0,
      sortBy: DEFAULT_SORT_NAME
    };
  }

  async componentDidMount() {
    let validUser = await isValidUser();

    if (validUser) {
      this.getBooksList();
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

  getBooksList = (page = 0, sort = null) => {
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    this.setState({
      loading: true
    });
    api
      .getBooks(ngo, page, sortBy)
      .then(({ data }) => {
        const { count, results } = data;
        this.setState({
          bookList: results,
          checkedBooks: [],
          loading: false,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          page: page
        });
      })
      .catch(({ response }) => {
        this.setState({ loading: false });
        api.handleError(response);
      });
  };

  toggleAddBookModal = () => {
    this.setState(p => ({
      showAddBookModal: !p.showAddBookModal,
      bookData: {},
      title: "Add Book"
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
    api
      .importBooks(ngo, { file: selectedFileToImport })
      .then(({ data }) => {
        if (isValid(data.message)) {
          // this.mapBookWithImportErrors(data.message);
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
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedBookData: [],
            importBookLoading: false
          });
          this.toggleImportBookModal();
          this.getBooksList();
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
    api.exportBooks(ngo).then(({ data }) => {
      download(atob(data), "Books.xlsx", "application/vnd.ms-excel;");
    });
  };

  toggleImportBookModal = () => {
    this.setState(p => ({
      showImportBookModal: !p.showImportBookModal,
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null,
      importedBookData: []
    }));
  };

  handleAddBookInputChange = ({ target }) => {
    const { name, value } = target;
    const { modalData } = this.state;
    const updatedData = { ...modalData, [name]: value };
    this.setState({ modalData: updatedData });
  };

  handleSaveBook = () => {
    const { modalData, bookList } = this.state;
    const updated = [...bookList, modalData];
    this.setState({
      bookList: updated,
      modalData: null,
      showAddBookModal: false
    });
  };

  handleBookCheckboxToggle = book => {
    const { checkedBooks } = this.state;
    const updatedBooks = checkedBooks.addOrUpdate(book);
    this.setState({
      checkedBooks: updatedBooks
    });
  };

  handleDeleteBooks = () => {
    const { checkedBooks } = this.state;
    const bookKeys = reduce(
      checkedBooks,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    let keys = JSON.stringify(bookKeys);
    api
      .deleteBooks({ keys })
      .then(({ data }) => {
        this.setState({
          checkedBooks: []
        });
        this.getBooksList();
        api.handleSuccess(data);
        this.toggleDeactivateBookConfirmationModal();
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleEditBookModal = book => {
    this.toggleAddBookModal();
    this.setState({
      bookData: book,
      title: "Edit Book"
    });
  };

  handleShowFilter = () => {
    this.setState(p => ({
      showFilter: !p.showFilter,
      filterText: "",
      clear: !p.clear
    }));
    this.filterBooks("");
  };

  filterBooks = (value, page = 0, sort = null) => {
    this.setState({
      loading: true
    });
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    const filters = { name: value, sort: sortBy };
    const body = { search: JSON.stringify(filters), model: NGO_BOOK_SEARCH };
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        this.setState({
          bookList: results,
          page: page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          loading: false
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleFilterTextChange = event => {
    const { value } = event.target;
    this.setState({
      filterText: value
    });
    this.filterBooks(value);
  };

  toggleDeactivateBookConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateBookConfirmationModal: !p.showDeactivateBookConfirmationModal
    }));
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

  handleBookExport = () => {
    const ngo = localStorage.getItem("ngo");
    const ngoName = localStorage.getItem("ngoName");
    api
      .exportBooks(ngo)
      .then(({ data }) => {
        const fileName = formatFileExportNames(BOOK_FILE_EXPORT_NAME, ngoName);
        download(atob(data), fileName, "application/vnd.ms-excel;");
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleFilterClear = () => {
    this.setState(p => ({
      filterText: ""
    }));
    this.filterBooks("");
  };

  handlePageChange = nextPage => {
    const { filterText } = this.state;
    if (isValid(filterText) > 0) {
      this.filterBooks(filterText, nextPage);
    } else {
      this.getBooksList(nextPage);
    }
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    let sortBy = desc ? id : `-${id}`;
    const { filterText } = this.state;
    this.setState({
      sortBy
    });
    if (isValid(filterText) > 0) {
      this.filterBooks(filterText, 0, sortBy);
    } else {
      this.getBooksList(0, sortBy);
    }
  };

  render() {
    const {
      showAddBookModal,
      modalData,
      bookList,
      checkedBooks,
      showImportBookModal,
      bookData,
      title,
      filterText,
      showFilter,
      showDeactivateBookConfirmationModal,
      selectedFileName,
      importedBookData,
      importError,
      loading,
      importBookLoading,
      clear,
      levels,
      pages,
      page
    } = this.state;
    const { t, history } = this.props;
    return (
      <div className="container-fluid">
        <BookActions
          checkedBooks={checkedBooks}
          toggleAddBookModal={this.toggleAddBookModal}
          toggleImportBookModal={this.toggleImportBookModal}
          onExportBooks={this.handleBookExport}
          onDeleteBooks={this.toggleDeactivateBookConfirmationModal}
          onToggleFilters={this.handleShowFilter}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <BookFilters
          text={filterText}
          onFilterTextChange={this.handleFilterTextChange}
          open={showFilter}
        />
        <BookTable
          books={bookList}
          checkedBooks={checkedBooks}
          onBookCheckboxToggle={this.handleBookCheckboxToggle}
          toggleModal={this.toggleEditBookModal}
          loading={loading}
          history={history}
          pages={pages}
          page={page}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          t={t}
        />
        <AddBookModal
          isOpen={showAddBookModal}
          toggleModal={this.toggleAddBookModal}
          onAddShoolInputChange={this.handleAddBookInputChange}
          onSaveBook={this.handleSaveBook}
          modalData={modalData}
          getBooks={this.getBooksList}
          bookData={bookData}
          title={title}
          levels={levels}
          t={t}
        />
        <ImportBook
          selectedFileName={selectedFileName}
          books={importedBookData}
          importError={importError}
          onFileInput={this.handleFileSelected}
          isOpen={showImportBookModal}
          toggleImportBookModal={this.toggleImportBookModal}
          onImportBook={this.handleBookImport}
          importBookLoading={importBookLoading}
          t={t}
        />
        <ConfirmationModal
          isOpen={showDeactivateBookConfirmationModal}
          title={"Deactivate selected books?"}
          onPositiveAction={this.handleDeleteBooks}
          toggleModal={this.toggleDeactivateBookConfirmationModal}
        />
      </div>
    );
  }
}

export default withRouter(BookContainer);
