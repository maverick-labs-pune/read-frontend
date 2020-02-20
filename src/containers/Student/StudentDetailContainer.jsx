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
import StudentDetails from "../../components/StudentDetails/StudentDetails";
import api from "../../utils/api";
import forEach from "lodash/forEach";
import instance from "../../utils/axios";
import AddStudentModal from "../../components/AddEntityModals/AddStudentModal";
import find from "lodash/find";
import { GENDER } from "../../utils/constants";
import cloneDeep from "lodash/cloneDeep";
import { isValidUser } from "../../utils/validations";

class StudentDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddStudentModal: false,
      checkedStudents: [],
      schoolDropdown: [],
      classroomDropdown: [],
      academicYearDropdown: [],
      selectedSchool: null,
      selectedClassroom: null,
      selectedAcademicYear: null,
      isDropout: false,
      hasAttendedPreSchool: false,
      selectedGender: null,
      studentDetails: null,
      title: "Edit Student",
      showDeactivateStudentConfirmationModal: false,
      showMarkStudentAsDropoutConfirmationModal: false,
      modalData: null
    };
  }

  async componentDidMount() {
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getSchoolDropdown(ngo),
          api.getAcademicYear(),
          api.getStudentDetails(key)
        ])
        .then(
          instance.spread((schools, academicYears, studentDetails) => {
            let schoolDropdown = [];
            let academicYearDropdown = [];

            forEach(schools.data, item => {
              schoolDropdown.push({ value: item.key, label: item.name });
            });

            forEach(academicYears.data, item => {
              academicYearDropdown.push({ value: item.key, label: item.name });
            });

            const {
              details,
              modalData,
              is_dropout,
              has_attended_preschool
            } = this.createStudentData(
              studentDetails.data,
              schoolDropdown,
              academicYearDropdown
            );

            this.setState({
              schoolDropdown,
              academicYearDropdown,
              studentDetails: details,
              isDropout: is_dropout,
              hasAttendedPreSchool: has_attended_preschool,
              modalData
            });
          })
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  createStudentData = (details, schoolDropdown, academicYearDropdown) => {
    let data = cloneDeep(details);
    const { classroom, student } = data;
    const { school } = classroom;
    const { is_dropout, has_attended_preschool } = student;
    const gender = this.getSelectedGender(data.student.gender);
    const schoolSelected = this.getSelectedSchool(schoolDropdown, school);
    const academicYear = this.getSelectedAcademicYear(
      academicYearDropdown,
      data.academic_year
    );

    let result = find(schoolDropdown, item => {
      return item.value === school.key;
    });

    this.fetchClassrooms(result.value);

    student.gender = gender;
    student.school = schoolSelected;
    student.academic_year = academicYear;
    const studentDetails = this.createStudentDetailObject(details);
    return {
      modalData: student,
      details: studentDetails,
      is_dropout,
      has_attended_preschool
    };
  };

  fetchClassrooms = school => {
    const ngo = localStorage.getItem("ngo");
    api
      .getSchoolClassrooms(ngo, school)
      .then(({ data }) => {
        let classroomDropdown = [];
        forEach(data, item => {
          classroomDropdown.push({
            value: item.key,
            label: `${item.standard} - ${item.division ? item.division : "-"}`
          });
        });
        let { studentDetails, modalData } = this.state;
        let { classroom } = studentDetails;
        const classroomSelected = this.getSelectedClassroom(
          classroomDropdown,
          classroom
        );
        modalData.classroom = classroomSelected;
        this.setState({
          classroomDropdown,
          selectedClassroom: {},
          modalData
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  fetchStudentDetails = () => {
    const { key } = this.props.match.params;
    const { schoolDropdown, academicYearDropdown } = this.state;
    api
      .getStudentDetails(key)
      .then(({ data }) => {
        const {
          details,
          modalData,
          is_dropout,
          has_attended_preschool
        } = this.createStudentData(data, schoolDropdown, academicYearDropdown);
        this.setState({
          studentDetails: details,
          modalData,
          isDropout: is_dropout,
          hasAttendedPreSchool: has_attended_preschool
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleEditStudentModal = () => {
    this.setState(p => ({
      showAddStudentModal: !p.showAddStudentModal,
      selectedSchool: null,
      selectedClassroom: null,
      selectedAcademicYear: null,
      selectedGender: null
    }));
  };

  handleSchoolChange = value => {
    this.setState({
      selectedSchool: value,
      classroomDropdown: []
    });
    this.fetchClassrooms(value.value);
  };

  handleIsDropoutCheckboxChange = () => {
    this.setState(p => ({
      isDropout: !p.isDropout
    }));
  };

  handleHasPreSchoolAttendedCheckboxChange = () => {
    this.setState(p => ({
      hasAttendedPreSchool: !p.hasAttendedPreSchool
    }));
  };

  createStudentDetailObject = data => {
    let student = Object.assign({}, data.student);
    student.classroom = data.classroom;
    student.academicYear = data.academic_year;
    return student;
  };

  markAsDropout = () => {
    const { key } = this.props.match.params;
    const {
      modalData: { academic_year }
    } = this.state;
    const body = { academicYear: academic_year.value };
    api
      .markStudentAsDropout(key, body)
      .then(() => {
        this.fetchStudentDetails();
        this.toggleMarkStudentDropoutConfirmationModal();
        this.props.history.push("/home/students");
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleStudentDelete = key => {
    let body = JSON.stringify([key]);
    api
      .deleteStudents({ students: body })
      .then(({ data }) => {
        this.toggleDeactivateStudentConfirmationModal();
        api.handleSuccess(data);
        this.props.history.push("/home/students");
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleDeactivateStudentConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateStudentConfirmationModal: !p.showDeactivateStudentConfirmationModal
    }));
  };

  toggleMarkStudentDropoutConfirmationModal = () => {
    this.setState(p => ({
      showMarkStudentAsDropoutConfirmationModal: !p.showMarkStudentAsDropoutConfirmationModal
    }));
  };

  getSelectedGender = gender => {
    let result = find(GENDER, item => {
      return item.value === gender;
    });
    return result;
  };

  getSelectedSchool = (schools, selectedSchool) => {
    let result = find(schools, item => {
      return item.value === selectedSchool.key;
    });
    return result;
  };

  getSelectedClassroom = (classrooms, selectedClassroom) => {
    let result = find(classrooms, item => {
      return item.value === selectedClassroom.key;
    });
    return result;
  };

  getSelectedAcademicYear = (academicYears, selectedAcademicYear) => {
    let result = find(academicYears, item => {
      return item.value === selectedAcademicYear.key;
    });
    return result;
  };

  render() {
    const {
      showAddStudentModal,
      schoolDropdown,
      classroomDropdown,
      academicYearDropdown,
      isDropout,
      hasAttendedPreSchool,
      studentDetails,
      title,
      showDeactivateStudentConfirmationModal,
      showMarkStudentAsDropoutConfirmationModal,
      modalData
    } = this.state;

    const { t } = this.props;
    return (
      <div>
        <StudentDetails
          studentDetails={studentDetails}
          toggleModal={this.toggleEditStudentModal}
          markAsDropout={this.markAsDropout}
          onStudentDelete={this.handleStudentDelete}
          showDeactivateStudentConfirmationModal={
            showDeactivateStudentConfirmationModal
          }
          toggleDeactivateStudentConfirmationModal={
            this.toggleDeactivateStudentConfirmationModal
          }
          showMarkStudentAsDropoutConfirmationModal={
            showMarkStudentAsDropoutConfirmationModal
          }
          toggleMarkStudentDropoutConfirmationModal={
            this.toggleMarkStudentDropoutConfirmationModal
          }
          t={t}
        />
        <AddStudentModal
          isOpen={showAddStudentModal}
          toggleModal={this.toggleEditStudentModal}
          onAddShoolInputChange={this.handleAddStudentInputChange}
          onSchoolChange={this.handleSchoolChange}
          schools={schoolDropdown}
          classrooms={classroomDropdown}
          academicYears={academicYearDropdown}
          isDropout={isDropout}
          isEdit={true}
          onIsDropoutCheckboxChange={this.handleIsDropoutCheckboxChange}
          hasAttendedPreSchool={hasAttendedPreSchool}
          onHasAttendedPreSchool={this.handleHasPreSchoolAttendedCheckboxChange}
          title={title}
          updateStudentDetails={this.fetchStudentDetails}
          studentModalData={modalData}
          t={t}
        />
      </div>
    );
  }
}

export default withRouter(StudentDetailsContainer);
