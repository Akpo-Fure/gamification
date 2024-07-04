import { useLoggedInUser } from "@/hooks";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const AdminAuth = (Component) => {
  return (props) => {
    const user = useLoggedInUser();
    const router = useRouter();

    if (!user) {
      toast.error("You need to login first");
      router.push("/auth/login");
      return null;
    }

    if (!user?.isAdmin) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default AdminAuth;
