import { useState, useRef, useEffect, useCallback } from "react";
import { authService } from "../../services/authService";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData extends ParentFormData {
  RememberMe: boolean;
}
interface ParentFormData {
  email: string;
  password: string;
}
interface Errors extends ParentFormData {
  apiErrors?: Array<{ message: string }>;
}

const SignInForm = () => {
  const { setUser } = useAuth();
  const Navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    RememberMe: false,
  });

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Errors>>({});

  const getValidationError = (name: string, value: string): string => {
    let error = "";

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    validateField(name, value);
  };

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Errors> = {};

    // Validate each field using current formData
    Object.entries(formData).forEach(([key, value]) => {
      const error = getValidationError(key, value);
      if (error) {
        newErrors[key as keyof ParentFormData] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    if (validate()) {
      console.log("Form submitted successfully!", formData);
      try {
        const response = await authService.signin(
          formData.email,
          formData.password,
          formData.RememberMe
        );
        console.log(response.data);
        window.location.href = "/";
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Signin failed:", error);
          setErrors({ ...errors, apiErrors: error.response?.data.errors || ["error occured while signing in"] });
        } else {
          console.error("Unexpected error:", error);
        }
        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    }
    setIsSigningIn(false);
  };
  useEffect(() => {
    const handleResendEmail = async () => {
      if (!errors.apiErrors) return;
      const emailError = errors.apiErrors.find(
        (error) => error.message === "Email is not confirmed"
      );

      if (emailError) {
        console.log("Email is not confirmed");
        try {
          await authService.resendEmail(formData.email, "Verification");
          Navigate("/verification", {
            state: { email: formData.email },
          });
        } catch (error) {
          console.error("Resend email failed:", error);
        }
      }
    };

    handleResendEmail();
  }, [errors.apiErrors]);
  return (
    <>
      <section className="sign-in-section section-padding fix">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="sign-in-items">
                <div className="title text-center">
                  <h2 className="wow fadeInUp">Sign In to your Account</h2>
                </div>
                {errors.apiErrors && errors.apiErrors.length > 0 && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error</strong>
                    {errors.apiErrors.map((error, index) => {
                      return <div key={index}>⚠️ {error.message}</div>;
                    })}
                  </div>
                )}
                <form onSubmit={handleSubmit} id="contact-form">
                  <div className="row g-4">
                    <div
                      className="col-lg-12 wow fadeInUp"
                      data-wow-delay=".2s"
                    >
                      <div className="form-clt style-2">
                        <span>
                          Email <span className="text-danger">*</span>
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
                    <div
                      className="col-lg-12 wow fadeInUp"
                      data-wow-delay=".4s"
                    >
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
                    <div className="col-lg-12">
                      <div className="from-cheak-items">
                        <div className="form-check d-flex gap-2 from-customradio">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="RememberMe"
                            id="flexRadioDefault1"
                            checked={formData.RememberMe}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Remember Me
                          </label>
                        </div>
                        <Link to="/forgot-password">
                          <span>Forgot Password ?</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-4 wow fadeInUp" data-wow-delay=".4s">
                      <button
                        disabled={isSigningIn}
                        type="submit"
                        className="theme-btn"
                      >
                        {isSigningIn ? (
                          <>
                            Signing In{" "}
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                    <div className="col-lg-12 text-center mt-3">
                      <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary">
                          Sign Up
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
    </>
  );
};

export default SignInForm;
