"use client";

import { useMemo, useRef, useState } from "react";
import { coverLetterApi } from "@/lib/api/cover-letter";
import { useTheme } from "@/contexts/theme-context";

type Mode = "resume" | "jd" | "both";

const DEFAULT_TEMPLATE = `<section style="font-family: Arial, Calibri, 'Times New Roman', sans-serif; color:inherit; line-height:1.5;">
  <header>
    <p style="margin:0 0 6px 0; font-weight:700; font-size:18px;">Your Name</p>
    <p style="margin:0 0 2px 0; font-size:12px;">email@example.com | (555) 123-4567 | City, ST | LinkedIn</p>
    <p style="margin:12px 0; font-size:12px;">Date</p>
    <p style="margin:0 0 2px 0; font-size:12px;">Hiring Manager Name</p>
    <p style="margin:0 0 2px 0; font-size:12px;">Company Name</p>
  </header>
  <p style="margin:16px 0 8px 0;">Dear Hiring Manager,</p>
  <p style="margin:0 0 8px 0;">Intro paragraph…</p>
  <ul style="margin:0 0 8px 20px;">
    <li>Achievement 1 with metric</li>
    <li>Achievement 2 with metric</li>
    <li>Achievement 3 with metric</li>
  </ul>
  <p style="margin:0 0 8px 0;">Closing paragraph…</p>
  <p style="margin:16px 0 0 0;">Sincerely,<br/>Your Name</p>
</section>`;

