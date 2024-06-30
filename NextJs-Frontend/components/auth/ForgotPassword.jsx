import Form from "react-bootstrap/Form";
import Link from "next/link";
import { BlueButton } from "../shared/Button";
import { useState } from "react";
import { validate } from "@/utils";
import { AuthLayout } from ".";
import { ForgotPasswordSchema } from "@/schema";
import { TextInput } from "../shared/Input";
import { useForgotPassword } from "@/hooks";

const ForgotPassword = () => {
  const { mutate, isPending } = useForgotPassword();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(ForgotPasswordSchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      mutate(data);
    });
  };

  return (
    <AuthLayout title={"Forgot Password"}>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          errors={errors.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setErrors({ ...errors, email: "" });
          }}
        />
        <BlueButton
          text="Submit"
          type="submit"
          onClick={handleSubmit}
          disabled={isPending}
          isLoading={isPending}
        />

        <small>
          Remember your password? <Link href="/auth/login">Login</Link>
        </small>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;
