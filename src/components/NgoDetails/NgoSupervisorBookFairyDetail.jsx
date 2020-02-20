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
import Select from "../Select/Select";
import BookFairyTable from "../ItemTables/BookFairyTable";
import { isValid } from "../../utils/stringUtils";

class NgoSupervisorBookFairyDetails extends Component {
  render() {
    const {
      supervisors,
      bookFairies,
      onSupervisorChange,
      selectedSupervisor,
      onBookFairyChange,
      onSupervisorBookFairySave,
      t
    } = this.props;

    return (
      <div className="mt20">
        <div className="row">
          <div className="col-lg-3 col-md-3">Supervisor Management</div>
        </div>
        <div className="row mt20">
          <div className="col-md-4">
            <Select
              options={supervisors}
              onChange={onSupervisorChange}
              value={selectedSupervisor}
              placeholder="Select Supervisor"
            />
          </div>
        </div>
        <div className="row mt20">
          <div className="col">
            <BookFairyTable
              showRows={isValid(selectedSupervisor)}
              fairies={bookFairies}
              onBookFairyChange={onBookFairyChange}
              t={t}
            />
          </div>
        </div>
        <div className="row mt20">
          <div className="col-lg-3 col-md-3">
            <Button
              disabled={selectedSupervisor === null}
              onClick={onSupervisorBookFairySave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NgoSupervisorBookFairyDetails;
