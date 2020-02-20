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
import instance from "../../utils/axios";
import forEach from "lodash/forEach";
import SessionsTable from "../../components/ItemTables/SessionsTable";
import {
  READ_SESSION_PENDING,
  READ_SESSION_EVALUATED_NOT_VERIFIED,
  READ_SESSION_UPCOMING,
  DEFAULT_SORT_SESSION_DATE,
  DEFAULT_TABLE_PAGE_SIZE,
  BOOK_FAIRY_PENDING_SESSIONS,
  BOOK_FAIRY_EVALUATED_SESSIONS,
  BOOK_FAIRY_UPCOMING_SESSIONS
} from "../../utils/constants";
import { isValidUser } from "../../utils/validations";

class BookFairySessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingSessions: [],
      evaluatedButNotVerifiedSessions: [],
      upcomingSessions: [],
      pendingPage: 0,
      evaluatedPage: 0,
      upcomingPage: 0,
      pendingPages: 0,
      evaluatedPages: 0,
      upcomingPages: 0,
      pendingSortBy: DEFAULT_SORT_SESSION_DATE,
      evaluatedSortBy: DEFAULT_SORT_SESSION_DATE,
      upcomingSortBy: DEFAULT_SORT_SESSION_DATE,
      pendingDesc: false,
      evaluatedDesc: false,
      upcomingDesc: false,
      pendingLoading: false,
      evaluatedLoading: false,
      upcomingLoading: false
    };
  }

  async componentDidMount() {
    const ngo = localStorage.getItem("ngo");
    this.setState({
      pendingLoading: true,
      evaluatedLoading: true,
      upcomingLoading: true
    });

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getBookFairyReadSessions(
            ngo,
            READ_SESSION_PENDING,
            0,
            DEFAULT_SORT_SESSION_DATE,
            false
          ),
          api.getBookFairyReadSessions(
            ngo,
            READ_SESSION_EVALUATED_NOT_VERIFIED,
            0,
            DEFAULT_SORT_SESSION_DATE,
            false
          ),
          api.getBookFairyReadSessions(
            ngo,
            READ_SESSION_UPCOMING,
            0,
            DEFAULT_SORT_SESSION_DATE,
            false
          )
        ])
        .then(
          instance.spread(
            (
              PendingSessions,
              EvaluatedNotVerifiedSessions,
              UpcomingSessions
            ) => {
              this.setState({
                pendingSessions: this.createReadSessionList(
                  PendingSessions.data.results
                ),
                evaluatedButNotVerifiedSessions: this.createReadSessionList(
                  EvaluatedNotVerifiedSessions.data.results
                ),
                upcomingSessions: this.createReadSessionList(
                  UpcomingSessions.data.results
                ),
                pendingPage: 0,
                pendingPages: Math.ceil(
                  PendingSessions.data.count / DEFAULT_TABLE_PAGE_SIZE
                ),
                evaluatedPage: 0,
                evaluatedPages: Math.ceil(
                  EvaluatedNotVerifiedSessions.data.count /
                    DEFAULT_TABLE_PAGE_SIZE
                ),
                upcomingPage: 0,
                upcomingPages: Math.ceil(
                  UpcomingSessions.data.count / DEFAULT_TABLE_PAGE_SIZE
                ),
                pendingLoading: false,
                evaluatedLoading: false,
                upcomingLoading: false
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getPendingSession = (page = 0, sort = null, order = null) => {
    const ngo = localStorage.getItem("ngo");
    this.setState({
      pendingLoading: true
    });
    const { pendingDesc, pendingSortBy } = this.state;
    const sortBy = sort === null ? pendingSortBy : sort;
    const orderBy = order === null ? pendingDesc : order;
    api
      .getBookFairyReadSessions(
        ngo,
        READ_SESSION_PENDING,
        page,
        sortBy,
        orderBy
      )
      .then(({ data }) => {
        const { results } = data;
        this.setState({
          pendingPage: page,
          pendingSessions: this.createReadSessionList(results),
          pendingLoading: false
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getEvaluatedButNotVerifiedSessions = (
    page = 0,
    sort = null,
    order = null
  ) => {
    const ngo = localStorage.getItem("ngo");
    this.setState({
      evaluatedLoading: true
    });
    const { evaluatedDesc, evaluatedSortBy } = this.state;
    const sortBy = sort === null ? evaluatedSortBy : sort;
    const orderBy = order === null ? evaluatedDesc : order;
    api
      .getBookFairyReadSessions(
        ngo,
        READ_SESSION_EVALUATED_NOT_VERIFIED,
        page,
        sortBy,
        orderBy
      )
      .then(({ data }) => {
        const { results } = data;
        this.setState({
          evaluatedPage: page,
          evaluatedButNotVerifiedSessions: this.createReadSessionList(results),
          evaluatedLoading: false
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getUpcomingSessions = (page = 0, sort = null, order = null) => {
    const ngo = localStorage.getItem("ngo");
    this.setState({
      upcomingLoading: true
    });
    const { upcomingDesc, upcomingSortBy } = this.state;
    const sortBy = sort === null ? upcomingSortBy : sort;
    const orderBy = order === null ? upcomingDesc : order;
    api
      .getBookFairyReadSessions(
        ngo,
        READ_SESSION_UPCOMING,
        page,
        sortBy,
        orderBy
      )
      .then(({ data }) => {
        const { results } = data;
        this.setState({
          upcomingPage: page,
          upcomingSessions: this.createReadSessionList(results),
          upcomingLoading: false
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  createReadSessionList = readSessions => {
    const { t } = this.props;
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

  fetchSession = (page, type) => {
    switch (type) {
      case BOOK_FAIRY_PENDING_SESSIONS:
        this.getPendingSession(page);
        break;
      case BOOK_FAIRY_EVALUATED_SESSIONS:
        this.getEvaluatedButNotVerifiedSessions(page);
        break;
      case BOOK_FAIRY_UPCOMING_SESSIONS:
        this.getUpcomingSessions(page);
        break;
      default:
        break;
    }
  };

  getSortedSessions = (sortBy, order, type) => {
    switch (type) {
      case BOOK_FAIRY_PENDING_SESSIONS:
        this.setState({
          pendingSortBy: sortBy,
          pendingDesc: order
        });
        this.getPendingSession(0, sortBy, order);
        break;
      case BOOK_FAIRY_EVALUATED_SESSIONS:
        this.setState({
          evaluatedSortBy: sortBy,
          evaluatedDesc: order
        });
        this.getEvaluatedButNotVerifiedSessions(0, sortBy, order);
        break;
      case BOOK_FAIRY_UPCOMING_SESSIONS:
        this.setState({
          upcomingSortBy: sortBy,
          upcomingDesc: order
        });
        this.getUpcomingSessions(0, sortBy, order);
        break;
      default:
        break;
    }
  };

  handlePageChange = (nextPage, type) => {
    this.fetchSession(nextPage, type);
  };

  handleSortChange = (sortColumn, type) => {
    const { id, desc } = sortColumn[0];
    this.getSortedSessions(id, desc, type);
  };

  render() {
    const {
      checkedSessions,
      pendingSessions,
      evaluatedButNotVerifiedSessions,
      upcomingSessions,
      evaluatedLoading,
      pendingLoading,
      upcomingLoading,
      evaluatedPages,
      pendingPages,
      upcomingPages,
      evaluatedPage,
      pendingPage,
      upcomingPage
    } = this.state;

    const { t, history } = this.props;
    return (
      <div className="container-fluid">
        <div className="mt40 school-details-container mb-5">
          <h4>Pending Sessions</h4>
          <div className="divider" />
          <SessionsTable
            sessions={pendingSessions || []}
            onSessionCheckboxToggle={this.handleSessionCheckboxToggle}
            checkedSessions={checkedSessions || []}
            history={history}
            loading={pendingLoading}
            pages={pendingPages}
            page={pendingPage}
            onPageChange={page =>
              this.handlePageChange(page, BOOK_FAIRY_PENDING_SESSIONS)
            }
            onSortChange={sort =>
              this.handleSortChange(sort, BOOK_FAIRY_PENDING_SESSIONS)
            }
            t={t}
          />
          <div className="row mt40" />
          <h4>Evaluated But Not Verified Sessions</h4>
          <div className="divider" />
          <SessionsTable
            sessions={evaluatedButNotVerifiedSessions || []}
            onSessionCheckboxToggle={this.handleSessionCheckboxToggle}
            checkedSessions={checkedSessions || []}
            history={history}
            loading={evaluatedLoading}
            pages={evaluatedPages}
            page={evaluatedPage}
            onPageChange={page =>
              this.handlePageChange(page, BOOK_FAIRY_EVALUATED_SESSIONS)
            }
            onSortChange={sort =>
              this.handleSortChange(sort, BOOK_FAIRY_EVALUATED_SESSIONS)
            }
            t={t}
          />

          <div className="row mt40" />
          <h4>Upcoming Sessions</h4>
          <div className="divider" />
          <SessionsTable
            sessions={upcomingSessions || []}
            onSessionCheckboxToggle={this.handleSessionCheckboxToggle}
            checkedSessions={checkedSessions || []}
            history={history}
            loading={upcomingLoading}
            pages={upcomingPages}
            page={upcomingPage}
            onPageChange={page =>
              this.handlePageChange(page, BOOK_FAIRY_UPCOMING_SESSIONS)
            }
            onSortChange={sort =>
              this.handleSortChange(sort, BOOK_FAIRY_UPCOMING_SESSIONS)
            }
            t={t}
          />
        </div>
      </div>
    );
  }
}

export default BookFairySessionContainer;
