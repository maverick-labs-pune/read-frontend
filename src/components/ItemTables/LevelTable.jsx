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
import { NoDataComponent } from "../Table/NoDataComponent";

class LevelTable extends Component {
  render() {
    const { levels, onLevelRowClick, loading, t } = this.props;
    const columns = [
      {
        Header: t("FIELD_LABEL_LEVEL_RANK"),
        accessor: "rank"
      },
      {
        Header: t("FIELD_LABEL_RANK_MR_IN"),
        accessor: "mr_in"
      },
      {
        Header: t("FIELD_LABEL_RANK_EN_IN"),
        accessor: "en_in"
      }
    ];
    return (
      <div className="row mt20  mb-5">
        <div className="col-lg-12 col-md-12">Levels</div>
        <div className="col-lg-12 col-md-12 mt20">
          <ReactTable
            data={levels}
            columns={columns}
            className="-highlight"
            loading={loading}
            showPagination={
              levels.length > DEFAULT_TABLE_PAGE_SIZE ? true : false
            }
            defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
            getNoDataProps={getNoDataProps}
            NoDataComponent={NoDataComponent}
            noDataText="No Levels found"
            minRows={MINIMUM_TABLE_ROWS}
            getTdProps={(state, rowInfo, column) => {
              if (
                column &&
                column.id !== "checkbox" &&
                rowInfo !== undefined &&
                column.id !== "actions"
              ) {
                return {
                  onClick: () => onLevelRowClick(rowInfo.original),
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

export default LevelTable;
