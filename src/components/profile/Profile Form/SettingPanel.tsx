import React, { useCallback, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { Errors, ParentFormData } from ".";
import { cloudService } from "../../../services/cloudService";
import { authService } from "../../../services/authService";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface SettingsPanelProps {
  profile: ParentFormData;
  setProfile: React.Dispatch<React.SetStateAction<ParentFormData>>;
  DEFAULT_AVATAR: string;
  croppedImage: File | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  profile,
  setProfile,
  DEFAULT_AVATAR,
  croppedImage,
}) => {
  const { user, setUser } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Errors>>({});

  const getValidationError = useCallback(
    (name: string, value: string): string => {
      let error = "";

      if (name === "UserName") {
        if (!value.trim()) {
          error = "User Name is required.";
        } else if (value.length < 3) {
          error = "User Name must be at least 3 characters.";
        } else if (value.length > 20) {
          error = "User Name must be less than 20 characters.";
        } else if (/[|]/.test(value)) {
          error = "User Name must not contain the '|' character.";
        }
      }
      if (name === "newPassword") {
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

      if (name === "confirmPassword") {
        if (!value.trim()) {
          error = "Confirm Password is required.";
        } else if (value !== profile.newPassword) {
          error = "Passwords do not match.";
        }
      }
      if (profile.role === "instructor") {
        if (name === "expertise" && !value.trim()) {
          error = "Expertise is required.";
        }

        if (name === "biography" && !value.trim()) {
          error = "Biography is required.";
        }

        if (name === "yearsOfExperience") {
          const stringValue = String(value).trim();

          if (!stringValue) {
            error = "Years of experience is required.";
          } else if (isNaN(Number(stringValue)) || Number(stringValue) < 0) {
            error = "Years of experience must be a positive number.";
          }
        }
      }
      if (profile.role === "student") {
        if (name === "educationLevel" && !value.trim()) {
          error = "Education level is required.";
        }

        if (name === "fieldOfStudy" && !value.trim()) {
          error = "Field of study is required.";
        }
      }

      return error;
    },
    [profile]
  );

  const validateField = (name: string, value: string) => {
    const error = getValidationError(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));

    validateField(name, value);
  };

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Errors> = {};

    // Common validations
    const firstNameError = getValidationError("UserName", profile.UserName);
    if (firstNameError) {
      newErrors.UserName = firstNameError;
    }


    // Password validations (only if changing password)
    if (isChangingPassword) {
      const newPasswordError = getValidationError(
        "newPassword",
        profile.newPassword
      );
      if (newPasswordError) {
        newErrors.newPassword = newPasswordError;
      }

      const confirmPasswordError = getValidationError(
        "confirmPassword",
        profile.confirmPassword
      );
      if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
      }
    }

    // Role-specific validations
    if (profile.role === "instructor") {
      const expertiseError = getValidationError("expertise", profile.expertise);
      if (expertiseError) {
        newErrors.expertise = expertiseError;
      }

      const yearsOfExperienceError = getValidationError(
        "yearsOfExperience",
        profile.yearsOfExperience
      );
      if (yearsOfExperienceError) {
        newErrors.yearsOfExperience = yearsOfExperienceError;
      }

      const biographyError = getValidationError("biography", profile.biography);
      if (biographyError) {
        newErrors.biography = biographyError;
      }
    }

    if (profile.role === "student") {
      const educationLevelError = getValidationError(
        "educationLevel",
        profile.educationLevel
      );
      if (educationLevelError) {
        newErrors.educationLevel = educationLevelError;
      }

      const fieldOfStudyError = getValidationError(
        "fieldOfStudy",
        profile.fieldOfStudy
      );
      if (fieldOfStudyError) {
        newErrors.fieldOfStudy = fieldOfStudyError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile, isChangingPassword, getValidationError]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    try {
      const updatePayload = {
        userName: `${profile.UserName} `,
        profileImg: profile.profileImage,
        publicId: "",
        ...(profile.role === "student" && {
          educationLevel: profile.educationLevel,
          fieldOfStudy: profile.fieldOfStudy,
        }),
        ...(profile.role === "instructor" && {
          expertise: profile.expertise,
          yearsOfExperience: profile.yearsOfExperience,
          biography: profile.biography,
        }),
      };
      if (
        DEFAULT_AVATAR !== profile.profileImage &&
        user!.profileImg !== profile.profileImage
      ) {
        const { data: signatureData } = await cloudService.getSignatureImage();
        if (!signatureData) return console.error("Signature is missing.");

        if (!croppedImage) return console.error("Image is missing.");

        const { data: uploadData } = await cloudService.uploadFile(
          croppedImage,
          signatureData,
          "images_preset"
        );

        console.log("Uploaded asset:", uploadData);

        setProfile((prev) => ({
          ...prev,
          profileImage: uploadData.secure_url,
        }));

        updatePayload.profileImg = uploadData.secure_url;
        updatePayload.publicId = uploadData.public_id;

        const { data: updateData } = await authService.updateUser(
          updatePayload
        );

        console.log("User updated:", updateData);
      } else {
        const { data: updateData } = await authService.updateUser(
          updatePayload
        );
        console.log("User updated:", updateData);
      }
      const { data: userData } = await authService.getCurrentUser();
      setUser(userData.currentUser);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiErrors: error.response?.data.errors || "An error occurred",
        }));
      } else {
        console.error("Unexpected error:", error);
      }

      window.scrollTo({ top: 300, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const response = await authService.resetPassword(
        user!.email,
        profile.newPassword
      );
      console.log("Password updated:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiErrors: error.response?.data.errors || "An error occurred",
        }));
      } else {
        console.error("Unexpected error:", error);
      }
    }
    setIsChangingPassword(false);
    setProfile((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword: "",
    }));
    setIsSaving(false);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Account Settings
      </h2>
      {errors.apiErrors && errors.apiErrors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <strong>Error</strong>
          {errors.apiErrors.map((error, index) => (
            <div key={index}>⚠️ {error.message}</div>
          ))}
        </div>
      )}
      {!isChangingPassword ? (
        <div className="space-y-8">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="UserName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  User Name
                </label>
                <input
                  id="UserName"
                  type="text"
                  name="UserName"
                  value={profile.UserName}
                  onChange={handleChange}
                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
                {errors.UserName && (
                  <p className="text-danger">{errors.UserName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={profile.role === "student" ? "Student" : "Instructor"}
                  disabled
                  className="w-full text-black px-4 py-2 border-2 border-gray-200 bg-gray-50 rounded-lg"
                />
              </div>
              {profile.role === "student" ? (
                <>
                  <div>
                    <label
                      htmlFor="educationLevel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Education Level
                    </label>
                    <select
                      id="educationLevel"
                      name="educationLevel"
                      value={profile.educationLevel}
                      onChange={handleChange}
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    >
                      <option value="high_school">High School</option>
                      <option value="associate">Associate</option>
                      <option value="bachelor">Undergraduate</option>
                      <option value="master">Graduate</option>
                      <option value="doctorate">Postgraduate</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.educationLevel && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.educationLevel}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="fieldOfStudy"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Field of Study
                    </label>
                    <input
                      id="fieldOfStudy"
                      type="text"
                      name="fieldOfStudy"
                      value={profile.fieldOfStudy}
                      onChange={handleChange}
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                    {errors.fieldOfStudy && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.fieldOfStudy}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="expertise"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Area of Expertise
                    </label>
                    <input
                      id="expertise"
                      type="text"
                      name="expertise"
                      value={profile.expertise}
                      onChange={handleChange}
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                    {errors.expertise && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.expertise}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Years of Experience
                    </label>
                    <input
                      id="yearsOfExperience"
                      type="number"
                      name="yearsOfExperience"
                      value={profile.yearsOfExperience}
                      onChange={handleChange}
                      min="0"
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                    {errors.yearsOfExperience && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.yearsOfExperience}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="biography"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Biography
                    </label>
                    <textarea
                      id="biography"
                      name="biography"
                      value={profile.biography}
                      onChange={handleChange}
                      rows={4}
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    ></textarea>
                    {errors.biography && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.biography}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Social Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    GitHub
                  </label>
                  <div className="flex items-center">
                    <Github className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="github"
                      type="text"
                      value={profile.socialLinks.github}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            github: e.target.value,
                          },
                        }))
                      }
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    LinkedIn
                  </label>
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="linkedin"
                      type="text"
                      value={profile.socialLinks.linkedin}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Twitter
                  </label>
                  <div className="flex items-center">
                    <Twitter className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="twitter"
                      type="text"
                      value={profile.socialLinks.twitter}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            twitter: e.target.value,
                          },
                        }))
                      }
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="portfolio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Portfolio Website
                  </label>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="portfolio"
                      type="text"
                      value={profile.socialLinks.portfolio}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            portfolio: e.target.value,
                          },
                        }))
                      }
                      className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Security
            </h3>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      ) : (
        // Change Password Form
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={profile.newPassword}
                  name="newPassword"
                  onChange={handleChange}
                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-danger">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={profile.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsChangingPassword(false)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPanel;
