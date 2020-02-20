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
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";

class BookTable extends Component {
  render() {
    const {
      books,
      checkedBooks,
      loading,
      history,
      onBookCheckboxToggle,
      pages,
      page,
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
              id={`checkbox-${original.key}`}
              onChange={() => onBookCheckboxToggle(original)}
              checked={findIndex(checkedBooks, { key: original.key }) > -1}
            />
          );
        },
        width: 45,
        sortable: false
      },
      {
        Header: t("FIELD_LABEL_BOOK_NAME"),
        accessor: "name"
      },
      {
        Header: t("FIELD_LABEL_BOOK_LEVEL"),
        accessor: "level",
        width: 150,
        Cell: ({ original }) => {
          const name = original.level ? original.level.name : "";
          return t(name);
        }
      },
      {
        Header: t("FIELD_LABEL_BOOK_AUTHOR"),
        accessor: "author"
      },
      {
        Header: t("FIELD_LABEL_BOOK_PUBLISHER"),
        accessor: "publisher"
      },
      {
        Header: t("FIELD_LABEL_BOOK_PRICE"),
        accessor: "price",
        width: 100
      }
    ];
    return (
      <div className="row mt20">
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
            noDataText="No Books found"
            onPageChange={pageIndex => {
              onPageChange(pageIndex);
            }}
            onSortedChange={newSorted => onSortChange(newSorted)}
            getTdProps={(state, rowInfo, column) => {
              if (column && column.id !== "checkbox" && rowInfo !== undefined) {
                return {
                  onClick: e =>
                    history.push(`/home/books/${rowInfo.original.key}`),
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

export default BookTable;
