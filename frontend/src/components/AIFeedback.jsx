import { Sparkles, MessageSquare } from 'lucide-react';

function AIFeedback({ feedback }) {
  // Simple markdown parser for bold and line breaks
    const formatText = (text) => {
        return text.split('\n').map((line, i) => {
        // Replace **text** with <strong>text</strong>
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formatted = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
        return <p key={i} className="mb-3 last:mb-0">{formatted}</p>;
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold">AI Coach Feedback</h3>
        </div>
        <div className="text-gray-200 leading-relaxed">{formatText(feedback)}</div>
        </div>
    );
}

export default AIFeedback;
