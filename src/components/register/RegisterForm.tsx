import { useState, useEffect,  useCallback } from "react";
import { authService } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {BookOpen, GraduationCap } from "lucide-react";


import axios from "axios";
interface FormDataRequired {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  expertise?: string;
  yearsOfExperience?: string;
  biography?: string;
}
interface FormData extends FormDataRequired {
  role: "student" | "instructor";  
}
interface Errors extends FormData {
  apiErrors?: Array<{ message: string }>;
}
type PasswordStrength = "empty" | "weak" | "medium" | "strong" | "very-strong";

const RegisterForm: React.FC = () => {
  const { setUser } = useAuth();

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
    educationLevel: undefined,
  fieldOfStudy: undefined,
  expertise: undefined,
  yearsOfExperience: undefined,
  biography: undefined,
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Errors>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("empty");
  const [step, setStep] = useState(1);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return "empty";
    
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>/]/.test(password)) score += 1;
    
    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    if (score <= 5) return "strong";
    return "very-strong";
  };

  const getPasswordStrengthLabel = (strength: PasswordStrength): string => {
    switch (strength) {
      case "empty": return "Enter Password";
      case "weak": return "Weak";
      case "medium": return "Medium";
      case "strong": return "Strong";
      case "very-strong": return "Very Strong";
    }
  };

  const getPasswordStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case "empty": return "bg-gray-200";
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      case "very-strong": return "bg-green-600";
    }
  };

  const getPasswordStrengthWidth = (strength: PasswordStrength): string => {
    switch (strength) {
      case "empty": return "w-0";
      case "weak": return "w-1/4";
      case "medium": return "w-2/4";
      case "strong": return "w-3/4";
      case "very-strong": return "w-full";
    }
  };
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
    if(name==="educationLevel" && formData.role==="student"){
      if (value===undefined || !value.trim()) {
        error = "Education Level is required.";
      }
    }
    
    if(name==="fieldOfStudy" && formData.role==="student"){
      if (value===undefined || !value.trim()) {
        error = "Field Of Study Level is required.";
      }
    }
    if(name==="expertise" && formData.role==="instructor"){
      if (value===undefined || !value.trim()) {
        error = "Expertise is required.";
      }
    }
    if(name==="yearsOfExperience" && formData.role==="instructor"){
      if (value===undefined || !value.trim()) {
        error = "Years Of Experience is required.";
      }
    }
    if(name==="biography" && formData.role==="instructor"){
      if (value===undefined || !value.trim()) {
        error = "Biography is required.";
      }
      else if (value.length < 50) {
        error = "Biography must be at least 50 characters.";
      }
      else if (value.length > 500) {
        error = "Biography must be less than 500 characters.";
      }
    }
    return error;
  };
  const handleRoleChange = (role: "student" | "instructor") => {
    setFormData({
      ...formData,
      role,
      educationLevel: role === "student" ? formData.educationLevel : undefined,
      fieldOfStudy: role === "student" ? formData.fieldOfStudy : undefined,
      expertise: role === "instructor" ? formData.expertise : undefined,
      yearsOfExperience: role === "instructor" ? formData.yearsOfExperience : undefined,
      biography: role === "instructor" ? formData.biography : undefined,
    });
    setErrors({});
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Errors> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = getValidationError(key, value);
      if (error ) {
        newErrors[key as keyof FormDataRequired] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleNextStep = () => {
    const fieldsToValidate = ["firstName", "lastName", "email", "password"];
    const newErrors: Partial<Errors> = {};

    fieldsToValidate.forEach((field) => {
      const error = getValidationError(field, formData[field as keyof FormData] as string);
      if (error) {
        newErrors[field as keyof FormDataRequired] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    if (validate()) {
      console.log("Form submitted successfully!", formData);
      try {
        const response = await authService.signup({
          email: formData.email,
          password: formData.password,
          userName: `${formData.firstName} ${formData.lastName}`,
          role: formData.role,
          educationLevel: formData.educationLevel,
          fieldOfStudy: formData.fieldOfStudy,
          expertise: formData.expertise,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
          biography: formData.biography
        });
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
                <p className="text-gray-600 mt-2">Join our e-learning platform today</p>
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
              {step === 1 && (
                <div className="row g-4">
                  <div className="col-lg-6">
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
                        className={`${
                          errors.firstName ? "border-danger focus:ring-danger" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-danger">{errors.firstName}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
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
                        className={`${
                          errors.lastName ? "border-danger focus:ring-danger" : ""
                        }`}
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
                        className={`${
                          errors.email ? "border-danger focus:ring-danger" : ""
                        }`}
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
                        className={`${
                          errors.password ? "border-danger focus:ring-danger" : ""
                        }`}
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
                      <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength === "weak" ? "text-red-600" :
                          passwordStrength === "medium" ? "text-yellow-600" :
                          passwordStrength === "strong" || passwordStrength === "very-strong" ? "text-green-600" :
                          "text-gray-600"
                        }`}>
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)} ${getPasswordStrengthWidth(passwordStrength)}`}
                        ></div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center `}>
                          <span className={`mr-1 ${formData.password.length >= 8 ? "text-success" : "text-gray-500"}`}>{formData.password.length >= 8 ? "✓" : "○"}</span>
                          <span className={`${formData.password.length >= 8 ? "text-success" : "text-gray-500"}`}>8+ characters</span>
                        </div>
                        <div className={`flex items-center `}>
                          <span className={`mr-1 ${/[A-Z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>{/[A-Z]/.test(formData.password) ? "✓" : "○"}</span>
                          <span className={`${/[A-Z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center `}>
                          <span className={`mr-1 ${/[a-z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>{/[a-z]/.test(formData.password) ? "✓" : "○"}</span>
                          <span className={`${/[a-z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>Lowercase letter</span>
                        </div>
                        <div className={`flex items-center`}>
                          <span className={`mr-1 ${/[0-9]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>{/[0-9]/.test(formData.password) ? "✓" : "○"}</span>
                          <span className={`${/[0-9]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>Number</span>
                        </div>
                        <div className={`flex items-center `}>
                          <span className={`mr-1 ${/[a-z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>{/[!@#$%^&*(),.?":{}|<>/]/.test(formData.password) ? "✓" : "○"}</span>
                          <span className={`${/[a-z]/.test(formData.password) ? "text-success" : "text-gray-500"}`}>Special character</span>
                        </div>
                      </div>
                    </div>
                      {errors.password && (
                        <p className="text-danger">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 center mt-3">
                    <button onClick={handleNextStep} type="button" className="theme-btn">
                    Continue
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
                )}

                {step === 2 && (
                  <div className="row g-4">
                    <h3 className="text-xl font-semibold text-gray-800 ">I am registering as a:</h3>
                  <div className="col-lg-6">
                    <div className="form-clt">
                      <div
                          className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.role === "student"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-blue-300"
                          }`}
                          onClick={() => handleRoleChange("student")}
                        >
                          <div className="flex items-center">
                            <div className={`p-3 rounded-full ${
                              formData.role === "student" ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                              <GraduationCap size={24} className={formData.role === "student" ? "text-blue-600" : "text-gray-600"} />
                            </div>
                            <div className="ml-4">
                              <h4 className={`font-medium ${formData.role === "student" ? "text-blue-700" : "text-gray-700"}`}>
                                Student
                              </h4>
                              <p className="text-sm text-gray-500">I want to learn and take courses</p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-clt">
                    <div
                        className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.role === "instructor"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                        onClick={() => handleRoleChange("instructor")}
                      >
                        <div className="flex items-center">
                          <div className={`p-3 rounded-full ${
                            formData.role === "instructor" ? "bg-blue-100" : "bg-gray-100"
                          }`}>
                            <BookOpen size={24} className={formData.role === "instructor" ? "text-blue-600" : "text-gray-600"} />
                          </div>
                          <div className="ml-4">
                            <h4 className={`font-medium ${formData.role === "instructor" ? "text-blue-700" : "text-gray-700"}`}>
                              Instructor
                            </h4>
                            <p className="text-sm text-gray-500">I want to create and teach courses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.role === "student" && (
                    <div className="space-y-6">
                      <div className="col-lg-12">
                      <div className="form-clt">
                        <span>
                        Education Level <span className="text-danger">*</span>
                      </span>
                        <select
                          name="educationLevel"
                          title="Select your education level"
                          value={formData.educationLevel || ""}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.educationLevel ? "border-danger focus:ring-danger" : "border-gray-300 focus:ring-blue-200"
                          }`}
                        >
                          <option value="">Select your education level</option>
                          <option value="high_school">High School</option>
                          <option value="associate">Associate Degree</option>
                          <option value="bachelor">Bachelor's Degree</option>
                          <option value="master">Master's Degree</option>
                          <option value="doctorate">Doctorate</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.educationLevel && (
                        <p className="text-danger">{errors.educationLevel}</p>
                      )}
                      </div>
                      </div>

                      <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                      Field of Study <span className="text-danger">*</span>
                      </span>
                      <input
                          type="text"
                          name="fieldOfStudy"
                          value={formData.fieldOfStudy || ""}
                          onChange={handleChange}
                          placeholder="E.g., Computer Science, Business, etc."
                          className={`${
                            errors.fieldOfStudy ? "border-danger focus:ring-danger" : ""
                          }`}
                          
                        />
                      {errors.fieldOfStudy && (
                        <p className="text-danger">{errors.fieldOfStudy}</p>
                      )}
                    </div>
                  </div>
                    </div>
                  )}
                  {formData.role === "instructor" && (
                    <div className="space-y-6">
                      
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                      Area of Expertise <span className="text-danger">*</span>
                      </span>
                      <input
                          type="text"
                          name="expertise"
                          value={formData.expertise || ""}
                          onChange={handleChange}
                          placeholder="E.g., Web Development, Data Science, etc."
                          className={`${
                            errors.expertise ? "border-danger focus:ring-danger" : ""
                          }`}
                          
                        />
                      {errors.expertise && (
                        <p className="text-danger">{errors.expertise}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                      Years of Experience<span className="text-danger">*</span>
                      </span>
                      <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience || ""}
                          onChange={handleChange}
                          min="0"
                          placeholder="Enter number of years"
                          className={`${
                            errors.yearsOfExperience ? "border-danger focus:ring-danger" : ""
                          }`}
                          
                        />
                      {errors.yearsOfExperience && (
                        <p className="text-danger">{errors.yearsOfExperience}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <span>
                      Professional Biography <span className="text-danger">*</span>
                      </span>
                      <textarea
                          name="biography"
                          value={formData.biography || ""}
                          onChange={handleChange}
                          placeholder="Tell us about your professional background and teaching experience"
                          className={`${
                            errors.biography ? "border-danger focus:ring-danger" : ""
                          }`}
                          
                        ></textarea>
                      {errors.biography && (
                        <p className="text-danger">{errors.biography}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                          Minimum 50 characters, maximum 500 characters.
                        </p>
                    </div>
                  </div>
                  </div>
                   )}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSigningUp}
                      className="flex-1 theme-btn"
                    >
                      {isSigningUp ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        "Create Account"
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
                  )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
