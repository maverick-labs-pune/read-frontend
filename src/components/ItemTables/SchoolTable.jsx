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
import Checkbox from "../Checkbox/Checkbox";
import find from "lodash/find";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";

class SchoolTable extends Component {
  render() {
    const {
      schools,
      onSchoolCheckboxToggle,
      checkedSchools,
      loading,
      history,
      pages,
      page,
      onPageChange,
      onSortChange,
      t
    } = this.props;
    const columns = [
      {
        Header: "",
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <Checkbox
              id={`checkbox-id-${original.key}`}
              onChange={() => onSchoolCheckboxToggle(original)}
              checked={
                find(checkedSchools, { key: original.key }) !== undefined
              }
            />
          );
        },
        width: 45,
        sortable: false
      },
      {
        Header: t("FIELD_LABEL_SCHOOL_NAME"),
        accessor: "name"
      },
      {
        Header: t("FIELD_LABEL_SCHOOL_ADDRESS"),
        accessor: "address"
      },
      {
        Header: t("FIELD_LABEL_SCHOOL_SCHOOL_TYPE"),
        accessor: "school_type",
        Cell: ({ original }) => {
          const { school_type } = original;
          return t(school_type.name);
        }
      },
      {
        Header: t("FIELD_LABEL_SCHOOL_MEDIUM"),
        accessor: "medium",
        Cell: ({ original }) => {
          const { medium } = original;
          return t(medium.name);
        }
      },
      {
        Header: t("FIELD_LABEL_SCHOOL_SCHOOL_CATEGORY"),
        accessor: "school_category",
        Cell: ({ original }) => {
          const { school_category } = original;
          return t(school_category.name);
        }
      }
    ];
    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={schools}
            columns={columns}
            minRows={MINIMUM_TABLE_ROWS}
            loading={loading}
            className="-highlight"
            pages={pages}
            page={page}
            showPagination={pages === 0 ? false : true}
            manual
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            showPageSizeOptions={false}
            onPageChange={pageIndex => {
              onPageChange(pageIndex);
            }}
            onSortedChange={newSorted => onSortChange(newSorted)}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No Schools found"
            getTdProps={(state, rowInfo, column) => {
              if (column && column.id !== "checkbox" && rowInfo !== undefined) {
                return {
                  onClick: e =>
                    history.push(`/home/schools/${rowInfo.original.key}`),
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

export default withRouter(SchoolTable);
