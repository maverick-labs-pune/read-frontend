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
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import AddNgoAdminModal from "../AddEntityModals/AddNgoAdminModal";
import { Button } from "../Button/Button";
import NgoAdminDetails from "./NgoAdminDetails";
import NgoLevelDetails from "./NgoLevelDetails";
import NgoSupervisorBookFairyDetails from "./NgoSupervisorBookFairyDetail";
import { isValid } from "../../utils/stringUtils";

class NgoDetails extends Component {
  render() {
    const {
      toggleDeactivateNgoConfirmationModal,
      showDeactivateNgoConfirmationModal,
      showAddAdminModal,
      ngo,
      adminDetails,
      readAdmin,
      toggleEditNgoModal,
      toggleAddAdminModal,
      onDeactivateNgoAdmin,
      onDeactivateNgo,
      getNgoAdmins,
      onAddNgoAdmin,
      toggleEditLevelModal,
      showLevelModal,
      levels,
      levelData,
      getlevels,
      onLevelRowClick,
      loading,
      supervisors,
      bookFairies,
      onSupervisorChange,
      selectedSupervisor,
      onBookFairyChange,
      onSupervisorBookFairySave,
      bookfairyLoading,
      isEditLevel,
      page,
      pages,
      onPageChange,
      onSortChange,
      t
    } = this.props;

    const deactivateButton = readAdmin ? (
      <Button
        warning
        secondary
        className="text-warning ml10"
        onClick={toggleDeactivateNgoConfirmationModal}
      >
        Deactivate NGO
      </Button>
    ) : null;

    const addAdminButton = readAdmin ? (
      <Button className="mr10" onClick={toggleAddAdminModal}>
        Add Admin
      </Button>
    ) : null;

    const NgoLevelComponent = !readAdmin ? (
      <NgoLevelDetails
        levels={levels}
        showLevelModal={showLevelModal}
        levelData={isEditLevel ? levelData : {}}
        getlevels={getlevels}
        onLevelRowClick={onLevelRowClick}
        toggleEditLevelModal={toggleEditLevelModal}
        loading={loading}
        t={t}
      />
    ) : null;

    const NgoSupervisorComponent =
      !readAdmin && isValid(supervisors) && isValid(bookFairies) ? (
        <NgoSupervisorBookFairyDetails
          supervisors={supervisors}
          bookFairies={bookFairies}
          onSupervisorChange={onSupervisorChange}
          selectedSupervisor={selectedSupervisor}
          onBookFairyChange={onBookFairyChange}
          onSupervisorBookFairySave={onSupervisorBookFairySave}
          bookfairyLoading={bookfairyLoading}
          t={t}
        />
      ) : null;
    return (
      <div>
        <div className="mt40 mb20 ngo-details-container card">
          <div className="mt20 ml20 mr20 mb20">
            <h3>NGO Details</h3>
            <div className="divider" />
            <div className="ngo-details mt40">
              <div className="row align-items-end">
                <div className="col-lg-3 col-md-3">Name</div>
                <div className="col-lg-4 col-md-4">
                  <strong>{ngo.name}</strong>
                </div>
                <div className="col-lg-5 col-md-5 text-right">
                  {addAdminButton}
                  <Button primary onClick={toggleEditNgoModal}>
                    Edit NGO
                  </Button>
                  {deactivateButton}
                </div>
              </div>
              <div className="row mt20">
                <div className="col-lg-3 col-md-3">Address</div>
                <div className="col-lg-6 col-md-6">{ngo.address}</div>
              </div>
              <NgoAdminDetails
                adminDetails={adminDetails}
                toggleAddAdminModal={toggleAddAdminModal}
                onDeactivateNgoAdmin={onDeactivateNgoAdmin}
                showLevelModal={showLevelModal}
                levels={levels}
                readAdmin={readAdmin}
                levelData={levelData}
                getlevels={getlevels}
                onLevelRowClick={onLevelRowClick}
                page={page}
                pages={pages}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                t={t}
              />
              {NgoLevelComponent}
              {NgoSupervisorComponent}
            </div>
          </div>
          <ConfirmationModal
            isOpen={showDeactivateNgoConfirmationModal}
            title={"Deactivate NGO?"}
            onPositiveAction={onDeactivateNgo}
            toggleModal={toggleDeactivateNgoConfirmationModal}
          />
          <AddNgoAdminModal
            isOpen={showAddAdminModal}
            toggleAddAdminModal={toggleAddAdminModal}
            getNgoAdmins={getNgoAdmins}
            adminDetails={adminDetails}
            onAddNgoAdmin={onAddNgoAdmin}
            ngo={ngo}
          />
        </div>
      </div>
    );
  }
}

export default NgoDetails;
