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
import ReactTable from "react-table";
import "react-table/react-table.css";
import forEach from "lodash/forEach";
import { Button } from "../Button/Button";
import { toUpperCase } from "../../utils/stringUtils";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";

class ClassroomTable extends Component {
  getClassroomColumns = data => {
    const { t } = this.props;
    const keys = Object.keys(data[0]);
    let columns = [];
    forEach(keys, value => {
      if (value !== "key") {
        columns.push({
          Header: t(`FIELD_LABEL_CLASSROOM_${toUpperCase(value)}`),
          accessor: value,
          Cell: row => {
            return value === "standard"
              ? t(`${toUpperCase(row.value)}`)
              : row.value;
          }
        });
      }
    });
    return columns;
  };

  render() {
    const {
      classrooms,
      toggleDeactivateClassroomConfirmationModal,
      onImportToggle,
      onExportToggle
    } = this.props;

    const { key } = this.props.match.params;

    const buttons = {
      Header: "",
      id: "actions",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <div className="justify-content-center align-items-center">
            <Button
              id={`button-id-${original.key}`}
              onClick={() =>
                toggleDeactivateClassroomConfirmationModal(original.key)
              }
            >
              Delete
            </Button>
            <Button
              id={`button-id-${original.key}`}
              className="ml-2 mr-2"
              onClick={() => onImportToggle(original.key)}
            >
              Import
            </Button>
            <Button
              id={`button-id-${original.key}`}
              onClick={() => onExportToggle(original.key)}
              className="mr-1"
            >
              Export
            </Button>
          </div>
        );
      },
      sortable: false,
      width: 240
    };

    const columns = [...this.getClassroomColumns(classrooms), buttons];
    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={classrooms}
            columns={columns}
            className="-highlight"
            showPagination={
              classrooms.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
            }
            getTdProps={(state, rowInfo, column) => {
              if (
                column &&
                column.id !== "checkbox" &&
                rowInfo !== undefined &&
                column.id !== "actions"
              ) {
                return {
                  onClick: e =>
                    this.props.history.push(
                      `/home/schools/${key}/classroom/${rowInfo.original.key}`
                    ),
                  style: { cursor: "pointer" }
                };
              } else {
                return { onClick: (e, h) => {} };
              }
            }}
            defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
            minRows={MINIMUM_TABLE_ROWS}
            noDataText="No Classrooms Found"
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ClassroomTable);
