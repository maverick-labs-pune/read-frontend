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

class SupervisorClassroomStudentsAccept extends Component {
  render() {
    const { students } = this.props;
    const { t } = this.props;

    const columns = [
      {
        Header: t("STUDENT NAME"),
        accessor: "",
        Cell: ({ original }) => {
          return `${original.first_name} ${original.last_name}`;
        }
      },
      {
        id: "checkbox",
        accessor: "",
        Header: "Is present",
        Cell: ({ original }) => {
          return `${original.attendance ? "present" : "not present"}`;
        },
        sortable: false
      },
      {
        id: "level",
        accessor: "",
        Header: "Level",
        Cell: ({ original }) => {
          return `${original.level}`;
        },
        sortable: false
      },
      {
        id: "book",
        accessor: "",
        Header: "Book",
        Cell: ({ original }) => {
          return `${original.book}`;
        },
        sortable: false
      },
      {
        id: "comments",
        accessor: "",
        Header: "Comments",
        Cell: ({ original }) => {
          return `${original.comments}`;
        },
        sortable: false
      }
    ];

    return (
      <div className="row">
        <div className="col">
          <div className="row mt20">
            <div className="col-lg-12 col-md-12">
              <ReactTable
                data={students}
                columns={columns}
                minRows={0}
                showPagination={false}
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
          {/* <div className="row mt-2">
            <div className="col text-right">
              <Button className="mr-2">Save</Button>
              <Button>Submit</Button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default SupervisorClassroomStudentsAccept;
