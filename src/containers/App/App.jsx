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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from "../Login/Login";
import Home from "../Home/Home";
import { withNamespaces } from "react-i18next";
import "./../../utils/i18n";
import "./../../utils/extension";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import QRCode from "../QRCode/QRCode";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";
import ForgotPasswordContainer from "../ForgotPassword/ForgotPasswordContainer";
import ForgotPasswordTokenContainer from "../ForgotPassword/ForgotPasswordTokenContainer";

class App extends Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <Router>
          <Switch>
            <Route
              exact
              path="/login"
              render={() => <Login {...this.props} />}
            />
            <Route exact path="/" render={() => <Redirect to="login" />} />

            <Route path="/home" render={() => <Home {...this.props} />} />

            <Route
              exact
              path="/qrcode"
              render={() => <QRCode {...this.props} />}
            />
            <Route
              exact
              path="/privacy_policy"
              render={() => <PrivacyPolicy {...this.props} />}
            />

            <Route
              exact
              path="/forgot_password/"
              render={() => <ForgotPasswordContainer {...this.props} />}
            />
            <Route
              exact
              path="/forgot_password/:token"
              render={() => <ForgotPasswordTokenContainer {...this.props} />}
            />
            <Route render={() => <Redirect to="home" />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withNamespaces()(App);
