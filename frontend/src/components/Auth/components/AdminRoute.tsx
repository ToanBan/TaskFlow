import { useUser } from "../../../context/authContext";
import { Navigate } from "react-router-dom";
const AdminRoute = ({ children }: { children: any }) => {
  const { user } = useUser();
  if (!user) return <p>Loading...</p>;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
