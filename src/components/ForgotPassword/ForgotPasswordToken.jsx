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
import "./ForgotPassword.scss";
import { validationSchema } from "../../utils/validationSchemas";
import { Formik } from "formik";
import api from "../../utils/api";
import ForgotPasswordTokenForm from "../Forms/ForgotPasswordTokenForm";

class ForgotPasswordToken extends Component {
  render() {
    const { isTokenValid, token, onSuccess } = this.props;
    return (
      <div className="forget-password-container">
        <div className="forget-password-form-container">
          <div className="forget-password-form">
            {isTokenValid ? (
              <Formik
                initialValues={{}}
                validationSchema={validationSchema.ForgotPasswordTokenSchema}
                onSubmit={(values, actions) => {
                  const body = { token, password: values.new_password };
                  api
                    .forgotPassword(body)
                    .then(({ data }) => {
                      api.handleSuccess(data);
                      onSuccess();
                    })
                    .catch(({ response }) => {
                      api.handleError(response);
                      actions.setSubmitting(false);
                    });
                }}
                render={props => <ForgotPasswordTokenForm {...props} />}
              />
            ) : (
              <h5 className="text-center text-dark">
                Token does not exist/expired/not valid.
              </h5>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordToken;
