import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

export default function DenoiseForm() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://322d-34-143-141-66.ngrok-free.app";

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      toast.success("✅ File ready to denoise!");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    multiple: false,
  });

  const handleDenoise = async () => {
    if (!file) {
      toast.error("Please select an audio file.");
      return;
    }

    setLoading(true);
    toast.info("🚀 Sending to server...");

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await axios.post(`${API_BASE}/denoise/`, formData, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(response.data);
      setAudioURL(url);
      toast.success("✅ Denoising complete!");
    } catch {
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-center font-sans">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl transition-all border dark:border-zinc-700">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-zinc-800 text-white p-4 rounded-full shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Audio Denoiser</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drop your noisy audio and we’ll clean it up in seconds.
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? "border-green-500 bg-green-50 dark:bg-zinc-800 shadow-inner"
              : "border-gray-300 dark:border-gray-600 hover:border-pink-400"
          }`}
        >
          <input {...getInputProps()} />
          {!file ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Drag & drop your audio file or <span className="underline">click here</span>
            </p>
          ) : (
            <div className="text-left text-sm text-pink-700 dark:text-pink-400 font-medium">
              🎵 Selected: {file.name}
            </div>
          )}
        </div>

        <button
          className="mt-6 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 shadow-sm"
          onClick={handleDenoise}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Denoising...
            </>
          ) : (
            <>⚡ Denoise Audio</>
          )}
        </button>

        {audioURL && (
          <div className="mt-6 text-left">
            <p className="text-sm text-gray-500 mb-1">🎧 Output:</p>
            <audio controls src={audioURL} className="w-full rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
