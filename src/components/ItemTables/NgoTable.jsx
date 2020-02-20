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
import findIndex from "lodash/findIndex";
import {
  MINIMUM_TABLE_ROWS,
  DEFAULT_TABLE_PAGE_SIZE
} from "../../utils/constants";
import { NoDataComponent } from "../Table/NoDataComponent";

class NgoTable extends Component {
  render() {
    const {
      ngos,
      showCheckboxes,
      onNgoCheckboxToggle,
      checkedNgos,
      history,
      loading,
      t
    } = this.props;
    const checkboxColumn = showCheckboxes
      ? {
          id: "checkbox",
          accessor: "",
          Cell: ({ original }) => {
            return (
              <Checkbox
                id={`checkbox-${original.key}`}
                onChange={() => onNgoCheckboxToggle(original)}
                checked={findIndex(checkedNgos, { key: original.key }) > -1}
              />
            );
          },
          width: 45,
          sortable: false
        }
      : null;

    const otherColumns = [
      {
        Header: t("FIELD_LABEL_NGO_NAME"),
        accessor: "name"
      },
      {
        Header: t("FIELD_LABEL_NGO_ADDRESS"),
        accessor: "address"
      }
    ];

    let columns = showCheckboxes
      ? [checkboxColumn, ...otherColumns]
      : [...otherColumns];
    return (
      <div className="row mt20">
        <div className="col-lg-12 col-md-12">
          <ReactTable
            data={ngos}
            columns={columns}
            className="-highlight"
            loading={loading}
            showPagination={
              ngos.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
            }
            defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
            minRows={MINIMUM_TABLE_ROWS}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No NGOs found"
            getTdProps={(state, rowInfo, column) => {
              if (column && column.id !== "checkbox" && rowInfo !== undefined) {
                return {
                  onClick: () =>
                    history.push(`/home/ngos/${rowInfo.original.key}`),
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

export default withRouter(NgoTable);
