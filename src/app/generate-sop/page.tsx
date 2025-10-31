"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";

interface Question {
  id: string;
  questionText: string;
  inputType: "text" | "number" | "file" | "dropdown" | "radio" | "checkbox";
  options?: string[];
  isRequired: boolean;
}

type AnswerValue = string | number | File | string[] | null;

export default function GenerateSOPPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchQuestions();
  }, [session, status, router]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data: { questions: Question[] } = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const missingRequired = questions.filter((q) => {
      const answer = answers[q.id];

      if (!q.isRequired) return false;

      if (answer === null || answer === undefined) return true;

      // Check empty string
      if (typeof answer === "string" && answer.trim().length === 0) return true;

      // Check empty array
      if (Array.isArray(answer) && answer.length === 0) return true;

      return false;
    });

    if (missingRequired.length > 0) {
      alert("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    console.log("Answers:", answers);
    alert("SOP generation feature coming soon! Your answers have been logged.");
    setSubmitting(false);
  };

  const renderInput = (question: Question) => {
    const value = answers[question.id] ?? "";

    switch (question.inputType) {
      case "text":
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="Enter your answer..."
            required={question.isRequired}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(
                question.id,
                e.target.value ? parseInt(e.target.value, 10) : null
              )
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter a number..."
            required={question.isRequired}
          />
        );

      case "file":
        return (
          <input
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(question.id, e.target.files?.[0] ?? null)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required={question.isRequired}
          />
        );

      case "dropdown":
        return (
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required={question.isRequired}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  required={question.isRequired}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const selectedValues = Array.isArray(value) ? value : [];
              return (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      const updatedValues = e.target.checked
                        ? [...selectedValues, option]
                        : selectedValues.filter((v) => v !== option);
                      handleInputChange(question.id, updatedValues);
                    }}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your answer..."
            required={question.isRequired}
          />
        );
    }
  };

  if (status === "loading" || loading) return <Loader />;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Generate Your <span className="text-purple-400">SOP</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Fill out the form below to generate a personalized Statement of
              Purpose.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20"
          >
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-white font-medium">
                    {index + 1}. {question.questionText}
                    {question.isRequired && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  {renderInput(question)}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Generating SOP..." : "Generate SOP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
