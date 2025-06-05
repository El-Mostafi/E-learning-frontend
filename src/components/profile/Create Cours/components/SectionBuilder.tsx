import React, { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useDropzone, FileRejection } from "react-dropzone";
import { useCourse } from "../context/CourseContext";
import Button from "./common/Button";
import {
  GripVertical,
  Plus,
  X,
  Eye,
  EyeOff,
  Upload,
  Film,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { cloudService } from "../../../../services/cloudService";
const SectionBuilder: React.FC<{
  onContinue: () => void;
  onBack: () => void;
}> = ({ onContinue, onBack }) => {
  const { state, dispatch } = useCourse();
  const { sections } = state;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      videos: [],
    };

    dispatch({
      type: "ADD_SECTION",
      payload: newSection,
    });
  };

  const updateSection = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    dispatch({
      type: "UPDATE_SECTION",
      payload: {
        id,
        updates: { [field]: value },
      },
    });

    if (errors[`${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${id}-${field}`];
      setErrors(newErrors);
    }
  };

  const removeSection = async (sectionId: string) => {
    const section = state.sections.find((sec) => sec.id === sectionId);

    try {
      if (section) {
        const videos = section.videos.map((video) => ({
          id: video.id,
          publicId: video.publicId,
        }));
        for (const video of videos) {
          const response = await cloudService.deleteFile(
            video.publicId,
            "video",
            state.id!
          );
          if (response.status === 200) {
            dispatch({
              type: "REMOVE_VIDEO_FROM_SECTION",
              payload: { sectionId, videoId: video.id },
            });
          } else {
            setErrors({
              ...errors,
              [`${sectionId}-${video.id}-apiError`]:
                "An error occurred while deleting the video ",
            });
            return;
          }
        }
        dispatch({
          type: "REMOVE_SECTION",
          payload: sectionId,
        });
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith(`${sectionId}-`)) {
            delete newErrors[key];
          }
        });
        setErrors(newErrors);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors({
          ...errors,
          [`${sectionId}-apiError`]:
            "An error occurred while deleting the video in section",
        });
      } else {
        console.error("Unexpected error:", error);
        setErrors({
          ...errors,
          [`${sectionId}-apiError`]:
            "An error occurred while deleting the video in section",
        });
      }
    }
  };

  const validateAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const aspectRatio = video.videoWidth / video.videoHeight;
        const isValid = Math.abs(aspectRatio - 16 / 9) < 0.1;
        resolve(isValid);
      };

      video.onerror = () => {
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        resolve(0);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const updateVideoProgress = useCallback(
    (videoId: string, sectionId: string, progress: number) => {
      dispatch({
        type: "UPDATE_VIDEO_IN_SECTION",
        payload: {
          sectionId,
          videoId,
          updates: { progress },
        },
      });
    },
    [dispatch]
  );

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      sectionId: string
    ) => {
      if (fileRejections.length > 0) {
        setErrors({
          ...errors,
          [`${sectionId}-video`]: fileRejections[0].errors[0].message,
        });
        return;
      }

      for (const file of acceptedFiles) {
        const isValidRatio = await validateAspectRatio(file);
        const duration = await getVideoDuration(file);

        const videoId = `video-${Date.now()}-${Math.random()}`;

        if (!isValidRatio) {
          dispatch({
            type: "ADD_VIDEO_TO_SECTION",
            payload: {
              sectionId,
              video: {
                id: videoId,
                publicId: "",
                file,
                secureUrl: "",
                progress: 0,
                preview: URL.createObjectURL(file),
                error: "Video aspect ratio should be 16:9",
                duration,
                title: file.name,
                description: "",
              },
            },
          });
          continue;
        }

        dispatch({
          type: "ADD_VIDEO_TO_SECTION",
          payload: {
            sectionId,
            video: {
              id: videoId,
              publicId: "",
              file,
              secureUrl: "",
              progress: 0,
              preview: URL.createObjectURL(file),
              duration,
              title: file.name,
              description: "",
            },
          },
        });
        try {
          const { data: signatureData } =
            await cloudService.getSignatureVideo();
          if (!signatureData) return console.error("Signature is missing.");
          console.log("Signature data:", signatureData);
          const response = await cloudService.uploadVideoToCloudinary(
            signatureData,
            file,
            sectionId,
            updateVideoProgress,
            videoId
          );
          dispatch({
            type: "UPDATE_VIDEO_IN_SECTION",
            payload: {
              sectionId,
              videoId,
              updates: {
                publicId: response.public_id,
                secureUrl: response.secure_url,
              },
            },
          });
          console.log("Video uploaded:", response);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("API Error:", error.response?.data);
            setErrors((prevErrors) => ({
              ...prevErrors,
              [`${sectionId}-${videoId}-apiError`]:
                error.response?.data.errors || "An error occurred",
            }));
          } else {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            console.error("Unexpected error:", errorMessage);
            setErrors((prevErrors) => ({
              ...prevErrors,
              [`${sectionId}-${videoId}-apiError`]: errorMessage,
            }));
          }
        }
      }
    },
    [dispatch, updateVideoProgress, errors]
  );

  const removeVideo = async (
    sectionId: string,
    videoId: string,
    publicId: string
  ) => {
    try {
      if (publicId) {
        const response = await cloudService.deleteFile(publicId, "video",state.id!);
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "REMOVE_VIDEO_FROM_SECTION",
            payload: { sectionId, videoId },
          });
        } else {
          setErrors({
            ...errors,
            [`${sectionId}-${videoId}-apiError`]:
              "An error occurred while deleting the video",
          });
          return;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors({
          ...errors,
          [`${sectionId}-${videoId}-apiError`]:
            "An error occurred while deleting the video",
        });
      } else {
        console.error("Unexpected error:", error);
        setErrors({
          ...errors,
          [`${sectionId}-${videoId}-apiError`]:
            "An error occurred while deleting the video",
        });
      }
    }
  };

  const updateVideo = (
    sectionId: string,
    videoId: string,
    field: "title" | "description",
    value: string
  ) => {
    dispatch({
      type: "UPDATE_VIDEO_IN_SECTION",
      payload: {
        sectionId,
        videoId,
        updates: { [field]: value },
      },
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch({
      type: "REORDER_SECTIONS",
      payload: items,
    });
  };

  const validateSections = () => {
    const newErrors: Record<string, string> = {};

    if (sections.length === 0) {
      newErrors.general = "You need to add at least one section";
    } else {
      sections.forEach((section) => {
        if (!section.title.trim()) {
          newErrors[`${section.id}-title`] = "Section title is required";
        }
        if (!section.description.trim()) {
          newErrors[`${section.id}-description`] =
            "Section description is required";
        }
        if (section.videos.length === 0) {
          newErrors[`${section.id}-videos`] =
            "Each section must have at least one video";
        }
        section.videos.forEach((video) => {
          if (!video.title.trim()) {
            newErrors[`${section.id}-${video.id}-title`] =
              "Video title is required";
          }
          if (!video.description.trim()) {
            newErrors[`${section.id}-${video.id}-description`] =
              "Video description is required";
          }
        });
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateSections()) {
      onContinue();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const VideoDropzone = ({ sectionId }: { sectionId: string }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "video/mp4": [] },
      maxSize: 100 * 1024 * 1024,
      onDrop: (acceptedFiles, fileRejections) =>
        onDrop(acceptedFiles, fileRejections, sectionId),
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Add videos to this section
          </p>
          <p className="text-xs text-gray-500">MP4 format only (max 100MB)</p>
          <p className="text-xs text-gray-500 mt-1">
            16:9 aspect ratio recommended
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Sections</h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </>
            )}
          </button>
          <span className="text-sm text-gray-500">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </span>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {isPreviewMode ? (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-medium text-gray-800">
              Course Outline Preview
            </h3>
          </div>
          <div className="p-4">
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No sections added yet
              </p>
            ) : (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 p-4">
                      <h4 className="font-medium text-lg">
                        Section {index + 1}:{" "}
                        {section.title || "Untitled Section"}
                      </h4>
                      <p className="text-gray-600 mt-2">
                        {section.description || "No description provided"}
                      </p>
                    </div>
                    <div className="p-4">
                      <h5 className="font-medium text-sm text-gray-700 mb-3">
                        Videos in this section:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.videos.map((video) => (
                          <div
                            key={video.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="aspect-video bg-gray-100">
                              <video
                                src={video.preview}
                                className="w-full h-full object-cover"
                                controls
                              ></video>
                            </div>
                            <div className="p-3">
                              <h6 className="font-medium">{video.title}</h6>
                              <p className="text-sm text-gray-600 mt-1">
                                {video.description}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 mt-2">
                                <Film className="w-3 h-3 mr-1" />
                                <span>
                                  {formatDuration(video.duration || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6 mb-6"
              >
                {sections.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">No sections added yet</p>
                    <Button onClick={addSection} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Your First Section
                    </Button>
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 p-3 border-b flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-2 cursor-grab"
                            >
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="font-medium flex-1">
                              Section {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedSection(
                                  expandedSection === section.id
                                    ? null
                                    : section.id
                                )
                              }
                              className="mr-2 text-gray-500 hover:text-gray-700"
                            >
                              {expandedSection === section.id
                                ? "Collapse"
                                : "Expand"}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove section"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div
                            className={`p-4 space-y-4 ${
                              expandedSection === section.id ? "" : "hidden"
                            }`}
                          >
                            <div>
                              {errors[`${section.id}-apiError`] && (
                                <div className="my-2 flex items-start text-red-600 ">
                                  <AlertCircle className="w-6 h-6 mr-1 flex-shrink-0 mt-0.5" />
                                  <span>
                                    {
                                      errors[
                                        `${section.id}-apiError`
                                      ]
                                    }
                                  </span>
                                </div>
                              )}
                              <label
                                htmlFor={`title-${section.id}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Section Title{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id={`title-${section.id}`}
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(
                                    section.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                  ${
                                    errors[`${section.id}-title`]
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300"
                                  }`}
                                placeholder="Enter section title"
                                maxLength={100}
                              />
                              {errors[`${section.id}-title`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`${section.id}-title`]}
                                </p>
                              )}
                              <div className="text-xs text-right text-gray-500 mt-1">
                                {section.title.length}/100
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor={`description-${section.id}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Section Description{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                id={`description-${section.id}`}
                                value={section.description}
                                onChange={(e) =>
                                  updateSection(
                                    section.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                  ${
                                    errors[`${section.id}-description`]
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300"
                                  }`}
                                placeholder="Enter section description"
                                rows={3}
                                maxLength={500}
                              ></textarea>
                              {errors[`${section.id}-description`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`${section.id}-description`]}
                                </p>
                              )}
                              <div className="text-xs text-right text-gray-500 mt-1">
                                {section.description.length}/500
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Section Videos{" "}
                                <span className="text-red-500">*</span>
                              </h4>

                              {errors[`${section.id}-videos`] && (
                                <p className="mb-2 text-sm text-red-600">
                                  {errors[`${section.id}-videos`]}
                                </p>
                              )}

                              <div className="space-y-4">
                                {section.videos.map((video) => (
                                  <div
                                    key={video.id}
                                    className="border rounded-lg overflow-hidden"
                                  >
                                    <div className="aspect-video bg-gray-100 relative">
                                      <video
                                        src={video.preview}
                                        className="w-full h-full object-cover"
                                        controls={video.progress === 100}
                                      ></video>

                                      {video.progress < 100 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                          <div className="text-white text-center">
                                            <p className="font-medium">
                                              {Math.round(video.progress)}%
                                            </p>
                                            <p className="text-xs">
                                              Uploading...
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeVideo(
                                            section.id,
                                            video.id,
                                            video.publicId
                                          )
                                        }
                                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
                                        aria-label="Remove video"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>

                                    <div className="p-3">
                                      <input
                                        type="text"
                                        value={video.title}
                                        onChange={(e) =>
                                          updateVideo(
                                            section.id,
                                            video.id,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className={`w-full px-3 py-2 border text-black rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                          ${
                                            errors[
                                              `${section.id}-${video.id}-title`
                                            ]
                                              ? "border-red-500"
                                              : "border-gray-300"
                                          }`}
                                        placeholder="Video title"
                                      />
                                      {errors[
                                        `${section.id}-${video.id}-title`
                                      ] && (
                                        <p className="mt-1 mb-2 text-sm text-red-600">
                                          {
                                            errors[
                                              `${section.id}-${video.id}-title`
                                            ]
                                          }
                                        </p>
                                      )}

                                      <textarea
                                        value={video.description}
                                        onChange={(e) =>
                                          updateVideo(
                                            section.id,
                                            video.id,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                          ${
                                            errors[
                                              `${section.id}-${video.id}-description`
                                            ]
                                              ? "border-red-500"
                                              : "border-gray-300"
                                          }`}
                                        placeholder="Video description"
                                        rows={2}
                                      ></textarea>
                                      {errors[
                                        `${section.id}-${video.id}-description`
                                      ] && (
                                        <p className="mt-1 text-sm text-red-600">
                                          {
                                            errors[
                                              `${section.id}-${video.id}-description`
                                            ]
                                          }
                                        </p>
                                      )}

                                      <div className="flex items-center text-xs text-gray-500 mt-2">
                                        <Film className="w-3 h-3 mr-1" />
                                        {video.file && (
                                          <span>
                                            {formatFileSize(video.file.size)}
                                          </span>
                                        )}
                                        <span className="mx-1">•</span>
                                        <span>
                                          {formatDuration(video.duration || 0)}
                                        </span>
                                      </div>

                                      {video.error && (
                                        <div className="mt-2 flex items-start text-red-600 text-xs">
                                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                                          <span>{video.error}</span>
                                        </div>
                                      )}
                                      {errors[
                                        `${section.id}-${video.id}-apiError`
                                      ] && (
                                        <div className="mt-2 flex items-start text-red-600 text-xs">
                                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                                          <span>
                                            {
                                              errors[
                                                `${section.id}-${video.id}-apiError`
                                              ]
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}

                                <div>
                                  <VideoDropzone sectionId={section.id} />

                                  {errors[`${section.id}-video`] && (
                                    <p className="mt-2 text-sm text-red-600">
                                      {errors[`${section.id}-video`]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {!isPreviewMode && sections.length > 0 && (
        <div className="mb-6">
          <Button onClick={addSection} variant="outline" fullWidth>
            <Plus className="w-4 h-4 mr-1" />
            Add Another Section
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default SectionBuilder;
