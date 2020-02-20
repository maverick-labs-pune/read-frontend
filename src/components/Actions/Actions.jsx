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
import PropTypes from "prop-types";
import { Button } from "../../components";

class Actions extends Component {
  render() {
    const {
      checkedItems,
      deleteItem,
      importItem,
      exportItem,
      addItem,
      onToggleFilters,
      onClear,
      clear,
      t
    } = this.props;
    const hasCheckedItems = checkedItems.length > 0;

    return (
      <div className="row mt20">
        <div className="col-lg-3 col-md-3">
          {hasCheckedItems ? (
            <Button onClick={deleteItem.onDeleteItems}>
              {deleteItem.text}
            </Button>
          ) : null}
          <Button
            className={`${hasCheckedItems ? "ml10" : ""}`}
            onClick={onToggleFilters}
          >
            {t(`LABEL_FILTERS`)}
          </Button>
          {clear ? (
            <Button onClick={onClear} className="ml10">
              Clear
            </Button>
          ) : null}
        </div>
        <div className={`col-lg-5 col-md-5 offset-lg-4 offset-md-4 text-right`}>
          {exportItem ? (
            <Button className="mr10" onClick={exportItem.onExportItems}>
              {exportItem.text}
            </Button>
          ) : null}
          {importItem ? (
            <Button className="mr10" onClick={importItem.onImportItems}>
              {importItem.text}
            </Button>
          ) : null}
          {addItem ? (
            <Button onClick={addItem.onAddItem}>{addItem.text}</Button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Actions;
Actions.propTypes = {
  checkedItems: PropTypes.array,
  deleteItem: PropTypes.shape({
    text: PropTypes.string,
    onDeleteItems: PropTypes.func
  }),
  importItem: PropTypes.shape({
    text: PropTypes.string,
    onImportItems: PropTypes.func
  }),
  exportItem: PropTypes.shape({
    text: PropTypes.string,
    onExportItems: PropTypes.func
  }),
  addItem: PropTypes.shape({
    text: PropTypes.string,
    onAddItem: PropTypes.func
  })
};
