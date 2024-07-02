import { useLoggedInUser } from "@/hooks";
import { useRouter } from "next/router";

const Auth = (Component) => {
  return (props) => {
    const user = useLoggedInUser();
    const router = useRouter();

    if (!user) {
      router.push("/auth/login");
      return null;
    }

    return <Component {...props} />;
  };
};
export default Auth;
