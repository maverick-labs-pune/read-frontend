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
import { withRouter } from "react-router-dom";
import Checkbox from "../Checkbox/Checkbox";
import find from "lodash/find";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  MINIMUM_TABLE_ROWS,
  SESSION_DATE_FORMAT
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";
import moment from "moment";

class SessionsTable extends Component {
  render() {
    const {
      sessions,
      canDelete,
      history,
      onSessionCheckboxToggle,
      checkedSessions,
      loading,
      page,
      pages,
      onPageChange,
      onSortChange,
      t
    } = this.props;

    const checkbox = {
      Header: "",
      id: "checkbox",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <Checkbox
            id={`checkbox-id-${original.key}`}
            onChange={() => onSessionCheckboxToggle(original)}
            checked={find(checkedSessions, { key: original.key }) !== undefined}
          />
        );
      },
      width: 45,
      sortable: false
    };

    const otherColumns = [
      {
        Header: t("FIELD_LABEL_READ_SESSION_DATE_TIME"),
        accessor: "dateTime",
        sortMethod: (a, b) => {
          const date1 = moment(a).unix();
          const date2 = moment(b).unix();
          if (date1 > date2) return 1;
          if (date1 < date2) return -1;
          return 0;
        },
        Cell: ({ original }) => {
          let formatDate = null;
          if (original.startDateTime && original.endDateTime) {
            formatDate =
              moment(original.startDateTime).format(SESSION_DATE_FORMAT) +
              " to " +
              moment(original.endDateTime).format("h:mm a");
          }
          return formatDate;
        },
        width: 350
      },
      {
        Header: t("LABEL_SCHOOL"),
        accessor: "school"
      },
      {
        Header: t("LABEL_STANDARD"),
        accessor: "standard",
        Cell: ({ original }) => {
          return t(original.standard);
        },
        width: 150
      },
      {
        Header: t("LABEL_BOOK_FAIRY"),
        accessor: "fairy"
      },
      {
        Header: t("FIELD_LABEL_READ_SESSION_TYPE"),
        accessor: "type",
        Cell: ({ original }) => {
          return t(original.type);
        },
        width: 100
      },
      {
        Header: t("LABEL_ACADEMIC_YEAR"),
        accessor: "academicYear",
        width: 120
      }
    ];

    const columns = canDelete ? [checkbox, ...otherColumns] : [...otherColumns];
    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={sessions}
            columns={columns}
            className="-highlight"
            pages={pages}
            page={page}
            manual
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            showPagination={pages === 0 ? false : true}
            showPageSizeOptions={false}
            loading={loading}
            minRows={MINIMUM_TABLE_ROWS}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No Sessions found"
            onPageChange={pageIndex => onPageChange(pageIndex)}
            onSortedChange={newSorted => onSortChange(newSorted)}
            getTdProps={(state, rowInfo, column) => {
              if (column && column.id !== "checkbox" && rowInfo !== undefined) {
                return {
                  onClick: e =>
                    history.push(
                      `/home/sessions/${rowInfo.original.key}/${rowInfo.original.type}`
                    ),
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

export default withRouter(SessionsTable);
