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
import NgoDetails from "../../components/NgoDetails/NgoDetails";
import api from "../../utils/api";
import AddNgoModal from "../../components/AddEntityModals/AddNgoModal";
import { withRouter } from "react-router-dom";
import {
  READ_ADMIN,
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_SORT_FIRST_NAME
} from "../../utils/constants";
import instance from "../../utils/axios";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import find from "lodash/find";
import reduce from "lodash/reduce";
import { isValid } from "../../utils/stringUtils";
import { isValidUser } from "../../utils/validations";

class NgoDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeactivateNgoConfirmationModal: false,
      showDeleteAdminConfirmationModal: false,
      showAddAdminModal: false,
      showEditNgoModal: false,
      adminDetails: [],
      ngo: {},
      addNgoAdminError: null,
      showLevelModal: false,
      levels: [],
      selectedLevel: null,
      supervisors: [],
      bookFairies: [],
      selectedSupervisor: null,
      editLevel: false,
      pages: 0,
      page: 0,
      sortBy: DEFAULT_SORT_FIRST_NAME
    };
  }

  async componentDidMount() {
    const { key } = this.props.match.params;

    let validUser = await isValidUser();
    if (validUser) {
      instance
        .all([
          api.getNgo(key),
          api.getNgoAdmins(key, 0, DEFAULT_SORT_FIRST_NAME),
          api.getLevels(key),
          api.bookFairies(key),
          api.supervisors(key)
        ])
        .then(
          instance.spread((ngos, admins, levels, bookFairies, supervisors) => {
            let supervisorDropdown = [];
            forEach(supervisors.data, supervisor => {
              supervisorDropdown.push({
                value: supervisor.key,
                label: `${supervisor.first_name} ${supervisor.last_name}`
              });
            });
            const { results, count } = admins.data;
            this.setState({
              ngo: ngos.data,
              levels: levels.data,
              adminDetails: results,
              page: 0,
              pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE),
              supervisors: supervisorDropdown,
              bookFairies: this.bookFairiesInit(bookFairies.data)
            });
          })
        );
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  getNgoAdmins = (page = 0, sort = null) => {
    const { key } = this.props.match.params;
    const sortBy = sort === null ? this.state.sortBy : sort;
    api
      .getNgoAdmins(key, page, sortBy)
      .then(({ data }) => {
        const { results, count } = data;
        this.setState({
          adminDetails: results,
          page,
          pages: Math.ceil(count / DEFAULT_TABLE_PAGE_SIZE)
        });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  bookFairiesInit = data => {
    let bookFairiesDefault = cloneDeep(data);
    forEach(bookFairiesDefault, bookFairy => {
      bookFairy.checked = false;
    });
    return bookFairiesDefault;
  };
  /******************************
   * add NGO ADMIN callbacks START
   *****************************/
  toggleAddAdminModal = () => {
    this.setState(p => ({ showAddAdminModal: !p.showAddAdminModal }));
  };

  toggleAddLevelModal = () => {
    this.setState(p => ({
      showLevelModal: !p.showLevelModal,
      editLevel: false
    }));
  };

  toggleEditLevelModal = () => {
    this.setState(p => ({
      showLevelModal: !p.showLevelModal,
      editLevel: true
    }));
  };
  /******************************
   * add NGO ADMIN callbacks END
   *******************************/

  /**
   * deactivate NGO callback START
   */
  handleDeactivateNgo = () => {
    const { key } = this.props.match.params;
    api
      .deactivateNgo(key)
      .then(({ data }) => {
        this.toggleDeactivateNgoConfirmationModal();
        this.props.history.push("/home");
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  /******************************************
   * Edit NGO related callbacks START
   *****************************************/
  handleEditNgo = data => {
    const { key } = this.props.match.params;
    api
      .updateNgo(key, data)
      .then(() => {
        api
          .getNgo(key)
          .then(({ data }) => {
            this.setState({ ngo: data });
            this.toggleEditNgoModal();
          })
          .catch(({ response }) => {
            api.handleError(response);
          });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };
  toggleEditNgoModal = () => {
    this.setState(p => ({ showEditNgoModal: !p.showEditNgoModal }));
  };
  handleEditNgoInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  /******************************************
   * Edit NGO callbacks END
   *****************************************/

  /**
   *
   */
  handleDeactivateNgoAdmin = adminKey => {
    const { key } = this.props.match.params;
    const data = { user_key: adminKey };
    api
      .deactivateNgoAdmin(key, data)
      .then(({ data }) => {
        api
          .getNgoAdmins(key)
          .then(({ data }) => {
            this.setState({ adminDetails: data });
            this.toggleDeleteAdminConfirmationModal();
            api.handleSuccess(data);
          })
          .catch(({ response }) => {
            api.handleError(response);
          });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  handleUpdateNgo = ngo => {
    this.setState({
      ngo
    });
  };

  fetchLevels = () => {
    const { key } = this.props.match.params;
    api.getLevels(key).then(({ data }) => {
      this.setState({
        levels: data
      });
    });
  };

  handleLevelClick = level => {
    this.setState({
      selectedLevel: level
    });
    this.toggleEditLevelModal();
  };

  handleSupervisorChange = supervisor => {
    this.setState({
      selectedSupervisor: supervisor
    });
    this.getSupervisorBookFairies(supervisor.value);
  };

  getSupervisorBookFairies = supervisor => {
    const { bookFairies } = this.state;
    const { key } = this.props.match.params;
    let bookFairiesCopy = cloneDeep(bookFairies);
    api
      .getSupervisorBookFairies(key, supervisor)
      .then(({ data }) => {
        forEach(bookFairiesCopy, bookFairy => {
          const { key } = bookFairy;
          let isBookFairyUnderSupervisor = find(data, { key: key });
          if (isBookFairyUnderSupervisor !== undefined) {
            bookFairy["checked"] = true;
          } else {
            bookFairy["checked"] = false;
          }
        });
        this.setState({
          bookFairies: bookFairiesCopy
        });
      })
      .catch(error => {
        // api.handleError(response);
      });
  };

  handleBookFairyChange = supervisor => {
    const { bookFairies } = this.state;
    let bookFairiesCopy = cloneDeep(bookFairies);
    let isBookFairyUnderSupervisor = find(bookFairiesCopy, {
      key: supervisor.key
    });
    if (isBookFairyUnderSupervisor !== undefined) {
      isBookFairyUnderSupervisor.checked = isBookFairyUnderSupervisor.checked
        ? false
        : true;
      this.setState({
        bookFairies: bookFairiesCopy
      });
    }
  };

  handleSupervisorBookFairySave = () => {
    const { selectedSupervisor, bookFairies } = this.state;
    const { key } = this.props.match.params;
    const bookFairyKeys = reduce(
      bookFairies,
      (result, fairy) => {
        const { checked, key } = fairy;
        if (checked) {
          result.push(key);
        }
        return result;
      },
      []
    );
    if (isValid(bookFairyKeys) > 0) {
      const body = {
        supervisor: selectedSupervisor.value,
        fairies: JSON.stringify(bookFairyKeys)
      };
      api
        .addBookFairiesUndeSupervisor(key, body)
        .then(({ data }) => {
          api.handleSuccess(data);
        })
        .catch(({ response }) => {
          api.handleError(response);
        });
    }
  };

  handlePageChange = nextPage => {
    this.getNgoAdmins(nextPage);
  };

  handleSortChange = sortColumn => {
    const { id, desc } = sortColumn[0];
    let sortBy = desc ? id : `-${id}`;
    this.setState({
      sortBy
    });
    this.getNgoAdmins(0, sortBy);
  };

  render() {
    const {
      showDeleteAdminConfirmationModal,
      showDeactivateNgoConfirmationModal,
      showAddAdminModal,
      showEditNgoModal,
      adminDetails,
      addNgoAdminError,
      ngo,
      showLevelModal,
      levels,
      selectedLevel,
      supervisors,
      bookFairies,
      selectedSupervisor,
      editLevel,
      page,
      pages
    } = this.state;

    const { t } = this.props;

    const group = localStorage.getItem("group");
    return (
      <div>
        <NgoDetails
          ngo={ngo}
          adminDetails={adminDetails}
          onAddNgoAdmin={this.handleAddNgoAdmin}
          addNgoAdminError={addNgoAdminError}
          onDeactivateNgo={this.handleDeactivateNgo}
          onDeactivateNgoAdmin={this.handleDeactivateNgoAdmin}
          toggleDeactivateNgoConfirmationModal={
            this.toggleDeactivateNgoConfirmationModal
          }
          toggleDeleteAdminConfirmationModal={
            this.toggleDeleteAdminConfirmationModal
          }
          showDeleteAdminConfirmationModal={showDeleteAdminConfirmationModal}
          showDeactivateNgoConfirmationModal={
            showDeactivateNgoConfirmationModal
          }
          showAddAdminModal={showAddAdminModal}
          toggleAddAdminModal={this.toggleAddAdminModal}
          toggleEditNgoModal={this.toggleEditNgoModal}
          getNgoAdmins={this.getNgoAdmins}
          readAdmin={group === READ_ADMIN}
          toggleAddLevelModal={this.toggleAddLevelModal}
          toggleEditLevelModal={this.toggleEditLevelModal}
          showLevelModal={showLevelModal}
          getlevels={this.fetchLevels}
          levels={levels}
          levelData={selectedLevel}
          onLevelRowClick={this.handleLevelClick}
          isEditLevel={editLevel}
          t={t}
          supervisors={supervisors}
          bookFairies={bookFairies}
          onSupervisorChange={this.handleSupervisorChange}
          onBookFairyChange={this.handleBookFairyChange}
          onSupervisorBookFairySave={this.handleSupervisorBookFairySave}
          selectedSupervisor={selectedSupervisor}
          page={page}
          pages={pages}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
        />
        <AddNgoModal
          isOpen={showEditNgoModal}
          toggleModal={this.toggleEditNgoModal}
          onAddNgoInputChange={this.handleEditNgoInputChange}
          onAddNgo={this.handleEditNgo}
          modalData={ngo}
          updateNgo={this.handleUpdateNgo}
          t={t}
        />
      </div>
    );
  }

  toggleDeactivateNgoConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateNgoConfirmationModal: !p.showDeactivateNgoConfirmationModal
    }));
  };
  toggleDeleteAdminConfirmationModal = () => {
    this.setState(p => ({
      showDeleteAdminConfirmationModal: !p.showDeleteAdminConfirmationModal
    }));
  };
}

export default withRouter(NgoDetailsContainer);
