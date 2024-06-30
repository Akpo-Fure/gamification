import Form from "react-bootstrap/Form";
import React from "react";
import Link from "next/link";
import { BlueButton } from "../shared/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { useLogin, useLoggedInUser } from "@/hooks";
import { validate } from "@/utils";
import { LoginSchema } from "@/schema";
import { AuthLayout } from ".";
import { TextInput } from "../shared/Input";

const Login = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const data = useLoggedInUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(LoginSchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      mutate(data, {
        onSuccess: () => router.push("/"),
      });
    });
  };

  return (
    <AuthLayout title={"Login"}>
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <small>
            Don't have an account? <Link href="/auth/register">Register</Link>
          </small>
          <small>
            <Link href="/auth/forgotpassword">Forgot Password?</Link>
          </small>
        </div>

        <BlueButton
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          text="Login"
        />
      </Form>
    </AuthLayout>
  );
};

export default React.memo(Login);
