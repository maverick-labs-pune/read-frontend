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

class StudentActions extends Component {
  render() {
    const {
      checkedStudents,
      onToggleFilters,
      onDeleteStudents,
      toggleAddStudentModal,
      clear,
      onClear,
      t
    } = this.props;
    return (
      <Actions
        checkedItems={checkedStudents}
        onToggleFilters={onToggleFilters}
        deleteItem={{
          text: "Delete " + t(`LABEL_STUDENT`),
          onDeleteItems: onDeleteStudents
        }}
        addItem={{
          text: t(`LABEL_ADD_NEW`) + " " + t(`LABEL_STUDENT`),
          onAddItem: toggleAddStudentModal
        }}
        t={t}
        clear={clear}
        onClear={onClear}
      />
    );
  }
}

export default StudentActions;
