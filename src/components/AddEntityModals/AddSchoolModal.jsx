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
import ModalHeader from "../Modal/ModalHeader";
import ModalContent from "../Modal/ModalContent";
import AddSchoolForm from "../Forms/AddSchoolForm";
import { Formik } from "formik";
import api from "../../utils/api";
import { validationSchema } from "../../utils/validationSchemas";
import { RESPONSE_STATUS_400 } from "../../utils/constants";
import { parseErrorResponse, removeNullValues } from "../../utils/stringUtils";
import cloneDeep from "lodash/cloneDeep";

Modal.setAppElement("#root");
class AddSchoolModal extends Component {
  getBody = values => {
    let body = cloneDeep(values);
    const { selectedType, selectedCategory, selectedMedium } = this.props;

    body["school_type"] = selectedType
      ? selectedType.value
      : values.school_type.name;

    body["medium"] = selectedMedium ? selectedMedium.value : values.medium.name;

    body["school_category"] = selectedCategory
      ? selectedCategory.value
      : values.school_category.name;

    body["year_of_intervention"] = values.year_of_intervention
      ? values.year_of_intervention.value
      : "";
    return body;
  };

  render() {
    const {
      isOpen,
      schoolData,
      schoolTypes,
      schoolMediums,
      schoolCategories,
      onSchoolTypeChange,
      onSchoolCategoryChange,
      onSchoolMediumChange,
      selectedCategory,
      selectedMedium,
      selectedType,
      toggleModal,
      updateSchool,
      getSchools,
      onYearOfInterventionChange,
      title,
      t
    } = this.props;
    return (
      <Modal
        classname="mb80"
        isOpen={isOpen}
        onRequestClose={toggleModal}
        // style={}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <ModalContent className="custom-modal-content">
          <ModalHeader title={title} toggleModal={toggleModal} />
          <div className="modal-body custom-modal-body padding">
            <Formik
              classname="mb80"
              initialValues={{ ...schoolData }}
              onSubmit={(values, actions) => {
                const ngo = localStorage.getItem("ngo");
                const body = this.getBody(values);
                if (Object.keys(schoolData).length > 0) {
                  const { key } = schoolData;
                  api
                    .updateSchool(key, removeNullValues(body))
                    .then(({ data }) => {
                      updateSchool(data);
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
                    .addSchool(ngo, body)
                    .then(({ data }) => {
                      getSchools();
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
              validationSchema={validationSchema.AddSchool}
              render={props => (
                <AddSchoolForm
                  schoolTypes={schoolTypes}
                  schoolCategories={schoolCategories}
                  schoolMediums={schoolMediums}
                  selectedType={selectedType}
                  selectedMedium={selectedMedium}
                  selectedCategory={selectedCategory}
                  onSchoolTypeChange={onSchoolTypeChange}
                  onSchoolMediumChange={onSchoolMediumChange}
                  onSchoolCategoryChange={onSchoolCategoryChange}
                  onYearOfInterventionChange={onYearOfInterventionChange}
                  t={t}
                  {...props}
                />
              )}
            />
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default AddSchoolModal;
