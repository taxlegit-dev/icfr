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
  const [processes, setProcesses] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [showProcesses, setShowProcesses] = useState(false);
  const [subprocesses, setSubprocesses] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedSubprocesses, setSelectedSubprocesses] = useState<
    Record<string, string[]>
  >({});
  const [showSubprocesses, setShowSubprocesses] = useState(false);
  const [loadingSubprocesses, setLoadingSubprocesses] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

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

    try {
      const response = await fetch("/api/generate-sop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate processes");
      }

      const data = await response.json();
      setProcesses(data.processes);
      setShowProcesses(true);
    } catch (error) {
      console.error("Error generating SOP:", error);
      alert("Failed to generate processes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetSubprocesses = async () => {
    if (selectedProcesses.length === 0) return;

    setLoadingSubprocesses(true);
    const newSubprocesses: Record<string, string[]> = {};
    const newSelectedSubprocesses: Record<string, string[]> = {};

    try {
      // Parallel API calls for all selected processes
      const promises = selectedProcesses.map(async (process) => {
        const response = await fetch("/api/generate-subprocesses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ process }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to generate subprocesses for ${process}: ${errorData.error}`
          );
        }

        const data = await response.json();
        return data;
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        newSubprocesses[result.process] = result.subprocesses;
        newSelectedSubprocesses[result.process] = [];
      });

      setSubprocesses(newSubprocesses);
      setSelectedSubprocesses(newSelectedSubprocesses);
      setShowSubprocesses(true);
      setActiveTab(selectedProcesses[0]); // Set first process as active tab
    } catch (error) {
      console.error("Error generating subprocesses:", error);
      alert("Failed to generate subprocesses. Please try again.");
    } finally {
      setLoadingSubprocesses(false);
    }
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

          {!showProcesses ? (
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
          ) : !showSubprocesses ? (
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Processes for SOP Generation
                </h2>
                <p className="text-gray-300">
                  Choose the business processes you want to generate SOPs for:
                </p>
              </div>

              <div className="space-y-4">
                {processes.map((process, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedProcesses.includes(process)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProcesses((prev) => [...prev, process]);
                        } else {
                          setSelectedProcesses((prev) =>
                            prev.filter((p) => p !== process)
                          );
                        }
                      }}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-white font-medium">{process}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleGetSubprocesses}
                  disabled={
                    selectedProcesses.length === 0 || loadingSubprocesses
                  }
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingSubprocesses
                    ? "Getting Subprocesses..."
                    : "Get Subprocesses"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Subprocesses for SOP Generation
                </h2>
                <p className="text-gray-300">
                  Choose the subprocesses you want to generate SOPs for:
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-600 pb-4">
                {selectedProcesses.map((process) => (
                  <button
                    key={process}
                    onClick={() => setActiveTab(process)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeTab === process
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {process}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab && subprocesses[activeTab] && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {activeTab} Subprocesses
                  </h3>
                  {subprocesses[activeTab].map((subprocess, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedSubprocesses[activeTab]?.includes(subprocess) || false}
                        onChange={(e) => {
                          const currentSelected = selectedSubprocesses[activeTab] || [];
                          if (e.target.checked) {
                            setSelectedSubprocesses((prev) => ({
                              ...prev,
                              [activeTab]: [...currentSelected, subprocess],
                            }));
                          } else {
                            setSelectedSubprocesses((prev) => ({
                              ...prev,
                              [activeTab]: currentSelected.filter((s) => s !== subprocess),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">{subprocess}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    console.log("Selected subprocesses:", selectedSubprocesses);
                    alert("Subprocesses selected! Ready for SOP generation.");
                    // Here you can add logic to proceed with SOP generation for selected subprocesses
                  }}
                  disabled={Object.values(selectedSubprocesses).every(arr => arr.length === 0)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate SOPs for Selected Subprocesses
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
