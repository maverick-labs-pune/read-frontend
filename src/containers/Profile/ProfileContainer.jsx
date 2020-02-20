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
import api from "../../utils/api";
import UserDetails from "../../components/Profile/UserDetails";
import AddUserModal from "../../components/AddEntityModals/AddUserModal";
import { isValidUser } from "../../utils/validations";

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLink: "",
      showImportUserModal: false,
      profileData: {},
      checkedUsers: [],
      userData: null,
      title: null,
      showFilters: false,
      filterText: "",
      selectedFileToImport: null,
      showDeactivateUserConfirmationModal: false,
      selectedUserType: null,
      showAddUserModal: false
    };
  }

  async componentDidMount() {
    let validUser = await isValidUser();
    if (validUser) {
      this.fetchUserDetails();
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  fetchUserDetails = () => {
    let key = localStorage.getItem("key");
    api
      .getProfile(key)
      .then(({ data }) => {
        this.setState({
          profileData: data
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleAddUserModal = () => {
    this.setState(p => ({
      showAddUserModal: !p.showAddUserModal,
      selectedUserType: null,
      title: "Edit User",
      selectedFileToImport: null
    }));
  };

  handleUserTypeChange = value => {
    this.setState({
      selectedUserType: value
    });
  };

  toggleEditUserModal = details => {
    details = this.state.profileData;
    this.toggleAddUserModal();
    this.setState({
      userData: details,
      title: "Edit User",
      selectedUserType: null
    });
  };

  render() {
    const {
      profileData,
      showAddUserModal,
      selectedUserType,
      title
    } = this.state;

    const { location, t } = this.props;
    return (
      <div>
        <UserDetails
          data={profileData}
          toggleModal={this.toggleEditUserModal}
        />
        <AddUserModal
          isOpen={showAddUserModal}
          toggleModal={this.toggleEditUserModal}
          userData={profileData}
          selectedUserType={selectedUserType}
          onUserTypeChange={this.handleUserTypeChange}
          usersList={this.fetchUserDetails}
          title={title}
          location={location}
          t={t}
        />
      </div>
    );
  }
}

export default ProfileContainer;
