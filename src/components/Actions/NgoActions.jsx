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
import Actions from "./Actions";

class NgoActions extends Component {
  render() {
    const {
      checkedNgos,
      onToggleFilters,
      onDeleteNGOs,
      toggleAddNgoModal,
      t
    } = this.props;
    return (
      <Actions
        checkedItems={checkedNgos}
        onToggleFilters={onToggleFilters}
        deleteItem={{
          text: "Deactivate " + t(`LABEL_NGO`),
          onDeleteItems: onDeleteNGOs
        }}
        addItem={{
          text: t(`LABEL_ADD_NEW`) + " " + t(`LABEL_NGO`),
          onAddItem: toggleAddNgoModal
        }}
        t={t}
      />
    );
  }
}

export default NgoActions;
