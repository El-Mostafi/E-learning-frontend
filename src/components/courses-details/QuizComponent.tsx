import React, {  useState } from "react";
import { QuizQuestion } from "../../services/coursService";
// import Certificate from "./certificate/Certificate";

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  //this will come from course details this is use just for demo
  // const [certificateData, setCertificateData] = useState({
  //   studentName: "John Smith",
  //   courseName: "Advanced Web Development with React",
  //   score: 95,
  //   date: "May 15, 2023",
  //   instructorName: "Dr. Emily Johnson",
  //   certificateId: "CERT-8392-4721-EDU",
  // });

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

  if (showResults) {
    const passed = quizScore >= 70; // Passing threshold is 70%

    return (
      <div>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <span
                className={`text-4xl ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {passed ? "🎉" : "😔"}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? "Congratulations! you Can Take Certificate" : "Almost There!"}
            </h2>
            <p className="text-gray-600 mb-4">
              You scored {quizScore.toFixed(1)}%
            </p>
            <div
              className={`text-lg font-semibold ${
                passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {passed
                ? "You passed the quiz!"
                : "Keep practicing and try again!"}
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{question.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg ${
                            key === question.correctAnswer
                              ? "bg-green-100 border-green-500"
                              : selectedAnswers[question._id] === key
                              ? "bg-red-100 border-red-500"
                              : "bg-gray-50"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setShowResults(false);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>

        
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Course Quiz</h2>
          <span className="text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerSelect(currentQuestion._id, key)}
              className={`w-full p-4 text-left rounded-lg transition-all ${
                selectedAnswers[currentQuestion._id] === key
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }`}
            >
              <span className="inline-block w-8 h-8 rounded-full bg-white border-2 border-current text-center leading-7 mr-3">
                {key}
              </span>
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isQuestionAnswered(currentQuestion._id)}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
