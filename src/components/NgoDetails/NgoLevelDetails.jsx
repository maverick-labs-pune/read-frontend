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
import AddLevelModal from "../AddEntityModals/AddLevelModal";
import LevelTable from "../ItemTables/LevelTable";

class NgoLevelDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levelKey: null
    };
  }

  render() {
    const {
      toggleEditLevelModal,
      showLevelModal,
      levelData,
      getlevels,
      onLevelRowClick,
      loading,
      levels,
      t
    } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <AddLevelModal
              isOpen={showLevelModal}
              toggleModal={toggleEditLevelModal}
              levelData={levelData}
              getlevels={getlevels}
              t={t}
            />
            <LevelTable
              levels={levels}
              onLevelRowClick={onLevelRowClick}
              loading={loading}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NgoLevelDetails;
