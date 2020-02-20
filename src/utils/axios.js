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
import axios from "axios";
import { API_URL, AVAILABLE_LANGUAGES } from "./constants";

const instance = axios.create({
  baseURL: API_URL
});

instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
instance.defaults.xsrfCookieName = "csrftoken";
instance.defaults.withCredentials = true;
instance.all = axios.all;
instance.spread = axios.spread;

instance.interceptors.request.use(config => {
  config.headers.common["Accept-Language"] =
    localStorage.getItem("SELECTED_LANGUAGE") || AVAILABLE_LANGUAGES[0].value;
  return config;
});
instance.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      window.location = "/login";
      localStorage.clear();
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
