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
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import UserTable from "../ItemTables/UserTable";

class NgoAdminDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteAdminConfirmationModal: false,
      deactivateAdminKey: null
    };
  }

  toggleDeleteAdminConfirmationModal = key => {
    this.setState(p => ({
      showDeleteAdminConfirmationModal: !p.showDeleteAdminConfirmationModal,
      deactivateAdminKey: key
    }));
  };

  render() {
    const { showDeleteAdminConfirmationModal } = this.state;
    const {
      adminDetails,
      readAdmin,
      onDeactivateNgoAdmin,
      page,
      pages,
      onSortChange,
      onPageChange,
      t
    } = this.props;
    return (
      <div>
        <div className="row mt20">
          <div className="col-lg-3 col-md-3">Admin</div>
        </div>
        <div className="row mt10">
          <div className="col">
            {adminDetails.length > 0 ? (
              <UserTable
                users={adminDetails}
                adminTable={true}
                toggleModal={this.toggleEditUserModal}
                readAdmin={readAdmin}
                toggleDeleteAdminConfirmationModal={
                  this.toggleDeleteAdminConfirmationModal
                }
                page={page}
                pages={pages}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                t={t}
              />
            ) : (
              <div className="text-muted">
                <small>
                  <i>No Admins</i>
                </small>
              </div>
            )}
          </div>
        </div>

        <ConfirmationModal
          isOpen={showDeleteAdminConfirmationModal}
          title={"Remove as admin?"}
          onPositiveAction={() => {
            onDeactivateNgoAdmin(this.state.deactivateAdminKey);
            this.toggleDeleteAdminConfirmationModal(null);
          }}
          toggleModal={() => this.toggleDeleteAdminConfirmationModal(null)}
        />
      </div>
    );
  }
}

export default NgoAdminDetails;
