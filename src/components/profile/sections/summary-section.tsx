"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateSummary } from "@/store/slices/profileSlice";
import { ProfileApiService } from "@/lib/api/profile";
import { Save, Edit3, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SummarySection() {
  const dispatch = useAppDispatch();
  const { summary } = useAppSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSummary, setTempSummary] = useState(summary);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Update temp summary when Redux store changes (from localStorage)
  useEffect(() => {
    setTempSummary(summary);
  }, [summary]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Update Redux store first
      dispatch(updateSummary(tempSummary));

      // Save to backend
      await ProfileApiService.updateSummary(tempSummary);

      setSaveMessage({
        type: "success",
        text: "Summary updated successfully!",
      });
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving summary:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save summary. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempSummary(summary);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempSummary(summary);
    setIsEditing(true);
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Professional Summary
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Write a compelling summary that highlights your key strengths
                and experience
              </p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 shadow-lg hover:shadow-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Summary"}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md text-xs">
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Summary</span>
                </button>
              )}
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                saveMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}>
              {saveMessage.text}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-white/10 shadow-lg p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Write a Professional Summary
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This summary will appear at the top of your resume and
                    should highlight your most relevant qualifications.
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives. Keep it concise but impactful, typically 3-4 sentences..."
                  />

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span>Character count: {tempSummary.length}</span>
                      <span>Recommended: 150-300 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                        💡
                      </div>
                      <span>
                        Tip: Use action verbs and quantify achievements when
                        possible
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary ? (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {summary}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                      <FileText className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        No summary written yet
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Click the Edit button to write your professional summary
                      </p>
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 mx-auto text-xs">
                        <Edit3 className="w-4 h-4" />
                        <span>Write Summary</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Writing Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6 h-fit sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Writing Tips
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best practices for your summary
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Do's */}
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Do's
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        Use strong action verbs (led, developed, implemented)
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        Quantify achievements with numbers and percentages
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Highlight relevant skills and technologies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Keep it concise (3-4 sentences)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        Tailor to the specific job you're applying for
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Don'ts */}
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Don'ts
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Use first person pronouns (I, me, my)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Include personal information or hobbies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Make it too generic or vague</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Exceed 4-5 sentences</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Use clichés or overused buzzwords</span>
                    </li>
                  </ul>
                </div>

                {/* Character Count Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/30 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    Character Count Guide
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span className="font-medium">
                        {isEditing ? tempSummary.length : summary.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended:</span>
                      <span className="font-medium">150-300</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (isEditing ? tempSummary.length : summary.length) <
                          150
                            ? "bg-yellow-500"
                            : (isEditing
                                ? tempSummary.length
                                : summary.length) <= 300
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            ((isEditing ? tempSummary.length : summary.length) /
                              300) *
                              100,
                            100
                          )}%`,
                        }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
