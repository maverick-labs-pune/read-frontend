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
import AddUserModal from "../../components/AddEntityModals/AddUserModal";
import UserActions from "../../components/Actions/UserActions";
import UserTable from "../../components/ItemTables/UserTable";
import api from "../../utils/api";
import reduce from "lodash/reduce";
import UserFilters from "../../components/Filters/UserFilters";
import {
  NGO_USER_SEARCH,
  NGO_USER_TYPE,
  USER_FILE_EXPORT_NAME,
  IMPORT_FILE_ERROR,
  DEFAULT_SORT_FIRST_NAME,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { isValid } from "../../utils/stringUtils";
import XLSX from "xlsx";
import download from "downloadjs";
import ImportUser from "../../components/ImportEntityModals/ImportUser";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
import { isValidUser } from "../../utils/validations";

class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUserType: null,
      checkedUsers: [],
      userData: null,
      title: null,
      showFilters: false,
      filterText: "",
      showImportUserModal: false,
      selectedFileToImport: null,
      showDeactivateUserConfirmationModal: false,
      selectedFileName: null,
      importedUserData: [],
      importError: false,
      loading: true,
      importUserLoading: false,
      pages: 0,
      page: 0,
      sortBy: DEFAULT_SORT_FIRST_NAME,
      clear: false
    };
  }

  async componentDidMount() {
    let validUser = await isValidUser();
    if (validUser) {
      this.getUsers();
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getUsers = (page = 0, sort = null) => {
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    this.setState({
      loading: true
    });
    api
      .getNGOUsers(ngo, page, sortBy)
      .then(({ data }) => {
        const { count, results } = data;
        this.setState({
          users: results,
          checkedUsers: [],
          loading: false,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          page: page
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleAddUserModal = () => {
    this.setState(p => ({
      showAddUserModal: !p.showAddUserModal,
      userData: {},
      selectedUserType: NGO_USER_TYPE[0],
      title: "Add User",
      selectedFileToImport: null
    }));
  };

  handleShowFilterChange = () => {
    this.setState(p => ({
      showFilters: !p.showFilters,
      filterText: "",
      clear: !p.clear
    }));
    this.filterUsers("");
  };

  handleUserChecked = user => {
    let { checkedUsers } = this.state;
    const updatedUsers = checkedUsers.addOrUpdate(user);
    this.setState({
      checkedUsers: updatedUsers
    });
  };

  handleDeleteUsers = () => {
    const { checkedUsers } = this.state;
    const userKeys = reduce(
      checkedUsers,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    let keys = JSON.stringify(userKeys);
    api
      .deleteUsers({ keys })
      .then(({ data }) => {
        this.setState({
          checkedUsers: []
        });
        this.getUsers();
        this.toggleDeactivateUserConfirmationModal();
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleUserImport = () => {
    const { selectedFileToImport, importedUserData } = this.state;
    if (!selectedFileToImport) {
      const data = { message: IMPORT_FILE_ERROR };
      api.handleError({ data });
      return;
    }
    this.setState({
      importUserLoading: true
    });

    const ngo = localStorage.getItem("ngo");
    api
      .importUsers(ngo, { file: selectedFileToImport })
      .then(({ data }) => {
        if (isValid(data.message)) {
          const { result, error } = mapModelDataWithImportErrors(
            importedUserData,
            data.message
          );
          api.handleError(data);
          this.setState({
            importUserLoading: false,
            importedUserData: result,
            importError: error,
            selectedFileToImport: null,
            selectedFileName: null
          });
        } else {
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedUserData: [],
            importUserLoading: false
          });
          this.toggleImportUserModal();
          this.getUsers();
        }
      })
      .catch(({ response }) => {
        api.handleError(response);
        this.toggleImportUserModal();
        this.setState({
          importUserLoading: false
        });
      });
  };

  handleUserExport = () => {
    const ngo = localStorage.getItem("ngo");
    const ngoName = localStorage.getItem("ngoName");
    api.exportUsers(ngo).then(({ data }) => {
      const fileName = formatFileExportNames(USER_FILE_EXPORT_NAME, ngoName);
      download(atob(data), fileName, "application/vnd.ms-excel;");
    });
  };

  handleUserTypeChange = value => {
    this.setState({
      selectedUserType: value
    });
  };

  toggleImportUserModal = () => {
    if (this.state.showImportUserModal) {
      this.setState(p => ({
        selectedFileToImport: null,
        selectedFileName: null
      }));
    }
    this.setState(p => ({
      showImportUserModal: !p.showImportUserModal,
      selectedUserType: NGO_USER_TYPE[0],
      title: "Import Users",
      importedUserData: [],
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null
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
          importedUserData: jsonData
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

  toggleEditUserModal = details => {
    this.toggleAddUserModal();
    this.setState({
      userData: details,
      title: "Edit User",
      selectedUserType: null
    });
  };

  filterUsers = (value, page = 0, sortBy = null) => {
    this.setState({
      loading: true
    });
    const ngo = localStorage.getItem("ngo");
    const sort = sortBy === null ? this.state.sortBy : sortBy;
    const filters = { name: value, sort };
    const body = { search: JSON.stringify(filters), model: NGO_USER_SEARCH };
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        this.setState({
          users: results,
          page,
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
    this.filterUsers(value);
  };

  toggleDeactivateUserConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateUserConfirmationModal: !p.showDeactivateUserConfirmationModal
    }));
  };

  handlePageChange = nextPage => {
    const { filterText } = this.state;
    if (isValid(filterText) > 0) {
      this.filterUsers(filterText, nextPage);
    } else {
      this.getUsers(nextPage);
    }
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    const { filterText } = this.state;
    let sortBy = desc ? id : `-${id}`;
    this.setState({
      sortBy
    });
    if (isValid(filterText) > 0) {
      this.filterUsers(filterText, 0, sortBy);
    } else {
      this.getUsers(0, sortBy);
    }
  };

  handleFilterClear = () => {
    this.setState({
      filterText: ""
    });
    this.filterUsers("");
  };

  render() {
    const {
      checkedUsers,
      showAddUserModal,
      showImportUserModal,
      selectedUserType,
      users,
      userData,
      title,
      filterText,
      showFilters,
      showDeactivateUserConfirmationModal,
      selectedFileName,
      importedUserData,
      importError,
      loading,
      importUserLoading,
      page,
      pages,
      clear
    } = this.state;
    const { t } = this.props;
    return (
      <div className="container-fluid">
        <UserActions
          checkedUsers={checkedUsers || []}
          toggleAddUserModal={this.toggleAddUserModal}
          toggleImportUserModal={this.toggleImportUserModal}
          onExportUsers={this.handleUserExport}
          onDeleteUsers={this.toggleDeactivateUserConfirmationModal}
          onToggleFilters={this.handleShowFilterChange}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <UserFilters
          text={filterText}
          onFilterTextChange={this.handleFilterTextChange}
          open={showFilters}
        />
        <UserTable
          users={users}
          checkedUsers={checkedUsers}
          onUserCheckboxToggle={this.handleUserChecked}
          toggleModal={this.toggleEditUserModal}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          t={t}
        />
        <ImportUser
          t={this.props}
          selectedFileName={selectedFileName}
          users={importedUserData}
          importError={importError}
          onFileInput={this.handleFileSelected}
          isOpen={showImportUserModal}
          toggleImportUserModal={this.toggleImportUserModal}
          onImportUser={this.handleUserImport}
          importUserLoading={importUserLoading}
        />
        <AddUserModal
          isOpen={showAddUserModal}
          toggleModal={this.toggleAddUserModal}
          onSaveUser={this.handleSaveUser}
          userData={userData}
          selectedUserType={selectedUserType}
          onUserTypeChange={this.handleUserTypeChange}
          usersList={this.getUsers}
          title={title}
          location={null}
          t={t}
        />
        <ConfirmationModal
          isOpen={showDeactivateUserConfirmationModal}
          title={"Deactivate selected users?"}
          onPositiveAction={this.handleDeleteUsers}
          toggleModal={this.toggleDeactivateUserConfirmationModal}
        />
      </div>
    );
  }
}

export default UsersContainer;
