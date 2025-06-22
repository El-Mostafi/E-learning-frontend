import React, { useState, useRef } from "react";
import ImageCropDialog from "./ImageCropDialog";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../services/authService";
import CreateCours from "../Create Cours";
import Sidebar from "./Sidebar";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import SettingsPanel from "./SettingPanel";
import AdminDashboard from "./AdminDashboard";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";

export interface ParentFormData {
  UserName: string;
  email: string;
  role: "student" | "instructor" | "admin";
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
// Replace existing QuickStats type with:
export type QuickStats = {
  // Student properties
  totalTimeLearned?: number;
  coursesCompleted?: number;
  activeCourses?: number;
  
  // Instructor properties
  totalStudents?: number;
  coursesCreated?: number;
  averageRating?: number;
};
export interface Errors extends ParentFormData {
  apiErrors?: Array<{ message: string }>;
}

function App() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "settings" | "CreateCours" | "admin"
  >("profile");
  
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const [showProfileDisconnectConfirm, setShowProfileDisconnectConfirm] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [QuickStat, setQuickStat] = useState<QuickStats | null>({
    totalTimeLearned: 0,
    coursesCompleted: 0,
    activeCourses: 0,
    totalStudents: 0,
    coursesCreated: 0,
    averageRating: 0,
  });

  // User profile state
  const [profile, setProfile] = useState<ParentFormData>({
    UserName: user?.userName || "",
    email: user?.email || "",
    role: (user?.role ?? "student") as "student" | "instructor" | "admin",
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
      github: `github.com/${user?.userName.replace("|", "")}`,
      linkedin: `linkedin.com/in/${user?.userName.replace("|", "")}`,
      twitter: `twitter.com/${user?.userName.replace("|", "")}`,
      portfolio: `https://${user?.userName.replace("|", "")}.com`,
    },
  });

  

  
// If user is admin, show admin dashboard
  if (profile.role === "admin") {
    return <AdminDashboard />;
  }
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

  const renderMainContent = () => {
    if (activeTab === "profile") {
      return profile.role === "student" ? (
        <StudentDashboard setQuickStat={setQuickStat} />
      ) : (
        <InstructorDashboard
          profile={{
            UserName: profile.UserName,
            profileImage: profile.profileImage,
          }}
          setQuickStat={setQuickStat}
        />
      );
    } else if (activeTab === "settings") {
      return (
        <SettingsPanel
          profile={profile}
          setProfile={setProfile}
          DEFAULT_AVATAR={DEFAULT_AVATAR}
          croppedImage={croppedImage}
        />
      );
    } else if (activeTab === "CreateCours" && profile.role === "instructor") {
      return <CreateCours />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleImageClick={handleImageClick}
            resetProfileImage={resetProfileImage}
            setShowProfileDisconnectConfirm={setShowProfileDisconnectConfirm}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            QuickStats={QuickStat}
            DEFAULT_AVATAR={DEFAULT_AVATAR}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {renderMainContent()}
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

export default App;
