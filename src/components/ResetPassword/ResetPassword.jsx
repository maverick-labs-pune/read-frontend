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
import { Formik } from "formik";
import { validationSchema } from "../../utils/validationSchemas";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import { toast } from "react-toastify";
class ResetPassword extends Component {
  render() {
    const { isResetPasswordSuccess, onResetPasswordSuccess } = this.props;
    return (
      <div>
        <h3>Reset Password</h3>
        <div className="divider" />
        {isResetPasswordSuccess ? (
          <p>You password reset successfully.</p>
        ) : (
          <Formik
            initialValues={{}}
            validationSchema={validationSchema.ResetPasswordSchema}
            onSubmit={(values, actions) => {
              const key = localStorage.getItem("key");
              const body = { ...values };
              api
                .resetPassword(key, body)
                .then(({ data }) => {
                  onResetPasswordSuccess();
                  let isToast = toast.isActive("reset-password-toast");
                  if (isToast) {
                    toast.update("reset-password-toast", {
                      type: toast.TYPE.SUCCESS,
                      render: <div> Successfully changed </div>
                    });
                    toast.dismiss("reset-password-toast");
                  }
                })
                .catch(({ response }) => {
                  actions.resetForm();
                  api.handleError(response);
                });
            }}
            render={props => <ResetPasswordForm {...props} />}
          />
        )}
      </div>
    );
  }
}

export default ResetPassword;
