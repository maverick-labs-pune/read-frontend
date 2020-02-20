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
import * as Yup from "yup";
import { isValid } from "./stringUtils";

const NgoSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  address: Yup.string()
    .min(2, "Too Short!")
    .max(200, "Too Long!")
    .required("Required")
});

const AddBookSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

const AddSchoolSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  address: Yup.string()
    .min(2, "Too Short!")
    .max(300, "Too Long!")
    .required("Required"),
  pin_code: Yup.number()
    .positive("Pin code should be positive")
    .integer("Value should be integer")
    .typeError("Pincode should be number")
    .required("Required")
});

const AddNgoAdmin = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  username: Yup.string()
    .min(2, "Too Short!")
    .max(150, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(5, "Too Short!")
    .max(20, "Too Long!")
    .required("Required")
});

const AddStudentSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
  mother_tongue: Yup.string()
    .min(2, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
  address: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  birth_date: Yup.date()
    .typeError("Invalid date")
    .required("Required"),
  gender: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required")
    .nullable(true),
  school: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  classroom: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  academic_year: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required")
});

const AddUserSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  username: Yup.string()
    .min(5, "Too Short!")
    .max(150, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(5, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .nullable()
});

const AddUserNoEmailSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  username: Yup.string()
    .min(5, "Too Short!")
    .max(150, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(5, "Too Short!")
    .max(20, "Too Long!")
    .required("Required")
});

const UpdateUserSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  username: Yup.string()
    .min(5, "Too Short!")
    .max(150, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .nullable()
});

const UpdateBookfairyUserSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  username: Yup.string()
    .min(5, "Too Short!")
    .max(150, "Too Long!")
    .required("Required")
});

const AddSessionSchema = Yup.object().shape({
  school: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  classroom: Yup.array()
    .min(1, "Pick at least 1 classroom")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),
  book_fairy: Yup.array()
    .min(1, "Pick at least 1 book fairy")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),
  academic_year: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  type: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  start_time: Yup.date()
    .typeError("Invalid Start Time")
    .required("Required"),
  end_time: Yup.date()
    .typeError("Invalid End Time")
    .required("Required")
});

const oneTimeSessionValidationSchema = Yup.object().shape({
  school: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  classroom: Yup.array()
    .min(1, "Pick at least 1 classroom")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),
  book_fairy: Yup.array()
    .min(1, "Pick at least 1 book fairy")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),
  academic_year: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  type: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  one_time_date: Yup.date()
    .typeError("Invalid Start Time")
    .required("Required"),
  start_time: Yup.date()
    .typeError("Invalid Start Time")
    .required("Required"),
  end_time: Yup.date()
    .typeError("Invalid End Time")
    .required("Required")
});

const recurringSessionValidationSchema = Yup.object().shape({
  school: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  classroom: Yup.array()
    .min(1, "Pick at least 1 classroom")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),

  recurring_date: Yup.array()
    .min(1, "Pick at least 1 day")
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required()
      })
    )
    .required("Required"),
  start_date_recurring: Yup.date()
    .typeError("Invalid date")
    .required("Required"),

  end_date_recurring: Yup.date()
    .typeError("Invalid date")
    .required("Required"),

  book_fairy: Yup.array()
    .min(1, "Pick at least 1 book fairy")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .required("Required"),
  academic_year: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  type: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  start_time: Yup.date()
    .typeError("Invalid Start Time")
    .required("Required"),
  end_time: Yup.date()
    .typeError("Invalid End Time")
    .required("Required")
});

const AddInventorySchema = Yup.object().shape({
  status: Yup.object()
    .test("react-select-test", "Required", value => {
      return isValid(value) > 0 ? true : false;
    })
    .required("Required"),
  serial_number: Yup.string().required("Required")
});

const AddLevelSchema = Yup.object().shape({
  rank: Yup.number()
    .positive("Rank should be positive")
    .integer("Rank should be integer")
    .typeError("Rank should be number")
    .required("Required"),
  mr_in: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  en_in: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

const CancelSessionSchema = Yup.object().shape({
  comments: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

const ResetPasswordSchema = Yup.object().shape({
  old_password: Yup.string()
    .required("Required")
    .min(4, "Too Short!")
    .max(10, "Too Long!"),
  new_password: Yup.string()
    .required("Required")
    .min(4, "Too Short!")
    .max(10, "Too Long!"),
  confirm_password: Yup.string()
    .required("Required")
    .test(
      "passwords-match",
      "New password does not match with confirm password ",
      function(value) {
        return this.parent.new_password === value;
      }
    )
});

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Required")
    .email("Invalid email")
});

const ForgotPasswordTokenSchema = Yup.object().shape({
  new_password: Yup.string()
    .required("Required")
    .min(4, "Too Short!")
    .max(10, "Too Long!"),
  confirm_password: Yup.string()
    .required("Required")
    .test(
      "passwords-match",
      "New password does not match with confirm password ",
      function(value) {
        return this.parent.new_password === value;
      }
    )
});

export const validationSchema = {
  NGO: NgoSchema,
  AddBook: AddBookSchema,
  AddSchool: AddSchoolSchema,
  AddNgoAdmin: AddNgoAdmin,
  AddStudent: AddStudentSchema,
  AddUser: AddUserSchema,
  AddUserBookfairy: AddUserNoEmailSchema,
  AddSession: AddSessionSchema,
  OneTimeSession: oneTimeSessionValidationSchema,
  RecusringSession: recurringSessionValidationSchema,
  UpdateUser: UpdateUserSchema,
  UpdateBookfairyUser: UpdateBookfairyUserSchema,
  AddInventory: AddInventorySchema,
  AddLevel: AddLevelSchema,
  CancelSessionSchema: CancelSessionSchema,
  ResetPasswordSchema: ResetPasswordSchema,
  ForgotPasswordSchema: ForgotPasswordSchema,
  ForgotPasswordTokenSchema
};
