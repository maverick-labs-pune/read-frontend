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
import ForgotPasswordForm from "../Forms/ForgotPasswordForm";
import api from "../../utils/api";
import { RESPONSE_STATUS_400 } from "../../utils/constants";

class ForgotPassword extends Component {
  render() {
    const { onForgotPasswordSuccess, isForgotPasswordSuccess, t } = this.props;
    return (
      <div className="forget-password-container">
        <div className="forget-password-form-container">
          <div className="forget-password-form">
            {!isForgotPasswordSuccess ? (
              <div>
                <p className="text-center">
                  Please enter your email. A link will be sent to you with
                  instructions to reset your password.
                </p>
                <Formik
                  initialValues={{}}
                  validationSchema={validationSchema.ForgotPasswordSchema}
                  onSubmit={(values, actions) => {
                    const body = { ...values };
                    api
                      .getForgotPasswordToken(body)
                      .then(({ data }) => {
                        onForgotPasswordSuccess();
                      })
                      .catch(({ response }) => {
                        if (response.status === RESPONSE_STATUS_400) {
                          api.handleError(response);
                        } else {
                          const { message } = response.data;
                          actions.setErrors({ email: message });
                        }
                        actions.setSubmitting(false);
                      });
                  }}
                  render={props => <ForgotPasswordForm t={t} {...props} />}
                />
              </div>
            ) : (
              <p className="text-center">Please check your email</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
