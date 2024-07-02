import { Form } from "react-bootstrap";
import colors from "@/constants/colors";
import fontSizes from "@/constants/fontsizes";
import PropTypes from "prop-types";

const TextInput = ({
  label,
  type,
  placeholder,
  required,
  value,
  onChange,
  errors,
  as,
  rows,
}) => {
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
          rows={rows || 1}
          as={as || "input"}
          required={required || false}
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

const SelectInput = ({ value, onChange, options, label, lists, errors }) => {
  if (options?.length !== lists?.length) {
    throw new Error("Options and lists must be of the same length");
  }

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

        <Form.Select value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={option} value={option}>
              {lists[index]}
            </option>
          ))}
        </Form.Select>
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

const CheckboxInput = ({ value, checked, onChange, label, errors }) => {
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
        <Form.Check
          type="checkbox"
          label={label}
          checked={checked}
          onChange={onChange}
        />
        {errors && (
          <Form.Text
            style={{
              color: colors.error,
            }}
          >
            {errors}
          </Form.Text>
        )}
      </div>
    </Form.Group>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.string,
  as: PropTypes.string,
};

SelectInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  lists: PropTypes.array.isRequired,
  errors: PropTypes.string,
};

CheckboxInput.propTypes = {
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  errors: PropTypes.string,
};

export { TextInput, SelectInput, CheckboxInput };
