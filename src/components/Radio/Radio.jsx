import React from "react";
import "./Radio.scss";
import PropTypes from "prop-types";

function Radio(props) {
  const { ...radioProps } = props;
  return (
    <div>
      <input type="radio" id={props.id} name={props.name} {...radioProps} />
      <label htmlFor={props.id}>
        <strong>{props.label}</strong>
      </label>
    </div>
  );
}

export default Radio;

Radio.propTypes = {
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
