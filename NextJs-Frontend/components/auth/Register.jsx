import Form from "react-bootstrap/Form";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { BlueButton } from "../shared/Button";
import { useEffect, useState } from "react";
import { useRegister, useResendVerificationEmail } from "@/hooks";
import { validate } from "@/utils";
import { RegisterSchema } from "@/schema";
import { AuthLayout } from ".";
import { TextInput } from "../shared/Input";
import { CenteredModal } from "../shared/Modal";

const Register = () => {
  const router = useRouter();
  const { mutate, isPending } = useRegister();
  const { mutate: resendEmail, isPending: isResendingEmail } =
    useResendVerificationEmail();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: Cookies.get("ref") || "",
  });

  const { ref } = router.query;

  useEffect(() => {
    if (ref) {
      Cookies.set("ref", ref);
    }
  }, [ref]);

  const referralCode = Cookies.get("ref");

  useEffect(() => {
    if (referralCode) {
      setFormData((prevData) => ({ ...prevData, referralCode }));
    }
  }, [referralCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(RegisterSchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      mutate(data, {
        onSuccess: () => setSuccess(true),
      });
    });
  };

  return (
    <AuthLayout title={"Sign Up"}>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <TextInput
          label="Name"
          placeholder="Enter name"
          value={formData.name}
          errors={errors.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setErrors({ ...errors, name: "" });
          }}
        />

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
          Already have an account? <Link href="/auth/login">Login</Link>
        </small>

        <BlueButton
          text="Sign Up"
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          onClick={handleSubmit}
        />
      </Form>
      <CenteredModal
        size="xs"
        show={success}
        header="Sign Up Success"
        onHide={() => {
          setSuccess(false);
          router.push("/auth/login");
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <p>
            You have successfully registered. Please check your email to verify
            your account.
          </p>
          <small>
            If you did not receive the email, please click the button below to
            resend the email, or try loggin in to resend the email.
          </small>

          <BlueButton
            disabled={isResendingEmail}
            isLoading={isResendingEmail}
            onClick={() => {
              resendEmail({ email: formData.email });
            }}
            text="Resend Email"
          />
        </div>
      </CenteredModal>
    </AuthLayout>
  );
};

export default Register;
