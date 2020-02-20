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
import NgoTable from "../../components/ItemTables/NgoTable";
import NgoActions from "../../components/Actions/NgoActions";
import AddNgoModal from "../../components/AddEntityModals/AddNgoModal";
import api from "./../../utils/api";
import reduce from "lodash/reduce";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { withRouter } from "react-router-dom";
import { READ_ADMIN } from "../../utils/constants";
import { isValidUser } from "../../utils/validations";

class NgoListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ngoList: [],
      filteredNgoList: [],
      appliedFilters: [],
      checkedNgos: [],
      showAddNgoModal: false,
      saveNgoModalData: { name: "", address: "" },
      showFilters: false,
      showDeactivateNgoConfirmationModal: false,
      loading: true
    };
  }

  async componentDidMount() {
    const group = localStorage.getItem("group");
    const ngo = localStorage.getItem("ngo");
    const isReadAdmin = group === READ_ADMIN;

    let validUser = await isValidUser();
    if (validUser) {
      if (!isReadAdmin) {
        this.props.history.push(`/home/ngos/${ngo}`);
      } else {
        api
          .getNgos(isReadAdmin)
          .then(({ data }) => {
            this.setState({
              ngoList: data,
              filteredNgoList: data,
              loading: false
            });
          })
          .catch(error => {
            this.setState({ loading: false });
            api.handleError(error);
          });
      }
    } else {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  /******************************************
   * Delete NGO related callbacks START
   *****************************************/
  handleDeleteNgo = () => {
    const { checkedNgos } = this.state;
    const ngoKeys = reduce(
      checkedNgos,
      (result, value) => {
        result.push(value.key);
        return result;
      },
      []
    );

    let keys = JSON.stringify(ngoKeys);
    api
      .deactivateNgos({ keys })
      .then(({ data }) => {
        this.setState({
          checkedNgos: []
        });
        this.toggleDeactivateNgoConfirmationModal();
        this.getNgos();
        api.handleSuccess(data);
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };
  handleNgoCheckboxToggle = ngo => {
    const { checkedNgos } = this.state;
    const updatedNgos = checkedNgos.addOrUpdate(ngo);
    this.setState({ checkedNgos: updatedNgos });
  };

  /******************************************
   * Delete NGO related callbacks END
   *****************************************/

  /******************************************
   * Add NGO related callbacks START
   *****************************************/
  handleAddNgo = data => {
    // api.
  };
  toggleAddNgoModal = () => {
    this.setState(p => ({ showAddNgoModal: !p.showAddNgoModal }));
  };
  handleAddNgoInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  /******************************************
   * Add NGO callbacks END
   *****************************************/

  /******************************************
   * filters and related callbacks START
   *****************************************/
  handleFiltersChange = () => {
    const { allNgos, appliedFilters } = this.state;
    const filteredData = this._filterData(allNgos, appliedFilters);
    this.setState({ filteredNgoList: filteredData });
  };

  handleToggleFiltersView = () => {
    this.setState(p => ({ showFilters: !p.showFilters }));
  };

  /*****************************************
   * Filters and related callbacks END
   *****************************************/

  getNgos = () => {
    const group = localStorage.getItem("group");
    const isReadAdmin = group === READ_ADMIN;
    api
      .getNgos(isReadAdmin)
      .then(({ data }) => {
        this.setState({ ngoList: data, filteredNgoList: data });
      })
      .catch(({ response }) => {
        api.handleError(response);
      });
  };

  toggleDeactivateNgoConfirmationModal = () => {
    this.setState(p => ({
      showDeactivateNgoConfirmationModal: !p.showDeactivateNgoConfirmationModal
    }));
  };

  render() {
    const {
      showAddNgoModal,
      checkedNgos,
      saveNgoModalData,
      // showFilters,
      filteredNgoList,
      showDeactivateNgoConfirmationModal,
      loading
    } = this.state;

    const { history, t } = this.props;

    const group = localStorage.getItem("group");

    let NGOActionComponent = null;
    if (group === READ_ADMIN) {
      NGOActionComponent = (
        <NgoActions
          checkedNgos={checkedNgos}
          onToggleFilters={this.handleToggleFiltersView}
          toggleAddNgoModal={this.toggleAddNgoModal}
          onDeleteNGOs={this.toggleDeactivateNgoConfirmationModal}
          t={t}
        />
      );
    }
    return (
      <div className="container-fluid">
        {NGOActionComponent}
        <NgoTable
          ngos={filteredNgoList}
          onNgoCheckboxToggle={this.handleNgoCheckboxToggle}
          checkedNgos={checkedNgos}
          loading={loading}
          showCheckboxes={group === READ_ADMIN}
          history={history}
          t={t}
        />

        <AddNgoModal
          isOpen={showAddNgoModal}
          toggleModal={this.toggleAddNgoModal}
          onAddNgoInputChange={this.handleAddNgoInputChange}
          onAddNgo={this.handleAddNgo}
          saveNgoModalData={saveNgoModalData}
          getNgos={this.getNgos}
          modalData={{}}
          t={t}
        />
        <ConfirmationModal
          isOpen={showDeactivateNgoConfirmationModal}
          title={"Deactivate selected NGOs?"}
          onPositiveAction={this.handleDeleteNgo}
          toggleModal={this.toggleDeactivateNgoConfirmationModal}
        />
      </div>
    );
  }

  _filterData = (ngos, filters) => {
    //logic to filter data based on selected parameters
    return ngos;
  };
}

export default withRouter(NgoListContainer);
