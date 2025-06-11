import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/authService";
import Preloader from "../common/Preloader";

// Define User type based on your API response structure
export interface UserContext {
  userId: string;
  userName: string;
  email: string;
  profileImg: string;
  role: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  expertise?: string;
  yearsOfExperience?: string;
  biography?: string;
}

interface AuthContextType {
  user: UserContext | null;
  setUser: (user: UserContext | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        setUser(response.data.currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token"); // Remove invalid token
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Display Preloader while loading
  if (loading) {
    return <Preloader />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
