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
import Modal from "react-modal";
import { Formik } from "formik";
import AddBookForm from "../Forms/AddBookForm";
import ModalContent from "../Modal/ModalContent";
import ModalHeader from "../Modal/ModalHeader";
import api from "../../utils/api";
import { validationSchema } from "../../utils/validationSchemas";
import { removeNullValues, parseErrorResponse } from "../../utils/stringUtils";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
Modal.setAppElement("#root");

class AddBookModal extends Component {
  render() {
    const {
      bookData,
      title,
      isOpen,
      toggleModal,
      getBooks,
      getBookDetails,
      levels,
      t
    } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
          <ModalContent>
            <ModalHeader title={title} toggleModal={toggleModal} />
            <div className="modal-body custom-modal-body">
              <Formik
                initialValues={{ ...bookData }}
                onSubmit={(values, actions) => {
                  let body = Object.assign({}, values);
                  const ngo = localStorage.getItem("ngo");
                  body["level"] = body.levels ? body.levels.value : null;
                  body = removeNullValues(body);
                  if (Object.keys(bookData).length > 0) {
                    const { key } = body;
                    api
                      .updateBook(key, body)
                      .then(({ data }) => {
                        getBookDetails();
                        toggleModal();
                        api.handleSuccess(data);
                      })
                      .catch(({ response }) => {
                        if (response.status === RESPONSE_STATUS_400) {
                          const errors = parseErrorResponse(
                            response.data.message
                          );
                          actions.setErrors(errors);
                        } else {
                          api.handleError(response);
                        }
                        actions.setSubmitting(false);
                      });
                  } else {
                    api
                      .addBook(ngo, body)
                      .then(({ data }) => {
                        getBooks();
                        toggleModal();
                        api.handleSuccess(data);
                      })
                      .catch(({ response }) => {
                        if (response.status === RESPONSE_STATUS_400) {
                          const errors = parseErrorResponse(
                            response.data.message
                          );

                          actions.setErrors(errors);
                        } else {
                          api.handleError(response);
                        }
                        actions.setSubmitting(false);
                      });
                  }
                }}
                render={props => (
                  <AddBookForm t={t} levels={levels} {...props} />
                )}
                validationSchema={validationSchema.AddBook}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}

export default AddBookModal;
