import { useLoggedInUser } from "@/hooks";

const AdminAuth = (Component) => {
  return (props) => {
    const user = useLoggedInUser();

    if (user?.isAdmin) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default AdminAuth;
