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
import AddStudentModal from "../../components/AddEntityModals/AddStudentModal";
import StudentActions from "../../components/Actions/StudentActions";
import StudentTable from "../../components/ItemTables/StudentTable";
import instance from "../../utils/axios";
import api from "../../utils/api";
import forEach from "lodash/forEach";
import StudentFilters from "../../components/Filters/StudentFilters";
import {
  NGO_STUDENT_SEARCH,
  DEFAULT_SORT_NAME,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Import from "../../components/ImportEntityModals/Import";
import { withRouter } from "react-router-dom";
import { isValidUser } from "../../utils/validations";
import { isValid } from "../../utils/stringUtils";

class StudentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddStudentModal: false,
      modalData: null,
      studentList: [],
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
      title: "Add Student",
      showFilters: false,
      filterText: "",
      selectedSchoolFilter: null,
      selectedAcademicYearFilter: null,
      showDeactivateStudentConfirmationModal: false,
      showImportStudentModal: false,
      loading: true,
      clear: false,
      pages: 0,
      page: 0,
      sortBy: DEFAULT_SORT_NAME,
      desc: false,
      currentAcademicYear: null
    };
  }

  async componentDidMount() {
    const ngo = localStorage.getItem("ngo");
    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getSchoolDropdown(ngo),
          api.getAcademicYear(),
          api.getStudents(ngo, 0, DEFAULT_SORT_NAME, false),
          api.getCurrentAcademicyear()
        ])
        .then(
          instance.spread(
            (schools, academicYears, students, currentAcademicYear) => {
              let schoolDropdown = [];
              let academicYearDropdown = [];

              forEach(schools.data, item => {
                schoolDropdown.push({ value: item.key, label: item.name });
              });

              forEach(academicYears.data, item => {
                academicYearDropdown.push({
                  value: item.key,
                  label: item.name
                });
              });

              const { results, count } = students.data;
              this.createStudentTableData(results);
              const currentAcademicYearDropdown = this.getcurrentAcademicYear(
                currentAcademicYear.data
              );

              this.setState({
                schoolDropdown,
                academicYearDropdown,
                loading: false,
                selectedAcademicYear: currentAcademicYearDropdown,
                pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
                page: 0,
                currentAcademicYear: currentAcademicYearDropdown
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

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
        this.setState({
          classroomDropdown,
          selectedClassroom: null
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getcurrentAcademicYear = academicYear => {
    return { value: academicYear.key, label: academicYear.name };
  };

  fetchStudents = (page = 0, sort = null, order = null) => {
    this.setState({
      loading: true
    });
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    const orderBy = order === null ? this.state.desc : order;

    api
      .getStudents(ngo, page, sortBy, orderBy)
      .then(({ data }) => {
        const { results } = data;
        this.createStudentTableData(results);
        this.setState({
          page
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  createStudentTableData = data => {
    let students = [];

    forEach(data, obj => {
      const { classroom, student } = obj;
      const { school, standard } = classroom;
      students.push({
        key: student.key,
        name: `${student.first_name} ${student.last_name}`,
        school: school.name,
        standard: standard.name,
        division: classroom.division
      });
    });

    this.setState({
      studentList: students,
      loading: false
    });
  };

  toggleAddStudentModal = () => {
    this.setState(p => ({
      showAddStudentModal: !p.showAddStudentModal,
      selectedSchool: null,
      selectedClassroom: null,
      selectedGender: null,
      classroomDropdown: [],
      isDropout: false,
      hasAttendedPreSchool: false
    }));
  };

  handleSchoolChange = value => {
    this.setState({
      selectedSchool: value
    });
    this.fetchClassrooms(value.value);
  };

  handleAddStudentInputChange = ({ target }) => {
    const { name, value } = target;
    const { modalData } = this.state;
    const updatedData = { ...modalData, [name]: value };
    this.setState({ modalData: updatedData });
  };

  handleSaveStudent = () => {
    const { modalData, studentList } = this.state;
    const updated = [...studentList, modalData];
    this.setState({
      studentList: updated,
      modalData: null,
      showAddStudentModal: false
    });
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

  handleStudentCheckboxToggle = student => {
    const { checkedStudents } = this.state;
    const updatedStudents = checkedStudents.addOrUpdate(student);
    this.setState({
      checkedStudents: updatedStudents
    });
  };

  handleStudentDelete = () => {
    const { checkedStudents } = this.state;
    let students = [];
    forEach(checkedStudents, value => {
      students.push(value.key);
    });

    let body = JSON.stringify(students);
    api
      .deleteStudents({ students: body })
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

  handleShowFilter = isShow => {
    const { currentAcademicYear } = this.state;
    this.setState(p => ({
      showFilters: !p.showFilters,
      filterText: "",
      selectedSchoolFilter: null,
      selectedAcademicYearFilter: !p.showFilters ? currentAcademicYear : null,
      clear: !p.clear
    }));
    if (!isShow) {
      this.filterStudents(null, null, currentAcademicYear);
    } else {
      this.filterStudents();
    }
  };

  handleSchoolFilterChange = value => {
    const { filterText, selectedAcademicYearFilter } = this.state;
    this.setState({
      selectedSchoolFilter: value
    });

    this.filterStudents(filterText, value, selectedAcademicYearFilter);
  };

  handleAcademicYearFilterChange = value => {
    const { filterText, selectedSchoolFilter } = this.state;
    this.setState({
      selectedAcademicYearFilter: value
    });
    this.filterStudents(filterText, selectedSchoolFilter, value);
  };

  handleFilterTextChange = event => {
    const { value } = event.target;
    const { selectedSchoolFilter, selectedAcademicYearFilter } = this.state;
    this.setState({
      filterText: value
    });
    this.filterStudents(
      value,
      selectedSchoolFilter,
      selectedAcademicYearFilter
    );
  };

  filterStudents = (
    name,
    school,
    academicYear,
    page = 0,
    sort = null,
    order = null
  ) => {
    this.setState({
      loading: true
    });
    const ngo = localStorage.getItem("ngo");
    let schoolkey = school ? school.value : "";
    const academicYearKey = academicYear ? academicYear.value : "";
    const sortBy = sort === null ? this.state.sortBy : sort;
    const orderBy = order === null ? this.state.desc : order;
    const filters = {
      name,
      school: schoolkey,
      academicYear: academicYearKey,
      sort: sortBy,
      order: orderBy ? "true" : "false"
    };
    const body = {
      model: NGO_STUDENT_SEARCH,
      search: JSON.stringify(filters)
    };
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        this.createStudentTableData(results);
        this.setState({
          page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE)
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleDeactivateStudentConfirmationModal = key => {
    this.setState(p => ({
      showDeactivateStudentConfirmationModal: !p.showDeactivateStudentConfirmationModal
    }));
  };

  handleFilterClear = () => {
    this.setState(p => ({
      filterText: "",
      selectedSchoolFilter: null,
      selectedAcademicYearFilter: null
    }));
    this.filterStudents();
  };

  handlePageChange = nextPage => {
    const {
      filterText,
      selectedSchoolFilter,
      selectedAcademicYearFilter
    } = this.state;
    if (
      isValid(filterText) > 0 ||
      selectedSchoolFilter != null ||
      selectedAcademicYearFilter != null
    ) {
      this.filterStudents(
        filterText,
        selectedSchoolFilter,
        selectedAcademicYearFilter,
        nextPage
      );
    } else {
      this.fetchStudents(nextPage);
    }
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    const { filterText, selectedSchoolFilter } = this.state;
    this.setState({
      sortBy: id,
      desc
    });
    if (isValid(filterText) > 0 || selectedSchoolFilter != null) {
      this.filterStudents(filterText, selectedSchoolFilter, 0, id, desc);
    } else {
      this.fetchStudents(0, id, desc);
    }
  };

  render() {
    const {
      showAddStudentModal,
      studentList,
      checkedStudents,
      schoolDropdown,
      classroomDropdown,
      academicYearDropdown,
      isDropout,
      hasAttendedPreSchool,
      title,
      showFilters,
      selectedSchoolFilter,
      filterText,
      showDeactivateStudentConfirmationModal,
      showImportStudentsModal,
      loading,
      selectedAcademicYear,
      clear,
      page,
      pages,
      selectedAcademicYearFilter
    } = this.state;
    const { t, historty } = this.props;
    return (
      <div className="container-fluid">
        <StudentActions
          checkedStudents={checkedStudents}
          toggleAddStudentModal={this.toggleAddStudentModal}
          onDeleteStudents={this.toggleDeactivateStudentConfirmationModal}
          onToggleFilters={() => this.handleShowFilter(showFilters)}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <StudentFilters
          schools={schoolDropdown}
          academicYears={academicYearDropdown}
          selectedSchool={selectedSchoolFilter}
          selectedAcademicYear={selectedAcademicYearFilter}
          onSchoolFilterChange={this.handleSchoolFilterChange}
          onAcademicYearFilterChange={this.handleAcademicYearFilterChange}
          open={showFilters}
          text={filterText}
          onFilterTextChange={this.handleFilterTextChange}
        />
        <StudentTable
          students={studentList}
          onStudentCheckboxToggle={this.handleStudentCheckboxToggle}
          checkedStudents={checkedStudents}
          loading={loading}
          history={historty}
          pages={pages}
          page={page}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          t={t}
        />
        <AddStudentModal
          isOpen={showAddStudentModal}
          toggleModal={this.toggleAddStudentModal}
          onAddShoolInputChange={this.handleAddStudentInputChange}
          onSaveStudent={this.handleSaveStudent}
          isEdit={false}
          studentModalData={{}}
          onSchoolChange={this.handleSchoolChange}
          schools={schoolDropdown}
          classrooms={classroomDropdown}
          academicYears={academicYearDropdown}
          isDropout={isDropout}
          onIsDropoutCheckboxChange={this.handleIsDropoutCheckboxChange}
          hasAttendedPreSchool={hasAttendedPreSchool}
          onHasAttendedPreSchool={this.handleHasPreSchoolAttendedCheckboxChange}
          getStudents={this.fetchStudents}
          title={title}
          t={t}
          selectedAcademicYear={selectedAcademicYear}
        />
        <Import
          isOpen={showImportStudentsModal}
          toggleModal={this.toggleImportStudentModal}
          onImport={this.handleImportStudent}
          title="Import Students"
        />
        <ConfirmationModal
          isOpen={showDeactivateStudentConfirmationModal}
          title={"Deactivate selected students?"}
          onPositiveAction={this.handleStudentDelete}
          toggleModal={this.toggleDeactivateStudentConfirmationModal}
        />
      </div>
    );
  }
}

export default withRouter(StudentContainer);
