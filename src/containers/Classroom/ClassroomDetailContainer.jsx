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
import ClassroomDetails from "../../components/Classroom/ClassroomDetail";
import instance from "../../utils/axios";
import api from "../../utils/api";
import forEach from "lodash/forEach";
import { withRouter } from "react-router-dom";
import { isValidUser } from "../../utils/validations";

class ClassroomDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomStudentList: [],
      classroomDetail: [],
      selectedClassroom: null,
      checkedStudents: [],
      showAddStudentModal: false,
      hasAttendedPreSchool: false,
      modalData: null,
      school: [],
      selectedSchool: null,
      academicYearDropdown: [],
      selectedAcademicYear: null,
      isDropout: false,
      title: "Add Student",
      readOnly: true,
      showDeactivateStudentConfirmationModal: false,
      loading: false
    };
  }

  async componentDidMount() {
    const { classroomkey } = this.props.match.params;
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getCurrentAcademicyear(),
          api.getSchoolClassrooms(ngo, key),
          api.getSchool(key),
          api.getAcademicYear()
        ])
        .then(
          instance.spread(
            (currentAcademicYear, classrromList, school, academicYears) => {
              let classroomDetail = [];
              let schoolDropdown = [];
              let academicYearDropdown = [];
              let selectedCurrentAcademicYear = null;
              forEach(classrromList.data, item => {
                if (item.key === classroomkey) classroomDetail = item;
              });

              schoolDropdown.push({
                value: school.data.key,
                label: school.data.name
              });

              selectedCurrentAcademicYear = {
                value: currentAcademicYear.data.key,
                label: currentAcademicYear.data.name
              };

              forEach(academicYears.data, item => {
                academicYearDropdown.push({
                  value: item.key,
                  label: item.name
                });
              });

              this.getStudentOfAcadmicYear(currentAcademicYear.data.key);
              this.setState({
                classroomDetail,
                school: schoolDropdown,
                selectedSchool: schoolDropdown[0],
                academicYearDropdown,
                selectedAcademicYear: selectedCurrentAcademicYear
              });
            }
          )
        )
        .catch(({ response }) => {
          api.handleError(response);
        });
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getStudentOfAcadmicYear = academicYear => {
    this.setState({
      loading: true
    });
    const { classroomkey } = this.props.match.params;
    api
      .getClassroomStudentDetails(classroomkey, academicYear)
      .then(({ data }) => {
        this.setState({
          classroomStudentList: data,
          loading: false
        });
      })
      .catch(({ response }) => {
        this.setState({ loading: false });
        api.handleError(response);
      });
  };

  HandleAcademicYearChange = value => {
    this.getStudentOfAcadmicYear(value.value);
    this.setState({
      selectedAcademicYear: value
    });
  };

  toggleAddStudentModal = () => {
    this.setState(p => ({
      showAddStudentModal: !p.showAddStudentModal,
      selectedGender: null,
      classroomDropdown: [],
      isDropout: false,
      hasAttendedPreSchool: false
    }));
  };

  handleAddStudentInputChange = ({ target }) => {
    const { name, value } = target;
    const { modalData } = this.state;
    const updatedData = { ...modalData, [name]: value };
    this.setState({ modalData: updatedData });
  };

  handleSaveStudent = () => {
    const { modalData, showAddStudentModal } = this.state;
    const updated = [...showAddStudentModal, modalData];
    this.setState({
      showAddStudentModal: updated,
      modalData: null
    });
  };

  toggleDeactivateStudentConfirmationModal = key => {
    this.setState(p => ({
      showDeactivateStudentConfirmationModal: !p.showDeactivateStudentConfirmationModal
    }));
  };

  handleStudentDeleteButton = student => {
    this.setState({
      checkedStudents: [student]
    });

    this.toggleDeactivateStudentConfirmationModal();
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

  fetchStudents = () => {
    const { classroomkey } = this.props.match.params;
    const { selectedAcademicYear } = this.state;
    api
      .getClassroomStudentDetails(classroomkey, selectedAcademicYear.value)
      .then(({ data }) => {
        this.setState({
          classroomStudentList: data
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleStudentDelete = () => {
    const { classroomkey } = this.props.match.params;
    const { checkedStudents } = this.state;

    let student = checkedStudents[0].key;

    api
      .removeStudentFromClassroom(classroomkey, { student })
      .then(({ data }) => {
        this.fetchStudents();
        this.setState({
          checkedStudents: []
        });
        this.toggleDeactivateStudentConfirmationModal();
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  render() {
    const {
      title,
      showAddStudentModal,
      classroomDetail,
      classroomStudentList,
      modalData,
      checkedStudents,
      school,
      academicYearDropdown,
      isDropout,
      hasAttendedPreSchool,
      readOnly,
      showDeactivateStudentConfirmationModal,
      selectedSchool,
      selectedAcademicYear,
      loading
    } = this.state;

    return (
      <div>
        <ClassroomDetails
          school={school}
          selectedSchool={selectedSchool}
          classroomDetail={classroomDetail}
          classroomStudentList={classroomStudentList}
          academicYears={academicYearDropdown}
          checkedStudents={checkedStudents}
          isOpen={showAddStudentModal}
          toggleAddStudentModal={this.toggleAddStudentModal}
          modalData={modalData}
          onSaveStudent={this.handleSaveStudent}
          isDropout={isDropout}
          onIsDropoutCheckboxChange={this.handleIsDropoutCheckboxChange}
          hasAttendedPreSchool={hasAttendedPreSchool}
          onHasAttendedPreSchool={this.handleHasPreSchoolAttendedCheckboxChange}
          title={title}
          getStudents={this.fetchStudents}
          readOnly={readOnly}
          handleStudentDeleteButton={this.handleStudentDeleteButton}
          isConfirmationOpen={showDeactivateStudentConfirmationModal}
          onPositiveAction={this.handleStudentDelete}
          toggleDeleteStudentModal={
            this.toggleDeactivateStudentConfirmationModal
          }
          selectedAcademicYear={selectedAcademicYear}
          onAcademicYearChange={this.HandleAcademicYearChange}
          loading={loading}
          classroomStudents
          {...this.props}
        />
      </div>
    );
  }
}

export default withRouter(ClassroomDetailsContainer);
