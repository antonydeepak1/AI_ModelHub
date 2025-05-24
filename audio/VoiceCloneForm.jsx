import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

export default function VoiceCloneForm() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://322d-34-143-141-66.ngrok-free.app";

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    toast.success("Audio file selected!");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    multiple: false,
  });

  const handleClone = async () => {
    if (!text || !file) {
      toast.error("Please provide both text and an audio file.");
      return;
    }

    setLoading(true);
    toast.info("Cloning voice...");

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("audio", file);

      const response = await axios.post(`${API_BASE}/clone/`, formData, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(response.data);
      setAudioURL(url);
      toast.success("Voice cloning completed!");
    } catch (err) {
      toast.error("Voice cloning failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10 text-center">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-zinc-800 text-white p-4 rounded-full">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Voice Cloning</h1>
          <p className="text-sm text-gray-500">Generate AI voice by giving reference audio & text</p>
        </div>

        <input
          type="text"
          className="w-full mt-6 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
          placeholder="Enter text to synthesize"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div
          {...getRootProps()}
          className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 dark:text-gray-400">
            {file ? file.name : "Drop reference audio or click to select"}
          </p>
        </div>

        <button
          className="mt-6 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-black via-zinc-800 to-black text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-40"
          onClick={handleClone}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "🧬 Clone Voice"}
        </button>

        {audioURL && (
          <div className="mt-6 text-left">
            <p className="text-sm text-gray-500 mb-1">🎧 Generated Audio:</p>
            <audio controls src={audioURL} className="w-full rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
