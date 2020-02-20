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
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";

class BookLendingSessionClassroomStudentsTable extends Component {
  render() {
    const { students, t } = this.props;

    const columns = [
      {
        Header: t("Name"),
        accessor: "",
        Cell: ({ original }) => {
          return `${original.first_name} ${original.last_name}`;
        }
      },
      {
        id: "book",
        accessor: "",
        Header: "Book",
        Cell: ({ original }) => {
          return original.book
            ? `${original.book.map((booklist, i) => booklist.label)}`
            : "-";
        },
        sortable: false
      },
      {
        id: "Status",
        accessor: "",
        Header: "Status",
        Cell: ({ original }) => {
          return original.action ? `${original.action}` : "-";
        },
        sortable: false
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
            />
          </div>
        </div>
        {/* <div className="row mt-2">
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
        </div> */}
      </div>
    );
  }
}

export default BookLendingSessionClassroomStudentsTable;
