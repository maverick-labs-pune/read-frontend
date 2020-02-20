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
import SchoolDetails from "../../components/SchoolDetails/SchoolDetails";
import instance from "../../utils/axios";
import api from "../../utils/api";
import AddSchoolModal from "../../components/AddEntityModals/AddSchoolModal";
import forEach from "lodash/forEach";
import { withRouter } from "react-router-dom";
import moment from "moment";
import XLSX from "xlsx";
import { isValid } from "../../utils/stringUtils";
import download from "downloadjs";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";
import { getYearOfInterventionDropdown } from "../../utils/dates";
import {
  mapModelDataWithImportErrors,
  formatFileExportNames
} from "../../utils/common";
import {
  CLASSROOM_STUDENT_FILE_EXPORT_NAME,
  IMPORT_FILE_ERROR
} from "../../utils/constants";
import { isValidUser } from "../../utils/validations";

class SchoolDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddSchoolModal: false,
      addSchoolModalData: null,
      checkedSchools: [],
      schoolMediums: [],
      schoolTypes: [],
      schoolCategories: [],
      schoolStandards: [],
      selectedSchoolType: null,
      selectedSchoolMedium: null,
      selectedSchoolCategory: null,
      schoolData: null,
      title: "Edit School",
      selectedStandard: null,
      classrooms: [],
      showDeactivateSchoolConfirmationModal: false,
      yearOfIntervention: null,
      showImportExportModal: false,
      isImport: false,
      selectedFileToImport: null,
      selectedAcademicYear: null,
      academicYearDropdown: [],
      classroomKey: null,
      selectedFileName: null,
      importedStudentData: [],
      importError: false,
      fileUploadLoading: false,
      currentAcademicYear: null
    };
  }

  async componentDidMount() {
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");
    const { t } = this.props;
    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getSchoolTypes(),
          api.getSchoolMediums(),
          api.getSchoolCategories(),
          api.getSchool(key),
          api.getStandards(),
          api.getSchoolClassrooms(ngo, key),
          api.getAcademicYear(),
          api.getCurrentAcademicyear()
        ])
        .then(
          instance.spread(
            (
              types,
              mediums,
              categories,
              schoolDetails,
              standards,
              classrooms,
              academicYears,
              currentAcademicYearResponse
            ) => {
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

              let schoolStandards = [];
              forEach(standards.data, item => {
                schoolStandards.push({ value: item.name, label: t(item.name) });
              });

              let academicYearDropdown = [];
              forEach(academicYears.data, item => {
                academicYearDropdown.push({
                  value: item.key,
                  label: item.name
                });
              });

              schoolDetails.data.year_of_intervention = this.getYearOfIntervention(
                moment(schoolDetails.data.year_of_intervention).year()
              );

              const currentAcademicYear = {
                value: currentAcademicYearResponse.data.key,
                label: currentAcademicYearResponse.data.name
              };

              this.setState({
                schoolMediums,
                schoolCategories,
                schoolTypes,
                schoolData: schoolDetails.data,
                schoolStandards,
                classrooms: classrooms.data,
                selectedStandard: schoolStandards[0],
                academicYearDropdown,
                selectedAcademicYear: currentAcademicYear,
                currentAcademicYear: currentAcademicYear
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  fetchClassrooms = () => {
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");
    api
      .getSchoolClassrooms(ngo, key)
      .then(({ data }) => {
        this.setState({
          classrooms: data
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getYearOfIntervention = yearOfIntervention => {
    const years = getYearOfInterventionDropdown();
    const result = find(years, year => {
      if (year.label === yearOfIntervention) return year;
    });
    return result;
  };

  deleteClassroom = key => {
    api
      .deleteClassroom(key)
      .then(({ data }) => {
        this.fetchClassrooms();
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleAddSchoolModal = () => {
    this.setState(p => ({ showAddSchoolModal: !p.showAddSchoolModal }));
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

  handleSchoolStandardChange = value => {
    this.setState({
      selectedStandard: value
    });
  };

  updateSchoolDetails = details => {
    let schoolDetails = cloneDeep(details);
    let year = moment(schoolDetails.year_of_intervention).year();
    schoolDetails.year_of_intervention = this.getYearOfIntervention(year);
    this.setState({
      schoolData: schoolDetails
    });
  };

  toggleDeactivateSchoolConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateSchoolConfirmationModal: !p.showDeactivateSchoolConfirmationModal
    }));
  };

  handleDeactivateSchool = schoolKey => {
    let keys = JSON.stringify([schoolKey]);
    api
      .deleteSchools({ keys })
      .then(({ data }) => {
        this.toggleDeactivateSchoolConfirmationModal();
        this.props.history.push("/home");
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleYearOfInterventionChange = value => {
    this.setState({
      yearOfIntervention: value
    });
  };

  handleStudentImport = () => {
    const {
      selectedFileToImport,
      classroomKey,
      selectedAcademicYear,
      importedStudentData
    } = this.state;
    if (!isValid(selectedAcademicYear)) {
      api.handleError({
        data: { message: "Please select an academic year." }
      });
      return;
    }
    if (!selectedFileToImport) {
      const data = { message: IMPORT_FILE_ERROR };
      api.handleError({ data });
      return;
    }
    this.setState({
      fileUploadLoading: true
    });

    api
      .importStudents(classroomKey, {
        file: selectedFileToImport,
        academic_year: selectedAcademicYear.value
      })
      .then(({ data }) => {
        if (isValid(data.message)) {
          const { error, result } = mapModelDataWithImportErrors(
            importedStudentData,
            data.message
          );
          api.handleError(data);
          this.setState({
            fileUploadLoading: false,
            importedStudentData: result,
            importError: error,
            selectedFileToImport: null,
            selectedFileName: null
          });
        } else {
          api.handleSuccess(data);
          this.setState({
            selectedFileToImport: null,
            selectedFileName: null,
            importedStudentData: [],
            fileUploadLoading: false
          });
          this.toggleImportExportStudentModal(false, null);
        }
      })
      .catch(({ response }) => {
        api.handleError(response);
        this.setState({
          fileUploadLoading: false
        });
      });
  };

  handleStudentExport = () => {
    const { selectedAcademicYear, classroomKey, schoolData } = this.state;
    if (!selectedAcademicYear) {
      api.handleError({
        data: { message: "Please select an academic year." }
      });
      return;
    }
    api
      .exportStudents(classroomKey, selectedAcademicYear.value)
      .then(({ data }) => {
        const classroom = this.getSchoolClassroomName(classroomKey);
        const ngoName = localStorage.getItem("ngoName");
        const name = `${schoolData.name}-${classroom.standard}-${classroom.division}-${selectedAcademicYear.label}`;
        const fileName = formatFileExportNames(
          CLASSROOM_STUDENT_FILE_EXPORT_NAME,
          ngoName,
          name
        );
        download(atob(data), fileName, "application/vnd.ms-excel;");
        api.handleSuccess(data);
        this.toggleImportExportStudentModal(false, null);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getSchoolClassroomName = key => {
    const { classrooms } = this.state;
    return find(classrooms, { key });
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
          importedStudentData: jsonData
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

  handleAcademicYearChange = value => {
    this.setState({
      selectedAcademicYear: value
    });
  };

  toggleImportExportStudentModal = (isImport, classroomKey) => {
    this.setState(p => ({
      showImportExportModal: !p.showImportExportModal,
      isImport,
      classroomKey,
      selectedFileToImport: null,
      selectedFileName: null,
      importedStudentData: [],
      importError: false
    }));
  };

  render() {
    const {
      showAddSchoolModal,
      addSchoolModalData,
      schoolTypes,
      schoolMediums,
      schoolCategories,
      selectedSchoolCategory,
      selectedSchoolMedium,
      selectedSchoolType,
      schoolData,
      title,
      schoolStandards,
      selectedStandard,
      classrooms,
      showDeactivateSchoolConfirmationModal,
      yearOfIntervention,
      showImportExportModal,
      isImport,
      selectedAcademicYear,
      academicYearDropdown,
      selectedFileName,
      importedStudentData,
      importError,
      fileUploadLoading
    } = this.state;

    const { key } = this.props.match.params;
    const { t } = this.props;
    return (
      <div>
        <SchoolDetails
          key={key}
          schoolDetails={schoolData}
          toggleModal={this.toggleAddSchoolModal}
          standards={schoolStandards}
          selectedStandard={selectedStandard}
          onStandardChange={this.handleSchoolStandardChange}
          fetchClassrooms={this.fetchClassrooms}
          classrooms={classrooms}
          onDeleteClassroom={this.deleteClassroom}
          showDeactivateSchoolConfirmationModal={
            showDeactivateSchoolConfirmationModal
          }
          toggleDeactivateSchoolConfirmationModal={
            this.toggleDeactivateSchoolConfirmationModal
          }
          onDeactivateSchool={this.handleDeactivateSchool}
          onImportStudent={this.handleStudentImport}
          onExportStudent={this.handleStudentExport}
          toggleImportStudentModal={this.toggleImportExportStudentModal}
          showImportExportModal={showImportExportModal}
          isImport={isImport}
          onFileInput={this.handleFileSelected}
          selectedAcademicYear={selectedAcademicYear}
          academicYearDropdown={academicYearDropdown}
          onAcademicYearChange={this.handleAcademicYearChange}
          selectedFileName={selectedFileName}
          students={importedStudentData}
          importError={importError}
          fileUploadLoading={fileUploadLoading}
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
          schoolData={schoolData}
          title={title}
          updateSchool={this.updateSchoolDetails}
          onYearOfInterventionChange={this.handleYearOfInterventionChange}
          yearOfIntervention={yearOfIntervention}
          t={t}
        />
      </div>
    );
  }
}

export default withRouter(SchoolDetailsContainer);
