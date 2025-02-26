import { useState, useEffect, useRef, useCallback } from "react";
import { authService } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface Errors extends FormData {
  apiErrors?: Array<{ message: string }>;
}

const RegisterForm: React.FC = () => {
  const { setUser } = useAuth();

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Errors>>({});

  const getValidationError = (name: string, value: string): string => {
    let error = "";

    if (name === "firstName") {
      if (!value.trim()) {
        error = "First Name is required.";
      } else if (value.length < 3) {
        error = "First Name must be at least 3 characters.";
      }else  if(value.length>20){
        error = "First Name must be less than 20 characters.";
      }else if (/[|]/.test(value)) {
        error = "First Name must not contain the '|' character.";
      }
    }

    if (name === "lastName") {
      if (!value.trim()) {
        error = "Last Name is required.";
      } else if (value.length < 3) {
        error = "Last Name must be at least 3 characters.";
      }else  if(value.length>20){
        error = "Last Name must be less than 20 characters.";
      }else if (/[|]/.test(value)) {
        error = "Last Name must not contain the '|' character.";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(value)) {
        error = "Invalid email format.";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required.";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters.";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(value)) {
        error = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*(),.?":{}|<>/]/.test(value)) {
        error = "Password must contain at least one special character.";
      }
    }

    return error;
  };
  const validateField = (name: string, value: string) => {
    const error = getValidationError(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  useEffect(() => {
    setUser(null);
    authService.signout();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Errors> = {};

    // Validate each field using current formData
    Object.entries(formData).forEach(([key, value]) => {
      const error = getValidationError(key, value);
      if (error) {
        newErrors[key as keyof FormData] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    if (validate()) {
      console.log("Form submitted successfully!", formData);
      try {
        const response = await authService.signup(
          formData.email,
          formData.password,
          `${formData.firstName}|${formData.lastName}`
        );
        console.log(response.data);
        navigate("/verification", { state: { email: formData.email } });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Signup failed:", error.response?.data);
          setErrors({ ...errors, apiErrors: error.response?.data.errors });
          window.scrollTo({ top: 300, behavior: "smooth" });
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
    setIsSigningUp(false);
  };

  return (
    <section className="sign-in-section section-padding fix">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="sign-in-items">
              <div className="title text-center">
                <h2>Create An Account</h2>
              </div>
              {errors.apiErrors && errors.apiErrors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  <strong>Error</strong>
                  {errors.apiErrors.map((error, index) => (
                    <div key={index}>⚠️ {error.message}</div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSubmit} id="contact-form">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="form-clt style-2">
                      <span>
                        First Name <span className="text-danger">*</span>
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        ref={firstName}
                      />
                      {errors.firstName && (
                        <p className="text-danger">{errors.firstName}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                        Last Name <span className="text-danger">*</span>
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        ref={lastName}
                      />
                      {errors.lastName && (
                        <p className="text-danger">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                        Email Address <span className="text-danger">*</span>
                      </span>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        ref={email}
                      />
                      {errors.email && (
                        <p className="text-danger">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                        Password <span className="text-danger">*</span>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        ref={password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="icon"
                      >
                        {showPassword ? (
                          <i className="far fa-eye-slash"></i>
                        ) : (
                          <i className="far fa-eye"></i>
                        )}
                      </button>
                      {errors.password && (
                        <p className="text-danger">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <button disabled={isSigningUp} type="submit" className="theme-btn">
                      {isSigningUp ? (
                        <>
                          Signing Up{" "}
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                  <div className="col-lg-12 text-center mt-3">
                    <p>
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-primary">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
