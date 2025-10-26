import { MessageSquare } from 'lucide-react';

export default function FillerWords({ fillerWords }) {
    const entries = Object.entries(fillerWords || {});
    if (entries.length === 0) return null;

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Filler Words Detected
        </h3>

        <div className="flex flex-wrap gap-4">
            {entries.map(([word, count]) => (
            <div
                key={word}
                className="group relative bg-linear-to-br from-red-500/20 to-pink-500/20 backdrop-blur-md border border-red-400/30 px-6 py-3 rounded-2xl hover:scale-105 transition-transform"
            >
                <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 rounded-2xl transition"></div>
                <div className="relative flex items-center gap-3">
                <span className="text-white font-semibold text-lg">"{word}"</span>
                <span className="bg-red-500/30 text-red-100 px-3 py-1 rounded-full text-sm font-bold">×{count}</span>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
