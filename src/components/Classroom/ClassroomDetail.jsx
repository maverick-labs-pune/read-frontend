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
import AddStudentModal from "../AddEntityModals/AddStudentModal";
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import StudentTable from "../ItemTables/StudentTable";
import { isValid } from "../../utils/stringUtils";
import Select from "../Select/Select";
import { Button } from "../Button/Button";

class ClassroomDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      selectedSchool,
      classroomDetail,
      classroomStudentList,
      toggleAddStudentModal,
      toggleDeleteStudentModal,
      isConfirmationOpen,
      onPositiveAction,
      academicYears,
      selectedAcademicYear,
      onAcademicYearChange,
      t
    } = this.props;

    let classrooms = [];
    classrooms.push({
      value: classroomDetail.key,
      label: classroomDetail.standard + "-" + classroomDetail.division
    });

    let selectedStudentClassroom = classrooms[0];

    return (
      <div>
        <div className="mt40 school-details-container card">
          <div className="mt20 ml20 mr20 mb20">
            <h3>
              {classroomDetail && selectedSchool
                ? selectedSchool.label +
                  " Classroom " +
                  t(classroomDetail.standard) +
                  " " +
                  classroomDetail.division +
                  " Details"
                : ""}
            </h3>
            <div className="divider" />
            <div className="ngo-details mt40">
              <div className="row align-items-end">
                <div className="col-lg-3 col-md-3">Academic Year</div>
                <div className="col-lg-3 col-md-3">
                  <Select
                    name="academic_year"
                    onChange={onAcademicYearChange}
                    //onBlur={handleBlur}
                    value={selectedAcademicYear || {}}
                    options={academicYears}
                    required
                  />
                </div>
                <div className="col-lg-6 col-md-6 text-right">
                  <Button primary onClick={toggleAddStudentModal}>
                    Add Student
                  </Button>
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">No of Students</div>
                <div className="col-lg-6 col-md-6">
                  <div className="row">
                    <div className="col-lg-3 col-md-3">
                      {classroomStudentList ? classroomStudentList.length : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt10 mb-4 school-details-container">
          <AddStudentModal
            toggleModal={toggleAddStudentModal}
            studentData={{}}
            isEdit={false}
            classrooms={classrooms}
            selectedClassroom={selectedStudentClassroom}
            selectedAcademicYear={selectedAcademicYear}
            {...this.props}
          />
          {isValid(classroomStudentList) > 0 ? (
            <div>
              <StudentTable
                students={classroomStudentList}
                classroomStudentTable={true}
                classroomStudents
                {...this.props}
              />
              <ConfirmationModal
                isOpen={isConfirmationOpen}
                title={"Remove the selected student from classroom?"}
                onPositiveAction={onPositiveAction}
                toggleModal={toggleDeleteStudentModal}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(ClassroomDetails);
