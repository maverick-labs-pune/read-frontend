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
import { SIGN_OUT } from "../../utils/constants";

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    };
    this.close = this.close.bind(this);
  }

  componentDidUpdate() {
    const { listOpen } = this.state;
    setTimeout(() => {
      if (listOpen) {
        window.addEventListener("click", this.close);
      } else {
        window.removeEventListener("click", this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.close);
  }

  close(timeOut) {
    this.setState({
      listOpen: false
    });
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  }

  render() {
    const { listOpen } = this.state;
    const firstName = localStorage.getItem("firstName");

    const { onItemClick } = this.props;

    return (
      <div className="dd-wrapper">
        <div className="col-1">
          <div className="dd-user-wrapper">
            Welcome <strong>{firstName}</strong>
          </div>
        </div>
        <div className="col-3">
          <div className="dd-header" onClick={() => this.toggleList()}>
            <div className="dd-header-title">
              <i className="fas fa-user-circle" />
            </div>
          </div>
          {listOpen && (
            <div className="dd-list" onClick={e => e.stopPropagation()}>
              {[{ text: "Your Profile", path: "/home/profile/" }].map(
                (item, i) => (
                  <div
                    className="item"
                    key={i}
                    onClick={() => {
                      this.close();
                      onItemClick(item);
                    }}
                  >
                    {item.text}
                  </div>
                )
              )}
              <div className="divider" />
              {[
                { text: "Settings", path: "/home/settings/" },
                { text: SIGN_OUT, path: "/login" }
              ].map((item, i) => (
                <div
                  className="item"
                  key={i}
                  onClick={() => {
                    this.close();
                    onItemClick(item);
                  }}
                >
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NavMenu;
