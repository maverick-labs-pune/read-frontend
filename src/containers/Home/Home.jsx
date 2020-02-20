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
import Navbar from "./../../components/Navbar/Navbar";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { getRoutes } from "./../../utils/routes";
import SettingsContainer from "./../Settings/SettingsContainer";
import ProfileContainer from "./../Profile/ProfileContainer";
import { isValid } from "../../utils/stringUtils";

// const ROLE = ["READ_ADMIN", "NGO_ADMIN", "SUPERVISOR"];

class Home extends Component {
  render() {
    const routes = getRoutes();

    return (
      <div className="container-fluid">
        <Navbar routes={routes} {...this.props} />
        <Switch>
          {routes.map((route, i) => {
            return (
              <Route
                key={i}
                exact
                path={route.path}
                render={() =>
                  React.createElement(route.component, { ...this.props })
                }
              />
            );
          })}
          <Route path="/home/settings" component={SettingsContainer} />
          <Route
            path="/home/profile/"
            render={() =>
              React.createElement(ProfileContainer, { ...this.props })
            }
          />

          <Route
            path="/home/"
            render={() => (
              <Redirect
                to={
                  isValid(routes) > 0
                    ? routes[0].path
                    : this.props.history.push("/login")
                }
              />
            )}
          />

          <Route render={() => <Redirect to="/home/" />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Home);
