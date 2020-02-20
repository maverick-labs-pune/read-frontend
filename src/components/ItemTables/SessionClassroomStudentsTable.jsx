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
import ReactTable from "react-table";
import "react-table/react-table.css";
import Checkbox from "../Checkbox/Checkbox";
import Select from "../Select/Select";
import AsyncSelect from "react-select/lib/Async";
import { Button } from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";

class SessionClassroomStudentsTable extends Component {
  render() {
    const {
      students,
      levels,
      readOnly,
      classroom,
      onAttendanceChange,
      onLevelChange,
      onBookChange,
      onCommentChange,
      onClassroomSave,
      onBookSearchChange,
      t
    } = this.props;

    const columns = [
      {
        Header: t("Name"),
        accessor: "",
        Cell: ({ original }) => {
          return `${original.first_name} ${original.last_name}`;
        },
        width: 150
      },
      {
        id: "checkbox",
        accessor: "",
        Header: "Present",
        Cell: ({ original }) => {
          return readOnly ? (
            `${original.attendance ? "Yes" : "No"}`
          ) : (
            <Checkbox
              id={`checkbox-${original.key}`}
              onChange={event => onAttendanceChange(event, original)}
              styles={{ menu: base => ({ ...base, zIndex: 2 }) }}
              checked={original.attendance}
            />
          );
        },
        sortable: false,
        width: 100
      },
      {
        id: "level",
        accessor: "",
        Header: "Level",
        Cell: ({ original }) => {
          return readOnly ? (
            original.level ? (
              t(`${original.level}`)
            ) : (
              "-"
            )
          ) : (
            <Select
              placeholder="Select Level"
              maxMenuHeight={150}
              value={original.level}
              onChange={event => onLevelChange(event, original)}
              options={levels}
            />
          );
        },
        sortable: false,
        width: 150
      },
      {
        id: "book",
        accessor: "",
        Header: "Book",
        Cell: ({ original }) => {
          return readOnly ? (
            original.book ? (
              `${original.book.map((booklist, i) => booklist.label)}`
            ) : (
              "-"
            )
          ) : (
            // <Select
            //   placeholder="Select Book"
            //   maxMenuHeight={150}
            //   value={original.book}
            //   onChange={event => onBookChange(event, original)}
            //   options={books}
            //   isMulti={true}
            //   closeMenuOnSelect={false}
            // />
            <AsyncSelect
              isMulti
              loadOptions={onBookSearchChange}
              placeholder="Search by serial no"
              onChange={event => onBookChange(event, original)}
              value={original.book}
            />
          );
        },
        sortable: false,
        style: readOnly ? { overflow: "hidden" } : {}
      },
      {
        id: "comments",
        accessor: "",
        Header: "Comments",
        Cell: ({ original }) => {
          return readOnly ? (
            `${original.comments || "-"}`
          ) : (
            <TextArea
              placeholder="Comments"
              onChange={event => onCommentChange(event, original)}
              value={original.comments || ""}
            />
          );
        },
        sortable: false,
        width: 150
      },
      {
        id: "evaluated",
        accessor: "",
        Header: "",
        Cell: ({ original }) => {
          return original.isEvaluated ? (
            <i className="fa fa-check" aria-hidden="true" />
          ) : (
            <i className="fa fa-times" aria-hidden="true" />
          );
        },
        sortable: false,
        width: 50
      }
    ];

    return (
      <div>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <ReactTable
              data={students}
              columns={columns}
              className="-highlight"
              showPagination={
                students.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
              }
              defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
              minRows={MINIMUM_TABLE_ROWS}
              noDataText="No Students Found"
              getTdProps={(state, rowInfo, column) => {
                const { id } = column;
                return {
                  style:
                    id === "level" || id === "book"
                      ? { overflow: "visible" }
                      : {}
                };
              }}
              getTableProps={() => {
                return {
                  style: { overflow: "visible" }
                };
              }}
              getTbodyProps={() => {
                return {
                  style: { overflow: "visible" }
                };
              }}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col text-right">
            {readOnly ? null : (
              <Button
                onClick={() => onClassroomSave(classroom)}
                disabled={students.length === 0 ? true : false}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SessionClassroomStudentsTable;
