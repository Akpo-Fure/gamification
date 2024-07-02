import { Button as BootsStrap } from "react-bootstrap";
import PropTypes from "prop-types";
import styled from "styled-components";
import fontSizes from "@/constants/fontsizes";

const BtnStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.3rem",
  border: "none",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  width: "100%",
  whiteSpace: "nowrap",
};

const BlueButton2 = styled.button`
  ${BtnStyles};
  background-color: #1a73e8;
  color: #fff;

  &:hover,
  &:focus {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BlueButton = ({ type, disabled, onClick, style, text, isLoading }) => {
  return (
    <BootsStrap
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
    </BootsStrap>
  );
};

const ActionButton = ({ label, onClick }) => (
  <Button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    }}
  >
    <ActionText>{label}</ActionText>
  </Button>
);

const TransparentButton = styled.button`
  ${BtnStyles};
  background-color: transparent;
  color: #344054;
  border: 1px solid #d0d5dd;
  ${({ disabled }) => disabled && "opacity: 0.5;"}

  &:hover,
  &:focus {
    opacity: 0.65;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ActionText = styled.p`
  font-size: ${fontSizes.m};
  display: flex;
  font-weight: 600;
  color: #0047a4;
  margin: 0;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:hover,
  &:focus {
    opacity: 0.65;
  }
`;

BlueButton.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export { BlueButton, BlueButton2, TransparentButton, ActionButton };
