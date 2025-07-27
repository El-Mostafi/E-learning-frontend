import React from 'react';
import {
  Camera,
  X,
  UserCircle,
  ChevronRight,
  Settings,
  PlusCircle,
  LogOut,
  Clock,
  CheckCircle,
  BookOpen,
  Users,
  Star,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from 'lucide-react';
import { QuickStats } from '.';

interface SidebarProps {
  profile: {
    profileImage: string;
    UserName: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    socialLinks: {
      github: string;
      linkedin: string;
      twitter: string;
      portfolio: string;
    };
  };
  activeTab: 'admin'| 'profile' | 'settings' | 'CreateCours';
  setActiveTab: (tab: 'profile' | 'settings' | 'CreateCours') => void;
  handleImageClick: () => void;
  resetProfileImage: () => void;
  setShowProfileDisconnectConfirm: (show: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  QuickStats: QuickStats | null;
  DEFAULT_AVATAR: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  handleImageClick,
  resetProfileImage,
  setShowProfileDisconnectConfirm,
  fileInputRef,
  handleImageChange,
  QuickStats,
  DEFAULT_AVATAR,
}) => {
  const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "<1m";
  }
};

  return (
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
          {profile.UserName.replace("|", " ")} 
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
                  {formatTime(QuickStats!.totalTimeLearned! || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold">
                  {QuickStats!.coursesCompleted || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">Active Courses</span>
                </div>
                <span className="font-semibold">
                  {QuickStats!.activeCourses || "0"}
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
                  {QuickStats!.totalStudents || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">Courses Created</span>
                </div>
                <span className="font-semibold">
                  {QuickStats!.coursesCreated || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm">Average Rating</span>
                </div>
                <span className="font-semibold">
                  {QuickStats!.averageRating || "0.0"}
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
  );
};

export default Sidebar;