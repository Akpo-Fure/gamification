import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useRegister } from "@/hooks/auth.hook";
import { validate } from "@/utils";
import { RegisterSchema } from "@/schema";
import { UserLayout } from ".";

const Register = () => {
  const router = useRouter();
  //   const { mutate, isLoading } = useRegister();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(RegisterSchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
    });
  };

  return (
    <UserLayout>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          width: "450px",
        }}
      >
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <Form.Text className="text-danger">{errors.email}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: "" });
            }}
          />
          {errors.confirmPassword && (
            <Form.Text className="text-danger">
              {errors.confirmPassword}
            </Form.Text>
          )}
        </Form.Group>

        <Button
          onClick={handleSubmit}
          variant="primary"
          type="submit"
          style={{
            width: "auto",
          }}
        >
          Submit
        </Button>
      </Form>
    </UserLayout>
  );
};

export default Register;
