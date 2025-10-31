"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "file", label: "File" },
    { value: "dropdown", label: "Dropdown" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
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

    // Validation
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
      // Convert options to array if present
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

      // Redirect to list page after 2 seconds
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
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Dynamic Question</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Text */}
        <div>
          <label
            htmlFor="questionText"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Question Text *
          </label>
          <input
            type="text"
            id="questionText"
            name="questionText"
            value={formData.questionText}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your question"
            required
          />
        </div>

        {/* Input Type */}
        <div>
          <label
            htmlFor="inputType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Input Type *
          </label>
          <select
            id="inputType"
            name="inputType"
            value={formData.inputType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {inputTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Options Field - Conditional */}
        {showOptionsField && (
          <div>
            <label
              htmlFor="options"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Options * (comma separated)
            </label>
            <textarea
              id="options"
              name="options"
              value={formData.options}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Option 1, Option 2, Option 3"
              rows={3}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter options separated by commas
            </p>
          </div>
        )}

        {/* Is Required */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRequired"
            name="isRequired"
            checked={formData.isRequired}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isRequired"
            className="ml-2 block text-sm text-gray-700"
          >
            Is Required
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Question"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/questions")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
