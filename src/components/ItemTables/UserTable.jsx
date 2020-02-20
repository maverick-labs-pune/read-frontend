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
import find from "lodash/find";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";
import { Button } from "../Button/Button";

class UserTable extends Component {
  render() {
    const {
      users,
      onUserCheckboxToggle,
      checkedUsers,
      loading,
      toggleModal,
      adminTable,
      toggleDeleteAdminConfirmationModal,
      readAdmin,
      page,
      pages,
      onPageChange,
      onSortChange,
      t
    } = this.props;
    const columns = [
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <Checkbox
              id={`checkbox-id-${original.key}`}
              onChange={() => onUserCheckboxToggle(original)}
              checked={find(checkedUsers, { key: original.key }) !== undefined}
            />
          );
        },
        width: 45,
        sortable: false
      },
      {
        Header: t("FIELD_LABEL_USER_FIRST_NAME"),
        accessor: "first_name"
      },
      {
        Header: t("FIELD_LABEL_USER_LAST_NAME"),
        accessor: "last_name"
      },
      {
        Header: t("FIELD_LABEL_USER_EMAIL"),
        accessor: "email"
      },
      {
        Header: t("FIELD_LABEL_USER_TYPE"),
        accessor: "user_type"
      }
    ];

    const ngoAdminColumns = [
      {
        Header: t("FIELD_LABEL_USER_FIRST_NAME"),
        accessor: "first_name"
      },
      {
        Header: t("FIELD_LABEL_USER_LAST_NAME"),
        accessor: "last_name"
      },
      {
        Header: t("FIELD_LABEL_USER_EMAIL"),
        accessor: "email"
      },
      {
        Header: t("LABEL_ACTIONS"),
        id: "actions",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <div className="justify-content-center align-items-center">
              <Button
                id={`button-id-${original.key}`}
                onClick={() => toggleDeleteAdminConfirmationModal(original.key)}
              >
                Remove
              </Button>
            </div>
          );
        },
        sortable: false
      }
    ];

    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={users}
            columns={
              readAdmin === true
                ? ngoAdminColumns
                : adminTable === true
                ? ngoAdminColumns.slice(0, 3)
                : columns
            }
            className="-highlight"
            onPageChange={pageIndex => {
              onPageChange(pageIndex);
            }}
            pages={pages}
            page={page}
            onSortedChange={newSorted => onSortChange(newSorted)}
            showPagination={pages === 0 ? false : true}
            defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
            manual
            minRows={MINIMUM_TABLE_ROWS}
            loading={loading}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText={
              readAdmin === true
                ? "No Admin found"
                : adminTable === true
                ? "No Admin found"
                : "No Users found"
            }
            getTdProps={(state, rowInfo, column) => {
              if (
                column &&
                column.id !== "checkbox" &&
                rowInfo !== undefined &&
                column.id !== "actions" &&
                !adminTable
              ) {
                return {
                  onClick: e => toggleModal(rowInfo.original),
                  style: { cursor: "pointer" }
                };
              } else {
                return { onClick: (e, h) => {} };
              }
            }}
          />
        </div>
      </div>
    );
  }
}

const getNoDataProps = props => ({
  loading: props.loading
});
export default UserTable;
