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
import { Button } from "../Button/Button";
import moment from "moment";
import { SESSION_DATE_FORMAT } from "../../utils/constants";

class SessionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      bookFairies,
      classrooms,
      details,
      toggleDeactivateSessionConfirmationModal,
      toggleCancelSessionModal,
      t
    } = this.props;
    let formatDate = null;
    if (details.startDateTime && details.endDateTime) {
      formatDate =
        moment(details.startDateTime).format(SESSION_DATE_FORMAT) +
        " to " +
        moment(details.endDateTime).format("h:mm a");
    }
    return (
      <div className="mt40 school-details-container card">
        <div className="mt20 ml20 mr20 mb20">
          <h3>Read Session Details</h3>
          <div className="divider" />
          <div className="ngo-details mt40">
            <div className="row mt20 align-item-end">
              <div className="col-lg-3 col-md-3">Academic Year</div>
              <div className="col-lg-3 col-md-3">
                {details.academicYear || null}
              </div>
              <div className="col text-right">
                <Button
                  className="text-warning ml10"
                  warning
                  secondary
                  onClick={toggleDeactivateSessionConfirmationModal}
                >
                  Delete Session
                </Button>

                <Button
                  className="text-warning ml10"
                  warning
                  secondary
                  onClick={toggleCancelSessionModal}
                >
                  Cancel Session
                </Button>
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Session Type</div>
              <div className="col-lg-6 col-md-6">{t(details.type) || null}</div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Scheduled at </div>
              <div className="col-lg-6 col-md-6">{formatDate || null}</div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Evaluated by book fairy</div>
              <div className="col-lg-6 col-md-6">
                {details.isEvaluated === 1 ? (
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
                {details.isVerified ? (
                  <i className="fa fa-check" aria-hidden="true" />
                ) : (
                  <i className="fa fa-times" aria-hidden="true" />
                )}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Verified by </div>
              <div className="col-lg-6 col-md-6">
                {details.verifiedBySupervisor || null}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Is cancelled</div>
              <div className="col-lg-6 col-md-6">
                {details.isCancelled ? (
                  <i className="fa fa-check" aria-hidden="true" />
                ) : (
                  <i className="fa fa-times" aria-hidden="true" />
                )}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Book Fairies</div>
              <div className="col-lg-6 col-md-6">
                {bookFairies.map((e, i) => {
                  return (
                    <div key={i} className="classroom-details-wrapper mb10">
                      <div className="row">
                        <div className="col-md-4 col-lg-4">{e.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Classrooms</div>
              <div className="col">
                {classrooms.map((e, i) => {
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
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionDetails);
