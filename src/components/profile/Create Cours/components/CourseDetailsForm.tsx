import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useCourse } from "../context/CourseContext";
import Button from "./common/Button";
import axios from "axios";
import {
  Image as ImageIcon,
  Upload,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading,
} from "lucide-react";
import { cloudService } from "../../../../services/cloudService";

const CATEGORIES = [
  "Web Development",
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Photography",
  "Music",
  "Health & Fitness",
  "Personal Development",
];

const LANGUAGES = [
  "Arabic",
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const CourseDetailsForm: React.FC<{ onContinue: () => void }> = ({
  onContinue,
}) => {
  const { state, dispatch } = useCourse();
  const { courseDetails } = state;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [StarterKit, Image, Link, TextStyle, Color],
    content:
      courseDetails.description ||
      "<p>Start writing your course description here...</p>",
    onUpdate: ({ editor }) => {
      dispatch({
        type: "SET_COURSE_DETAILS",
        payload: { description: editor.getHTML().toString() },
      });
    },
  });
  const validateImageAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = 0; // Allow any aspect ratio
        const isValid = targetRatio === 0 || Math.abs(aspectRatio - targetRatio) < 0.1;
        resolve(isValid);
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles, fileRejections) => {
      const isValid = await validateImageAspectRatio(acceptedFiles[0]);

      if (!isValid) {
        setErrors({
          ...errors,
          thumbnail: "Please upload an image with a 4:3 aspect ratio.",
        });
        return;
      }
      if (fileRejections.length > 0) {
        setErrors({
          ...errors,
          thumbnail: fileRejections[0].errors[0].message,
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
          dispatch({
            type: "SET_COURSE_DETAILS",
            payload: {
              thumbnail: file,
              thumbnailPreview: reader.result as string,
            },
          });
        };

        reader.readAsDataURL(file);
        setErrors({ ...errors, thumbnail: "" });
      }
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      dispatch({
        type: "SET_COURSE_DETAILS",
        payload: { title: value },
      });

      if (errors.title && value.trim().length > 0) {
        setErrors({ ...errors, title: "" });
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "SET_COURSE_DETAILS",
      payload: { category: e.target.value },
    });

    if (errors.category) {
      setErrors({ ...errors, category: "" });
    }
  };
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "SET_COURSE_DETAILS",
      payload: { language: e.target.value },
    });

    if (errors.language) {
      setErrors({ ...errors, language: "" });
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_COURSE_DETAILS",
      payload: { level: e.target.value },
    });

    if (errors.level) {
      setErrors({ ...errors, level: "" });
    }
  };
  const handelDeleteImage = async () => {
    try {
      if (courseDetails.imgPublicId) {
        const response = await cloudService.deleteFile(
          courseDetails.imgPublicId,
          "image",
          state.id!
        );
        if (response.status === 200) {
          dispatch({
            type: "SET_COURSE_DETAILS",
            payload: {
              thumbnail: null,
              thumbnailPreview: "",
              imgPublicId: "",
              secureUrl: "",
            },
          });
        }
        else {
          setErrors({ ...errors, thumbnail: "An error occurred while deleting the image" })
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors({...errors, thumbnail:"An error occurred while deleting the image"});
      } else {
        console.error("Unexpected error:", error);
        setErrors({...errors, thumbnail:"An error occurred while deleting the image"});
      }
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!courseDetails.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!courseDetails.thumbnailPreview) {
      newErrors.thumbnail = "Thumbnail is required";
    }

    if (!courseDetails.category) {
      newErrors.category = "Category is required";
    }

    if (!courseDetails.language) {
      newErrors.language = "Language is required";
    }

    if (!courseDetails.level) {
      newErrors.level = "Level is required";
    }

    if (
      !courseDetails.description ||
      courseDetails.description ===
        "<p>Start writing your course description here...</p>"
    ) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Course Details</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image <span className="text-red-500">*</span>
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }
            ${errors.thumbnail ? "border-red-500 bg-red-50" : ""}`}
        >
          <input {...getInputProps()} />

          {courseDetails.thumbnailPreview ? (
            <div className="relative">
              <img
                src={courseDetails.thumbnailPreview}
                alt="Thumbnail preview"
                className="mx-auto max-h-48 rounded"
              />
              <button
                type="button"
                title="Remove thumbnail"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handelDeleteImage();
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500">PNG or JPEG (max 5MB)</p>
            </div>
          )}
        </div>
        {errors.thumbnail && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Course Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={courseDetails.title}
              onChange={handleTitleChange}
              className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${
                errors.title
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter course title"
            />
            <div className="absolute right-3 top-2 text-xs text-gray-500">
              {courseDetails.title.length}/100
            </div>
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Language <span className="text-red-500">*</span>
          </label>
          <select
            id="language"
            value={courseDetails.language}
            onChange={handleLanguageChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${
                errors.category
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-600">{errors.language}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={courseDetails.category}
            onChange={handleCategoryChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${
                errors.category
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {LEVELS.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={courseDetails.level === level}
                  onChange={handleLevelChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>

        <div
          className={`border rounded-lg overflow-hidden transition-colors
          ${errors.description ? "border-red-500" : "border-gray-300"}`}
        >
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("bold") ? "bg-gray-200" : ""
              }`}
              aria-label="Bold"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("italic") ? "bg-gray-200" : ""
              }`}
              aria-label="Italic"
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
              }`}
              aria-label="Heading"
            >
              <Heading className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter the URL");
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("link") ? "bg-gray-200" : ""
              }`}
              aria-label="Link"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("bulletList") ? "bg-gray-200" : ""
              }`}
              aria-label="Bullet List"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive("orderedList") ? "bg-gray-200" : ""
              }`}
              aria-label="Ordered List"
            >
              <ListOrdered className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter the image URL");
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="p-1 rounded hover:bg-gray-200"
              aria-label="Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          <EditorContent
            editor={editor}
            className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
          />
        </div>

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default CourseDetailsForm;
