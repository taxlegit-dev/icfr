"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Type, 
  List, 
  Check, 
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Hash
} from "lucide-react";

export default function CreateQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    questionText: "",
    inputType: "text",
    options: "",
    isRequired: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputTypes = [
    { value: "text", label: "Text", icon: Type },
    { value: "number", label: "Number", icon: Hash },
    { value: "file", label: "File", icon: FileText },
    { value: "dropdown", label: "Dropdown", icon: List },
    { value: "radio", label: "Radio", icon: Check },
    { value: "checkbox", label: "Checkbox", icon: Check },
  ];

  const showOptionsField = ["dropdown", "radio", "checkbox"].includes(
    formData.inputType
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.questionText.trim()) {
      setError("Question text is required");
      setLoading(false);
      return;
    }

    if (showOptionsField && !formData.options.trim()) {
      setError("Options are required for dropdown, radio, and checkbox types");
      setLoading(false);
      return;
    }

    try {
      const optionsArray = showOptionsField
        ? formData.options
            .split(",")
            .map((opt) => opt.trim())
            .filter((opt) => opt)
        : null;

      const payload = {
        questionText: formData.questionText.trim(),
        inputType: formData.inputType,
        options: optionsArray,
        isRequired: formData.isRequired,
      };

      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      setSuccess("Question created successfully!");
      setFormData({
        questionText: "",
        inputType: "text",
        options: "",
        isRequired: false,
      });

      setTimeout(() => {
        router.push("/admin/dashboard/questions");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError("Failed to create question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Create Question</h1>
          <p className="text-gray-600 text-sm mt-1">
            Add a new question to your SOP questionnaire
          </p>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <input
                type="text"
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter your question"
                required
              />
            </div>

            {/* Input Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Input Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {inputTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = formData.inputType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          inputType: type.value,
                        }))
                      }
                      className={`p-3 rounded-lg border text-xs font-medium transition-all duration-200 flex flex-col items-center space-y-1 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options Field - Conditional */}
            <AnimatePresence>
              {showOptionsField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options * (comma separated)
                  </label>
                  <textarea
                    name="options"
                    value={formData.options}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder="Option 1, Option 2, Option 3"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate options with commas
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Required Field */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isRequired"
                  name="isRequired"
                  checked={formData.isRequired}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isRequired: !prev.isRequired,
                    }))
                  }
                  className={`w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                    formData.isRequired ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{
                      x: formData.isRequired ? 20 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3 h-3 bg-white rounded-full shadow-sm m-1"
                  />
                </div>
              </div>
              <label
                htmlFor="isRequired"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Required field
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Question</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard/questions")}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}