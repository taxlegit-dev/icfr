"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";

interface Question {
  id: string;
  questionText: string;
  inputType: string;
  options?: string[];
  isRequired: boolean;
}

export default function GenerateSOPPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
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
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        console.error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate required fields
    const missingRequired = questions.filter(
      (q) => q.isRequired && (!answers[q.id] || answers[q.id].length === 0)
    );

    if (missingRequired.length > 0) {
      alert("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    // Placeholder for SOP generation logic
    // In a real implementation, this would send answers to an AI service
    console.log("Answers:", answers);

    alert("SOP generation feature coming soon! Your answers have been logged.");
    setSubmitting(false);
  };

  const renderInput = (question: Question) => {
    const value = answers[question.id] || "";

    switch (question.inputType) {
      case "text":
        return (
          <textarea
            value={value}
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
            value={value}
            onChange={(e) =>
              handleInputChange(question.id, parseInt(e.target.value) || "")
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
            onChange={(e) =>
              handleInputChange(question.id, e.target.files?.[0] || null)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required={question.isRequired}
          />
        );

      case "dropdown":
        return (
          <select
            value={value}
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
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option);
                    handleInputChange(question.id, newValues);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your answer..."
            required={question.isRequired}
          />
        );
    }
  };

  if (status === "loading" || loading) {
    return <Loader />;
  }

  if (!session) {
    return null; // Redirecting to login
  }

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
