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

class UserActions extends Component {
  render() {
    const {
      checkedUsers,
      onToggleFilters,
      onDeleteUsers,
      toggleImportUserModal,
      onExportUsers,
      toggleAddUserModal,
      clear,
      onClear,
      t
    } = this.props;
    return (
      <Actions
        checkedItems={checkedUsers}
        onToggleFilters={onToggleFilters}
        deleteItem={{
          text: "Delete User",
          onDeleteItems: onDeleteUsers
        }}
        importItem={{
          text: "Import Users",
          onImportItems: toggleImportUserModal
        }}
        exportItem={{
          text: "Export Users",
          onExportItems: onExportUsers
        }}
        addItem={{
          text: t(`LABEL_ADD_NEW`) + " " + t(`LABEL_USER`),
          onAddItem: toggleAddUserModal
        }}
        t={t}
        clear={clear}
        onClear={onClear}
      />
    );
  }
}

export default UserActions;
