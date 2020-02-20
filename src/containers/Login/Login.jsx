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
import { LoginForm, Button } from "../../components";
import api from "../../utils/api";
import { isValidUsername, isValidPassword } from "./../../utils/validations";
import { getPermissions } from "../../utils/stringUtils";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import i18n from "../../utils/i18n";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      language: this.getSelectedLanguage()
    };
  }

  getSelectedLanguage = () => {
    const selectedLanguage = localStorage.getItem("SELECTED_LANGUAGE")
      ? localStorage.getItem("SELECTED_LANGUAGE")
      : i18n.language;
    return selectedLanguage === "mr_IN" ? "MR" : "EN";
  };

  componentDidMount() {
    localStorage.clear();
  }

  handleInputChange = ({ name, value }) => {
    this.setState({ [name]: value, errorMessage: null });
  };

  handleResetPasswordToast = () => {
    const component = (
      <div>
        <h6>Please change your password...</h6>
        <Button onClick={() => this.props.history.push("/home/settings")}>
          Change Now
        </Button>
      </div>
    );
    toast(component, {
      type: toast.TYPE.INFO,
      draggable: false,
      toastId: "reset-password-toast",
      position: "top-center",
      autoClose: false,
      closeButton: false,
      closeOnClick: false
    });
  };

  login = () => {
    const { username, password } = this.state;
    const validUsername = isValidUsername(username);
    const validPassword = isValidPassword(password);
    const { t } = this.props;
    if (validUsername && validPassword) {
      this.setState({
        errors: [],
        errorMessage: ""
      });
      var loginData = { username: username, password: password };
      api
        .login(loginData)
        .then(({ data }) => {
          const {
            permissions,
            group,
            ngo,
            username,
            key,
            // language,
            ngo_name,
            is_reset_password,
            first_name
          } = data;
          const permission = getPermissions(permissions, group);
          localStorage.setItem("permissions", JSON.stringify(permission));
          localStorage.setItem("group", group);
          localStorage.setItem("ngo", ngo);
          localStorage.setItem("ngoName", ngo_name);
          localStorage.setItem("username", username);
          localStorage.setItem("key", key);
          // localStorage.setItem("SELECTED_LANGUAGE", language);
          localStorage.setItem("isResetPassword", is_reset_password);
          localStorage.setItem("loginTime", moment());
          localStorage.setItem("firstName", first_name);
          if (is_reset_password && group !== "READ Admin") {
            this.handleResetPasswordToast();
          }
          this.props.history.push("/home");
        })
        .catch(error => {
          const { data } = error.response;
          if (data && data.message) {
            this.setState({
              errors: ["server"],
              errorMessage: t(`${data.message}`)
            });
          } else {
            this.setState({
              errors: ["server"],
              errorMessage: "Something went wrong. Try again."
            });
          }
        });
    } else {
      const errors = [];
      if (!validUsername) {
        errors.push("username");
      }
      if (!validPassword) {
        errors.push("password");
      }
      this.setState({
        errorMessage: "Username and password length should be greater than 5"
      });
    }
  };

  handleLoginKeyPress = event => {
    if (event.key === "Enter") {
      this.login();
    }
  };

  handleLoginClick = event => {
    this.login();
  };

  handleLanguageChange = event => {
    const {
      target: { innerText }
    } = event;
    const { language } = this.state;
    const lang = innerText === "EN" ? "mr_IN" : "en_IN";
    i18n.changeLanguage(lang);
    localStorage.setItem("SELECTED_LANGUAGE", lang);
    const selectedLanguage = language === "EN" ? "MR" : "EN";
    this.setState({
      language: selectedLanguage
    });
  };

  render() {
    const { t } = this.props;
    const { language } = this.state;
    return (
      <LoginForm
        onInputChange={this.handleInputChange}
        onLoginClick={this.handleLoginClick}
        onLoginKeyPress={this.handleLoginKeyPress}
        errorMessage={this.state.errorMessage}
        onLanguageChange={this.handleLanguageChange}
        language={language}
        t={t}
      />
    );
  }
}

export default withRouter(Login);
