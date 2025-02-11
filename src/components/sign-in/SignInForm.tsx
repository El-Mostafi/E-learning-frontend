import { useState, useRef, useEffect, useCallback } from "react";
import { authService } from "../../services/authService";
import { Link } from "react-router-dom";
import axios from "axios";
interface FormData {
  email: string;
  password: string;
}
interface Errors extends FormData {
  apiErrors?: Array<{ message: string }>;
}

const SignInForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Errors>>({});
  const validateField = (name: string, value: string) => {
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
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(value)) {
        error = "Password must contain at least one number.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  useEffect(() => {
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
    const newErrors: Partial<FormData> = {};

    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (errors[key as keyof FormData]) {
        newErrors[key as keyof FormData] = errors[key as keyof FormData];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully!", formData);
      try {
        const response = await authService.signin(
          formData.email,
          formData.password
        );
        console.log(response.data);
        window.location.href = "/";
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Signup failed:", error.response?.data);
          setErrors({ ...errors, apiErrors: error.response?.data.errors });
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };
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
                    {errors.apiErrors.map((error, index) => (
                      <div key={index}>⚠️ {error.message}</div>
                    ))}
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
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          ref={password}
                        />
                        <div className="icon">
                          <i className="far fa-eye-slash"></i>
                        </div>
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
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Remember Me
                          </label>
                        </div>
                        <span>Forgot Password?</span>
                      </div>
                    </div>
                    <div className="col-lg-4 wow fadeInUp" data-wow-delay=".4s">
                      <button type="submit" className="theme-btn">
                        Sign In
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
