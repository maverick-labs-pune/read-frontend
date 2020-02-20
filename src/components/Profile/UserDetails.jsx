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

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, toggleModal } = this.props;
    let details = data;
    let userNgo = data.ngo;

    return (
      <div className="mt40 school-details-container card">
        <div className="mt20 ml20 mr20 mb20">
          <h3>User Profile</h3>
          <div className="divider" />
          <div className="ngo-details mt40">
            <div className="row align-items-end">
              <div className="col-lg-3 col-md-3">Name</div>
              <div className="col-lg-5 col-md-5">
                <strong>{details ? details.first_name : ""}</strong>
              </div>
              <div className="col-lg-4 col-md-4 text-right">
                <Button primary onClick={toggleModal}>
                  Edit Details
                </Button>
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Last Name</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.last_name : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">Email</div>
              <div className="col-lg-6 col-md-6">
                {details ? details.email : ""}
              </div>
            </div>
            <div className="row mt20">
              <div className="col-lg-3 col-md-3">NGO Name</div>
              <div className="col-lg-6 col-md-6">
                {userNgo ? userNgo.name : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetails;
