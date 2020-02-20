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
import BookLendingSessionClassroomStudentsTable from "../ItemTables/BookLendingSessionClassroomStudentsTable";
import { Button } from "../Button/Button";
import moment from "moment";
import { TextArea } from "../TextArea/TextArea";
import { isValid } from "../../utils/stringUtils";
import { SESSION_DATE_FORMAT } from "../../utils/constants";

class SupervisorBookLendingSessionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false
    };
  }

  render() {
    const {
      bookFairies,
      classrooms,
      details,
      books,
      // onSubmitSession,
      editNotes,
      toggleEditNotes,
      onNoteChange,
      onSaveNote,
      notes,
      t
    } = this.props;

    let formatDate = null;
    if (details.startDateTime && details.endDateTime) {
      formatDate =
        moment(details.startDateTime).format(SESSION_DATE_FORMAT) +
        " to " +
        moment(details.endDateTime).format("h:mm a");
    }
    const classroomTable = classrooms.map((item, i) => {
      return (
        <div key={i}>
          <div className="row school-details-container card">
            <div className="mt10 mb10 ml20">
              <strong>
                {" "}
                Students of {t(item.standard)} {item.division || ""}
              </strong>
            </div>
          </div>
          <div className="row mt20">
            <div className="col">
              <BookLendingSessionClassroomStudentsTable
                students={item.students}
                classroom={item.key}
                books={books}
                t={t}
              />
            </div>
          </div>
        </div>
      );
    });

    const classroomDetails = classrooms.map((e, i) => {
      return (
        <div key={i} className="classroom-details-wrapper mb10">
          <div className="row mt-1">
            <div className="col-md-8 col-lg-8">
              {e.school}
              <span className="ml5 mr5 round-separator" />
              {t(e.standard)}
              <span className="ml5 mr5 round-separator" />
              Division {e.division ? e.division : "-"}
            </div>
          </div>
        </div>
      );
    });

    // const submitBookFairySessions =
    //   classrooms.length > 0 ? (
    //     <Button onClick={onSubmitSession}>Submit</Button>
    //   ) : null;

    const classroomBookFairies = bookFairies.map((e, i) => {
      return (
        <div key={i} className="classroom-details-wrapper mb10">
          <div className="row">
            <div className="col-md-4 col-lg-4">{e.name}</div>
          </div>
        </div>
      );
    });

    const note = (
      <div className="row">
        <div className="col-lg-8 col-md-8">
          <TextArea placeholder="Notes" onChange={onNoteChange} value={notes} />
        </div>
        <div className="col-lg-4 col-md-4">
          <Button onClick={onSaveNote}>Submit</Button>
        </div>
      </div>
    );
    const noNotes = (
      <p>
        No Notes{" "}
        <i className="fas fa-pencil-alt note-Edit" onClick={toggleEditNotes} />
      </p>
    );

    return (
      <div>
        <div className="mt40 mb-5 school-details-container card">
          <div className="mt20 ml20 mr20 mb20">
            <h3>Read Session Details</h3>
            <div className="divider" />
            <div className="ngo-details mt40">
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Academic Year</div>
                <div className="col-lg-6 col-md-6">
                  {details.academicYear || null}
                </div>
                {/* <div className="col text-right">{submitBookFairySessions}</div> */}
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Session Type</div>
                <div className="col-lg-6 col-md-6">
                  {t(details.type) || null}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Scheduled at </div>
                <div className="col-lg-6 col-md-6">{formatDate || null}</div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Evaluated by book fairy</div>
                <div className="col-lg-6 col-md-6">
                  {details.isEvaluated ? (
                    <i className="fa fa-check" aria-hidden="true" />
                  ) : (
                    <i className="fa fa-times" aria-hidden="true" />
                  )}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Submitted By</div>
                <div className="col-lg-6 col-md-6">
                  {details.submittedByBookFairy || null}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Verified by supervisor</div>
                <div className="col-lg-6 col-md-6">
                  {details.isVerified === true ? (
                    <i className="fa fa-check" aria-hidden="true" />
                  ) : (
                    <i className="fa fa-times" aria-hidden="true" />
                  )}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Verified By</div>
                <div className="col-lg-6 col-md-6">
                  {details.verifiedBySupervisor || null}
                </div>
              </div>

              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Book Fairies</div>
                <div className="col-lg-6 col-md-6">{classroomBookFairies}</div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Classrooms</div>
                <div className="col">{classroomDetails}</div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Notes</div>
                <div className="col-lg-6 col-md-6">
                  {isValid(notes) > 0 ? (
                    editNotes ? (
                      note
                    ) : (
                      <p>
                        {notes}
                        <i
                          className="fas fa-pencil-alt note-Edit"
                          onClick={toggleEditNotes}
                        />
                      </p>
                    )
                  ) : editNotes ? (
                    note
                  ) : (
                    noNotes
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="school-details-container">
          <div className="row mt20 mb20">
            <div className="col">{classroomTable}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SupervisorBookLendingSessionDetails);
