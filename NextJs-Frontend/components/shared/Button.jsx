import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import styled from "styled-components";

const BlueButton = ({ type, disabled, onClick, style, text, isLoading }) => {
  return (
    <Button
      type={type ?? "button"}
      disabled={disabled}
      onClick={onClick}
      style={
        style ?? {
          width: "100%",
        }
      }
    >
      {isLoading ? ". . . . ." : text}
    </Button>
  );
};

BlueButton.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export { BlueButton };
