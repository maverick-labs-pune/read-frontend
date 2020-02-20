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
import { READ_ADMIN, BOOK_FAIRY, SUPERVISOR } from "./constants";
import toString from "lodash/toString";
import join from "lodash/join";
import capitalize from "lodash/capitalize";
import forEach from "lodash/forEach";
import upperCase from "lodash/upperCase";

export const getPermissions = (data, group) => {
  let permissions = {};
  forEach(data, item => {
    let permissionArr = item.split(".");
    let key = permissionArr[0];
    let value = permissionArr[1];
    (permissions[key] || (permissions[key] = [])).push(value);
  });

  // Removing users nav item from navbar routes
  if (group === READ_ADMIN || group === BOOK_FAIRY || group === SUPERVISOR) {
    delete permissions["users"];
  }

  // Removing books nav item from navbar routes
  if (group === BOOK_FAIRY) {
    delete permissions["books"];
  }
  return permissions;
};

export const capitalizeString = message => {
  return capitalize(message);
};

export const toUpperCase = message => {
  return upperCase(message);
};

export const formatResponse = response => {
  let message = [];
  if (typeof response === "object") {
    let responseKeys = Object.keys(response);
    responseKeys.forEach(item => {
      message.push(`${item} ${toString(response[item])}`);
    });
    return join(message, " ");
  } else {
    return toString(response);
  }
};

export const parseErrorResponse = response => {
  let errors = {};
  if (typeof response === "object") {
    let responseKeys = Object.keys(response);
    forEach(responseKeys, item => {
      errors[item] = toString(response[item]);
    });
  }
  return errors;
};

export const isValid = data => {
  if (data === null) return 0;
  if (typeof data === "object") return Object.keys(data).length;
  if (typeof data === "string") return data.length;
};

export const removeNullValues = ({ ...item }) => {
  forEach(item, (value, key) => {
    if (value === null) delete item[key];
  });
  return item;
};

export const humanize = str => {
  var frags = str.split("_");
  forEach(frags, (frag, index) => {
    frags[index] = frags[index].charAt(0).toUpperCase() + frags[index].slice(1);
  });

  return frags.join(" ");
};
