import { Mic, Clock } from 'lucide-react';

export default function TranscriptSection({ transcript, duration }) {
    if (!transcript) return null;

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Mic className="w-6 h-6 text-purple-400" />
            Full Transcript
        </h3>

        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <p className="text-purple-100 leading-relaxed text-lg">{transcript}</p>
        </div>

        {duration && (
            <p className="text-purple-300 text-sm mt-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duration: {duration} seconds
            </p>
        )}
        </div>
    );
}
