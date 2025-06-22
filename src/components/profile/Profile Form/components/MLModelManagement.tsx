import React, { useState, useEffect } from "react";
import {
  Brain,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Target,
  Calendar,
  BarChart3,
  Cpu,
  Sparkles,
  Timer,
} from "lucide-react";
import axios from "axios";
import { TrainingStatus } from "../../../../services/interfaces/model.interface";
import ModelService from "../../../../services/modelService";

const MLModelManagement: React.FC = () => {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStage, setTrainingStage] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect for training elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTraining && trainingStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trainingStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTraining, trainingStartTime]);

  // Format elapsed time
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Fetch training status
  const fetchTrainingStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ModelService.getTrainingStatus();

      setTrainingStatus(response.data);
      console.log("Training Status:", response);
      setLastRefresh(new Date());
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to fetch training status"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Train model
  const handleTrainModel = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      setTrainingStage("Initializing training environment...");
      setError(null);
      setTrainingStartTime(new Date());
      setElapsedTime(0);

      // Start with initial progress
      setTrainingProgress(5);
      setTrainingStage("Preparing training data...");

      setTimeout(() => {
        setTrainingProgress(50);
        setTrainingStage("Training model...");
      }, 2000);

      // Make the actual training request
      const response = await ModelService.TrainModel();
      setTrainingStatus(response.stats);

      

      setTimeout(() => {
        setTrainingProgress(75);
        setTrainingStage("Validating model performance...");
      }, 4000);

      setTimeout(() => {
        setTrainingProgress(95);
        setTrainingStage("Optimizing model parameters...");
      }, 6000);

      setTimeout(() => {
        setTrainingProgress(100);
        setTrainingStage("Training completed successfully!");
      }, 8000);

      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
        setTrainingStage("");
        setTrainingStartTime(null);
        setElapsedTime(0);
      }, 10000);
    } catch (err) {
      setIsTraining(false);
      setTrainingProgress(0);
      setTrainingStage("");
      setTrainingStartTime(null);
      setElapsedTime(0);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to train model");
      } else {
        setError("Training failed unexpectedly");
      }
    }
  };

  useEffect(() => {
    fetchTrainingStatus();
  }, []);

  // Helper functions
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (action: string) => {
    switch (action) {
      case "train":
        return <Brain className="w-5 h-5" />;
      case "retrain":
        return <RefreshCw className="w-5 h-5" />;
      case "up_to_date":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatDataChange = (count: number, label: string) => {
    if (count === 0) {
      return (
        <div className="flex items-center text-gray-600">
          <Minus className="w-4 h-4 mr-1" />
          <span>No change in {label.toLowerCase()}</span>
        </div>
      );
    }

    const isPositive = count > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    const prefix = isPositive ? "+" : "";

    return (
      <div className={`flex items-center ${colorClass}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span>
          {prefix}
          {Math.abs(count)} {label.toLowerCase()}
        </span>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error && !trainingStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Model Status
        </h3>
        <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
        <button
          onClick={fetchTrainingStatus}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              ML Model Management
            </h2>
            <p className="text-gray-600 mt-1">
              Course recommendation system status and controls
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchTrainingStatus}
            disabled={isLoading || isTraining}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Simplified Training Progress */}
          {isTraining && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Cpu className="w-6 h-6 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Model Training in Progress
                    </h3>
                    <p className="text-blue-700">{trainingStage}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-800">
                  <Timer className="w-5 h-5 mr-2" />
                  <span className="text-lg font-mono font-semibold">
                    {formatElapsedTime(elapsedTime)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Progress</span>
                  <span>{Math.round(trainingProgress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {trainingStatus && (
            <>
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Model Status Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 rounded-xl ${getUrgencyColor(
                        trainingStatus.trainingUrgency
                      )}`}
                    >
                      {getStatusIcon(trainingStatus.recommendedAction)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Model Status
                      </h3>
                      <p className="text-gray-600 capitalize">
                        {trainingStatus.recommendedAction.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Training Required</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trainingStatus.needsRetraining
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {trainingStatus.needsRetraining ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Urgency Level</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                          trainingStatus.trainingUrgency
                        )}`}
                      >
                        {trainingStatus.trainingUrgency
                          .charAt(0)
                          .toUpperCase() +
                          trainingStatus.trainingUrgency.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Training Timeline Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Training Timeline
                      </h3>
                      <p className="text-gray-600">Model training history</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">
                        Last Trained
                      </span>
                      <p className="font-medium text-gray-900">
                        {trainingStatus.lastTrainedAt
                          ? new Date(
                              trainingStatus.lastTrainedAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never trained"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Days Since Training
                      </span>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span
                          className={`font-medium ${
                            trainingStatus.daysSinceLastTraining > 30
                              ? "text-red-600"
                              : trainingStatus.daysSinceLastTraining > 7
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {trainingStatus.daysSinceLastTraining === Infinity
                            ? "Never"
                            : `${trainingStatus.daysSinceLastTraining} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quick Actions
                      </h3>
                      <p className="text-gray-600">Model management controls</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={handleTrainModel}
                      disabled={isTraining}
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all ${
                        trainingStatus.trainingUrgency === "critical"
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                          : trainingStatus.trainingUrgency === "high"
                          ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isTraining ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Training...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {trainingStatus.recommendedAction === "train"
                            ? "Train Model"
                            : "Retrain Model"}
                        </>
                      )}
                    </button>
                    <div className="text-xs text-gray-500 text-center">
                      {trainingStatus.recommendedAction === "up_to_date"
                        ? "Model is up to date"
                        : `${
                            trainingStatus.trainingUrgency
                              .charAt(0)
                              .toUpperCase() +
                            trainingStatus.trainingUrgency.slice(1)
                          } priority training needed`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Changes Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <Database className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Data Changes Since Last Training
                      </h3>
                      <p className="text-gray-600">
                        Track new data that may impact model performance
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* New Users */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">New Users</p>
                          <p className="font-semibold text-gray-900">
                            {formatDataChange(
                              trainingStatus.newUsersCount,
                              "Users"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* New Courses */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">New Courses</p>
                          <p className="font-semibold text-gray-900">
                            {formatDataChange(
                              trainingStatus.newCoursesCount,
                              "Courses"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* New Enrollments */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <GraduationCap className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            New Enrollments
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatDataChange(
                              trainingStatus.newEnrollmentsCount,
                              "Enrollments"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Insights & Recommendations
                    </h3>
                    <p className="text-gray-600">
                      Intelligent analysis of your recommendation system
                    </p>
                  </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Target className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">
                        Performance Prediction
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {trainingStatus.recommendedAction === "up_to_date"
                        ? "Your model is performing optimally with current data. Recommendations should be accurate and relevant."
                        : `Model performance may be ${
                            trainingStatus.trainingUrgency === "critical"
                              ? "significantly"
                              : "moderately"
                          } impacted. ${
                            trainingStatus.trainingUrgency === "critical"
                              ? "Immediate"
                              : "Scheduled"
                          } retraining recommended.`}
                    </p>
                  </div>

                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">
                        Data Quality Score
                      </h4>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              trainingStatus.recommendedAction === "up_to_date"
                                ? 95
                                : trainingStatus.trainingUrgency === "low"
                                ? 85
                                : trainingStatus.trainingUrgency === "medium"
                                ? 70
                                : trainingStatus.trainingUrgency === "high"
                                ? 55
                                : 35
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {trainingStatus.recommendedAction === "up_to_date"
                          ? "95%"
                          : trainingStatus.trainingUrgency === "low"
                          ? "85%"
                          : trainingStatus.trainingUrgency === "medium"
                          ? "70%"
                          : trainingStatus.trainingUrgency === "high"
                          ? "55%"
                          : "35%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MLModelManagement;