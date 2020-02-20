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
export const API_URL = process.env.REACT_APP_API_URL;

export const AVAILABLE_LANGUAGES = [
  { label: "English", value: "en_IN" },
  { label: "मराठी", value: "mr_IN" }
];

export const Ngo_Key = localStorage.getItem("ngo");

export const SESSION_DURATION = 1;

export const LOCALE_MARATHI = "mr_IN";
export const LOCALE_ENGLISH = "en_IN";

export const SIGN_OUT = "Sign Out";
export const NGO_ADMIN = "NGO Admin";
export const READ_ADMIN = "READ Admin";
export const BOOK_FAIRY = "Book Fairy";
export const SUPERVISOR = "Supervisor";
export const FUNDER = "Funder";

export const EVALUATED = "evaluated";
export const NON_EVALUATED = "non evaluated";

const MALE = "MALE";
const FEMALE = "FEMALE";
export const IMPORT_FILE_ERROR = "Please select file to import.";

export const REGULAR = "READ_SESSION_REGULAR";
export const EVALUATION = "READ_SESSION_EVALUATION";
export const BOOK_LENDING = "READ_SESSION_BOOK_LENDING";

export const READ_SESSION_PENDING = "PENDING";
export const READ_SESSION_EVALUATED_NOT_VERIFIED = "EVALUATED_NOT_VERIFIED";
export const READ_SESSION_UPCOMING = "UPCOMING";

export const DEFAULT_TABLE_PAGE_SIZE = 10;
export const MINIMUM_TABLE_ROWS = 0;

export const NGO_USER_TYPE = [
  { value: NGO_ADMIN, label: NGO_ADMIN },
  { value: SUPERVISOR, label: SUPERVISOR },
  { value: BOOK_FAIRY, label: BOOK_FAIRY },
  { value: FUNDER, label: FUNDER }
];

export const GENDER = [
  { value: MALE, label: MALE },
  { value: FEMALE, label: FEMALE }
];

export const READ_SESSION_TYPE = [
  { value: REGULAR, label: REGULAR },
  { value: EVALUATION, label: EVALUATION }
];

const INVENTORY_STATUS_GOOD = "Good";
const INVENTORY_STATUS_LOST = "Lost";
const INVENTORY_STATUS_DAMAGED = "Damaged";

export const INVENTORY_STATUS = [
  { value: "go", label: INVENTORY_STATUS_GOOD },
  { value: "lo", label: INVENTORY_STATUS_LOST },
  { value: "da", label: INVENTORY_STATUS_DAMAGED }
];

// TODO does label will have localisation support??
export const WEEKDAYS = [
  { value: 1, label: "Monday", key: 1 },
  { value: 2, label: "Tuesday", key: 2 },
  { value: 3, label: "Wednesday", key: 3 },
  { value: 4, label: "Thursday", key: 4 },
  { value: 5, label: "Friday", key: 5 },
  { value: 6, label: "Saturday", key: 6 },
  { value: 7, label: "Sunday", key: 7 }
];

export const RADIO_RECURRING = "session-radio-recurring";
export const RADIO_ONE_TIME = "session-radio-one-time";

export const NGO_SCHOOL_SEARCH = "school";
export const NGO_BOOK_SEARCH = "book";
export const NGO_STUDENT_SEARCH = "student";
export const NGO_USER_SEARCH = "user";
export const NGO_SESSION_SEARCH = "session";

export const RESPONSE_STATUS_400 = 400;
export const SESSION_DATE_FORMAT = "ddd MMM Do YYYY, h:mm a";

export const BOOK_FILE_EXPORT_NAME = "books";
export const BOOK_QRCODE_EXPORT_NAME = "books_qrcode";
export const INVENTORY_FILE_EXPORT_NAME = "inventory";
export const CLASSROOM_STUDENT_FILE_EXPORT_NAME = "classroom_students";
export const USER_FILE_EXPORT_NAME = "users";
export const SCHOOL_FILE_EXPORT_NAME = "schools";
export const EXPORT_XLSX_DATE_FORMAT = "DD-MM-YYYY-h-mm";
export const DEFAULT_SORT_NAME = "name";
export const DEFAULT_SORT_FIRST_NAME = "first_name";
export const DEFAULT_SORT_SESSION_DATE = "dateTime";
export const DEFAULT_SORT_INVENTORY_SERIAL_NUMBER = "serial_number";

export const SUPERVISOR_SESSION = "supervisor_session";
export const SUPERVISOR_EVALUATED_SESSION = "supervisor_evaluated_session";
export const SUPERVISOR_NON_EVALUATED_SESSION =
  "supervisor_non_evaluated_session";

export const BOOK_FAIRY_PENDING_SESSIONS = "book_fairy_pending";
export const BOOK_FAIRY_UPCOMING_SESSIONS = "book_fairy_upcoming";
export const BOOK_FAIRY_EVALUATED_SESSIONS = "book_fairy_evaluated";

export const MENU_CHANGE_LANGUAGE = "change_language";
export const MENU_RESET_PASSWORD = "reset_password";
