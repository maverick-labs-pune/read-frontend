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
import axios from "./axios";
import { toast } from "react-toastify";
import { formatResponse } from "./stringUtils";

const toFormData = data => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    fd.append(key, value);
  });
  return fd;
};

const login = data => {
  return axios.post("/login/", toFormData(data));
};

const handleError = error => {
  const { data } = error;
  if (data && data.message) {
    toast(formatResponse(data.message), {
      autoClose: 5000,
      type: toast.TYPE.ERROR
    });
  } else {
    toast("Something went wrong.", { autoClose: 5000, type: toast.TYPE.ERROR });
  }
};

const handleSuccess = success => {
  const { data } = success;
  if (data && data.message) {
    toast(data.message, {
      autoClose: 3000,
      type: toast.TYPE.SUCCESS
    });
  } else {
    toast("Success.", { autoClose: 3000, type: toast.TYPE.SUCCESS });
  }
};
const getNgos = isReadAdmin => {
  const url = isReadAdmin ? "/ngos?all=true" : "/ngos/";
  return axios.get(`${url}`);
};

const addNgo = data => {
  return axios.post("/ngos/", toFormData(data));
};

const getNgo = key => {
  return axios.get(`/ngos/${key}/`);
};

const updateNgo = (key, data) => {
  return axios.put(`/ngos/${key}/`, toFormData(data));
};

const deactivateNgo = key => {
  return axios.post(`/ngos/${key}/deactivate/`);
};

const deactivateNgos = data => {
  return axios.post(`/ngos/deactivate_ngos/`, data);
};

const getNgoAdmins = (key, page, sort) => {
  return axios.get(`/ngos/${key}/admins/?page=${page + 1}&sort=${sort}`);
};

const addUser = (key, data) => {
  return axios.post(`/ngos/${key}/add_user/`, toFormData(data));
};

const deactivateNgoAdmin = (key, data) => {
  return axios.post(`/ngos/${key}/deactivate_admin/`, toFormData(data));
};

const addBook = (key, data) => {
  return axios.post(`/ngos/${key}/add_book/`, toFormData(data));
};

const getBooks = (key, page, sortBy) => {
  return axios.get(`/ngos/${key}/books/?page=${page + 1}&sort=${sortBy}`);
};

const updateBook = (key, data) => {
  return axios.put(`/books/${key}/`, toFormData(data));
};

const deleteBooks = data => {
  return axios.post("/books/deactivate_book/", data);
};

const importBooks = (key, data) => {
  return axios.post(`/ngos/${key}/import_books/`, toFormData(data));
};

const exportBooks = key => {
  return axios.get(`/ngos/${key}/export_books/`);
};

const importSchools = (key, data) => {
  return axios.post(`/ngos/${key}/import_schools/`, toFormData(data));
};

const exportSchools = key => {
  return axios.get(`/ngos/${key}/export_schools/`);
};

const getSchools = (key, page, sortBy) => {
  return axios.get(`/ngos/${key}/schools/?page=${page + 1}&sort=${sortBy}`);
};

const getSchoolDropdown = key => {
  return axios.get(`/ngos/${key}/get_schools_dropdown/`);
};

const getSchoolMediums = () => {
  return axios.get("/schools/get_school_mediums");
};

const getSchoolTypes = () => {
  return axios.get("/schools/get_school_types");
};

const getSchoolCategories = () => {
  return axios.get("/schools/get_school_categories");
};

const addSchool = (key, data) => {
  return axios.post(`/ngos/${key}/add_school/`, toFormData(data));
};

const getSchool = key => {
  return axios.get(`/schools/${key}`);
};

const updateSchool = (key, data) => {
  return axios.put(`/schools/${key}/`, toFormData(data));
};

const deleteSchools = data => {
  return axios.post("/schools/deactivate_school/", data);
};

const getNGOUsers = (key, page, sortBy) => {
  return axios.get(`/ngos/${key}/users?page=${page + 1}&sort=${sortBy}`);
};

const deleteUsers = data => {
  return axios.post(`/users/deactivate_user/`, data);
};

const updateUser = (key, data) => {
  return axios.put(`/users/${key}/`, data);
};

const importUsers = (key, data) => {
  return axios.post(`/ngos/${key}/import_users/`, toFormData(data));
};

const exportUsers = (key, data) => {
  return axios.get(`/ngos/${key}/export_users/`, data);
};

const getStandards = () => {
  return axios.get("/standards");
};

const addClassroom = (key, data) => {
  return axios.post(`/ngos/${key}/add_classroom/`, toFormData(data));
};

const getSchoolClassrooms = (key, school) => {
  return axios.get(`/ngos/${key}/get_school_classrooms?school=${school}`);
};

