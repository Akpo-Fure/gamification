import Form from "react-bootstrap/Form";
import Link from "next/link";
import { useRouter } from "next/router";
import { BlueButton } from "../shared/Button";
import { useState } from "react";
import { validate } from "@/utils";
import { AuthLayout } from ".";
import { ResetPasswordSchema } from "@/schema";
import { TextInput } from "../shared/Input";
import { useResetPassword } from "@/hooks";

const ResetPassword = () => {
  const router = useRouter();
  const { userId, token } = router.query;

  const { mutate, isPending } = useResetPassword(userId, token);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(ResetPasswordSchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      mutate(data);
    });
  };

  return (
    <AuthLayout title={"Reset Password"}>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          errors={errors.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            setErrors({ ...errors, password: "" });
          }}
        />
        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          errors={errors.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            setErrors({ ...errors, confirmPassword: "" });
          }}
        />
        <small>
          Remember your password? <Link href="/auth/login">Login</Link>
        </small>

        <BlueButton
          text="Submit"
          type="submit"
          onClick={handleSubmit}
          disabled={isPending}
          isLoading={isPending}
        />
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
