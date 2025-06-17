import React, { useEffect, useState } from "react";
import { useCourse } from "../context/CourseContext";
import Button from "./common/Button";
import {
  AlertCircle,
  Edit,
  Book,
  HelpCircle,
  DollarSign,
  Ticket,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { cloudService } from "../../../../services/cloudService";
import { coursService } from "../../../../services/coursService";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CoursePreview: React.FC<{ onBack: () => void; mode: string }> = ({
  onBack,
  mode,
}) => {
  const { state, dispatch } = useCourse();
  const { courseDetails, sections, quizQuestions, pricing, coupons } = state;
  const { user } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: 0,
    maxUses: 0,
    expiryDate: new Date(),
  });
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    console.log(" state :", state);
  });
  const generateCouponCode = () => {
    const prefix = "COURSE";
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const code = `${prefix}${randomChars}`;
    setNewCoupon((prev) => ({ ...prev, code }));
  };

  const validateCourse = () => {
    const newErrors: string[] = [];

    if (
      !courseDetails.title ||
      !courseDetails.thumbnailPreview ||
      !courseDetails.category ||
      !courseDetails.level ||
      !courseDetails.description
    ) {
      newErrors.push("Course details are incomplete");
    }

    if (sections.length === 0) {
      newErrors.push("Your course needs at least one section");
    }

    if (quizQuestions.length === 0) {
      newErrors.push("Your course needs at least one quiz question");
    }

    if (!pricing.isFree && (!pricing.price || pricing.price <= 0)) {
      newErrors.push("Please set a valid price for your course");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handlePublish = () => {
    if (validateCourse()) {
      window.scrollTo({
        top: user?.role === "admin" ? 0 : 400,
        behavior: "smooth",
      });
      setShowConfirmation(true);
    }
  };

  const confrimUpdate = async () => {
    setIsUpdating(true);
    try {
      if (
        !state.courseDetails.secureUrl &&
        !state.courseDetails.imgPublicId &&
        !state.courseDetails.thumbnail
      ) {
        setErrors([...errors, "Thumbnail is required"]);
        setShowConfirmation(false);
        window.scrollTo({
          top: user?.role === "admin" ? 0 : 400,
          behavior: "smooth",
        });
        return;
      }
      let securUrl: string = "";
      let publicId: string = "";
      if (!state.courseDetails.secureUrl && !state.courseDetails.imgPublicId) {
        const { data: signatureData } = await cloudService.getSignatureImage();
        console.log(" signatureData :", signatureData);
        if (!signatureData) {
          setErrors([...errors, "An error occurred"]);
          setShowConfirmation(false);
          window.scrollTo({
            top: user?.role === "admin" ? 0 : 400,
            behavior: "smooth",
          });
          return;
        }

        const { data: uploadData } = await cloudService.uploadFile(
          state.courseDetails.thumbnail!,
          signatureData,
          "images_preset"
        );
        securUrl = uploadData.secure_url;
        publicId = uploadData.public_id;
        console.log("Uploaded asset:", uploadData,securUrl,publicId);
        if (!uploadData.secure_url) {
          setErrors([...errors, "error occured"]);
          setShowConfirmation(false);
          window.scrollTo({
            top: user?.role === "admin" ? 0 : 400,
            behavior: "smooth",
          });
          return;
        }
        dispatch({
          type: "SET_COURSE_DETAILS",
          payload: {
            ...state.courseDetails,
            secureUrl: uploadData.secure_url,
            imgPublicId: uploadData.public_id,
          },
        });
      }
      const response = await coursService.updateCours({
        ...state,
        courseDetails: {
          ...state.courseDetails,
          secureUrl: securUrl == "" ? state.courseDetails.secureUrl : securUrl,
          imgPublicId:
            publicId == "" ? state.courseDetails.imgPublicId : publicId,
        },
      });
      console.log("Course updated:", response.data);
      if (response.data.success == true) {
        console.log("course updated successfully");

        let index = 1;
        const publicIds: string[] = [];

        for (const section of state.sections) {
          const sectionPayload = {
            title: section.title,
            description: section.description,
            isPreview: false,
            orderIndex: index++,
          };

          const SectionResponse = await coursService.createSection(
            state.id!,
            sectionPayload
          );
          console.log("section created:", SectionResponse.data);

          if (SectionResponse.data.success == true) {
            console.log("section created successfully");

            for (const video of section.videos) {
              const videoPayload = {
                title: video.title,
                description: video.description,
                videoUrl: video.secureUrl,
                isPreview: false,
                duration: video.duration,
                publicId: video.publicId,
              };

              publicIds.push(video.publicId);

              const VideoResponse = await coursService.createVideo(
                state.id!,
                SectionResponse.data.sectionId,
                videoPayload
              );

              console.log("video created:", VideoResponse.data);

              if (VideoResponse.data.success == true) {
                console.log("video created successfully");
              }
            }
          }
        }

        for (const question of state.quizQuestions) {
          const QuizPaylod = {
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
          };
          const QuizResponse = await coursService.createQuiz(
            state.id!,
            QuizPaylod
          );
          console.log("quiz created:", QuizResponse.data);
        }
        console.log(publicIds);
        const publishResponse = await coursService.publishCours(
          state.id!,
          publicIds
        );
        console.log("Course updated:", publishResponse.data);
        if (user?.role.trim() === "instructor") {
          window.location.reload();
        } else {
          setShowConfirmation(false);
          setSuccessMessage("Course updated successfully");
          setShowSuccessToast(true);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors([...errors,"An error occurred Try again later"]);
      } else {
        console.error("Unexpected error:", error);
        setErrors([...errors, "An error occurred Try again later"]);
      }
      setShowConfirmation(false);
      window.scrollTo({
        top: user?.role === "admin" ? 0 : 400,
        behavior: "smooth",
      });
    }finally {
      setIsUpdating(false);
    }
  };
  const confirmPublish = async () => {
    setIsPublishing(true);
    try {
      if (!state.courseDetails.thumbnail) {
        setErrors([...errors, "Thumbnail is required"]);
        setShowConfirmation(false);
        window.scrollTo({
          top: user?.role === "admin" ? 0 : 400,
          behavior: "smooth",
        });
        return;
      }
      let securUrl: string = "";
      let publicId: string = "";
      if (!state.courseDetails.secureUrl) {
        const { data: signatureData } = await cloudService.getSignatureImage();
        if (!signatureData) {
          setErrors([...errors, "An error occurred"]);
          setShowConfirmation(false);
          window.scrollTo({
            top: user?.role === "admin" ? 0 : 400,
            behavior: "smooth",
          });
          return;
        }

        const { data: uploadData } = await cloudService.uploadFile(
          state.courseDetails.thumbnail!,
          signatureData,
          "images_preset"
        );
        securUrl = uploadData.secure_url;
        publicId = uploadData.public_id;
        console.log("Uploaded asset:", uploadData);
        if (!uploadData.secure_url) {
          setErrors([...errors, "error occured"]);
          setShowConfirmation(false);
          window.scrollTo({
            top: user?.role === "admin" ? 0 : 400,
            behavior: "smooth",
          });
          return;
        }
        dispatch({
          type: "SET_COURSE_DETAILS",
          payload: {
            secureUrl: uploadData.secure_url,
            imgPublicId: uploadData.public_id,
          },
        });
      }
      console.log(state);
      const response = await coursService.createCours({
        ...state,
        courseDetails: {
          ...state.courseDetails,
          secureUrl: securUrl == "" ? state.courseDetails.secureUrl : securUrl,
          imgPublicId:
            publicId == "" ? state.courseDetails.imgPublicId : publicId,
        },
      });
      console.log("Course created:", response.data);
      if (response.data.success == true) {
        console.log("course created successfully");

        let index = 1;
        const publicIds: string[] = [];

        for (const section of state.sections) {
          const sectionPayload = {
            title: section.title,
            description: section.description,
            isPreview: false,
            orderIndex: index++,
          };

          const SectionResponse = await coursService.createSection(
            response.data.courseId,
            sectionPayload
          );
          console.log("section created:", SectionResponse.data);

          if (SectionResponse.data.success == true) {
            console.log("section created successfully");

            for (const video of section.videos) {
              const videoPayload = {
                title: video.title,
                description: video.description,
                videoUrl: video.secureUrl,
                isPreview: false,
                duration: video.duration,
                publicId: video.publicId,
              };

              publicIds.push(video.publicId);

              const VideoResponse = await coursService.createVideo(
                response.data.courseId,
                SectionResponse.data.sectionId,
                videoPayload
              );

              console.log("video created:", VideoResponse.data);

              if (VideoResponse.data.success == true) {
                console.log("video created successfully");
              }
            }
          }
        }

        for (const question of state.quizQuestions) {
          const QuizPaylod = {
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
          };
          const QuizResponse = await coursService.createQuiz(
            response.data.courseId,
            QuizPaylod
          );
          console.log("quiz created:", QuizResponse.data);
        }
        console.log(publicIds);
        const publishResponse = await coursService.publishCours(
          response.data.courseId,
          publicIds
        );
        console.log("Course published:", publishResponse.data);

        if (user?.role === "instructor") {
          navigate("/my-courses");
        } else {
          setShowConfirmation(false);
          setSuccessMessage("Course published successfully");
          setShowSuccessToast(true);
        }
      }
      dispatch({ type: "PUBLISH_COURSE" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors([...errors, "An error occurred Try again later"]);
      } else {
        console.error("Unexpected error:", error);
        setErrors([...errors, "An error occurred Try again later"]);
      }
      setShowConfirmation(false);
      window.scrollTo({
        top: user?.role === "admin" ? 0 : 400,
        behavior: "smooth",
      });
    }

    setIsPublishing(false);
  };

  const handlePricingChange = (isFree: boolean) => {
    dispatch({
      type: "SET_PRICING",
      payload: { isFree },
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    if (!isNaN(price)) {
      dispatch({
        type: "SET_PRICING",
        payload: { price },
      });
    }
  };

  const handleAddCoupon = () => {
    if (
      newCoupon.code &&
      newCoupon.discountPercentage > 0 &&
      newCoupon.discountPercentage <= 100
    ) {
      dispatch({
        type: "ADD_COUPON",
        payload: newCoupon,
      });
      setNewCoupon({
        code: "",
        discountPercentage: 0,
        maxUses: 0,
        expiryDate: new Date(),
      });
    }
  };

  const handleRemoveCoupon = (code: string) => {
    dispatch({
      type: "REMOVE_COUPON",
      payload: code,
    });
  };

  const goToStep = (step: number) => {
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: step,
    });
  };

  return (
    <>
      <style>
        {`

          @keyframes slideIn {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(-100%);
              opacity: 0;
            }
          }

          .toast-enter {
            animation: slideIn 0.5s ease forwards;
          }

          .toast-exit {
            animation: slideOut 0.5s ease forwards;
          }
        .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 99999;
          }
        `}
      </style>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Course Preview & Publish</h2>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-700 font-medium mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-1" />
              Please fix the following issues before publishing:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-red-600 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showSuccessToast && (
          <div className="toast-container">
            <div className="bg-green-50 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 border border-green-200 toast-enter">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Course Summary</h3>
            <button
              type="button"
              onClick={() => goToStep(0)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Details
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden border">
            <div className="md:flex">
              <div className="md:w-1/3">
                {courseDetails.thumbnailPreview ? (
                  <img
                    src={courseDetails.thumbnailPreview}
                    alt="Course thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full min-h-[160px] flex items-center justify-center">
                    <span className="text-gray-400">No thumbnail</span>
                  </div>
                )}
              </div>
              <div className="p-4 md:w-2/3">
                <h4 className="font-bold text-xl mb-2">
                  {courseDetails.title || "Untitled Course"}
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {courseDetails.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {courseDetails.category}
                    </span>
                  )}
                  {courseDetails.level && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {courseDetails.level}
                    </span>
                  )}
                </div>
                <div
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: courseDetails.description,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center text-blue-700 mb-2">
              <Book className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Sections</h3>
            </div>
            <p className="text-2xl font-bold">{sections.length}</p>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center text-amber-700 mb-2">
              <HelpCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Quiz Questions</h3>
            </div>
            <p className="text-2xl font-bold">{quizQuestions.length}</p>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="mt-2 text-amber-600 hover:text-amber-800 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Course Settings</h3>

          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium flex items-center">
                  <DollarSign className="w-5 h-5 mr-1 text-gray-600" />
                  Pricing
                </h4>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={pricing.isFree}
                      onChange={() => handlePricingChange(true)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Free</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={!pricing.isFree}
                      onChange={() => handlePricingChange(false)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Paid</span>
                  </label>
                </div>

                {!pricing.isFree && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      min="0.99"
                      step="0.01"
                      value={pricing.price || ""}
                      onChange={handlePriceChange}
                      className="w-24 px-3 py-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Price"
                    />
                    <span className="text-gray-500 ml-2">USD</span>
                  </div>
                )}
              </div>
            </div>

            {!pricing.isFree && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <h4 className="font-medium flex items-center">
                    <Ticket className="w-5 h-5 mr-1 text-gray-600" />
                    Discount Coupons
                  </h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="Coupon code"
                        className="w-full px-3 py-2 pr-10 text-black border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={generateCouponCode}
                        className="absolute right-2 top-1/2  -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Generate code"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={newCoupon.discountPercentage || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountPercentage: parseInt(e.target.value),
                        })
                      }
                      placeholder="Discount %"
                      min="1"
                      max="100"
                      className="px-3 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={newCoupon.maxUses || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          maxUses: parseInt(e.target.value),
                        })
                      }
                      placeholder="Max uses (optional)"
                      min="0"
                      className="px-3 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={newCoupon.expiryDate.toISOString().slice(0, 10)}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          expiryDate: new Date(e.target.value),
                        })
                      }
                      placeholder="Expiry date (optional)"
                      className="px-3 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleAddCoupon}
                    variant="outline"
                    size="sm"
                    fullWidth
                  >
                    Add Coupon
                  </Button>

                  {coupons.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-medium mb-2">Active Coupons</h5>
                      <div className="space-y-2">
                        {coupons.map((coupon) => (
                          <div
                            key={coupon.code}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div>
                              <span className="font-medium">{coupon.code}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                {coupon.discountPercentage}% off
                              </span>
                              {coupon.maxUses > 0 && (
                                <span className="text-sm text-gray-600 ml-2">
                                  ({coupon.maxUses} uses)
                                </span>
                              )}
                              {coupon.expiryDate && (
                                <span className="text-sm text-gray-600 ml-2">
                                  Expires:{" "}
                                  {new Date(
                                    coupon.expiryDate
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveCoupon(coupon.code)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={handlePublish} disabled={!!successMessage}>
            {mode === "edit" ? "Update Course" : "Publish Course"}
          </Button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Publication</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to publish this course? Once published, it
                will be available according to your visibility settings.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={mode === "edit" ? confrimUpdate : confirmPublish}
                >
                  {isPublishing || isUpdating ? (
                    <>
                      {mode === "edit" ? "Updating " : "Publishing "}
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      {mode === "edit" ? "Confirm Update" : "Confirm Publish"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CoursePreview;
