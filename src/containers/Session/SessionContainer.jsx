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
import SessionActions from "../../components/Actions/SessionActions";
import CreateSessionModal from "../../components/AddEntityModals/CreateSessionModal";
import instance from "../../utils/axios";
import api from "../../utils/api";
import forEach from "lodash/forEach";
import SessionsTable from "../../components/ItemTables/SessionsTable";
import SessionFilters from "../../components/Filters/SessionFilters";
import {
  NGO_SESSION_SEARCH,
  DEFAULT_SORT_SESSION_DATE,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import reduce from "lodash/reduce";
import { isValid } from "../../utils/stringUtils";
import { isValidUser } from "../../utils/validations";

class SessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateSessionModal: false,
      schoolDropdown: [],
      classroomDropdown: [],
      academicYearDropdown: [],
      selectedSchool: null,
      selectedClassroom: null,
      selectedAcademicYear: null,
      selectedDate: null,
      bookFairiesDropdown: [],
      selectedBookFairies: null,
      isVerified: false,
      isCancelled: false,
      selectedRadio: null,
      recurringDate: null,
      recurringFromDate: null,
      recurringToDate: null,
      sessionsList: [],
      checkedSessions: [],
      filterSchoolDropdown: [],
      filterBookFairyDropdown: [],
      filterAcademicYearDropdown: [],
      filterClassroomDropdown: [],
      filterSelectedSchool: null,
      filterSelectedBookFairy: null,
      filterSelectedAcademicYear: null,
      filterSelectedClassroom: null,
      showDeactivateSessionConfirmationModal: false,
      loading: true,
      clear: false,
      sessionErrors: null,
      page: 0,
      pages: 0,
      sortBy: DEFAULT_SORT_SESSION_DATE,
      desc: false
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
          api.bookFairies(ngo),
          api.sessions(ngo, 0, DEFAULT_SORT_SESSION_DATE, false),
          api.getCurrentAcademicyear()
        ])
        .then(
          instance.spread(
            (
              schools,
              academicYears,
              fairies,
              sessions,
              currentAcademicYear
            ) => {
              let schoolDropdown = [];
              let academicYearDropdown = [];
              let bookFairiesDropdown = [];
              forEach(schools.data, item => {
                schoolDropdown.push({ value: item.key, label: item.name });
              });

              forEach(academicYears.data, item => {
                academicYearDropdown.push({
                  value: item.key,
                  label: item.name
                });
              });

              forEach(fairies.data, item => {
                bookFairiesDropdown.push({
                  value: item.key,
                  label: `${item.first_name} ${item.last_name}`,
                  key: item.key
                });
              });

              const selectedAcademicYear = {
                value: currentAcademicYear.data.key,
                label: currentAcademicYear.data.name
              };

              const { count, results } = sessions.data;
              const sessionsList = this.createReadSessionList(results);
              this.setState({
                schoolDropdown,
                academicYearDropdown,
                bookFairiesDropdown,
                sessionsList,
                filterSchoolDropdown: schoolDropdown,
                filterBookFairyDropdown: bookFairiesDropdown,
                filterAcademicYearDropdown: academicYearDropdown,
                loading: false,
                selectedAcademicYear,
                page: 0,
                pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE)
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  fetchSession = (page = 0, sort = null, order = null) => {
    const ngo = localStorage.getItem("ngo");
    const sortBy = sort === null ? this.state.sortBy : sort;
    const orderBy = order === null ? this.state.desc : order;

    this.setState({
      loading: true
    });
    api
      .sessions(ngo, page, sortBy, orderBy)
      .then(({ data }) => {
        const { results, count } = data;
        let result = this.createReadSessionList(results);
        this.setState({
          sessionsList: result,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          page: page,
          loading: false
        });
      })
      .catch(error => {});
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
            label: `${this.props.t(item.standard)} - ${
              item.division ? item.division : ""
            } `
          });
        });
        this.setState({
          classroomDropdown,
          filterClassroomDropdown: classroomDropdown
        });
      })
      .catch(error => {});
  };
  // TODO
  createReadSessionList = readSessions => {
    let result = [];
    forEach(readSessions, item => {
      const {
        academic_year,
        readsessionclassroom_set,
        readsessionbookfairy_set,
        type
      } = item;

      let schoolName = "",
        standards = [],
        bookFairies = [];
      forEach(readsessionclassroom_set, item => {
        let { school, standard, division } = item.classroom;
        schoolName = school.name;
        let standardDivisionStr = isValid(division)
          ? `${standard.name} - ${division}`
          : standard.name;
        standards.push(standardDivisionStr);
      });

      forEach(readsessionbookfairy_set, item => {
        let { book_fairy } = item;
        bookFairies.push(`${book_fairy.first_name} ${book_fairy.last_name}`);
      });

      let session = {
        startDateTime: item.start_date_time,
        endDateTime: item.end_date_time,
        academicYear: academic_year.name,
        key: item.key,
        notes: item.notes,
        school: schoolName,
        standard: standards.join(", "),
        fairy: bookFairies.join(", "),
        type
      };
      result.push(session);
    });
    return result;
  };

  toggleCreateSessionModal = () => {
    this.setState(p => ({
      showCreateSessionModal: !p.showCreateSessionModal,
      selectedSchool: null,
      selectedClassroom: null,
      selectedDate: null,
      selectedBookFairies: null,
      isVerified: false,
      isCancelled: false,
      selectedRadio: null,
      recurringDate: null,
      isError: false,
      sessionErrors: null,
      recurringFromDate: null,
      recurringToDate: null
    }));
  };

  handleSchoolChange = value => {
    this.setState({
      selectedSchool: value,
      classroomDropdown: [],
      selectedClassroom: null
    });
    this.fetchClassrooms(value.value);
  };

  handleClassroomChange = value => {
    this.setState({
      selectedClassroom: value
    });
  };

  handleAcademicYearChange = value => {
    this.setState({
      selectedAcademicYear: value
    });
  };

  handleBookFairiesChange = value => {
    this.setState({
      selectedBookFairies: value
    });
  };

  handleOneTimeDateChange = value => {
    this.setState({
      selectedDate: value
    });
  };

  handleIsVerifiedChange = () => {
    this.setState(p => ({
      isVerified: !p.isVerified
    }));
  };

  handleIsCancelledChange = () => {
    this.setState(p => ({
      isCancelled: !p.isCancelled
    }));
  };

  handleRadioChange = value => {
    const { target } = value;
    this.setState({
      selectedRadio: target.id
    });
  };

  handleRecurringDateChange = value => {
    this.setState({
      recurringDate: value
    });
  };

  handleFromDateChange = value => {
    this.setState({
      recurringFromDate: value
    });
  };

  handleToDateChange = value => {
    this.setState({
      recurringToDate: value
    });
  };

  handleSessionCheckboxToggle = session => {
    const { checkedSessions } = this.state;
    const updatedSessions = checkedSessions.addOrUpdate(session);
    this.setState({
      checkedSessions: updatedSessions
    });
  };

  handleClassroomFilterChange = value => {
    const {
      filterSelectedSchool,
      filterSelectedAcademicYear,
      filterSelectedBookFairy
    } = this.state;
    const school = filterSelectedSchool ? filterSelectedSchool.value : null;
    const academicYear = filterSelectedAcademicYear
      ? filterSelectedAcademicYear.value
      : null;
    const fairy = filterSelectedBookFairy
      ? filterSelectedBookFairy.value
      : null;

    this.setState({
      filterSelectedClassroom: value
    });
    this.filterSessions(school, fairy, academicYear, value.value);
  };

  handleSchoolFilterChange = value => {
    // Classroom under selected school
    this.fetchClassrooms(value.value);
    const { filterSelectedBookFairy, filterSelectedAcademicYear } = this.state;
    const academicYear = filterSelectedAcademicYear
      ? filterSelectedAcademicYear.value
      : null;
    const fairy = filterSelectedBookFairy
      ? filterSelectedBookFairy.value
      : null;
    this.setState({
      filterSelectedSchool: value,
      filterSelectedClassroom: null
    });
    this.filterSessions(value.value, fairy, academicYear, null);
  };

  handleBookFairyFilterChange = value => {
    const {
      filterSelectedSchool,
      filterSelectedAcademicYear,
      filterSelectedClassroom
    } = this.state;
    const school = filterSelectedSchool ? filterSelectedSchool.value : null;
    const classroom = filterSelectedClassroom
      ? filterSelectedClassroom.value
      : null;

    const academicYear = filterSelectedAcademicYear
      ? filterSelectedAcademicYear.value
      : null;
    this.setState({
      filterSelectedBookFairy: value
    });
    this.filterSessions(school, value.value, academicYear, classroom);
  };

  handleAcademicYearFilterChange = value => {
    const {
      filterSelectedSchool,
      filterSelectedBookFairy,
      filterSelectedClassroom
    } = this.state;
    const school = filterSelectedSchool ? filterSelectedSchool.value : null;
    const classroom = filterSelectedClassroom
      ? filterSelectedClassroom.value
      : null;
    const fairy = filterSelectedBookFairy
      ? filterSelectedBookFairy.value
      : null;

    this.setState({
      filterSelectedAcademicYear: value
    });
    this.filterSessions(school, fairy, value.value, classroom);
  };

  handleShowFilter = () => {
    this.setState(p => ({
      showFilters: !p.showFilters,
      filterSelectedSchool: null,
      filterSelectedBookFairy: null,
      filterSelectedAcademicYear: null,
      filterSelectedClassroom: null,
      clear: !p.clear
    }));
    this.filterSessions("", "", "", "");
  };

  filterSessions = (
    school,
    fairy,
    academicYear,
    classroom,
    page = 0,
    sortBy = null,
    orderBy = null
  ) => {
    this.setState({ loading: true });

    const sort = sortBy === null ? this.state.sortBy : sortBy;
    const order = orderBy === null ? this.state.desc : orderBy;

    const filters = {
      school,
      fairy,
      academicYear,
      classroom,
      sort,
      order: order ? "true" : "false"
    };
    const body = { model: NGO_SESSION_SEARCH, search: JSON.stringify(filters) };
    const ngo = localStorage.getItem("ngo");
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        const sessionsList = this.createReadSessionList(results);
        this.setState({
          sessionsList,
          loading: false,
          page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE)
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleDeactivateSessionConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateSessionConfirmationModal: !p.showDeactivateSessionConfirmationModal
    }));
  };

  handleDeleteSession = () => {
    const { checkedSessions } = this.state;
    const sessionKeys = reduce(
      checkedSessions,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    let keys = JSON.stringify(sessionKeys);
    api
      .deleteReadSession({ keys })
      .then(({ data }) => {
        this.setState({
          checkedSessions: []
        });
        api.handleSuccess(data);
        this.fetchSession();
        this.toggleDeactivateSessionConfirmationModal();
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleFilterClear = () => {
    this.setState({
      filterSelectedAcademicYear: null,
      filterSelectedClassroom: null,
      filterSelectedBookFairy: null,
      filterSelectedSchool: null
    });
    this.filterSessions("", "", "", "");
  };

  handleSessionConflicts = error => {
    const { message } = error;
    this.setState({
      sessionErrors: message,
      isError: true
    });
  };

  handlePageChange = nextPage => {
    const {
      filterSelectedAcademicYear,
      filterSelectedBookFairy,
      filterSelectedClassroom,
      filterSelectedSchool
    } = this.state;
    if (
      filterSelectedAcademicYear !== null ||
      filterSelectedBookFairy !== null ||
      filterSelectedClassroom !== null ||
      filterSelectedSchool !== null
    ) {
      const { school, bookFairy, academicYear, classroom } = this.getFilters();
      this.filterSessions(school, bookFairy, academicYear, classroom, nextPage);
    } else {
      this.fetchSession(nextPage);
    }
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    const {
      filterSelectedAcademicYear,
      filterSelectedBookFairy,
      filterSelectedClassroom,
      filterSelectedSchool
    } = this.state;
    this.setState({
      sortBy: id,
      desc
    });
    if (
      filterSelectedAcademicYear !== null ||
      filterSelectedBookFairy !== null ||
      filterSelectedClassroom !== null ||
      filterSelectedSchool !== null
    ) {
      const { school, bookFairy, academicYear, classroom } = this.getFilters();
      this.filterSessions(
        school,
        bookFairy,
        academicYear,
        classroom,
        0,
        id,
        desc
      );
    } else {
      this.fetchSession(0, id, desc);
    }
  };

  getFilters = () => {
    const {
      filterSelectedAcademicYear,
      filterSelectedBookFairy,
      filterSelectedClassroom,
      filterSelectedSchool
    } = this.state;
    const academicYear =
      isValid(filterSelectedAcademicYear) > 0
        ? filterSelectedAcademicYear.value
        : "";
    const school =
      isValid(filterSelectedSchool) > 0 ? filterSelectedSchool.value : "";
    const classroom =
      isValid(filterSelectedClassroom) > 0 ? filterSelectedClassroom.value : "";
    const bookFairy =
      isValid(filterSelectedBookFairy) > 0 ? filterSelectedBookFairy.value : "";

    return { school, academicYear, classroom, bookFairy };
  };

  render() {
    const {
      showCreateSessionModal,
      checkedSessions,
      modalData,
      schoolDropdown,
      classroomDropdown,
      academicYearDropdown,
      selectedDate,
      bookFairiesDropdown,
      isCancelled,
      isVerified,
      selectedRadio,
      recurringDate,
      recurringFromDate,
      recurringToDate,
      sessionsList,
      showFilters,
      filterSchoolDropdown,
      filterSelectedSchool,
      filterBookFairyDropdown,
      filterSelectedBookFairy,
      filterAcademicYearDropdown,
      filterSelectedAcademicYear,
      showDeactivateSessionConfirmationModal,
      loading,
      selectedAcademicYear,
      filterClassroomDropdown,
      filterSelectedClassroom,
      clear,
      sessionErrors,
      isError,
      pages,
      page
    } = this.state;
    const { t, history } = this.props;
    return (
      <div className="container-fluid">
        <SessionActions
          checkedSessions={checkedSessions || []}
          toggleCreateSessionModal={this.toggleCreateSessionModal}
          onToggleFilters={this.handleShowFilter}
          onDeleteSessions={this.toggleDeactivateSessionConfirmationModal}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <SessionFilters
          open={showFilters}
          schools={filterSchoolDropdown}
          onSchoolFilterChange={this.handleSchoolFilterChange}
          selectedSchool={filterSelectedSchool}
          bookFairies={filterBookFairyDropdown}
          onBookFairyChange={this.handleBookFairyFilterChange}
          selectedBookFairy={filterSelectedBookFairy}
          acadmicYears={filterAcademicYearDropdown}
          onAcademicYearChange={this.handleAcademicYearFilterChange}
          selectedAcademicYear={filterSelectedAcademicYear}
          classrooms={filterClassroomDropdown}
          onClassroomFilterChange={this.handleClassroomFilterChange}
          selectedClassroom={filterSelectedClassroom}
        />
        <SessionsTable
          sessions={sessionsList || []}
          onSessionCheckboxToggle={this.handleSessionCheckboxToggle}
          checkedSessions={checkedSessions || []}
          canDelete
          loading={loading}
          history={history}
          page={page}
          pages={pages}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
          t={t}
        />

        <CreateSessionModal
          isOpen={showCreateSessionModal}
          toggleModal={this.toggleCreateSessionModal}
          modalData={modalData || {}}
          onSchoolChange={this.handleSchoolChange}
          schools={schoolDropdown}
          classrooms={classroomDropdown}
          academicYears={academicYearDropdown}
          selectedDate={selectedDate}
          onOneTimeDateChange={this.handleOneTimeDateChange}
          bookFairies={bookFairiesDropdown}
          isVerified={isVerified}
          isCancelled={isCancelled}
          onIsVerified={this.handleIsVerifiedChange}
          onIsCancelled={this.handleIsCancelledChange}
          onDateRadioChange={this.handleRadioChange}
          selectedRadio={selectedRadio}
          onRecurringDateChange={this.handleRecurringDateChange}
          recurringDate={recurringDate}
          recurringFromDate={recurringFromDate}
          recurringToDate={recurringToDate}
          onFromDateChange={this.handleFromDateChange}
          onToDateChange={this.handleToDateChange}
          getSessions={this.fetchSession}
          isEdit={false}
          onSessionConflicts={this.handleSessionConflicts}
          sessionErrors={sessionErrors}
          isError={isError}
          t={t}
          selectedAcademicYear={selectedAcademicYear}
        />
        <ConfirmationModal
          isOpen={showDeactivateSessionConfirmationModal}
          title={"Delete selected sessions?"}
          onPositiveAction={this.handleDeleteSession}
          toggleModal={this.toggleDeactivateSessionConfirmationModal}
        />
      </div>
    );
  }
}

export default SessionContainer;
