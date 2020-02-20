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
import api from "../../utils/api";
import instance from "../../utils/axios";
import forEach from "lodash/forEach";
import SupervisorSessionDetails from "../../components/SessionDetails/SupervisorSessionDetails";
import SupervisorBookLendingSessionDetails from "../../components/SessionDetails/SupervisorBookLendingSessionDetails";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import { LOCALE_MARATHI } from "../../utils/constants";
import { isValidUser } from "../../utils/validations";

class SupervisorSessionDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomSessionsList: [],
      bookFairiesList: [],
      details: [],
      editNotes: false,
      notes: "",
      showCancelSessionModal: false
    };
  }

  async componentDidMount() {
    const { type, key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");

    let validUser = await isValidUser();
    if (validUser) {
      switch (type) {
        case "READ_SESSION_BOOK_LENDING":
          instance
            .all([
              api.readClassroomSessions(ngo, key),
              api.readSessionBookFairies(ngo, key),
              api.getReadSession(key),
              api.getBookLendingEvaluation(key)
            ])
            .then(
              instance.spread(
                (
                  classroomSessions,
                  readSessionBookFairies,
                  readSession,
                  bookLendingEvaluation
                ) => {
                  let classrooms = [];
                  let bookFairies = [];

                  forEach(readSessionBookFairies.data, item => {
                    const { book_fairy } = item;
                    bookFairies.push({
                      name: `${book_fairy.first_name} ${book_fairy.last_name}`,
                      key: book_fairy.key
                    });
                  });

                  const classroomsData = this.bindBookLendingStudentDetails(
                    classroomSessions.data,
                    bookLendingEvaluation.data
                  );
                  forEach(classroomsData, item => {
                    const { division, school, standard } = item.classroom;
                    classrooms.push({
                      standard: standard.name,
                      school: school.name,
                      division,
                      key: item.classroom.key,
                      students: item.students
                    });
                  });

                  const { data } = readSession;
                  const { academic_year } = data;
                  let sessionDetails = {
                    academicYear: academic_year.name,
                    type: data.type,
                    isVerified: data.is_verified,
                    isEvaluated: data.is_evaluated,
                    startDateTime: data.start_date_time,
                    endDateTime: data.end_date_time,
                    submittedByBookFairy: data.submitted_by_book_fairy
                      ? `${data.submitted_by_book_fairy.first_name}  ${data.submitted_by_book_fairy.last_name}`
                      : "-",
                    verifiedBySupervisor: data.verified_by_supervisor
                      ? `${data.verified_by_supervisor.first_name}  ${data.verified_by_supervisor.last_name}`
                      : "-"
                  };
                  this.setState({
                    classroomSessionsList: classrooms,
                    bookFairiesList: bookFairies,
                    details: sessionDetails,
                    notes: data.notes
                  });
                }
              )
            );
          break;
        default:
          instance
            .all([
              api.readClassroomSessions(ngo, key),
              api.readSessionBookFairies(ngo, key),
              api.getReadSession(key),
              api.getStudentEvaluations(key)
            ])
            .then(
              instance.spread(
                (
                  classroomSessions,
                  readSessionBookFairies,
                  readSession,
                  studentEvaluation
                ) => {
                  let classrooms = [];
                  let bookFairies = [];

                  forEach(readSessionBookFairies.data, item => {
                    const { book_fairy } = item;
                    bookFairies.push({
                      name: `${book_fairy.first_name} ${book_fairy.last_name}`,
                      key: book_fairy.key
                    });
                  });

                  const classroomsData = this.bindStudentDetails(
                    classroomSessions.data,
                    studentEvaluation.data
                  );

                  forEach(classroomsData, item => {
                    const { division, school, standard } = item.classroom;
                    classrooms.push({
                      standard: standard.name,
                      school: school.name,
                      division,
                      key: item.classroom.key,
                      students: item.students
                    });
                  });

                  const { data } = readSession;
                  const { academic_year } = data;
                  let sessionDetails = {
                    academicYear: academic_year.name,
                    type: data.type,
                    isVerified: data.is_verified,
                    isEvaluated: data.is_evaluated,
                    startDateTime: data.start_date_time,
                    endDateTime: data.end_date_time,
                    submittedByBookFairy: data.submitted_by_book_fairy
                      ? `${data.submitted_by_book_fairy.first_name}  ${data.submitted_by_book_fairy.last_name}`
                      : "-",
                    verifiedBySupervisor: data.verified_by_supervisor
                      ? `${data.verified_by_supervisor.first_name}  ${data.verified_by_supervisor.last_name}`
                      : "-",
                    sessionKey: data.key
                  };
                  this.setState({
                    classroomSessionsList: classrooms,
                    bookFairiesList: bookFairies,
                    details: sessionDetails,
                    notes: data.notes
                  });
                }
              )
            );
      }
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  fetchReadSession = () => {
    const { key } = this.props.match.params;
    api.getReadSession(key).then(({ data }) => {
      let sessionDetails = {
        academicYear: data.academic_year.name,
        type: data.type,
        isVerified: data.is_verified,
        isEvaluated: data.is_evaluated,
        startDateTime: data.start_date_time,
        endDateTime: data.end_date_time,
        submittedByBookFairy: data.submitted_by_book_fairy
          ? `${data.submitted_by_book_fairy.first_name}  ${data.submitted_by_book_fairy.last_name}`
          : "-",
        verifiedBySupervisor: data.verified_by_supervisor
          ? `${data.verified_by_supervisor.first_name}  ${data.verified_by_supervisor.last_name}`
          : "-",
        sessionKey: data.key
      };
      this.setState({
        details: sessionDetails,
        notes: data.notes
      });
    });
  };

  bindStudentDetails = (classrooms, evaluations) => {
    const locale = localStorage.getItem("SELECTED_LANGUAGE");
    let classroomData = cloneDeep(classrooms);
    forEach(classroomData, classroom => {
      let { students } = classroom;
      forEach(students, student => {
        let isEvaluated = this.isStudentPresentInEvaluations(
          student.key,
          evaluations
        );
        // If student is not evaluated adding defaults values otherwise adding respective evaluted values
        if (isEvaluated === undefined) {
          student.level = null;
          student.attendance = false;
          student.comments = null;
          student.book = null;
          student.isEvaluated = false;
        } else {
          const {
            attendance,
            comments,
            level,
            student: { inventory }
          } = isEvaluated;
          student.level = level
            ? locale === LOCALE_MARATHI
              ? level.mr_in
              : level.en_in
            : "-";
          student.attendance = attendance;
          student.comments = comments;
          student.book = this.getBookAndInventoryData(inventory);
          student.isEvaluated = true;
        }
      });
    });
    return classroomData;
  };

  bindBookLendingStudentDetails = (classrooms, evaluations) => {
    let classroomData = cloneDeep(classrooms);
    forEach(classroomData, classroom => {
      let { students } = classroom;
      forEach(students, student => {
        let isEvaluated = this.isStudentPresentInEvaluations(
          student.key,
          evaluations
        );
        if (isEvaluated === undefined) {
          student.book = null;
          student.isEvaluated = false;
        } else {
          const {
            student: { inventory },
            action
          } = isEvaluated;
          student.book = this.getBookAndInventoryData(inventory);
          student.action = action;
        }
      });
    });
    return classroomData;
  };

  getLevelFromName = (levels, key) => {
    return find(levels, item => {
      if (item.value === key) return item;
    });
  };

  isStudentPresentInEvaluations = (studentKey, evaluations) => {
    return find(evaluations, item => {
      const { student } = item;
      if (student.key === studentKey) return item;
    });
  };

  handleVerifySession = () => {
    const { key } = this.props.match.params;
    api
      .markSessionAsVerified(key)
      .then(({ data }) => {
        api.handleSuccess(data);
        this.fetchReadSession();
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  getBookAndInventoryData = data => {
    let result = [];
    forEach(data, inventory => {
      let { book, key, serial_number } = inventory;
      // For uniqueness value will be inventory key
      result.push({
        value: key,
        label: `${serial_number} - ${book.name}`,
        book: book.key
      });
    });
    return result;
  };

  toggleEditNotes = () => {
    this.setState(p => ({ editNotes: !p.editNotes }));
  };

  toggleCancelSessionModal = () => {
    this.setState(p => ({ showCancelSessionModal: !p.showCancelSessionModal }));
  };

  handleNoteChange = event => {
    const {
      target: { value }
    } = event;
    this.setState({
      notes: value
    });
  };

  handleSaveNote = () => {
    const { notes } = this.state;
    const { key } = this.props.match.params;
    const body = { comments: notes };
    api
      .addNoteToSession(key, body)
      .then(({ data }) => {
        api.handleSuccess(data);
        this.toggleEditNotes();
        this.fetchReadSession();
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  render() {
    const {
      classroomSessionsList,
      bookFairiesList,
      details,
      editNotes,
      notes,
      showCancelSessionModal
    } = this.state;
    const { t, history } = this.props;
    const { type } = this.props.match.params;

    return (
      <div>
        {type === "READ_SESSION_BOOK_LENDING" ? (
          <SupervisorBookLendingSessionDetails
            bookFairies={bookFairiesList}
            classrooms={classroomSessionsList}
            details={details || {}}
            //onSubmitSession={this.handleSubmitSession}
            editNotes={editNotes}
            toggleEditNotes={this.toggleEditNotes}
            onNoteChange={this.handleNoteChange}
            onSaveNote={this.handleSaveNote}
            notes={notes}
            t={t}
          />
        ) : (
          <SupervisorSessionDetails
            bookFairies={bookFairiesList}
            classrooms={classroomSessionsList}
            details={details || {}}
            onVerifyClick={this.handleVerifySession}
            editNotes={editNotes}
            toggleEditNotes={this.toggleEditNotes}
            onNoteChange={this.handleNoteChange}
            onSaveNote={this.handleSaveNote}
            notes={notes}
            toggleCancelSessionModal={this.toggleCancelSessionModal}
            showCancelSessionModal={showCancelSessionModal}
            history={history}
            t={t}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SupervisorSessionDetailContainer);
