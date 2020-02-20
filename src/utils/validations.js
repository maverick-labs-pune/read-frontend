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
import moment from "moment";
import api from "./api";
import { SESSION_DURATION } from "./constants";

export const isValidUsername = username => {
  return username && username.length >= 4;
};

export const isValidPassword = password => {
  return password && password.length >= 5;
};

export const isValidUser = async () => {
  const loginTime = moment(localStorage.getItem("loginTime"));
  const curentTime = moment();
  let laterTime = moment(loginTime).add(SESSION_DURATION, "hour");

  if (moment(curentTime).isBefore(moment(laterTime))) {
    return true;
  } else if (moment(curentTime).isAfter(moment(laterTime))) {
    let result = await checkAuth();
    return result;
  } else {
    return false;
  }
};

export const checkAuth = async () => {
  let { data } = await api.isAuthenticated();
  return data.is_authenticated;
};
