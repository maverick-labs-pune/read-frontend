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
import Select from "react-select";
import {
  AVAILABLE_LANGUAGES,
  MENU_CHANGE_LANGUAGE,
  MENU_RESET_PASSWORD
} from "../../utils/constants";
import i18n from "../../utils/i18n";
import find from "lodash/find";
import api from "../../utils/api";
import ResetPasswordContainer from "../ResetPassword/ResetPasswordContainer";
import { withRouter } from "react-router-dom";
import { isValidUser } from "../../utils/validations";

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: MENU_RESET_PASSWORD
    };
  }

  async componentDidMount() {
    let validUser = await isValidUser();
    if (!validUser) {
      this.props.history.push(`/login`);
      localStorage.clear();
    }
  }

  handleChangeLanguage = ({ value, label }) => {
    localStorage.setItem("SELECTED_LANGUAGE", value);
    i18n.changeLanguage(value);
    const userKey = localStorage.getItem("key");
    api
      .setLanguage(userKey, { selected_language: value })
      .then(({ data }) => {})
      .catch(error => {});
  };

  handleMenuChange = menu => {
    this.setState({
      selectedMenu: menu
    });
  };

  render() {
    const { selectedMenu } = this.state;
    let component = null;
    switch (selectedMenu) {
      case MENU_CHANGE_LANGUAGE:
        const selectedLanguage = localStorage.getItem("SELECTED_LANGUAGE");
        component = (
          <div>
            <h3>Change Language</h3>
            <div className="divider" />
            <div className="d-flex align-items-center mt20">
              <div className="mr20">Select Language</div>
              <Select
                className="w150"
                value={
                  find(AVAILABLE_LANGUAGES, { value: selectedLanguage }) ||
                  AVAILABLE_LANGUAGES[0]
                }
                onChange={this.handleChangeLanguage}
                options={AVAILABLE_LANGUAGES}
              />
            </div>
          </div>
        );
        break;
      case MENU_RESET_PASSWORD:
        component = <ResetPasswordContainer />;
        break;
      default:
        component = null;
        break;
    }

    return (
      <div className="row settings-container mt40">
        <div className="col-lg-3 col-md-3">
          <ul className="list-group">
            <li className="list-group-item font-weight-bold">Your Settings</li>
            <li
              className="list-group-item list-group-item-action"
              onClick={() => this.handleMenuChange(MENU_RESET_PASSWORD)}
              style={{ cursor: "pointer" }}
            >
              Reset Password
            </li>
            <li
              className="list-group-item list-group-item-action"
              onClick={() => this.handleMenuChange(MENU_CHANGE_LANGUAGE)}
              style={{ cursor: "pointer" }}
            >
              Change Language
            </li>
          </ul>
        </div>
        <div className="col-lg-9 col-md-9">{component}</div>
      </div>
    );
  }
}

export default withRouter(SettingsContainer);
