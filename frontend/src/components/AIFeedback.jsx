import { Sparkles } from 'lucide-react';

export default function AIFeedback({ feedback }) {
    if (!feedback) return null;

    return (
        <div className="bg-linear-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            AI Coaching Feedback
        </h3>
        <div className="prose prose-invert max-w-none">
            <p className="text-purple-100 leading-relaxed whitespace-pre-line text-lg">{feedback}</p>
        </div>
        </div>
    );
}
