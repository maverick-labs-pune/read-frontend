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
import { Button } from "../Button/Button";
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { isValid } from "../../utils/stringUtils";

class StudentDetails extends Component {
  getDetails = () => {
    const { studentDetails, t } = this.props;
    if (studentDetails) {
      const {
        first_name,
        last_name,
        middle_name,
        address,
        gender,
        birth_date,
        mother_tongue,
        is_dropout,
        has_attended_preschool
      } = studentDetails;
      let details = {};
      if (isValid(middle_name)) {
        details.name = `${first_name} ${middle_name} ${last_name}`;
      } else {
        details.name = `${first_name} ${last_name}`;
      }
      details.address = address;
      details.gender = t(gender);
      details.birthDate = birth_date;
      details.motherTongue = mother_tongue;
      details.isDropout = is_dropout ? "Yes" : "No";
      details.hasAttendedPreSchool = has_attended_preschool ? "Yes" : "No";
      return details;
    }
    return null;
  };

  getIsStudentDropout = () => {
    const { studentDetails } = this.props;
    const { is_dropout } = studentDetails;
    return is_dropout;
  };

  render() {
    const {
      showDeactivateStudentConfirmationModal,
      showMarkStudentAsDropoutConfirmationModal,
      toggleMarkStudentDropoutConfirmationModal,
      toggleDeactivateStudentConfirmationModal,
      toggleModal,
      onStudentDelete,
      markAsDropout
    } = this.props;

    const details = this.getDetails();
    const { key } = this.props.match.params;

    return (
      <div className="mt40 school-details-container card">
        <div className="mt20 ml20 mr20 mb20">
          <h3>Student Details</h3>
          <div className="divider" />
          <div className="ngo-details mt20">
            <div className="row align-items-end">
              <div className="col-lg-3 col-md-3">Full name</div>
              <div className="col-lg-3 col-md-3">
                <strong>{details ? details.name : ""}</strong>
              </div>
              <div className="col-lg-6 col-md-6 text-right">
                <Button primary onClick={toggleModal}>
                  Edit
                </Button>
                <Button
                  primary
                  className="ml10"
                  onClick={toggleMarkStudentDropoutConfirmationModal}
                >
                  Mark as dropout
                </Button>
                <Button
                  className="text-warning ml10"
                  warning
                  secondary
                  onClick={toggleDeactivateStudentConfirmationModal}
                >
                  Delete Student
                </Button>
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Address</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.address : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Gender</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.gender : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Mother Tongue</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.motherTongue : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Birth Date</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.birthDate : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Dropped out</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.isDropout : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Attended Pre-school</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.hasAttendedPreSchool : ""}
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showDeactivateStudentConfirmationModal}
            title={"Deactivate Student?"}
            onPositiveAction={() => onStudentDelete(key)}
            toggleModal={toggleDeactivateStudentConfirmationModal}
          />
          <ConfirmationModal
            isOpen={showMarkStudentAsDropoutConfirmationModal}
            title={"Mark student as dropout?"}
            onPositiveAction={() => markAsDropout()}
            toggleModal={toggleMarkStudentDropoutConfirmationModal}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(StudentDetails);