export default function CoverLetterGenerator() {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<Mode>("both");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string>(DEFAULT_TEMPLATE);
  const [showPasteResume, setShowPasteResume] = useState(false);
  const [showPasteJd, setShowPasteJd] = useState(false);

  const editableRef = useRef<HTMLDivElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const jdFileRef = useRef<HTMLInputElement>(null);

  const disabledGenerate = useMemo(() => {
    if (loading) return true;
    if (mode === "resume") return resumeText.trim().length < 20;
    if (mode === "jd") return jdText.trim().length < 20;
    return resumeText.trim().length < 20 || jdText.trim().length < 20;
  }, [mode, loading, resumeText, jdText]);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        resumeText: resumeText || undefined,
        jobDescription: jdText || undefined,
        targetJobTitle: jobTitle || undefined,
        companyName: companyName || undefined,
      };
      const res =
        mode === "resume"
          ? await coverLetterApi.fromResume(payload)
          : mode === "jd"
          ? await coverLetterApi.fromJd(payload)
          : await coverLetterApi.fromBoth(payload);
      setHtml(res.html || DEFAULT_TEMPLATE);
      // sync editable
      if (editableRef.current)
        editableRef.current.innerHTML = res.html || DEFAULT_TEMPLATE;
    } catch (e: any) {
      setError(e?.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const downloadDoc = () => {
    const content = editableRef.current?.innerHTML || html;
    const blob = new Blob(
      [
        `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`,
      ],
      { type: "application/msword" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${jobTitle || "cover-letter"}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    const content = editableRef.current?.innerHTML || html;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Cover Letter</title></head><body>${content}<script>window.onload=()=>{window.print();window.close();}</script></body></html>`
    );
    win.document.close();
  };

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setter: (val: string) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const { text } = await coverLetterApi.extractText(file);
      setter(text);
    } catch (err: any) {
      setError(err?.message || "Failed to extract text from file");
    } finally {
      setLoading(false);
    }
  };

  const onPick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const { text } = await coverLetterApi.extractText(file);
      setter(text);
    } catch (err: any) {
      setError(err?.message || "Failed to extract text from file");
    } finally {
      setLoading(false);
    }
  };

  const resetTemplate = () => {
    setHtml(DEFAULT_TEMPLATE);
    if (editableRef.current) editableRef.current.innerHTML = DEFAULT_TEMPLATE;
  };

  const copyHtml = async () => {
    const content = editableRef.current?.innerHTML || html;
    await navigator.clipboard.writeText(content);
  };

  const currentWordCount = (() => {
    const text = (
      editableRef.current?.innerText || html.replace(/<[^>]+>/g, " ")
    )
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(" ").length : 0;
  })();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 text-slate-900 dark:text-slate-100">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 px-6 py-[1.1rem] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-semibold">CL</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">Cover Letter</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">
                |
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                Generate a tailored cover letter from Resume and JD
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={printPdf}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Download PDF
            </button>
            <button
              onClick={downloadDoc}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200/50 dark:border-white/10 rounded-xl text-sm font-semibold">
              Download DOC
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col min-h-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl">
          <div className="px-4 pt-3 pb-2 border-b border-gray-200/20 dark:border-white/10 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-purple-600 text-white text-xs font-semibold">
              CL
            </span>
            <h3 className="text-sm font-semibold">Inputs</h3>
            <div className="ml-auto flex gap-2 text-xs">
              <button
                onClick={resetTemplate}
                className="px-2.5 py-1 rounded-md border border-gray-200/50 dark:border-white/10">
                Reset Template
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setMode("resume")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  mode === "resume"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                    : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-white/10 backdrop-blur hover:bg-white"
                }`}>
                From Resume
              </button>
              <button
                onClick={() => setMode("jd")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  mode === "jd"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                    : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-white/10 backdrop-blur hover:bg-white"
                }`}>
                From JD
              </button>
              <button
                onClick={() => setMode("both")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  mode === "both"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                    : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-white/10 backdrop-blur hover:bg-white"
                }`}>
                Resume + JD
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Target Job Title"
                className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
              />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
              />
            </div>

            {(mode === "resume" || mode === "both") && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white text-[10px] font-semibold">
                      R
                    </span>
                    <label className="block text-xs font-semibold">
                      Resume
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasteResume((s) => !s)}
                      className="px-2 py-1 text-xs rounded-md border border-gray-200/60 dark:border-slate-700">
                      {showPasteResume ? "Switch to Upload" : "Paste Resume"}
                    </button>
                    <span className="text-[11px] opacity-80">
                      PDF/DOC/DOCX/TXT
                    </span>
                  </div>
                </div>
                {!showPasteResume ? (
                  <div
                    onClick={() => resumeFileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, setResumeText)}
                    className="w-full rounded-lg border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-blue-400 cursor-pointer">
                    <p className="text-sm font-medium mb-0.5">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs opacity-80">
                      PDF, DOC, DOCX, TXT (max 5MB)
                    </p>
                    <input
                      ref={resumeFileRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => onPick(e, setResumeText)}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </div>
                ) : (
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-28 border rounded-md p-2 text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    placeholder="Paste or write your resume text here"
                  />
                )}
              </div>
            )}
            {(mode === "jd" || mode === "both") && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white text-[10px] font-semibold">
                      JD
                    </span>
                    <label className="block text-xs font-semibold">
                      Job Description
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const area = document.getElementById("jd-paste-area");
                        if (!area) return;
                        area.classList.toggle("hidden");
                      }}
                      className="px-2 py-1 text-xs rounded-md border dark:border-slate-700">
                      Paste JD
                    </button>
                    <span className="text-[11px] opacity-80">
                      PDF/DOC/DOCX/TXT
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => jdFileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, setJdText)}
                  className="w-full rounded-lg border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/40 p-6 text-center hover:border-blue-400 cursor-pointer">
                  <p className="text-sm font-medium mb-0.5">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs opacity-80">
                    PDF, DOC, DOCX, TXT (max 5MB)
                  </p>
                  <input
                    ref={jdFileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => onPick(e, setJdText)}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
                {false && <div></div>}
                {showPasteJd && (
                  <div className="mt-2">
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="w-full h-28 border rounded-md p-2 text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                      placeholder="Paste or write the JD here"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mt-3">
              <button
                disabled={disabledGenerate}
                onClick={handleGenerate}
                className={`px-4 py-2 rounded-md text-sm ${
                  disabledGenerate
                    ? "bg-gray-300 text-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                }`}>
                {loading ? "Generating…" : "Generate Cover Letter"}
              </button>
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </div>
          </div>
        </div>

        <div className="min-h-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl flex flex-col">
          <div className="px-5 pt-4 pb-3 border-b border-gray-200/20 dark:border-white/10 flex items-center gap-2">
            <h3 className="text-sm font-semibold">Preview</h3>
            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700">
                {currentWordCount} words
              </span>
              <button
                onClick={copyHtml}
                className="px-2 py-1 rounded-md border border-gray-200/60 dark:border-slate-700">
                Copy HTML
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              className="prose prose-slate dark:prose-invert max-w-none p-6 outline-none text-sm text-slate-900 dark:text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
