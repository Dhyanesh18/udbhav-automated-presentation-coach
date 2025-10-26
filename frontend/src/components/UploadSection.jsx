import { Upload, Loader2, Zap, AlertCircle } from 'lucide-react';

export default function UploadSection({ file, loading, error, handleFileChange, handleUpload }) {
    return (
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 mb-16">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-3xl font-bold mb-3 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Upload Your Audio
            </h2>
            <p className="text-purple-200 mb-8">Supports MP3, WAV, or video files with audio</p>

            <label className="w-full max-w-md mx-auto block">
            <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative bg-white/5 border-2 border-dashed border-white/30 rounded-2xl p-12 text-center hover:border-white/50 transition">
                <Upload className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-purple-200">Audio or video files accepted</p>
                </div>
            </div>
            <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
            />
            </label>

            {file && (
            <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">{file.name}</span>
            </div>
            )}

            <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="group relative mt-6 px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white disabled:opacity-50 transition-all hover:shadow-xl hover:scale-105"
            >
            {loading ? (
                <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={20} />
                <span>Analyzing Your Speech...</span>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                <Zap size={20} />
                <span>Analyze with AI</span>
                </div>
            )}
            </button>

            {error && (
            <div className="mt-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl p-4 flex items-center gap-3 justify-center">
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-200 text-sm">{error}</p>
            </div>
            )}
        </div>
        </div>
    );
}