const deleteClassroom = key => {
  return axios.post(`/classrooms/${key}/deactivate_classroom/`);
};

const getAcademicYear = () => {
  return axios.get("/academic_years/");
};

const addStudent = (key, body) => {
  return axios.post(`/classrooms/${key}/add_student/`, body);
};

const getStudents = (key, page, sortBy, desc) => {
  return axios.get(
    `/ngos/${key}/students/?page=${page + 1}&sort=${sortBy}&order=${desc}`
  );
};

const getStudentDetails = key => {
  return axios.get(`/students/${key}`);
};

const updateStudent = (key, data) => {
  return axios.put(`/students/${key}/`, toFormData(data));
};

const deleteStudents = data => {
  return axios.post("/students/deactivate_students/", data);
};

const importStudents = (key, data) => {
  return axios.post(`/classrooms/${key}/import_students/`, toFormData(data));
};

const exportStudents = (key, academic_year_key) => {
  return axios.get(
    `/classrooms/${key}/export_students/?academic_year=${academic_year_key}`
  );
};

const markStudentAsDropout = (key, body) => {
  return axios.post(`/students/${key}/mark_as_dropout/`, toFormData(body));
};

const bookFairies = key => {
  return axios.get(`/ngos/${key}/book_fairies`);
};

const addSession = (key, data) => {
  return axios.post(`/ngos/${key}/add_session/`, toFormData(data));
};

const searchInNgo = (key, data, page) => {
  return axios.post(`/ngos/${key}/search/?page=${page + 1}`, toFormData(data));
};

const sessions = (key, page, sort, orderBy) => {
  return axios.get(
    `/ngos/${key}/sessions/?page=${page + 1}&sort=${sort}&order=${orderBy}`
  );
};

const getSupervisorSessions = (key, page, sort, order) => {
  return axios.get(
    `/ngos/${key}/get_supervisor_sessions/?page=${page +
      1}&sort=${sort}&order=${order}`
  );
};

const readClassroomSessions = (ngo, key) => {
  return axios.get(`/read_sessions/${key}/session_classrooms?ngo=${ngo}`);
};

const readSessionBookFairies = (ngo, key) => {
  return axios.get(`/read_sessions/${key}/session_book_fairies?ngo=${ngo}`);
};

const getReadSession = key => {
  return axios.get(`/read_sessions/${key}/`);
};

const setLanguage = (key, data) => {
  return axios.post(`/users/${key}/set_language/`, toFormData(data));
};

const deleteReadSession = body => {
  return axios.post("/read_sessions/delete_sessions/", body);
};

const getBookFairyReadSessions = (ngo, type, page, sortBy, orderBy) => {
  return axios.get(
    `/ngos/${ngo}/book_fairy_sessions?page=${page +
      1}&type=${type}&sort=${sortBy}&order=${orderBy}`
  );
};

const getLevels = ngo => {
  return axios.get(`/ngos/${ngo}/get_levels/`);
};

const getStudentEvaluations = session => {
  return axios.get(`/read_sessions/${session}/get_student_evaluation`);
};

const getReadSessionBooks = ngo => {
  return axios.get(`/ngos/${ngo}/get_read_session_books`);
};

const evaluateStudent = (key, data) => {
  return axios.post(`/read_sessions/${key}/evaluate_students/`, data);
};

const getSupervisorSessionWithType = (key, type, page, sort, order) => {
  return axios.get(
    `/ngos/${key}/get_supervisor_sessions/?page=${page +
      1}&sort=${sort}&order=${order}&type=${type}`
  );
};
const getProfile = key => {
  return axios.get(`/users/${key}`);
};

const submitEvaluations = (key, data) => {
  return axios.post(`/read_sessions/${key}/submit_evaluations/`, data);
};

const markSessionAsVerified = key => {
  return axios.post(`/read_sessions/${key}/mark_session_as_verified/`);
};

const getClassroomStudentDetails = (key, acadmicYear) => {
  return axios.get(`/classrooms/${key}/students?academic_year=${acadmicYear}`);
};

const removeStudentFromClassroom = (key, data) => {
  return axios.post(`/classrooms/${key}/delete_student/`, data);
};

const getBookDetails = key => {
  return axios.get(`/books/${key}/`);
};

const getInventoryForBook = (key, page, sort) => {
  return axios.get(`/books/${key}/inventory?page=${page + 1}&sort=${sort}`);
};

const exportInventory = (ngo, book) => {
  return axios.get(`/ngos/${ngo}/export_inventory?book=${book}`);
};

const importBooksToInventory = (key, data) => {
  return axios.post(
    `/ngos/${key}/import_books_to_inventory/`,
    toFormData(data)
  );
};

