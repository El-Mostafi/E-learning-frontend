import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenValid } from "./ProtectedRoutes";



const StudentsdRoutes = () => {
    const {user} = useAuth();
  return isTokenValid() && user && user.role === "student" ? <Outlet /> : <Navigate to="/" />;
};

export default StudentsdRoutes;