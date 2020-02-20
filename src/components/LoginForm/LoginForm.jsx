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
import "./LoginForm.scss";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

export class LoginForm extends Component {
  state = {};
  render() {
    const {
      errorMessage,
      onInputChange,
      onLoginKeyPress,
      onLoginClick,
      language,
      onLanguageChange,
      t
    } = this.props;
    return (
      <div className="login-container">
        <div>
          <Button primary className="round-button" onClick={onLanguageChange}>
            {language}
          </Button>
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <Input
              label={t("FIELD_LABEL_USER_USERNAME")}
              name="username"
              onChange={({ target }) => onInputChange(target)}
            />
            <Input
              label={t("FIELD_LABEL_USER_PASSWORD")}
              name="password"
              type="password"
              onChange={({ target }) => onInputChange(target)}
              onKeyPress={onLoginKeyPress}
            />
            <div className="row">
              <div className="col mt-1">
                <a href="/forgot_password/">Forgot password?</a>
              </div>
            </div>
            <div className="flex justify-content-center mt-2">
              <Button primary onClick={onLoginClick}>
                {t("LABEL_LOGIN")}
              </Button>
            </div>

            {errorMessage ? (
              <div className="text-danger flex justify-content-center mt-2">
                <strong>{errorMessage}!</strong>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  onInputChange: PropTypes.func,
  onLoginClick: PropTypes.func
};
