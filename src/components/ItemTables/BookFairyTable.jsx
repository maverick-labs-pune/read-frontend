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
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";

class BookFairyTable extends Component {
  render() {
    const { fairies, t, onBookFairyChange, showRows } = this.props;

    const columns = [
      {
        Header: t("FIELD_LABEL_USER_FIRST_NAME"),
        accessor: "first_name"
      },
      {
        Header: t("FIELD_LABEL_USER_LAST_NAME"),
        accessor: "last_name"
      },
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <Checkbox
              id={`checkbox-id-${original.key}`}
              onChange={() => onBookFairyChange(original)}
              checked={original.checked}
            />
          );
        },
        width: 45,
        sortable: false
      }
    ];

    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12 mb20">
          <ReactTable
            data={showRows ? fairies : []}
            columns={columns}
            className="-highlight"
            showPagination={
              fairies.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
            }
            defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
            minRows={MINIMUM_TABLE_ROWS}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No Users found"
          />
        </div>
      </div>
    );
  }
}

const getNoDataProps = props => ({
  loading: props.loading
});
export default BookFairyTable;
