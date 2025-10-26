import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function RecordingHistory({ recordings }) {
    if (!recordings || recordings.length === 0) {
        return (
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
            <History className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
            <p className="text-gray-400">No recordings yet in this session</p>
        </div>
        );
    }

    const getScoreChange = (current, previous) => {
        if (!previous) return null;
        const diff = current - previous;
        if (Math.abs(diff) < 0.5) return { icon: Minus, color: 'text-gray-400', text: 'No change' };
        if (diff > 0) return { icon: TrendingUp, color: 'text-green-400', text: `+${diff.toFixed(1)}` };
        return { icon: TrendingDown, color: 'text-red-400', text: diff.toFixed(1) };
    };

    const formatFeedback = (text) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formatted = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
        });
        return <p key={i} className="mb-2 last:mb-0">{formatted}</p>;
    });
    };

    return (
        <div className="space-y-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
            <History className="text-purple-400" />
            Recording History
        </h3>

        {recordings.map((recording, index) => {
            const prevRecording = recordings[index + 1];
            const scoreChange = getScoreChange(
            recording.metrics.clarity_score,
            prevRecording?.metrics.clarity_score
            );
            const Icon = scoreChange?.icon;

            return (
            <div key={recording.id} className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-400">
                    {new Date(recording.created_at).toLocaleString()}
                    </p>
                    <p className="text-lg font-semibold mt-1">Recording #{recordings.length - index}</p>
                </div>
                {scoreChange && (
                    <div className={`flex items-center gap-1 ${scoreChange.color}`}>
                    {Icon && <Icon size={20} />}
                    <span className="font-semibold">{scoreChange.text}</span>
                    </div>
                )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Clarity Score</p>
                    <p className="text-2xl font-bold text-green-400">{recording.metrics.clarity_score}/10</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400">WPM</p>
                    <p className="text-2xl font-bold text-blue-400">{recording.metrics.words_per_minute}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Filler Words</p>
                    <p className="text-2xl font-bold text-yellow-400">{recording.metrics.total_fillers}</p>
                </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-gray-300">{formatFeedback(recording.ai_feedback)}</div>
                </div>
            </div>
            );
        })}
        </div>
    );
}