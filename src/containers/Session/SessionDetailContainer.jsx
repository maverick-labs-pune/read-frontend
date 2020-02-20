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
import SessionDetails from "../../components/SessionDetails/SessionDetails";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { isValidUser } from "../../utils/validations";
import CancelSessionModal from "../../components/AddEntityModals/CancelSessionModal";

class SessionDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomSessionsList: [],
      bookFairiesList: [],
      details: null,
      showDeactivateSessionConfirmationModal: false,
      showCancelSessionModal: false
    };
  }

  async componentDidMount() {
    const { key } = this.props.match.params;
    const ngo = localStorage.getItem("ngo");

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.readClassroomSessions(ngo, key),
          api.readSessionBookFairies(ngo, key),
          api.getReadSession(key)
        ])
        .then(
          instance.spread(
            (classroomSessions, readSessionBookFairies, readSession) => {
              let classrooms = [];
              let bookFairies = [];
              forEach(classroomSessions.data, item => {
                const { division, school, standard } = item.classroom;
                classrooms.push({
                  standard: standard.name,
                  school: school.name,
                  division,
                  key: item.classroom.key
                });
              });

              forEach(readSessionBookFairies.data, item => {
                const { book_fairy } = item;
                bookFairies.push({
                  name: `${book_fairy.first_name} ${book_fairy.last_name}`,
                  key: book_fairy.key
                });
              });

              const { data } = readSession;
              const { academic_year } = data;
              let sessionDetails = {
                key: data.key,
                academicYear: academic_year.name,
                type: data.type,
                isVerified: data.is_verified,
                isCancelled: data.is_cancelled,
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
                details: sessionDetails
              });
            }
          )
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  handleDeleteSession = () => {
    const { key } = this.props.match.params;
    let keys = JSON.stringify([key]);
    api
      .deleteReadSession({ keys })
      .then(({ data }) => {
        api.handleSuccess(data);
        this.toggleDeactivateSessionConfirmationModal();
        this.props.history.push("/home/sessions");
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

  toggleCancelSessionModal = () => {
    this.setState(p => ({ showCancelSessionModal: !p.showCancelSessionModal }));
  };

  render() {
    const {
      classroomSessionsList,
      bookFairiesList,
      details,
      showDeactivateSessionConfirmationModal,
      showCancelSessionModal
    } = this.state;
    const { t, history } = this.props;
    return (
      <div>
        <SessionDetails
          bookFairies={bookFairiesList}
          classrooms={classroomSessionsList}
          details={details || {}}
          toggleDeactivateSessionConfirmationModal={
            this.toggleDeactivateSessionConfirmationModal
          }
          toggleCancelSessionModal={this.toggleCancelSessionModal}
          t={t}
        />
        <ConfirmationModal
          isOpen={showDeactivateSessionConfirmationModal}
          title={"Delete session?"}
          onPositiveAction={this.handleDeleteSession}
          toggleModal={this.toggleDeactivateSessionConfirmationModal}
        />
        <CancelSessionModal
          toggleModal={this.toggleCancelSessionModal}
          isOpen={showCancelSessionModal}
          sessionKey={details}
          history={history}
          t={t}
        />
      </div>
    );
  }
}

export default withRouter(SessionDetailContainer);
