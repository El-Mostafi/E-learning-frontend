import { useState, useRef, useEffect, useCallback } from "react";
import { authService } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface FormData {
  email: string;
}
interface Errors extends FormData {
  apiErrors?: Array<{ message: string }>;
}

const ForgotPasswordForm = () => {
  const { setUser } = useAuth();

  const Navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });
  const [isSending, setIsSending] = useState(false);
  const email = useRef<HTMLInputElement>(null);
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
    setIsSending(true);
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully!", formData);
      try {
        const response = await authService.requestResetPassword(formData.email);
        console.log(response.data);
        Navigate("/reset-password", { state: { email: formData.email } });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("failed send email:", error.response?.data);
          setErrors({ ...errors, apiErrors: error.response?.data.errors });
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
    setIsSending(false);
  };
  return (
    <>
      <section className="sign-in-section section-padding fix">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="sign-in-items">
                <div className="title text-center">
                  <h2 className="wow fadeInUp">Forgot Password ?</h2>
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
                    <div className="col-lg-5 wow fadeInUp" data-wow-delay=".4s">
                      <button disabled={isSending} type="submit" className="theme-btn">
                        {isSending ? (
                          <>
                            Sending {" "}
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </>
                        ) : (
                          "Send Reset Code"
                        )}
                      </button>
                    </div>
                    <div className="col-lg-12 text-center mt-3">
                      <p>
                        Back To Login{" "}
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
    </>
  );
};

export default ForgotPasswordForm;
