import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenValid } from "./ProtectedRoutes";



const StudentsdInstructorsRoutes = () => {
    const {user} = useAuth();
  return isTokenValid() && user && (user.role === "student" || user.role === "instructor")  ? <Outlet /> : <Navigate to="/" />;
};

export default StudentsdInstructorsRoutes;