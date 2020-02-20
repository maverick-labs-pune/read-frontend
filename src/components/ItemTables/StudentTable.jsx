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
import Checkbox from "../Checkbox/Checkbox";
import find from "lodash/find";
import { withRouter } from "react-router-dom";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";
import { Button } from "../Button/Button";

class StudentTable extends Component {
  render() {
    const {
      students,
      onStudentCheckboxToggle,
      checkedStudents,
      loading,
      history,
      classroomStudentTable,
      handleStudentDeleteButton,
      page,
      pages,
      onPageChange,
      onSortChange,
      classroomStudents,
      t
    } = this.props;
    const studentColumns = [
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <Checkbox
              onChange={() => onStudentCheckboxToggle(original)}
              checked={
                find(checkedStudents, { key: original.key }) !== undefined
              }
              id={original.key}
            />
          );
        },
        width: 45,
        sortable: false
      },
      // {
      //   Header: t("FIELD_LABEL_STUDENT_FIRST_NAME"),
      //   accessor: "name"
      // },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: t("LABEL_SCHOOL"),
        accessor: "school"
      },
      {
        Header: t("LABEL_STANDARD"),
        accessor: "standard",
        Cell: ({ original }) => {
          return t(`${original.standard}`);
        },
        width: 80
      },
      {
        Header: t("LABEL_DIVISION"),
        accessor: "division",
        width: 80
      }
    ];

    const classRoomStudentColumns = [
      {
        Header: t("FIELD_LABEL_STUDENT_FIRST_NAME"),
        accessor: "first_name"
      },
      {
        Header: t("FIELD_LABEL_STUDENT_LAST_NAME"),
        accessor: "last_name"
      },
      {
        Header: t("FIELD_LABEL_STUDENT_BIRTH_DATE"),
        accessor: "birth_date"
      },
      {
        Header: t("FIELD_LABEL_STUDENT_GENDER"),
        accessor: "gender"
      },
      {
        Header: t("FIELD_LABEL_STUDENT_ADDRESS"),
        accessor: "address"
      },
      {
        Header: "",
        id: "actions",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <div className="justify-content-center align-items-center">
              <Button
                id={`button-id-${original.key}`}
                onClick={() => handleStudentDeleteButton(original)}
              >
                Delete
              </Button>
            </div>
          );
        },
        width: 120,
        sortable: false
      }
    ];
    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          {classroomStudents ? (
            <ReactTable
              data={students}
              columns={
                classroomStudentTable ? classRoomStudentColumns : studentColumns
              }
              className="-highlight"
              showPagination={
                students.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
              }
              defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
              minRows={MINIMUM_TABLE_ROWS}
              loading={loading}
              getNoDataProps={getNoDataProps}
              NoDataComponent={NoDataComponent}
              noDataText="No Students found"
              getTdProps={(state, rowInfo, column) => {
                if (
                  column &&
                  column.id !== "checkbox" &&
                  rowInfo !== undefined &&
                  column.id !== "actions"
                ) {
                  return {
                    onClick: e =>
                      history.push(`/home/students/${rowInfo.original.key}`),
                    style: { cursor: "pointer" }
                  };
                } else {
                  return { onClick: (e, h) => {} };
                }
              }}
            />
          ) : (
            <ReactTable
              data={students}
              columns={
                classroomStudentTable ? classRoomStudentColumns : studentColumns
              }
              className="-highlight"
              pages={pages}
              page={page}
              manual
              pageSize={DEFAULT_TABLE_PAGE_SIZE}
              minRows={MINIMUM_TABLE_ROWS}
              showPagination={pages === 0 ? false : true}
              showPageSizeOptions={false}
              defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
              loading={loading}
              onPageChange={pageIndex => {
                onPageChange(pageIndex);
              }}
              onSortedChange={newSorted => onSortChange(newSorted)}
              getNoDataProps={getNoDataProps}
              NoDataComponent={NoDataComponent}
              noDataText="No Students found"
              getTdProps={(state, rowInfo, column) => {
                if (
                  column &&
                  column.id !== "checkbox" &&
                  rowInfo !== undefined &&
                  column.id !== "actions"
                ) {
                  return {
                    onClick: e =>
                      history.push(`/home/students/${rowInfo.original.key}`),
                    style: { cursor: "pointer" }
                  };
                } else {
                  return { onClick: (e, h) => {} };
                }
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

const getNoDataProps = props => ({
  loading: props.loading
});

export default withRouter(StudentTable);
