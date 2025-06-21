import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  BookOpen,
  Trophy,
  Target,
  X
} from 'lucide-react';
import { QuizQuestion } from '../../services/coursService';



interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  handleGetCertificate: () => void;
  courseName?: string;
}

const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  questions,
  onComplete,
  handleGetCertificate,
  courseName = "Course Assessment"
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setIsSubmitting(false);
      setQuizScore(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto relative">
          <button
            title='Close'
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h3>
            <p className="text-gray-600">Please check back later for quiz content.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    setQuizScore(score);

    try {
      await onComplete(score);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return selectedAnswers[questionId] !== undefined;
  };

  const allQuestionsAnswered = questions.every((q) => isQuestionAnswered(q._id));

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (showResults) {
    const passed = quizScore >= 70;
    const correctAnswers = Math.round((quizScore / 100) * questions.length);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-auto relative">
          <button
            title='Close'
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Results Header */}
          <div className={`px-8 py-12 text-center ${passed ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'} text-white rounded-t-2xl`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              {passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Target className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {passed ? "Congratulations!" : "Keep Learning!"}
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {passed ? "You've successfully completed the quiz" : "You're making great progress"}
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">{quizScore.toFixed(0)}%</div>
                <div className="text-sm opacity-75">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm opacity-75">Correct</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Question Review
            </h2>
            
            <div className="space-y-6 mb-8">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question._id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question._id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
                        <div className="grid gap-3">
                          {Object.entries(question.options).map(([key, value]) => {
                            let optionClass = "p-4 rounded-lg border transition-all ";
                            
                            if (key === question.correctAnswer) {
                              optionClass += "bg-emerald-50 border-emerald-200 text-emerald-800";
                            } else if (userAnswer === key && !isCorrect) {
                              optionClass += "bg-red-50 border-red-200 text-red-800";
                            } else {
                              optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={key} className={optionClass}>
                                <div className="flex items-center space-x-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-medium">
                                    {key}
                                  </span>
                                  <span className="flex-1">{value}</span>
                                  {key === question.correctAnswer && (
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  )}
                                  {userAnswer === key && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              {passed && (
                <button onClick={handleGetCertificate} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                  <Award className="w-5 h-5" />
                  <span>Get Certificate</span>
                </button>
              )}
              <button
                onClick={handleClose}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-auto relative">
        <button
          title='Close'
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{courseName}</h1>
                <p className="text-blue-100">Test your knowledge and earn your certificate</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 mb-1">Progress</div>
              <div className="text-lg font-semibold">
                {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-900 mix-blend-multiply">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">Q{currentQuestionIndex + 1}</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>No time limit</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = selectedAnswers[currentQuestion._id] === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(currentQuestion._id, key)}
                  className={`w-full p-5 text-left rounded-xl transition-all duration-200 border-2 group hover:shadow-md ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-600 group-hover:border-gray-400'
                    }`}>
                      {key}
                    </div>
                    <span className={`flex-1 font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-800'
                    }`}>
                      {value}
                    </span>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500'
                      : index < currentQuestionIndex
                      ? 'bg-emerald-500'
                      : isQuestionAnswered(questions[index]._id)
                      ? 'bg-blue-200'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isQuestionAnswered(currentQuestion._id)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;