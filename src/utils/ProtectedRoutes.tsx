import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); 
        const isExpired = payload.exp * 1000 < Date.now(); 

        if (isExpired) {
            localStorage.removeItem("token"); 
            return false;
        }
        return true;
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        return false;
    }
};

const ProtectedRoutes = () => {
    return isTokenValid() ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoutes;
