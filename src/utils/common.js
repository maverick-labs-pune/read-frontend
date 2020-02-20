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
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import { humanize } from "./stringUtils";
import moment from "moment";
import find from "lodash/find";
import {
  BOOK_FILE_EXPORT_NAME,
  INVENTORY_FILE_EXPORT_NAME,
  CLASSROOM_STUDENT_FILE_EXPORT_NAME,
  SCHOOL_FILE_EXPORT_NAME,
  USER_FILE_EXPORT_NAME,
  EXPORT_XLSX_DATE_FORMAT,
  BOOK_QRCODE_EXPORT_NAME
} from "./constants";

const isArray = function(item) {
  return !!item && item.constructor === Array;
};

const isObject = function(item) {
  return !!item && item.constructor === Object;
};

export const mapModelDataWithImportErrors = (modelData, errorData) => {
  let isError = false;
  let result = cloneDeep(modelData);
  forEach(errorData, errorDictionary => {
    forEach(errorDictionary, (modelErrorDictionary, rowNo) => {
      let model = find(result, (item, rowNum) => {
        let row = rowNum + 1;
        if (parseInt(rowNo) === row) {
          return item;
        }
      });
      if (model !== undefined) {
        let modelErrorArray = [];
        forEach(modelErrorDictionary, (error, errorKey) => {
          let errorField = "";
          if (isArray(error)) {
            errorField = humanize(errorKey);
            modelErrorArray.push(`${errorField} : ${error}`);
          }
          if (isObject(error)) {
            forEach(error, (value, key) => {
              errorField = humanize(key);
              modelErrorArray.push(`${errorField} : ${value}`);
            });
          }
        });
        model.error = `${modelErrorArray}`;
        isError = true;
      }
    });
  });

  return { error: isError, result };
};

export const formatFileExportNames = (type, ngo, other) => {
  let fileName = null;
  switch (type) {
    case BOOK_FILE_EXPORT_NAME:
      fileName = `${ngo}-books-${moment().format(
        EXPORT_XLSX_DATE_FORMAT
      )}.xlsx`;
      break;
    case INVENTORY_FILE_EXPORT_NAME:
      fileName = `${other}-${moment().format(EXPORT_XLSX_DATE_FORMAT)}.xlsx`;
      break;
    case CLASSROOM_STUDENT_FILE_EXPORT_NAME:
      fileName = `${other}-${moment().format(EXPORT_XLSX_DATE_FORMAT)}.xlsx`;
      break;
    case SCHOOL_FILE_EXPORT_NAME:
      fileName = `${ngo}-schools-${moment().format(
        EXPORT_XLSX_DATE_FORMAT
      )}.xlsx`;
      break;
    case USER_FILE_EXPORT_NAME:
      fileName = `${ngo}-users-${moment().format(
        EXPORT_XLSX_DATE_FORMAT
      )}.xlsx`;
      break;
    case BOOK_QRCODE_EXPORT_NAME:
      fileName = `${other}-qrcode-${moment().format(
        EXPORT_XLSX_DATE_FORMAT
      )}.pdf`;
      break;
    default:
      fileName = "download.xlsx";
  }
  return fileName;
};
