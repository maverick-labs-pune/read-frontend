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
import api from "../../utils/api";
import forEach from "lodash/forEach";
import SessionsTable from "../../components/ItemTables/SessionsTable";
import moment from "moment";
import {
  EVALUATED,
  NON_EVALUATED,
  DEFAULT_SORT_SESSION_DATE,
  SUPERVISOR_SESSION,
  SUPERVISOR_EVALUATED_SESSION,
  SUPERVISOR_NON_EVALUATED_SESSION,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import instance from "../../utils/axios";
//import { serialize } from "uri-js";
import SupervisorSessionFilters from "../../components/Filters/SupervisorSessionFilters";
import { NGO_SESSION_SEARCH } from "../../utils/constants";
import SupervisorSessionActions from "../../components/Actions/SupervisorSessionActions";
import { withRouter } from "react-router-dom";
import { isValid } from "../../utils/stringUtils";
import { isValidUser } from "../../utils/validations";

class SupervisorSessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSessionsList: [],
      evaluatedSessionsList: [],
      nonEvaluatedSessionsList: [],
      filterBookFairyDropdown: [],
      filterSelectedBookFairy: null,
      fromDate: null,
      toDate: null,
      showFilters: false,
      loading: true,
      evaluatedLoading: false,
      nonEvaluatedLoading: false,
      clear: false,
      page: 0,
      evaluatedPage: 0,
      nonEvaluatedPage: 0,
      pages: 0,
      evaluatedPages: 0,
      nonEvaluatedPages: 0,
      sortBy: DEFAULT_SORT_SESSION_DATE,
      evaluatedSortBy: DEFAULT_SORT_SESSION_DATE,
      nonEvaluatedSortBy: DEFAULT_SORT_SESSION_DATE,
      desc: false,
      evaluatedDesc: false,
      nonEvaluatedDesc: false
    };
  }
  async componentDidMount() {
    const ngo = localStorage.getItem("ngo");
    const key = localStorage.getItem("key");
    this.setState({
      loading: true,
      evaluatedLoading: true,
      nonEvaluatedLoading: true
    });

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getSupervisorSessions(ngo, 0, DEFAULT_SORT_SESSION_DATE, false),
          api.getSupervisorSessionWithType(
            ngo,
            EVALUATED,
            0,
            DEFAULT_SORT_SESSION_DATE,
            false
          ),
          api.getSupervisorSessionWithType(
            ngo,
            NON_EVALUATED,
            0,
            DEFAULT_SORT_SESSION_DATE,
            false
          ),
          api.getSupervisorBookFairies(ngo, key)
        ])
        .then(
          instance.spread(
            (allSessions, evaluatedSessions, nonEvaluatedSessions, fairies) => {
              const allSessionsList = this.createReadSessionList(
                allSessions.data.results
              );
              const evaluatedSessionsList = this.createReadSessionList(
                evaluatedSessions.data.results
              );
              const nonEvaluatedSessionsList = this.createReadSessionList(
                nonEvaluatedSessions.data.results
              );
              let bookFairiesDropdown = [];
              forEach(fairies.data, item => {
                bookFairiesDropdown.push({
                  value: item.key,
                  label: `${item.first_name} ${item.last_name}`,
                  key: item.key
                });
              });
              this.setState({
                allSessionsList,
                evaluatedSessionsList,
                nonEvaluatedSessionsList,
                bookFairiesDropdown,
                filterBookFairyDropdown: bookFairiesDropdown,
                loading: false,
                evaluatedLoading: false,
                nonEvaluatedLoading: false,
                pages: Math.ceil(
                  allSessions.data.count / DEFAULT_TABLE_PAGE_SIZE
                ),
                evaluatedPages: Math.ceil(
                  evaluatedSessions.data.count / DEFAULT_TABLE_PAGE_SIZE
                ),
                nonEvaluatedPages: Math.ceil(
                  nonEvaluatedSessions.data.count / DEFAULT_TABLE_PAGE_SIZE
                )
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }
  getAllSessions = (page = 0, sort = null, order = null) => {
    this.setState({
      loading: true
    });
    const { sortBy, desc } = this.state;
    const allSortBy = sort === null ? sortBy : sort;
    const allOrderBy = order === null ? desc : order;
    const ngo = localStorage.getItem("ngo");
    api
      .getSupervisorSessions(ngo, page, allSortBy, allOrderBy)
      .then(({ data }) => {
        const { results } = data;
        const allSessionsList = this.createReadSessionList(results);
        this.setState({
          allSessionsList,
          page,
          loading: false
        });
      });
  };
  getEvaluatedSessions = (page = 0, sort = null, order = null) => {
    this.setState({
      evaluatedLoading: true
    });
    const { evaluatedSortBy, evaluatedDesc } = this.state;
    const sortBy = sort === null ? evaluatedSortBy : sort;
    const orderBy = order === null ? evaluatedDesc : order;
    const ngo = localStorage.getItem("ngo");
    api
      .getSupervisorSessionWithType(ngo, EVALUATED, page, sortBy, orderBy)
      .then(({ data }) => {
        const { results } = data;
        const evaluatedSessionsList = this.createReadSessionList(results);
        this.setState({
          evaluatedSessionsList,
          evaluatedPage: page,
          evaluatedLoading: false
        });
      });
  };
  getNonEvaluatedSessions = (page = 0, sort = null, order = null) => {
    this.setState({
      nonEvaluatedLoading: true
    });
    const { nonEvaluatedSortBy, nonEvaluatedDesc } = this.state;
    const sortBy = sort === null ? nonEvaluatedSortBy : sort;
    const orderBy = order === null ? nonEvaluatedDesc : order;
    const ngo = localStorage.getItem("ngo");
    api
      .getSupervisorSessionWithType(ngo, NON_EVALUATED, page, sortBy, orderBy)
      .then(({ data }) => {
        const { results } = data;
        const nonEvaluatedSessionsList = this.createReadSessionList(results);
        this.setState({
          nonEvaluatedSessionsList,
          nonEvaluatedPage: page,
          nonEvaluatedLoading: false
        });
      });
  };
  fetchSession = (page, type) => {
    switch (type) {
      case SUPERVISOR_SESSION:
        this.getAllSessions(page);
        break;
      case SUPERVISOR_EVALUATED_SESSION:
        this.getEvaluatedSessions(page);
        break;
      case SUPERVISOR_NON_EVALUATED_SESSION:
        this.getNonEvaluatedSessions(page);
        break;
      default:
        break;
    }
  };
  getSortedSessions = (sortBy, orderBy, type) => {
    switch (type) {
      case SUPERVISOR_SESSION:
        this.setState({
          desc: orderBy,
          sortBy: sortBy
        });
        this.getAllSessions(0, sortBy, orderBy);
        break;
      case SUPERVISOR_EVALUATED_SESSION:
        this.setState({
          evaluatedDesc: orderBy,
          evaluatedSortBy: sortBy
        });
        this.getEvaluatedSessions(0, sortBy, orderBy);
        break;
      case SUPERVISOR_NON_EVALUATED_SESSION:
        this.setState({
          nonEvaluatedDesc: orderBy,
          nonEvaluatedSortBy: sortBy
        });
        this.getNonEvaluatedSessions(0, sortBy, orderBy);
        break;
      default:
        break;
    }
  };
  createReadSessionList = readSessions => {
    let result = [];
    const { t } = this.props;
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
        let { school, standard } = item.classroom;
        schoolName = school.name;
        standards.push(standard.name);
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
        type: t(type)
      };
      result.push(session);
    });
    return result;
  };
  handleFromDateFilterChange = value => {
    const { filterSelectedBookFairy, toDate } = this.state;
    const selsctedBookFairy = filterSelectedBookFairy
      ? filterSelectedBookFairy.value
      : null;
    const selectedToDate = toDate ? toDate : null;
    const selsctedFronDate = moment(value).toISOString();
    this.setState({
      fromDate: moment(value).toISOString()
    });
    this.filterSessions(selsctedBookFairy, selsctedFronDate, selectedToDate);
  };
  handleToDateFilterChange = value => {
    const { filterSelectedBookFairy, fromDate } = this.state;
    const selsctedFronDate = fromDate ? fromDate : null;
    const selectedToDate = moment(value).toISOString();
    const selsctedBookFairy = filterSelectedBookFairy
      ? filterSelectedBookFairy.value
      : null;
    this.setState({
      toDate: moment(value).toISOString()
    });
    this.filterSessions(selsctedBookFairy, selsctedFronDate, selectedToDate);
  };
  handleBookFairyFilterChange = value => {
    const { fromDate, toDate } = this.state;
    const selsctedFronDate = fromDate ? fromDate : null;
    const selectedToDate = toDate ? toDate : null;
    this.setState({
      filterSelectedBookFairy: value
    });
    this.filterSessions(value.value, selsctedFronDate, selectedToDate);
  };
  handleShowFilter = () => {
    this.setState(p => ({
      showFilters: !p.showFilters,
      toDate: null,
      filterSelectedBookFairy: null,
      fromDate: null,
      clear: !p.clear
    }));
    this.filterSessions("", "", "");
  };
  filterSessions = (fairy, start, end, page = 0, sort = null, order = null) => {
    this.setState({
      loading: true
    });
    const sortBy = sort === null ? this.state.sortBy : sort;
    const orderBy = order === null ? this.state.desc : order;
    const filters = {
      fairy,
      start,
      end,
      sort: sortBy,
      order: orderBy ? "true" : "false"
    };
    const body = { model: NGO_SESSION_SEARCH, search: JSON.stringify(filters) };
    const ngo = localStorage.getItem("ngo");
    api
      .searchInNgo(ngo, body, page)
      .then(({ data }) => {
        const { results, count } = data;
        const allSessionsList = this.createReadSessionList(results);
        if (allSessionsList.length === 0)
          api.handleError({
            data: {
              message: `No sessions for the given filter`
            }
          });
        this.setState({
          allSessionsList,
          page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
          loading: false
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };
  handleFilterClear = () => {
    this.setState({
      filterSelectedBookFairy: null,
      fromDate: null,
      toDate: null
    });
    this.filterSessions("", "", "");
  };
  handlePageChange = (nextPage, type) => {
    const { filterSelectedBookFairy, fromDate, toDate } = this.state;
    if (
      isValid(filterSelectedBookFairy) > 0 ||
      isValid(fromDate) > 0 ||
      isValid(toDate) > 0
    ) {
      const { bookFairy, toDate, fromDate } = this.getFilters();
      this.filterSessions(bookFairy, fromDate, toDate, nextPage);
    } else {
      this.fetchSession(nextPage, type);
    }
  };
  handleSortChange = (sortColumn, type) => {
    const { id, desc } = sortColumn[0];
    const { filterSelectedBookFairy, fromDate, toDate } = this.state;
    if (
      isValid(filterSelectedBookFairy) > 0 ||
      isValid(fromDate) > 0 ||
      isValid(toDate) > 0
    ) {
      const { bookFairy, toDate, fromDate } = this.getFilters();
      this.filterSessions(bookFairy, fromDate, toDate, 0, id, desc);
    } else {
      this.getSortedSessions(id, desc, type);
    }
  };
  getFilters = () => {
    const { filterSelectedBookFairy, fromDate, toDate } = this.state;
    if (
      isValid(filterSelectedBookFairy) > 0 ||
      isValid(fromDate) > 0 ||
      isValid(toDate) > 0
    ) {
      const bookFairy =
        isValid(filterSelectedBookFairy) > 0
          ? filterSelectedBookFairy.value
          : "";
      return { bookFairy, fromDate, toDate };
    }
  };
  render() {
    const {
      allSessionsList,
      evaluatedSessionsList,
      nonEvaluatedSessionsList,
      showFilters,
      filterBookFairyDropdown,
      filterSelectedBookFairy,
      fromDate,
      toDate,
      loading,
      evaluatedLoading,
      nonEvaluatedLoading,
      clear,
      page,
      pages,
      evaluatedPage,
      evaluatedPages,
      nonEvaluatedPage,
      nonEvaluatedPages
    } = this.state;
    const { t, history } = this.props;
    return (
      <div className="mt20 school-details-container mb-5">
        <h4>Evaluated Sessions by Book Fairy</h4>
        <div className="divider" />
        <SessionsTable
          sessions={evaluatedSessionsList || []}
          page={evaluatedPage}
          pages={evaluatedPages}
          onPageChange={page =>
            this.handlePageChange(page, SUPERVISOR_EVALUATED_SESSION)
          }
          onSortChange={sort =>
            this.handleSortChange(sort, SUPERVISOR_EVALUATED_SESSION)
          }
          t={t}
          history={history}
          loading={evaluatedLoading}
        />
        <div className="row mt20" />
        <h4>Unevaluated Sessions by Book Fairy</h4>
        <div className="divider" />
        <SessionsTable
          sessions={nonEvaluatedSessionsList || []}
          page={nonEvaluatedPage}
          pages={nonEvaluatedPages}
          onPageChange={page =>
            this.handlePageChange(page, SUPERVISOR_NON_EVALUATED_SESSION)
          }
          onSortChange={sort =>
            this.handleSortChange(sort, SUPERVISOR_NON_EVALUATED_SESSION)
          }
          t={t}
          history={history}
          loading={nonEvaluatedLoading}
        />
        <div className="row mt40" />
        <h4>All Sessions</h4>
        <div className="divider" />
        <SupervisorSessionActions
          checkedItems={[]}
          onToggleFilters={this.handleShowFilter}
          onClear={this.handleFilterClear}
          clear={clear}
          t={t}
        />
        <SupervisorSessionFilters
          open={showFilters}
          bookFairies={filterBookFairyDropdown}
          selectedBookFairy={filterSelectedBookFairy}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={this.handleFromDateFilterChange}
          onToDateChange={this.handleToDateFilterChange}
          onBookFairyFilterChange={this.handleBookFairyFilterChange}
        />
        <SessionsTable
          sessions={allSessionsList || []}
          page={page}
          pages={pages}
          onPageChange={page => this.handlePageChange(page, SUPERVISOR_SESSION)}
          onSortChange={sort => this.handleSortChange(sort, SUPERVISOR_SESSION)}
          t={t}
          history={history}
          loading={loading}
        />
      </div>
    );
  }
}
export default withRouter(SupervisorSessionContainer);
