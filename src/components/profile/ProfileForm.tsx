import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  Lock,
  Eye,
  EyeOff,
  Settings,
  X,
  BookOpen,
  UserCircle,
  ChevronRight,
  Clock,
  Trophy,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  LogOut,
  Users,
  Star,
  PlusCircle,
} from "lucide-react";
import Count from "../../common/Count";
import { ResponsiveContainer } from "recharts";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ImageCropDialog from "./ImageCropDialog";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { cloudService } from "../../services/cloudService";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseTable from "./StudentsCourses";
import CreateCours  from "./Create Cours/index";

const options: ApexOptions = {
  chart: {
    type: "area",
    width: "100%",
    height: 300,
    sparkline: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#3D7FF9", "#27CFA7"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 1,
    colors: ["#3D7FF9", "#27CFA7"],
    lineCap: "round",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  grid: {
    show: true,
    borderColor: "#E6E6E6",
    strokeDashArray: 3,
    xaxis: {
      lines: { show: false },
    },
    yaxis: {
      lines: { show: true },
    },
  },
  markers: {
    colors: ["#3D7FF9", "#27CFA7"],
    strokeWidth: 3,
    size: 0,
    hover: {
      size: 8,
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: { fontSize: "14px" },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `$${value}Hr`,
      style: { fontSize: "14px" },
    },
  },
  tooltip: {
    x: { format: "dd/MM/yy HH:mm" },
  },
  legend: {
    show: false,
  },
};

const series = [
  {
    name: "Course Enrolled",
    data: [8, 15, 9, 20, 10, 33, 13, 22, 8, 17, 10, 15],
  },
  {
    name: "Course Completed",
    data: [8, 24, 18, 40, 18, 48, 22, 38, 18, 30, 20, 28],
  },
];
const instructorOptions: ApexOptions = {
  chart: {
    type: "area",
    width: "100%",
    height: 300,
    sparkline: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#3D7FF9"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 1,
    colors: ["#3D7FF9"],
    lineCap: "round",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  grid: {
    show: true,
    borderColor: "#E6E6E6",
    strokeDashArray: 3,
    xaxis: {
      lines: { show: false },
    },
    yaxis: {
      lines: { show: true },
    },
  },
  markers: {
    colors: ["#3D7FF9"],
    strokeWidth: 3,
    size: 0,
    hover: {
      size: 8,
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: { fontSize: "14px" },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `$${value}Hr`,
      style: { fontSize: "14px" },
    },
  },
  tooltip: {
    x: { format: "dd/MM/yy HH:mm" },
  },
  legend: {
    show: false,
  },
};

const instructorSeries = [
  {
    name: "Student Number",
    data: [8, 24, 18, 40, 18, 48, 22, 38, 18, 30, 20, 28],
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#3D7FF9",
  "#27CFA7",
];
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "instructor";
  profileImage: string;
  newPassword: string;
  confirmPassword: string;
  // Student fields
  educationLevel: string;
  fieldOfStudy: string;
  // Instructor fields
  expertise: string;
  yearsOfExperience: string;
  biography: string;
  // Common fields
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
  };
}
interface Errors extends ParentFormData {
  apiErrors?: Array<{ message: string }>;
}
function ProfileForm() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "settings" | "CreateCours"
  >("profile");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const [showProfileDisconnectConfirm, setShowProfileDisconnectConfirm] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Errors>>({});
  // User profile state
  const [profile, setProfile] = useState<ParentFormData>({
    firstName: user?.userName?.split("|")[0] || "",
    lastName: user?.userName?.split("|")[1] || "",
    email: user?.email || "",
    role: (user?.role ?? "student") as "student" | "instructor",
    // role: "student",
    profileImage: user?.profileImg || DEFAULT_AVATAR,
    newPassword: "",
    confirmPassword: "",
    // Student fields
    educationLevel: user?.educationLevel || "",
    fieldOfStudy: user?.fieldOfStudy || "",
    // Instructor fields
    expertise: user?.expertise || "",
    yearsOfExperience: user?.yearsOfExperience || "0",
    biography: user?.biography || "",
    socialLinks: {
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      twitter: "twitter.com/johndoe",
      portfolio: "johndoe.dev",
    },
  });
  const roleBasedStats =
    profile.role === "student"
      ? {
          totalHoursLearned: 156,
          coursesCompleted: 12,
          activeCourses: 3,
          badges: [
            { name: "Python Master", icon: "🐍" },
            { name: "Data Wizard", icon: "📊" },
            { name: "Quick Learner", icon: "⚡" },
          ],
          wishlist: [
            { name: "Advanced Machine Learning", instructor: "Dr. Sarah Chen" },
            {
              name: "Web Security Fundamentals",
              instructor: "Prof. James Wilson",
            },
            { name: "Cloud Architecture", instructor: "Michael Cloud" },
          ],
          completedCourses: [
            { name: "Introduction to Python", grade: "A", date: "2024-02-15" },
            { name: "Data Structures", grade: "A-", date: "2024-01-20" },
            { name: "Web Development Basics", grade: "B+", date: "2023-12-10" },
          ],
        }
      : {
          totalStudents: 245,
          coursesCreated: 8,
          averageRating: 4.8,
          certifications: [
            { name: "Certified Educator", icon: "🎓" },
            { name: "Expert Instructor", icon: "🏆" },
            { name: "Content Creator", icon: "✨" },
          ],
          popularCourses: [
            { name: "Advanced JavaScript", students: 87, rating: 4.9 },
            { name: "React Fundamentals", students: 65, rating: 4.7 },
            { name: "Full Stack Development", students: 93, rating: 4.8 },
          ],
          upcomingCourses: [
            { name: "TypeScript Masterclass", date: "2024-07-15" },
            { name: "Node.js Advanced Patterns", date: "2024-08-10" },
          ],
        };
  const fractionalPart =
    (roleBasedStats.averageRating as number) -
    Math.floor(roleBasedStats.averageRating as number);
  const fractionalString = fractionalPart.toFixed(1).substring(1);
  const getValidationError = (name: string, value: string): string => {
    let error = "";

    if (name === "firstName") {
      if (!value.trim()) {
        error = "First Name is required.";
      } else if (value.length < 3) {
        error = "First Name must be at least 3 characters.";
      } else if (value.length > 20) {
        error = "First Name must be less than 20 characters.";
      } else if (/[|]/.test(value)) {
        error = "First Name must not contain the '|' character.";
      }
    }

    if (name === "lastName") {
      if (!value.trim()) {
        error = "Last Name is required.";
      } else if (value.length < 3) {
        error = "Last Name must be at least 3 characters.";
      } else if (value.length > 20) {
        error = "Last Name must be less than 20 characters.";
      } else if (/[|]/.test(value)) {
        error = "Last Name must not contain the '|' character.";
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
  };
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
    const firstNameError = getValidationError("firstName", profile.firstName);
    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    const lastNameError = getValidationError("lastName", profile.lastName);
    if (lastNameError) {
      newErrors.lastName = lastNameError;
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
  }, [profile, isChangingPassword]);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    try {
      const updatePayload = {
        userName: `${profile.firstName}|${profile.lastName}`,
        profileImg: profile.profileImage,
        publicId:"",
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
        // setProfile((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));

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
      setIsSaving(false); // Ensure state is updated after completion
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

  const handleImageClick = async () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageName(file.name);
        setSelectedImage(reader.result as string);
        setShowImageCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCroppedImage = async (croppedImage: File, previewUrl: string) => {
    try {
      setCroppedImage(croppedImage);
      setProfile((prev) => ({ ...prev, profileImage: previewUrl }));
      setShowImageCrop(false);
      setSelectedImage(null);
      setSelectedImageName(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const resetProfileImage = () => {
    setProfile((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));
  };
  const handleDisconnectProfile = async () => {
    try {
      const response = await authService.signout();
      console.log("Profile disconnected:", response!.data);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting profile:", error);
    }
    setShowProfileDisconnectConfirm(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {activeTab === "settings" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:!opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
                    <div className="relative z-10 flex flex-col items-center space-y-1">
                      <button
                        aria-label="Change profile image"
                        onClick={handleImageClick}
                        className="p-1 bg-white rounded-full text-gray-700 hover:!text-blue-600 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                      {profile.profileImage !== DEFAULT_AVATAR && (
                        <button
                          aria-label="Reset profile image"
                          onClick={resetProfileImage}
                          className="p-1 bg-white rounded-full text-gray-700 hover:!text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="file-upload"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <div className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {profile.role === "student" ? "Student" : "Instructor"}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-3" />
                  <span>Profile</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              {profile.role === "instructor" && (
                <button
                  onClick={() => setActiveTab("CreateCours")}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "CreateCours"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <PlusCircle className="w-5 h-5 mr-3" />
                    <span>Create Cours</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowProfileDisconnectConfirm(true)}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                {profile.role === "student" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Hours Learned</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.totalHoursLearned}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.coursesCompleted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span className="text-sm">Active Courses</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.activeCourses}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">Total Students</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.totalStudents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span className="text-sm">Courses Created</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.coursesCreated}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-2" />
                        <span className="text-sm">Average Rating</span>
                      </div>
                      <span className="font-semibold">
                        {roleBasedStats.averageRating}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href={`https://${profile.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Github className="w-4 h-4 mr-2" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  <span className="text-sm">Twitter</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">Portfolio</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {activeTab === "profile" ? (
                // Profile View with Learning Dashboard
                <div className="space-y-8">
                  {profile.role === "student" ? (
                    <>
                      {/* Learning Statistics */}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                          Learning Dashboard
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <Clock className="w-5 h-5 text-blue-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Time Spent
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                              <span
                                className="odometer"
                                data-count={roleBasedStats.totalHoursLearned}
                              >
                                <Count
                                  number={
                                    roleBasedStats.totalHoursLearned as number
                                  }
                                  text="h"
                                />
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Total learning time
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <Trophy className="w-5 h-5 text-green-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Achievements
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                              <span
                                className="odometer"
                                data-count={roleBasedStats.badges!.length}
                              >
                                <Count
                                  number={roleBasedStats.badges!.length}
                                  text=""
                                />
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Badges earned
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Courses
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                              <span
                                className="odometer"
                                data-count={roleBasedStats.coursesCompleted}
                              >
                                <Count
                                  number={
                                    roleBasedStats.coursesCompleted as number
                                  }
                                  text=""
                                />
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Completed courses
                            </p>
                          </div>
                        </div>

                        {/* Learning Activity Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Weekly Learning Activity
                            </h3>
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[5] }}
                              ></div>
                              <span className="text-sm text-gray-600 mr-4">
                                Course Completed
                              </span>
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[4] }}
                              ></div>
                              <span className="text-sm text-gray-600">
                                Course Enrolled
                              </span>
                            </div>
                          </div>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <Chart
                                options={options}
                                series={series}
                                type="area"
                                height={300}
                              />
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Course Table */}
                        <CourseTable />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Learning Statistics */}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                          Instructor Dashboard
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <Users className="w-5 h-5 text-blue-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Students
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                              <Count
                                number={roleBasedStats.totalStudents as number}
                                text=""
                              />
                            </p>
                            <p className="text-sm text-gray-600">
                              Total enrolled
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Courses
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                              <Count
                                number={roleBasedStats.coursesCreated as number}
                                text=""
                              />
                            </p>
                            <p className="text-sm text-gray-600">
                              Created courses
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                            <div className="flex items-center mb-2">
                              <Star className="w-5 h-5 text-purple-600 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Rating
                              </h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                              <Count
                                number={Math.floor(
                                  roleBasedStats.averageRating as number
                                )}
                                text={fractionalString}
                              />
                            </p>
                            <p className="text-sm text-gray-600">
                              Average rating
                            </p>
                          </div>
                        </div>

                        {/* Learning Activity Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Number of Students Enrolled Over Time
                            </h3>
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[4] }}
                              ></div>
                              <span className="text-sm text-gray-600">
                                Student Number
                              </span>
                            </div>
                          </div>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <Chart
                                options={instructorOptions}
                                series={instructorSeries}
                                type="area"
                                height={300}
                              />
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Course Sections */}

                      <div className="grid grid-cols-1 md:grid-cols gap-8">
                        {/* Popular Courses */}
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                          <div className="flex justify-between items-center ">
                            <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-amber-500 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Popular Courses
                              </h3>
                            </div>
                            <Link to="/my-courses" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                              View All
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                          <div className="space-y-4">
                            <div className="row">
                              <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="courses-card-main-items">
                                  <div className="courses-card-items style-2">
                                    <div className="courses-image">
                                      <img
                                        src="assets/img/courses/09.jpg"
                                        alt="img"
                                      />
                                      <h3 className="courses-title">
                                        Web Design
                                      </h3>
                                      <h4 className="topic-title">
                                        Advance Web Design
                                      </h4>
                                      <div className="arrow-items">
                                        <div className="GlidingArrow">
                                          <img
                                            src="assets/img/courses/a1.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay1">
                                          <img
                                            src="assets/img/courses/a2.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay2">
                                          <img
                                            src="assets/img/courses/a3.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay3">
                                          <img
                                            src="assets/img/courses/a4.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay4">
                                          <img
                                            src="assets/img/courses/a5.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay5">
                                          <img
                                            src="assets/img/courses/a6.png"
                                            alt="img"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="courses-content">
                                      <ul className="post-cat">
                                        <li>
                                          <Link to="/courses">Design</Link>
                                        </li>
                                        <li>
                                          <i className="fas fa-star mr-2"></i>
                                          <span className="fw-bold me-1">
                                            4.5
                                          </span>
                                        </li>
                                      </ul>
                                      <h3>
                                        <Link to="/courses-details">
                                          Learn With Advance Web Design (UX/UI)
                                          Course
                                        </Link>
                                      </h3>
                                      <div className="client-items">
                                        <div
                                          className="client-img bg-cover"
                                          style={{
                                            background: `url(/assets/img/courses/client-1.png)`,
                                          }}
                                        ></div>
                                        <p>Paul C. Deleon</p>
                                      </div>
                                      <ul className="post-class">
                                        <li>
                                          <i className="far fa-books"></i>
                                          Lessons
                                        </li>
                                        <li>
                                          <i className="far fa-user"></i>
                                          80 Students
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="courses-card-main-items">
                                  <div className="courses-card-items style-2">
                                    <div className="courses-image">
                                      <img
                                        src="assets/img/courses/10.jpg"
                                        alt="img"
                                      />
                                      <h3 className="courses-title">
                                        Business Finance
                                      </h3>
                                      <h4 className="topic-title">
                                        Finance and Business
                                      </h4>
                                      <div className="arrow-items">
                                        <div className="GlidingArrow">
                                          <img
                                            src="assets/img/courses/a1.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay1">
                                          <img
                                            src="assets/img/courses/a2.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay2">
                                          <img
                                            src="assets/img/courses/a3.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay3">
                                          <img
                                            src="assets/img/courses/a4.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay4">
                                          <img
                                            src="assets/img/courses/a5.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay5">
                                          <img
                                            src="assets/img/courses/a6.png"
                                            alt="img"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="courses-content">
                                      <ul className="post-cat">
                                        <li>
                                          <Link to="/courses">Business</Link>
                                        </li>
                                        <li>
                                          <i className="fas fa-star mr-2"></i>
                                          <span className="fw-bold me-1">
                                            4.5
                                          </span>
                                        </li>
                                      </ul>
                                      <h3>
                                        <Link to="/courses-details">
                                          Finance Management Building Wealth
                                        </Link>
                                      </h3>
                                      <div className="client-items">
                                        <div
                                          className="client-img bg-cover"
                                          style={{
                                            background: `url(/assets/img/courses/client-1.png)`,
                                          }}
                                        ></div>
                                        <p>Paul C. Deleon</p>
                                      </div>
                                      <ul className="post-class">
                                        <li>
                                          <i className="far fa-books"></i>
                                          Lessons
                                        </li>
                                        <li>
                                          <i className="far fa-user"></i>
                                          80 Students
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="courses-card-main-items">
                                  <div className="courses-card-items style-2">
                                    <div className="courses-image">
                                      <img
                                        src="assets/img/courses/11.jpg"
                                        alt="img"
                                      />
                                      <h3 className="courses-title">
                                        Programming
                                      </h3>
                                      <h4 className="topic-title">
                                        Advance Machine <br /> Learning
                                      </h4>
                                      <div className="arrow-items">
                                        <div className="GlidingArrow">
                                          <img
                                            src="assets/img/courses/a1.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay1">
                                          <img
                                            src="assets/img/courses/a2.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay2">
                                          <img
                                            src="assets/img/courses/a3.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay3">
                                          <img
                                            src="assets/img/courses/a4.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay4">
                                          <img
                                            src="assets/img/courses/a5.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="GlidingArrow delay5">
                                          <img
                                            src="assets/img/courses/a6.png"
                                            alt="img"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="courses-content">
                                      <ul className="post-cat">
                                        <li>
                                          <Link to="/courses">Programming</Link>
                                        </li>
                                        <li>
                                          <i className="fas fa-star mr-2"></i>
                                          <span className="fw-bold me-1">
                                            4.5
                                          </span>
                                        </li>
                                      </ul>
                                      <h3>
                                        <Link to="/courses-details">
                                          Introduction to Data Science and
                                          Machine Learning
                                        </Link>
                                      </h3>
                                      <div className="client-items">
                                        <div
                                          className="client-img bg-cover"
                                          style={{
                                            background: `url(/assets/img/courses/client-1.png)`,
                                          }}
                                        ></div>
                                        <p>Paul C. Deleon</p>
                                      </div>
                                      <ul className="post-class">
                                        <li>
                                          <i className="far fa-books"></i>
                                          Lessons
                                        </li>
                                        <li>
                                          <i className="far fa-user"></i>
                                          80 Students
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* {roleBasedStats.popularCourses!.map(
                              (course, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-4 rounded-xl shadow-sm"
                                >
                                  <h4 className="font-medium text-gray-800">
                                    {course.name}
                                  </h4>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      {course.students} students
                                    </span>
                                    <span className="text-gray-600 flex items-center">
                                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                      {course.rating}
                                    </span>
                                  </div>
                                </div>
                              )
                            )} */}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : activeTab === "settings" ? (
                // Settings View
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
                      <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              First Name
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              name="firstName"
                              value={profile.firstName}
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            {errors.firstName && (
                              <p className="text-danger">{errors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Last Name
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              name="lastName"
                              value={profile.lastName}
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            {errors.lastName && (
                              <p className="text-danger">{errors.lastName}</p>
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
                              value={
                                profile.role === "student"
                                  ? "Student"
                                  : "Instructor"
                              }
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
                                  <option value="High School">
                                    High School
                                  </option>
                                  <option value="Undergraduate">
                                    Undergraduate
                                  </option>
                                  <option value="Graduate">Graduate</option>
                                  <option value="Postgraduate">
                                    Postgraduate
                                  </option>
                                  <option value="Other">Other</option>
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
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
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
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
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
                            <p className="text-danger">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* {passwordError && (
                        <div className="flex items-center justify-center text-red-500 text-sm">
                          <X className="w-4 h-4 mr-1" />
                          <span>{passwordError}</span>
                        </div>
                      )} */}

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
              ) : (
                profile.role==="instructor" ? <CreateCours/>:""
                // <CreateCours/>
              )}
            </div>
          </div>
        </div>
      </div>
      {showProfileDisconnectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Disconnect Profile
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to disconnect your profile? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowProfileDisconnectConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnectProfile}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageCrop && selectedImage && selectedImageName && (
        <ImageCropDialog
          imageName={selectedImageName}
          imageUrl={selectedImage}
          onClose={() => {
            setShowImageCrop(false);
            setSelectedImage(null);
            setSelectedImageName(null);
          }}
          onSave={handleCroppedImage}
        />
      )}
    </div>
  );
}

export default ProfileForm;
