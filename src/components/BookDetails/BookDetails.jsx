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
import { Button } from "../Button/Button";
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import InventoryActions from "../Actions/InventoryActions";
import InventoryTable from "../ItemTables/InventoryTable";
import AddInventoryModal from "../AddEntityModals/AddInventoryModal";
import ImportBooksToInventory from "../ImportEntityModals/ImportBooksToInventory";

class BookDetails extends Component {
  render() {
    const {
      details,
      toggleEditBookModal,
      toggleDeactivateBookConfirmationModal,
      showDeactivateBookConfirmationModal,
      onBookDelete,
      pages,
      page,
      onSortChange,
      onPageChange,
      t,
      history
    } = this.props;

    return (
      <div>
        <div className="mt40 school-details-container card">
          <div className="mt20 ml20 mr20 mb20">
            <h3>Book and Inventory Details</h3>
            <div className="divider" />
            <div className="ngo-details mt40">
              <div className="row align-items-end">
                <div className="col-lg-3 col-md-3">Name</div>
                <div className="col-lg-5 col-md-5">
                  <strong>{details ? details.name : ""}</strong>
                </div>
                <div className="col-lg-4 col-md-4 text-right">
                  <Button primary onClick={toggleEditBookModal}>
                    Edit Book
                  </Button>
                  <Button
                    className="text-warning ml10"
                    warning
                    secondary
                    onClick={toggleDeactivateBookConfirmationModal}
                  >
                    Delete Book
                  </Button>
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">NGO</div>
                <div className="col-lg-6 col-md-6">
                  {details ? details.ngo.name : ""}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Level</div>
                <div className="col-lg-6 col-md-6">
                  {details ? t(details.level ? details.level.name : "-") : ""}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Author</div>
                <div className="col-lg-6 col-md-6">
                  {details ? details.author : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Publisher</div>
                <div className="col-lg-6 col-md-6">
                  {details ? details.publisher || "-" : "-"}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Price</div>
                <div className="col-lg-6 col-md-6">
                  {details ? details.price || "-" : "-"}
                </div>
              </div>
            </div>
            <ConfirmationModal
              isOpen={showDeactivateBookConfirmationModal}
              title={"Deactivate selected book?"}
              onPositiveAction={onBookDelete}
              toggleModal={toggleDeactivateBookConfirmationModal}
            />
          </div>
        </div>
        <div className="mt40 school-details-container">
          <InventoryActions
            toggleImportBookModal={this.props.toggleImportBookModal}
            checkedItems={this.props.inventoryCheckedItems}
            onDeleteInventoryBooks={this.props.onDeleteInventoryBooks}
            onExportBooks={this.props.onExportInventoryBooks}
            t={t}
          />
          <InventoryTable
            books={this.props.inventoryBooks}
            loading={this.props.inventoryLoading}
            onInventoryBookClick={this.props.onInventoryBookClick}
            onInventoryBookCheckboxToggle={
              this.props.onInventoryBookCheckboxToggle
            }
            checkedInventoryBooks={this.props.checkedInventoryBooks}
            pages={pages}
            page={page}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            history={history}
            t={t}
          />
          <AddInventoryModal
            toggleModal={this.props.toggleEditInventoryModal}
            isOpen={this.props.showEditInventory}
            inventoryData={this.props.inventoryData}
            getInventory={this.props.getInventory}
            history={history}
            t={t}
          />
          <ImportBooksToInventory
            t={t}
            selectedFileName={this.props.selectedFileName}
            books={this.props.importedBookData}
            importError={this.props.importError}
            onFileInput={this.props.onImportInventoryBookFileInput}
            isOpen={this.props.showImportBookModal}
            toggleImportModal={this.props.toggleImportBookModal}
            onImportBook={this.props.onImportBook}
            importBookLoading={this.props.importBookLoading}
          />
          <ConfirmationModal
            isOpen={this.props.showDeactivateInventoryConfirmationModal}
            title={"Deactivate selected inventory book?"}
            onPositiveAction={this.props.onInventoryBookDelete}
            toggleModal={this.props.toggleDeactivateInventoryConfirmationModal}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(BookDetails);
