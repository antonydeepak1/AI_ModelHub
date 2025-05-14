// src/components/MedicalFileProcessor.jsx
import React, { useState, useCallback } from "react";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Bot,
  Upload,
  Network,
  Bookmark,
  ChevronDown,
  Check,
  MoveHorizontal,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
const languages = ["Tamil", "Hindi", "Kannada", "Telugu", "Malayalam", "French", "Spanish"];

const sections = [
  {
    label: "Original Text",
    key: "original_text",
    explain: "This is the unprocessed version of the uploaded document.",
  },
  {
    label: "Simplified Text",
    key: "simplified_text",
    explain: "A more understandable version of the medical content.",
  },
  {
    label: "Translated Text",
    key: "translated_text",
    explain: "Translated to your selected language.",
  },
  {
    label: "Medical Entities",
    key: "medical_entities",
    explain: "Key medical terms detected by AI.",
  },
];

const MedicalFileProcessor = () => {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState("Tamil");
  const [result, setResult] = useState(null);
  const [processingState, setProcessingState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      toast.success(`Selected: ${e.target.files[0].name}`);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      toast.success(`File \"${e.dataTransfer.files[0].name}\" selected`);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_lang", lang);

    setProcessingState("loading");
    try {
      const response = await axios.post(`${API_URL}/medical/process`, formData);
      setResult(response.data);
      setProcessingState("done");
      toast.success("File processed successfully");
    } catch {
      toast.error("Failed to process file. Please try again.");
      setProcessingState("idle");
    }
  };

  return (
    <div className="p-6 w-full font-urbanist">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <motion.div
          className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full shadow mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Medical File Processor
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Simplify and Translate Medical Documents
        </p>
      </div>

      {/* Upload Form */}
      {processingState === "idle" && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Drag & Drop */}
          <div
            className={clsx(
              "border border-black dark:border-white rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragging
                ? "bg-gray-100 dark:bg-zinc-800"
                : "bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-900"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <MoveHorizontal className="h-6 w-6 mx-auto mb-2 text-black dark:text-white" />
            <p className="text-sm text-black dark:text-white">
              {file ? `Selected: ${file.name}` : "Drop file or click to select"}
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-black dark:text-white">
              Output Language
            </label>
            <Listbox value={lang} onChange={setLang}>
              <div className="relative">
                <Listbox.Button className="w-full border border-black dark:border-white rounded px-4 py-2 bg-white dark:bg-black text-black dark:text-white">
                  {lang}
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </Listbox.Button>
                <Listbox.Options className="absolute bottom-full mb-1 w-full bg-white dark:bg-black rounded-md shadow z-10">
                  {languages.map((language) => (
                    <Listbox.Option
                      key={language}
                      value={language}
                      className="cursor-pointer px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {({ selected }) => (
                        <span className="flex items-center gap-2">
                          {selected && <Check className="w-4 h-4 text-green-500" />}
                          {language}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 text-base font-semibold text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-white dark:hover:bg-gray-100 rounded transition"
          >
            {isDragging ? "Processing..." : "⚡ Process Document"}
          </button>
        </form>
      )}

      {/* Loading */}
      {processingState === "loading" && (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <Network className="h-8 w-8 mx-auto mb-3 text-black dark:text-white animate-spin" />
          <p className="font-semibold">Processing document...</p>
        </div>
      )}

      {/* Results */}
      {processingState === "done" && result && (
        <motion.div className="mt-10 space-y-8">
          <motion.div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {["Upload", "Simplify", "Analyze", "Translate"].map((step, idx) => (
              <motion.div
                key={step}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="rounded-full p-2 bg-black text-white shadow">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-black dark:text-white">{step}</span>
                {idx < 3 && <div className="w-4 h-px bg-black mx-2" />}
              </motion.div>
            ))}
          </motion.div>

          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4 min-w-full">
              {sections.map(({ label, key, explain }, idx) => (
                <motion.div
                  key={key}
                  className="flex-shrink-0 w-[300px] md:w-[400px] p-4 border border-black dark:border-white bg-white dark:bg-black rounded-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <h3 className="font-semibold text-black dark:text-white flex items-center mb-2">
                    <Bookmark className="h-4 w-4 mr-2" />
                    {label}
                  </h3>
                  <pre className="text-xs text-gray-800 dark:text-white whitespace-pre-wrap max-h-[250px] overflow-auto">
                    {result[key]}
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MedicalFileProcessor;
