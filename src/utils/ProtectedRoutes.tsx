import { Navigate, Outlet } from "react-router-dom";

const decodeBase64Url = (str: string) => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }

  return decodeURIComponent(atob(output));
};

// eslint-disable-next-line react-refresh/only-export-components
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payload] = token.split('.');
    if (!payload) return false;

    const decodedPayload = JSON.parse(decodeBase64Url(payload));
    const isExpired = decodedPayload.exp * 1000 < Date.now();

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