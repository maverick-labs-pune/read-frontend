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

class SchoolActions extends Component {
  render() {
    const {
      checkedSchools,
      onToggleFilters,
      onDeleteSchools,
      toggleImportSchoolModal,
      onExportSchools,
      toggleAddSchoolModal,
      clear,
      onClear,
      t
    } = this.props;
    return (
      <Actions
        checkedItems={checkedSchools}
        onToggleFilters={onToggleFilters}
        deleteItem={{
          text: "Deactivate " + t(`LABEL_SCHOOL`),
          onDeleteItems: onDeleteSchools
        }}
        importItem={{
          text: "Import " + t(`LABEL_SCHOOL`),
          onImportItems: toggleImportSchoolModal
        }}
        exportItem={{
          text: "Export " + t(`LABEL_SCHOOL`),
          onExportItems: onExportSchools
        }}
        addItem={{
          text: t(`LABEL_ADD_NEW`) + " " + t(`LABEL_SCHOOL`),
          onAddItem: toggleAddSchoolModal
        }}
        clear={clear}
        onClear={onClear}
        t={t}
      />
    );
  }
}

export default SchoolActions;
