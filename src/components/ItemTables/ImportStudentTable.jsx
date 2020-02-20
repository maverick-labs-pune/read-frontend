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

class ImportStudentTable extends Component {
  render() {
    const { students } = this.props;
    const columns = [
      {
        accessor: "",
        Header: "Student Name",
        Cell: ({ original }) => {
          return `${original["First name"]} ${original["Last name"]}`;
        },
        width: 150
      },
      {
        accessor: "error",
        Header: "Error Message",
        sortable: false
      }
    ];
    return (
      <div className="row mt20">
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
    );
  }
}

export default ImportStudentTable;
