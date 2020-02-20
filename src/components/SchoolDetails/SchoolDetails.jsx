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
import AddClassroomModal from "../AddEntityModals/AddClassroomModal";
import { Button } from "../Button/Button";
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import ClassroomTable from "../ItemTables/ClassroomTable";
import { isValid } from "../../utils/stringUtils";
import ImportExportStudent from "../ImportEntityModals/ImportExportStudent";

class SchoolDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddClassroomModal: false,
      classroomKey: null,
      showDeactivateClassroomConfirmationModal: false
    };
  }

  toggleAddClassroomModal = () => {
    this.setState(p => ({ showAddClassroomModal: !p.showAddClassroomModal }));
  };

  toggleDeactivateClassroomConfirmationModal = key => {
    this.setState(p => ({
      showDeactivateClassroomConfirmationModal: !p.showDeactivateClassroomConfirmationModal,
      classroomKey: key
    }));
  };

  render() {
    const {
      showAddClassroomModal,
      showDeactivateClassroomConfirmationModal,
      classroomKey
    } = this.state;
    const {
      schoolDetails,
      standards,
      selectedStandard,
      onStandardChange,
      fetchClassrooms,
      classrooms,
      showDeactivateSchoolConfirmationModal,
      toggleDeactivateSchoolConfirmationModal,
      toggleImportStudentModal,
      toggleModal,
      isImport,
      showImportExportModal,
      onDeactivateSchool,
      onDeleteClassroom,
      onFileInput,
      onAcademicYearChange,
      academicYearDropdown,
      onImportStudent,
      fileUploadLoading,
      onExportStudent,
      selectedAcademicYear,
      selectedFileName,
      importError,
      students,
      t
    } = this.props;
    const { key } = this.props.match.params;
    return (
      <div>
        <div className="mt40 school-details-container card">
          <div className="mt20 ml20 mr20 mb20">
            <h3>{schoolDetails ? schoolDetails.name : ""} Details</h3>
            <div className="divider" />
            <div className="ngo-details mt40">
              <div className="row align-items-end">
                <div className="col-lg-3 col-md-3">Address</div>
                <div className="col-lg-3 col-md-3">
                  {schoolDetails
                    ? schoolDetails.address + " " + schoolDetails.pin_code
                    : ""}
                </div>
                <div className="col-lg-6 col-md-6 text-right">
                  <Button primary onClick={this.toggleAddClassroomModal}>
                    Add classroom
                  </Button>
                  <Button primary onClick={toggleModal} className="ml10">
                    Edit School
                  </Button>
                  <Button
                    warning
                    secondary
                    onClick={toggleDeactivateSchoolConfirmationModal}
                    className="text-warning ml10"
                  >
                    Delete School
                  </Button>
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Ward number</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails && schoolDetails.ward_number
                    ? schoolDetails.ward_number
                    : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">School Number</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails && schoolDetails.school_number
                    ? schoolDetails.school_number
                    : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Category</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails ? t(schoolDetails.school_category.name) : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Type</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails ? t(schoolDetails.school_type.name) : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Medium</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails ? t(schoolDetails.medium.name) : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Organization</div>
                <div className="col-lg-6 col-md-6">
                  {schoolDetails && schoolDetails.organization_name
                    ? schoolDetails.organization_name
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt10 mb-4 school-details-container">
          <AddClassroomModal
            isOpen={showAddClassroomModal}
            toggleModal={this.toggleAddClassroomModal}
            standards={standards}
            onStandardChange={onStandardChange}
            selectedStandard={selectedStandard}
            schoolDetails={schoolDetails}
            fetchClassrooms={fetchClassrooms}
          />
          {isValid(classrooms) > 0 ? (
            <ClassroomTable
              classrooms={classrooms}
              toggleDeactivateClassroomConfirmationModal={
                this.toggleDeactivateClassroomConfirmationModal
              }
              onImportToggle={classroom =>
                toggleImportStudentModal(true, classroom)
              }
              onExportToggle={classroom =>
                toggleImportStudentModal(false, classroom)
              }
              t={t}
            />
          ) : null}

          <ImportExportStudent
            toggleImportExport={toggleImportStudentModal}
            isImport={isImport}
            isOpen={showImportExportModal}
            onFileInput={onFileInput}
            onAcademicYearChange={onAcademicYearChange}
            academicYearDropdown={academicYearDropdown}
            onImportStudent={onImportStudent}
            fileUploadLoading={fileUploadLoading}
            onExportStudent={onExportStudent}
            selectedAcademicYear={selectedAcademicYear}
            selectedFileName={selectedFileName}
            importError={importError}
            students={students}
            t={t}
          />
          <ConfirmationModal
            isOpen={showDeactivateSchoolConfirmationModal}
            title={"Deactivate School?"}
            onPositiveAction={() => onDeactivateSchool(key)}
            toggleModal={toggleDeactivateSchoolConfirmationModal}
          />
          <ConfirmationModal
            isOpen={showDeactivateClassroomConfirmationModal}
            title={"Deactivate Classroom?"}
            onPositiveAction={() => {
              onDeleteClassroom(classroomKey);
              this.toggleDeactivateClassroomConfirmationModal(null);
            }}
            toggleModal={() =>
              this.toggleDeactivateClassroomConfirmationModal(null)
            }
          />
        </div>
      </div>
    );
  }
}

export default withRouter(SchoolDetails);
