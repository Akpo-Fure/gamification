import { Form } from "react-bootstrap";
import colors from "@/constants/colors";
import fontSizes from "@/constants/fontsizes";
import PropTypes from "prop-types";

const TextInput = ({ label, type, placeholder, value, onChange, errors }) => {
  return (
    <Form.Group
      style={{
        gap: "0em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25em",
        }}
      >
        <Form.Label
          style={{
            marginBottom: "0em",
          }}
        >
          {label}
        </Form.Label>
        <Form.Control
          type={type || "text"}
          placeholder={placeholder || ""}
          value={value}
          onChange={onChange || (() => {})}
        />
      </div>
      {errors && (
        <Form.Text
          style={{
            color: colors.error,
          }}
        >
          {errors}
        </Form.Text>
      )}
    </Form.Group>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.string,
};

export { TextInput };
