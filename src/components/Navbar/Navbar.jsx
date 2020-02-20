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
import NavItem from "./NavItem";
import NavMenu from "./NavMenu";
import includes from "lodash/includes";
import filter from "lodash/filter";
import { SIGN_OUT } from "../../utils/constants";
import { toast } from "react-toastify";
import { isValid } from "../../utils/stringUtils";
import api from "../../utils/api";

export const masterNavbarItems = [
  {
    key: "LABEL_SCHOOL",
    path: "/home/schools",
    linkText: "Schools",
    id: "schools",
    image: "fa fa-university"
  },
  {
    key: "LABEL_BOOK",
    path: "/home/books",
    linkText: "Books",
    id: "books",
    image: "fa fa-book"
  },
  {
    key: "LABEL_STUDENT",
    path: "/home/students",
    linkText: "Students",
    id: "students",
    image: "fa fa-graduation-cap"
  },
  {
    key: "LABEL_READ_SESSION",
    path: "/home/sessions",
    linkText: "Sessions",
    id: "read_sessions",
    image: "fa fa-calendar"
  },
  {
    key: "LABEL_USER",
    path: "/home/users",
    linkText: "Users",
    id: "users",
    image: "fa fa-users"
  },
  {
    key: "LABEL_NGO",
    path: `/home/ngos`,
    linkText: "NGO",
    id: "ngos",
    image: "fa fa-building"
  },
  {
    key: "LABEL_REPORT",
    path: "/home/reports",
    linkText: "Reports",
    id: "",
    image: "fa fa-graduation-cap"
  }
];

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedItemPath: null };
  }

  componentDidMount() {
    if (isValid(localStorage) > 1) {
      const storageItem = localStorage.getItem("SELECTED_NAV_BAR_ITEM");
      this.setState({
        selectedItemPath: storageItem || this.props.routes[0].path
      });
      this.props.history.listen((location, action) => {
        this.setState({ selectedItemPath: location.pathname });
        localStorage.setItem("SELECTED_NAV_BAR_ITEM", location.pathname);
      });
    } else this.props.history.push("/");
  }

  handleItemClick = item => {
    if (item.text === SIGN_OUT) {
      const isActiveToast = toast.isActive("reset-password-toast");
      if (isActiveToast) {
        toast.dismiss("reset-password-toast");
      }
      api
        .logout()
        .then(() => {
          localStorage.clear();
          this.props.history.push(`${item.path}`);
        })
        .catch(({ response }) => {
          api.handleError(response);
        });
    } else {
      this.setState({ selectedItemPath: item.path });
      localStorage.setItem("SELECTED_NAV_BAR_ITEM", item.path);
      this.props.history.push(`${item.path}`);
    }
  };

  render() {
    const { t } = this.props;
    const { selectedItemPath } = this.state;
    const allowedRoutes = filter(masterNavbarItems, value => {
      //check against current user permission.
      //if key is present then return true
      if (isValid(localStorage) > 1) {
        const permissions = JSON.parse(localStorage.getItem("permissions"));
        const permissionsKeys = Object.keys(permissions);
        const { id } = value;
        if (includes(permissionsKeys, id)) {
          return true;
        }
      } else this.props.history.push("/");
    });

    return (
      <div className="navbar row flex justify-content-center">
        {allowedRoutes.map((route, i) => {
          return (
            <div key={i}>
              <NavItem
                selected={selectedItemPath && route.path === selectedItemPath}
                onClick={() => this.handleItemClick(route)}
                key={i}
                image={route.image}
              >
                {t(`${route.key}`)}
              </NavItem>
            </div>
          );
        })}
        <NavMenu
          onItemClick={route => this.handleItemClick(route)}
          {...this.props}
        />
      </div>
    );
  }
}

export default Navbar;