const updateInventory = (key, data) => {
  return axios.put(`/inventory/${key}/`, toFormData(data));
};

const deleteInventory = data => {
  return axios.post("/inventory/deactivate_inventory_books/", toFormData(data));
};

const updateLevel = (key, data) => {
  return axios.put(`/levels/${key}/`, toFormData(data));
};

const getSupervisorBookFairies = (ngo, supervisor) => {
  return axios.get(
    `/ngos/${ngo}/get_book_fairy_under_supervisor?supervisor=${supervisor}`
  );
};

const supervisors = ngo => {
  return axios.get(`/ngos/${ngo}/supervisors/`);
};

const addBookFairiesUndeSupervisor = (ngo, data) => {
  return axios.post(
    `/ngos/${ngo}/add_book_fairies_under_supervisor/`,
    toFormData(data)
  );
};

const getCurrentAcademicyear = () => {
  return axios.get("/academic_years/get_current_academic_year/");
};

const searchBookBySerialNumber = (key, searchText) => {
  return axios.get(
    `/ngos/${key}/search_book_by_serial_number?serial_number=${searchText}`
  );
};

const addNoteToSession = (key, data) => {
  return axios.post(`/read_sessions/${key}/add_comment_on_session/`, data);
};

const getBookLevels = () => {
  return axios.get(`/book_levels/get_book_levels/`);
};

const generateQRCode = data => {
  return axios.post(`/books/generate_qr_code/`, toFormData(data));
};

const markSessionAsCancel = (key, body) => {
  return axios.post(
    `/read_sessions/${key}/mark_session_as_cancelled/`,
    toFormData(body)
  );
};

const resetPassword = (key, body) => {
  return axios.post(`/users/${key}/reset_password/`, body);
};

const isAuthenticated = () => {
  return axios.get(`/is_authenticated/`);
};

const getBookLendingEvaluation = session => {
  return axios.get(`/read_sessions/${session}/get_home_lending_books`);
};

const getForgotPasswordToken = body => {
  return axios.post("/get_forgot_password_token/", toFormData(body));
};

const isForgotPasswordTokenValid = token => {
  return axios.get(`/is_forgot_password_token_valid?token=${token}`);
};

const forgotPassword = body => {
  return axios.post("/forgot_password/", toFormData(body));
};

const logout = () => {
  return axios.post("/logout_view/");
};

const api = {
  handleError: handleError,
  handleSuccess,
  login: login,
  getNgos: getNgos,
  addNgo: addNgo,
  deactivateNgo: deactivateNgo,
  getNgoAdmins: getNgoAdmins,
  addUser: addUser,
  deactivateNgoAdmin: deactivateNgoAdmin,
  getNgo: getNgo,
  updateNgo: updateNgo,
  addBook,
  getBooks,
  updateBook,
  deleteBooks,
  importBooks,
  exportBooks,
  importSchools,
  exportSchools,
  getSchools,
  getSchoolCategories,
  getSchoolMediums,
  getSchoolTypes,
  addSchool,
  getSchool,
  updateSchool,
  deleteSchools,
  getNGOUsers,
  deleteUsers,
  updateUser,
  importUsers,
  exportUsers,
  getStandards,
  addClassroom,
  getSchoolClassrooms,
  deleteClassroom,
  getAcademicYear,
  addStudent,
  getStudents,
  getStudentDetails,
  updateStudent,
  deleteStudents,
  markStudentAsDropout,
  bookFairies,
  addSession,
  searchInNgo,
  sessions,
  readClassroomSessions,
  readSessionBookFairies,
  getReadSession,
  deactivateNgos,
  setLanguage,
  deleteReadSession,
  getBookFairyReadSessions,
  getLevels,
  getStudentEvaluations,
  getReadSessionBooks,
  evaluateStudent,
  getSupervisorSessionWithType,
  importStudents,
  exportStudents,
  getProfile,
  submitEvaluations,
  markSessionAsVerified,
  getClassroomStudentDetails,
  removeStudentFromClassroom,
  getBookDetails,
  getInventoryForBook,
  exportInventory,
  importBooksToInventory,
  updateInventory,
  deleteInventory,
  updateLevel,
  getSupervisorBookFairies,
  supervisors,
  addBookFairiesUndeSupervisor,
  getCurrentAcademicyear,
  searchBookBySerialNumber,
  getSupervisorSessions,
  addNoteToSession,
  getBookLevels,
  markSessionAsCancel,
  isAuthenticated,
  generateQRCode,
  getSchoolDropdown,
  getBookLendingEvaluation,
  resetPassword,
  getForgotPasswordToken,
  isForgotPasswordTokenValid,
  forgotPassword,
  logout
};

export default api;
