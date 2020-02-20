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
import findIndex from "lodash/findIndex";
import moment from "moment";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";

class InventoryTable extends Component {
  render() {
    const {
      books,
      onInventoryBookClick,
      onInventoryBookCheckboxToggle,
      checkedInventoryBooks,
      loading,
      page,
      pages,
      onSortChange,
      onPageChange,
      t
    } = this.props;
    const columns = [
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <Checkbox
              id={`checkbox-${original.key}`}
              onChange={() => onInventoryBookCheckboxToggle(original)}
              checked={
                findIndex(checkedInventoryBooks, {
                  key: original.key
                }) > -1
              }
            />
          );
        },
        width: 45,
        sortable: false
      },
      {
        Header: t("FIELD_LABEL_INVENTORY_SERIAL_NUMBER"),
        accessor: "serial_number"
      },
      {
        Header: t("FIELD_LABEL_INVENTORY_STATUS"),
        accessor: "status"
      },
      {
        Header: t("FIELD_LABEL_INVENTORY_YEAR_OF_PURCHASE"),
        accessor: "added_date_time",
        Cell: ({ original }) => {
          return original.added_date_time
            ? moment(original.added_date_time).format("YYYY")
            : "-";
        }
      }
    ];
    return (
      <div className="row mt20 mb20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={books}
            columns={columns}
            className="-highlight"
            loading={loading}
            pages={pages}
            page={page}
            manual
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            minRows={MINIMUM_TABLE_ROWS}
            showPagination={pages === 0 ? false : true}
            showPageSizeOptions={false}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No Books available in inventory"
            onPageChange={pageIndex => {
              onPageChange(pageIndex);
            }}
            onSortedChange={newSorted => onSortChange(newSorted)}
            getTdProps={(state, rowInfo, column) => {
              if (column && column.id !== "checkbox" && rowInfo !== undefined) {
                return {
                  onClick: () => onInventoryBookClick(rowInfo.original),

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

export default InventoryTable;
