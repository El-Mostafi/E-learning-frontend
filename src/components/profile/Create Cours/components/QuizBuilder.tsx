import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useCourse } from "../context/CourseContext";
import Button from "./common/Button";
import { GripVertical, Plus, X, Eye, EyeOff, CheckCircle } from "lucide-react";

const QuizBuilder: React.FC<{ onContinue: () => void; onBack: () => void }> = ({
  onContinue,
  onBack,
}) => {
  const { state, dispatch } = useCourse();
  const { quizQuestions } = state;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>(
    {}
  );
  const [showResults, setShowResults] = useState(false);

  const addQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      question: "",
      options: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      correctAnswer: "" as "A" | "B" | "C" | "D",
    };

    dispatch({
      type: "ADD_QUIZ_QUESTION",
      payload: newQuestion,
    });
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    if (field === "question") {
      dispatch({
        type: "UPDATE_QUIZ_QUESTION",
        payload: {
          id,
          updates: { question: value },
        },
      });
    } else if (field === "correctAnswer") {
      dispatch({
        type: "UPDATE_QUIZ_QUESTION",
        payload: {
          id,
          updates: { correctAnswer: value as "A" | "B" | "C" | "D" },
        },
      });
    } else {
      // It's an option (A, B, C, D)
      const option = field as "A" | "B" | "C" | "D";
      dispatch({
        type: "UPDATE_QUIZ_QUESTION",
        payload: {
          id,
          updates: {
            options: {
              ...quizQuestions.find((q) => q.id === id)!.options,
              [option]: value,
            },
          },
        },
      });
    }

    // Clear error for this field if it exists
    if (errors[`${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${id}-${field}`];
      setErrors(newErrors);
    }
  };

  const removeQuestion = (id: string) => {
    dispatch({
      type: "REMOVE_QUIZ_QUESTION",
      payload: id,
    });

    // Clear any errors for this question
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`${id}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(quizQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch({
      type: "REORDER_QUIZ_QUESTIONS",
      payload: items,
    });
  };

  const validateQuestions = () => {
    const newErrors: Record<string, string> = {};

    if (quizQuestions.length === 0) {
      newErrors.general = "You need to add at least one question";
    } else {
      quizQuestions.forEach((question) => {
        if (!question.question.trim()) {
          newErrors[`${question.id}-question`] = "Question text is required";
        }

        ["A", "B", "C", "D"].forEach((option) => {
          if (!question.options[option as "A" | "B" | "C" | "D"].trim()) {
            newErrors[
              `${question.id}-${option}`
            ] = `Option ${option} is required`;
          }
        });

        if (!question.correctAnswer) {
          newErrors[`${question.id}-correctAnswer`] =
            "Please select the correct answer";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateQuestions()) {
      onContinue();
    }
  };

  const handlePreviewAnswer = (questionId: string, answer: string) => {
    setPreviewAnswers({
      ...previewAnswers,
      [questionId]: answer,
    });
  };

  const calculateScore = () => {
    let correctCount = 0;

    quizQuestions.forEach((question) => {
      if (previewAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    return {
      score: correctCount,
      total: quizQuestions.length,
      percentage: Math.round((correctCount / quizQuestions.length) * 100),
    };
  };

  const resetPreview = () => {
    setPreviewAnswers({});
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quiz Builder</h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              if (!isPreviewMode) {
                resetPreview();
              }
            }}
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
                Preview Quiz
              </>
            )}
          </button>
          <span className="text-sm text-gray-500">
            {quizQuestions.length}{" "}
            {quizQuestions.length === 1 ? "question" : "questions"}
          </span>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {isPreviewMode ? (
        <div className="mb-6">
          <div className="bg-gray-50 p-4 border rounded-lg mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Quiz Preview</h3>
            <p className="text-sm text-gray-600">
              This is how students will see your quiz. Try answering the
              questions to test it.
            </p>
          </div>

          {showResults ? (
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-blue-50 p-4 border-b">
                <h3 className="font-medium text-blue-800">Quiz Results</h3>
              </div>
              <div className="p-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold mb-2">
                    {calculateScore().score}/{calculateScore().total}
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    You scored {calculateScore().percentage}%
                  </div>
                  <Button onClick={resetPreview} size="sm">
                    Try Again
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  {quizQuestions.map((question, index) => {
                    const isCorrect =
                      previewAnswers[question.id] === question.correctAnswer;

                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center mr-2 ${
                              isCorrect
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              Question {index + 1}: {question.question}
                            </p>
                            <div className="mt-2 text-sm">
                              <p>
                                Your answer:{" "}
                                <span className="font-medium">
                                  {previewAnswers[question.id]}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-green-600">
                                  Correct answer:{" "}
                                  <span className="font-medium">
                                    {question.correctAnswer}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {quizQuestions.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-gray-500">No questions added yet</p>
                </div>
              ) : (
                <div className="space-y-6 mb-6">
                  {quizQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 border-b">
                        <h3 className="font-medium">Question {index + 1}</h3>
                      </div>
                      <div className="p-4">
                        <p className="font-medium mb-4">{question.question}</p>

                        <div className="space-y-3">
                          {["A", "B", "C", "D"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={previewAnswers[question.id] === option}
                                onChange={() =>
                                  handlePreviewAnswer(question.id, option)
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-3">
                                <span className="font-medium mr-2">
                                  {option}.
                                </span>
                                {
                                  question.options[
                                    option as "A" | "B" | "C" | "D"
                                  ]
                                }
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {quizQuestions.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowResults(true)}>
                    Submit Quiz
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6 mb-6"
              >
                {quizQuestions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">No questions added yet</p>
                    <Button onClick={addQuestion} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Your First Question
                    </Button>
                  </div>
                ) : (
                  quizQuestions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
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
                              Question {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove question"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <label
                                htmlFor={`question-${question.id}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Question Text{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id={`question-${question.id}`}
                                value={question.question}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "question",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                  ${
                                    errors[`${question.id}-question`]
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                      : "border-gray-300"
                                  }`}
                                placeholder="Enter your question"
                              />
                              {errors[`${question.id}-question`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`${question.id}-question`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Options{" "}
                                <span className="text-red-500">*</span>
                              </p>

                              <div className="space-y-3">
                                {["A", "B", "C", "D"].map((option) => (
                                  <>
                                    <div
                                      key={option}
                                      className="flex items-center"
                                    >
                                      <label className="flex items-center mr-3">
                                        <input
                                          type="radio"
                                          name={`correct-${question.id}`}
                                          value={option}
                                          checked={
                                            question.correctAnswer === option
                                          }
                                          onChange={() =>
                                            updateQuestion(
                                              question.id,
                                              "correctAnswer",
                                              option
                                            )
                                          }
                                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-1 text-sm font-medium">
                                          {option}
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          question.options[
                                            option as "A" | "B" | "C" | "D"
                                          ]
                                        }
                                        onChange={(e) =>
                                          updateQuestion(
                                            question.id,
                                            option,
                                            e.target.value
                                          )
                                        }
                                        className={`flex-1 px-3 py-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                        ${
                                          errors[`${question.id}-${option}`]
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300"
                                        }`}
                                        placeholder={`Option ${option}`}
                                      />
                                    </div>
                                    {errors[`${question.id}-${option}`] && (
                                      <p className="mt-2 text-sm text-red-600">
                                        {errors[`${question.id}-${option}`]}
                                      </p>
                                    )}
                                  </>
                                ))}
                              </div>

                              {errors[`${question.id}-correctAnswer`] && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors[`${question.id}-correctAnswer`]}
                                </p>
                              )}

                              {["A", "B", "C", "D"].some(
                                (option) => errors[`${question.id}-${option}`]
                              ) && (
                                <p className="mt-2 text-sm text-red-600">
                                  All options are required
                                </p>
                              )}
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

      {!isPreviewMode && quizQuestions.length > 0 && (
        <div className="mb-6">
          <Button onClick={addQuestion} variant="outline" fullWidth>
            <Plus className="w-4 h-4 mr-1" />
            Add Another Question
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

export default QuizBuilder;
