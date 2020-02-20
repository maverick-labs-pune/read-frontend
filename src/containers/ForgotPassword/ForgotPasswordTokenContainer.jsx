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
import { isValid } from "../../utils/stringUtils";
import api from "../../utils/api";
import ForgotPasswordToken from "../../components/ForgotPassword/ForgotPasswordToken";
import { withRouter } from "react-router-dom";

class ForgotPasswordTokenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTokenValid: false
    };
  }

  componentDidMount = () => {
    const { token } = this.props.match.params;
    if (isValid(token) > 0) {
      api
        .isForgotPasswordTokenValid(token)
        .then(({ data }) => {
          this.setState({
            isTokenValid: true
          });
        })
        .catch(({ response }) => {
          api.handleError(response);
        });
    }
  };

  handleSuccess = () => {
    this.props.history.push("/login");
  };
  render() {
    const { isTokenValid } = this.state;
    const { token } = this.props.match.params;
    return (
      <ForgotPasswordToken
        isTokenValid={isTokenValid}
        token={token}
        onSuccess={this.handleSuccess}
      />
    );
  }
}

export default withRouter(ForgotPasswordTokenContainer);
