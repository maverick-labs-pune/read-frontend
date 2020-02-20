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
import SchoolTable from "../../components/ItemTables/SchoolTable";
import AddSchoolModal from "../../components/AddEntityModals/AddSchoolModal";
import SchoolActions from "../../components/Actions/SchoolActions";
import api from "../../utils/api";
import instance from "../../utils/axios";
import { withRouter } from "react-router-dom";
import forEach from "lodash/forEach";
import reduce from "lodash/reduce";
import SchoolFilters from "../../components/Filters/SchoolFilters";
import {
  NGO_SCHOOL_SEARCH,
  SCHOOL_FILE_EXPORT_NAME,
  IMPORT_FILE_ERROR,
  DEFAULT_SORT_NAME,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { getYearOfInterventionDropdown } from "../../utils/dates";
import download from "downloadjs";
import XLSX from "xlsx";
import { isValid } from "../../utils/stringUtils";
import ImportSchool from "../../components/ImportEntityModals/ImportSchool";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
import { isValidUser } from "../../utils/validations";

class SchoolContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddSchoolModal: false,
      addSchoolModalData: null,
      schoolList: [],
      checkedSchools: [],
      schoolMediums: [],
      schoolTypes: [],
      schoolCategories: [],
      selectedSchoolType: null,
      selectedSchoolMedium: null,
      selectedSchoolCategory: null,
      title: "Add School",
      showFilter: false,
      filterText: "",
      showDeactivateSchoolConfirmationModal: false,
      yearOfIntervention: null,
      loading: true,
      clear: false,
      showImportSchoolModal: false,
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null,
      importedSchoolData: [],
      pages: 0,
      page: 0,
      sortBy: DEFAULT_SORT_NAME
    };
  }

  /******************************************
   * Add SCHOOL related callbacks START
   *****************************************/

  async componentDidMount() {
    const { t } = this.props;
    getYearOfInterventionDropdown();
    const ngo = localStorage.getItem("ngo");
    const { page, sortBy } = this.state;

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getSchools(ngo, page, sortBy),
          api.getSchoolTypes(),
          api.getSchoolMediums(),
          api.getSchoolCategories()
        ])
        .then(
          instance.spread((list, types, mediums, categories) => {
            let schoolCategories = [];
            forEach(categories.data, item => {
              schoolCategories.push({
                value: item.value,
                label: t(item.label)
              });
            });

            let schoolMediums = [];
            forEach(mediums.data, item => {
              schoolMediums.push({ value: item.value, label: t(item.label) });
            });

            let schoolTypes = [];
            forEach(types.data, item => {
              schoolTypes.push({ value: item.value, label: t(item.label) });
            });

            const { count } = list.data;
            this.setState({
              schoolList: list.data.results,
              schoolMediums,
              schoolCategories,
              schoolTypes,
              selectedSchoolType: schoolTypes.length > 0 ? schoolTypes[0] : {},
              selectedSchoolCategory:
                schoolCategories.length > 0 ? schoolCategories[0] : {},
              selectedSchoolMedium:
                schoolMediums.length > 0 ? schoolMediums[0] : {},
              loading: false,
              pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
              page: page
            });
          })
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getSchoolList = (page = 0, sort = null) => {
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    api
      .getSchools(ngo, page, sortBy)
      .then(({ data }) => {
        const { count } = data;
        this.setState({
          schoolList: data.results,
          checkedSchools: [],
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          page: page
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleAddSchoolModal = () => {
    this.setState(p => ({ showAddSchoolModal: !p.showAddSchoolModal }));
  };

  handleAddSchoolInputChange = ({ target }) => {
    const { name, value } = target;
    const { addSchoolModalData } = this.state;
    const updatedData = { ...addSchoolModalData, [name]: value };
    this.setState({ addSchoolModalData: updatedData });
  };
  handleSaveSchool = () => {
    const { addSchoolModalData, schoolList } = this.state;
    const updated = [...schoolList, addSchoolModalData];
    this.setState({
      schoolList: updated,
      addSchoolModalData: null,
      showAddSchoolModal: false
    });
  };

  handleSchoolTypeChange = value => {
    this.setState({
      selectedSchoolType: value
    });
  };

  handleSchoolMediumChange = value => {
    this.setState({
      selectedSchoolMedium: value
    });
  };

  handleSchoolCategoryChange = value => {
    this.setState({
      selectedSchoolCategory: value
    });
  };

  /******************************************
   * Add SCHOOL related callbacks END
   *****************************************/

  /******************************************
   * Delete SCHOOL related callbacks START
   *****************************************/
  handleSchoolCheckboxToggle = school => {
    const { checkedSchools } = this.state;
    const updatedSchools = checkedSchools.addOrUpdate(school);
    this.setState({
      checkedSchools: updatedSchools
    });
  };

  handleSchoolDelete = () => {
    const { checkedSchools } = this.state;
    const schoolKeys = reduce(
      checkedSchools,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    let keys = JSON.stringify(schoolKeys);
    api
      .deleteSchools({ keys })
      .then(({ data }) => {
        this.getSchoolList();
        this.toggleDeactivateSchoolConfirmationModal();
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleShowFilter = () => {
    this.setState(p => ({
      showFilter: !p.showFilter,
      filterText: "",
      clear: !p.clear
    }));
    this.filterSchools("");
  };

  filterSchools = (value, page = 0, sort = null) => {
    this.setState({
      loading: true
    });
    const sortBy = sort === null ? this.state.sortBy : sort;
    const ngo = localStorage.getItem("ngo");
    const filters = { name: value, sort: sortBy };
    let body = { search: JSON.stringify(filters), model: NGO_SCHOOL_SEARCH };
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        this.setState({
          schoolList: results,
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
    this.filterSchools(value);
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
          importedSchoolData: jsonData
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

  toggleDeactivateSchoolConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateSchoolConfirmationModal: !p.showDeactivateSchoolConfirmationModal
    }));
  };

  handleYearOfInterventionChange = value => {
    this.setState({
      yearOfIntervention: value
    });
  };

  handleFilterClear = () => {
    this.setState(p => ({
      filterText: ""
    }));
    this.filterSchools("");
  };

  handleSchoolImport = () => {
    const { selectedFileToImport, importedSchoolData } = this.state;
    if (!selectedFileToImport) {
      const data = { message: IMPORT_FILE_ERROR };
      api.handleError({ data });
      return;
    }
    this.setState({
      importSchoolLoading: true
    });

    const ngo = localStorage.getItem("ngo");
    api
      .importSchools(ngo, { file: selectedFileToImport })
      .then(({ data }) => {
        if (isValid(data.message)) {
          const { error, result } = mapModelDataWithImportErrors(
            importedSchoolData,
            data.message
          );
          api.handleError(data);
          this.setState({
            importSchoolLoading: false,
            importedSchoolData: result,
            importError: error,
            selectedFileToImport: null,
            selectedFileName: null
          });
        } else {
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedSchoolData: [],
            importSchoolLoading: false
          });
          this.toggleImportSchoolModal();
          this.getSchoolList();
        }
      })
      .catch(({ response }) => {
        api.handleError(response);
        this.toggleImportSchoolModal();
        this.setState({
          importSchoolLoading: false
        });
      });
  };

  handleSchoolExport = () => {
    const ngo = localStorage.getItem("ngo");
    const ngoName = localStorage.getItem("ngoName");
    api
      .exportSchools(ngo)
      .then(({ data }) => {
        const fileName = formatFileExportNames(
          SCHOOL_FILE_EXPORT_NAME,
          ngoName
        );
        download(atob(data), fileName, "application/vnd.ms-excel;");
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleImportSchoolModal = () => {
    this.setState(p => ({
      showImportSchoolModal: !p.showImportSchoolModal,
      importError: false,
      selectedFileToImport: null,
      selectedFileName: null,
      importedSchoolData: []
    }));
  };

  handlePageChange = nextPage => {
    const { filterText } = this.state;
    if (isValid(filterText) > 0) {
      this.filterSchools(filterText, nextPage);
    } else {
      this.getSchoolList(nextPage);
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
      this.filterSchools(filterText, 0, sortBy);
    } else {
      this.getSchoolList(0, sortBy);
    }
  };

  render() {
    const {
      showAddSchoolModal,
      addSchoolModalData,
      schoolList,
      checkedSchools,
      schoolTypes,
      schoolMediums,
      schoolCategories,
      selectedSchoolCategory,
      selectedSchoolMedium,
      selectedSchoolType,
      title,
      showFilter,
      filterText,
      showDeactivateSchoolConfirmationModal,
      yearOfIntervention,
      loading,
      clear,
      selectedFileName,
      importedSchoolData,
      importError,
      importSchoolLoading,
      showImportSchoolModal,
      pages,
      page
    } = this.state;
    const { t, history } = this.props;
    return (
      <div className="container-fluid">
        <SchoolActions
          checkedSchools={checkedSchools}
          toggleAddSchoolModal={this.toggleAddSchoolModal}
          toggleImportSchoolModal={this.toggleImportSchoolModal}
          onExportSchools={this.handleSchoolExport}
          onDeleteSchools={this.toggleDeactivateSchoolConfirmationModal}
          onToggleFilters={this.handleShowFilter}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <SchoolFilters
          open={showFilter}
          onFilterTextChange={this.handleFilterTextChange}
          text={filterText}
        />
        <SchoolTable
          schools={schoolList}
          checkedSchools={checkedSchools}
          onSchoolCheckboxToggle={this.handleSchoolCheckboxToggle}
          loading={loading}
          history={history}
          pages={pages}
          page={page}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          t={t}
        />
        <AddSchoolModal
          isOpen={showAddSchoolModal}
          toggleModal={this.toggleAddSchoolModal}
          onAddShoolInputChange={this.handleAddSchoolInputChange}
          onSaveSchool={this.handleSaveSchool}
          addSchoolModalData={addSchoolModalData}
          schoolTypes={schoolTypes}
          schoolMediums={schoolMediums}
          schoolCategories={schoolCategories}
          onSchoolTypeChange={this.handleSchoolTypeChange}
          onSchoolCategoryChange={this.handleSchoolCategoryChange}
          onSchoolMediumChange={this.handleSchoolMediumChange}
          selectedCategory={selectedSchoolCategory}
          selectedMedium={selectedSchoolMedium}
          selectedType={selectedSchoolType}
          schoolData={{}}
          getSchools={this.getSchoolList}
          title={title}
          yearOfIntervention={yearOfIntervention}
          onYearOfInterventionChange={this.handleYearOfInterventionChange}
          t={t}
        />
        <ImportSchool
          selectedFileName={selectedFileName}
          schools={importedSchoolData}
          importError={importError}
          onFileInput={this.handleFileSelected}
          isOpen={showImportSchoolModal}
          toggleImportSchoolModal={this.toggleImportSchoolModal}
          onImportSchool={this.handleSchoolImport}
          importSchoolLoading={importSchoolLoading}
          t={t}
        />
        <ConfirmationModal
          isOpen={showDeactivateSchoolConfirmationModal}
          title={"Deactivate selected schools?"}
          onPositiveAction={this.handleSchoolDelete}
          toggleModal={this.toggleDeactivateSchoolConfirmationModal}
        />
      </div>
    );
  }
}

export default withRouter(SchoolContainer);
