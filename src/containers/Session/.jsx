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
import BookFairySessionDetails from "../../components/SessionDetails/BookFairySessionDetails";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import reduce from "lodash/reduce";
import { isValid } from "../../utils/stringUtils";
import { LOCALE_MARATHI } from "../../utils/constants";
import { isValidUser } from "../../utils/validations";

class BookFairySessionDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomSessionsList: [],
      bookFairiesList: [],
      details: null,
      levels: [],
      editNotes: false,
      notes: ""
    };
  }

  async componentDidMount() {
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");
    const locale = localStorage.getItem("SELECTED_LANGUAGE");
    const { t } = this.props;

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.readClassroomSessions(ngo, key),
          api.readSessionBookFairies(ngo, key),
          api.getReadSession(key),
          api.getLevels(ngo, key)
        ])
        .then(
          instance.spread(
            (
              classroomSessions,
              readSessionBookFairies,
              readSession,
              levels
            ) => {
              let classrooms = [];
              let bookFairies = [];
              let levelDropdown = [];

              forEach(readSessionBookFairies.data, item => {
                const { book_fairy } = item;
                bookFairies.push({
                  name: `${book_fairy.first_name} ${book_fairy.last_name}`,
                  key: book_fairy.key
                });
              });

              forEach(levels.data, item => {
                if (locale === LOCALE_MARATHI) {
                  levelDropdown.push({ value: item.key, label: t(item.mr_in) });
                } else {
                  levelDropdown.push({ value: item.key, label: t(item.en_in) });
                }
              });

              const classroomsData = this.bindStudentDetails(
                classroomSessions.data,
                levelDropdown
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
                levels: levelDropdown,
                notes: data.notes
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  // fetchClassroomSession = () => {
  //   const { key } = this.props.match.params;
  //   const ngo = localStorage.getItem("ngo");
  //   instance
  //     .all([
  //       api.readClassroomSessions(ngo, key),
  //       api.getStudentEvaluations(key)
  //     ])
  //     .then(
  //       instance.spread((classroomSessions, studentEvaluation) => {
  //         let classrooms = [];
  //         const { levels } = this.state;
  //         const classroomsData = this.bindStudentDetails(
  //           classroomSessions.data,
  //           levels,
  //           studentEvaluation.data
  //         );

  //         forEach(classroomsData, item => {
  //           const { division, school, standard } = item.classroom;
  //           classrooms.push({
  //             standard: standard.name,
  //             school: school.name,
  //             division,
  //             key: item.classroom.key,
  //             students: item.students
  //           });
  //         });
  //         this.setState({
  //           classroomSessionsList: classrooms
  //         });
  //       })
  //     );
  // };

  fetchReadSessionDetails = () => {
    const { key } = this.props.match.params;
    api.getReadSession(key).then(({ data }) => {
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
        details: sessionDetails,
        notes: data.notes
      });
    });
  };

  bindStudentDetails = (classrooms, levels, evaluations, booksDropdown) => {
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
          student.attendance = true;
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
            ? this.getLevelFromKey(levels, level.key)
            : null;
          student.attendance = attendance;
          student.comments = comments;
          student.book = this.getBookAndInventoryData(inventory);
          student.isEvaluated = true;
        }
      });
    });
    return classroomData;
  };

  getLevelFromKey = (levels, key) => {
    return find(levels, item => {
      if (item.value === key) return item;
    });
  };

  getBookFromKey = (bookDropdown, feedbackBooks) => {
    let result = [];
    forEach(feedbackBooks, bookDetails => {
      let book = find(bookDropdown, item => {
        if (item.value === bookDetails.key) return item;
      });
      if (book !== undefined) {
        result.push(book);
      }
    });
    return result;
  };

  isStudentPresentInEvaluations = (studentKey, evaluations) => {
    return find(evaluations, item => {
      const { student } = item;
      if (student.key === studentKey) return item;
    });
  };

  handleAttendanceChange = (event, student) => {
    const {
      target: { checked }
    } = event;

    // Changing student attendance depending on student is marked or not
    let { classroomSessionsList } = this.state;
    forEach(classroomSessionsList, classroom => {
      let { students } = classroom;
      forEach(students, item => {
        if (item.key === student.key) {
          item.attendance = checked;
        }
      });
    });
    this.setState({
      classroomSessionsList
    });
  };

  handleLevelChange = (event, student) => {
    let { classroomSessionsList } = this.state;
    forEach(classroomSessionsList, classroom => {
      let { students } = classroom;
      forEach(students, item => {
        if (item.key === student.key) {
          if (isValid(event) > 0) item.level = event;
          else item.level = null;
        }
      });
    });
    this.setState({
      classroomSessionsList
    });
  };

  handleBookChange = (event, student) => {
    let { classroomSessionsList } = this.state;
    forEach(classroomSessionsList, classroom => {
      let { students } = classroom;
      forEach(students, item => {
        if (item.key === student.key) {
          if (isValid(event) > 0) item.book = event;
          else item.book = null;
        }
      });
    });
    this.setState({
      classroomSessionsList
    });
  };

  handleCommentChange = (event, student) => {
    const {
      target: { value }
    } = event;
    let { classroomSessionsList } = this.state;
    forEach(classroomSessionsList, classroom => {
      let { students } = classroom;
      forEach(students, item => {
        if (item.key === student.key) {
          item.comments = value;
        }
      });
    });
    this.setState({
      classroomSessionsList
    });
  };

  handleSave = classroomKey => {
    const { classroomSessionsList } = this.state;
    const { key } = this.props.match.params;
    let result = [];
    let classroom = find(classroomSessionsList, item => {
      if (item.key === classroomKey) return item;
    });

    if (isValid(classroom) > 0) {
      const { students } = classroom;
      forEach(students, student => {
        const { level, book, comments, attendance, isEvaluated } = student;
        if (attendance && level !== null && book !== null) {
          const bookAndInventory = this.getbookAndInventory(book);
          result.push({
            student: student.key,
            level: level.value,
            book: bookAndInventory,
            comments,
            attendance,
            isEvaluated
          });
        }

        if (
          attendance &&
          level !== null &&
          book === null &&
          comments !== null
        ) {
          result.push({
            student: student.key,
            level: level.value,
            book: null,
            comments,
            attendance,
            isEvaluated
          });
        }

        if (!attendance) {
          result.push({
            student: student.key,
            level: null,
            book: null,
            comments,
            attendance,
            isEvaluated
          });
        }
      });

      if (isValid(result) > 0) {
        const body = result;
        api
          .evaluateStudent(key, { body })
          .then(({ data }) => {
            api.handleSuccess(data);
            //this.fetchClassroomSession();
          })
          .catch(({ response }) => {
            api.handleError(response);
          });
      }
    }
  };

  handleSubmitSession = () => {
    const { classroomSessionsList } = this.state;
    const { key } = this.props.match.params;
    let result = [];
    forEach(classroomSessionsList, classroom => {
      const { students } = classroom;
      forEach(students, student => {
        const { level, book, comments, attendance, isEvaluated } = student;
        if (attendance && level !== null && book !== null) {
          const bookAndInventory = this.getbookAndInventory(book);
          result.push({
            student: student.key,
            level: level.value,
            book: bookAndInventory,
            comments,
            attendance,
            isEvaluated
          });
        }

        if (
          attendance &&
          level !== null &&
          book === null &&
          comments !== null
        ) {
          result.push({
            student: student.key,
            level: level.value,
            book: null,
            comments,
            attendance,
            isEvaluated
          });
        }

        if (!attendance) {
          result.push({
            student: student.key,
            level: null,
            book: null,
            comments,
            attendance,
            isEvaluated
          });
        }
      });
    });

    if (isValid(result) > 0) {
      // const body = JSON.stringify(result);
      const body = result;
      api
        .submitEvaluations(key, { body })
        .then(({ data }) => {
          api.handleSuccess(data);
          // this.fetchClassroomSession();
          this.fetchReadSessionDetails();
        })
        .catch(({ response }) => {
          api.handleError(response);
        });
    }
  };

  getbookAndInventory = book => {
    let result = reduce(
      book,
      (result, item) => {
        result.push({ inventory: item.value, book: item.book });
        return result;
      },
      []
    );
    return result;
  };

  handleBookSearchChange = value => {
    const ngo = localStorage.getItem("ngo");
    if (value.length > 3) {
      return api.searchBookBySerialNumber(ngo, value).then(({ data }) => {
        return this.getBookAndInventoryData(data);
      });
    } else {
      return [];
    }
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
        this.fetchReadSessionDetails();
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
      levels,
      editNotes,
      notes
    } = this.state;

    const { t } = this.props;
    return (
      <div>
        <BookFairySessionDetails
          bookFairies={bookFairiesList}
          classrooms={classroomSessionsList}
          details={details || {}}
          levels={levels}
          onAttendanceChange={this.handleAttendanceChange}
          onLevelChange={this.handleLevelChange}
          onCommentChange={this.handleCommentChange}
          onBookChange={this.handleBookChange}
          onClassroomSave={this.handleSave}
          onSubmitSession={this.handleSubmitSession}
          onBookSearchChange={this.handleBookSearchChange}
          editNotes={editNotes}
          toggleEditNotes={this.toggleEditNotes}
          onNoteChange={this.handleNoteChange}
          onSaveNote={this.handleSaveNote}
          notes={notes}
          t={t}
        />
      </div>
    );
  }
}

export default withRouter(BookFairySessionDetailContainer);
