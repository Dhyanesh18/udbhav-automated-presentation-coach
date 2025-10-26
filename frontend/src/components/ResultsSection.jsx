import { Award, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import MetricCard from './MetricCard';
import PaceChart from './PaceChart';
import FillerWords from './FillerWords';
import AIFeedback from './AIFeedback';
import TranscriptSection from './TranscriptSection';

export default function ResultsSection({ results }) {
    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8 relative z-10">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard icon={<Award />} title="Clarity Score" value={`${results.clarity_score}/10`} subtitle="Excellent clarity" color="green" />
            <MetricCard icon={<MessageSquare />} title="Filler Words" value={results.total_fillers} subtitle="Total detected" color="yellow" />
            <MetricCard icon={<TrendingUp />} title="Speaking Pace" value={`${results.words_per_minute}`} subtitle={`${results.pace_feedback} (WPM)`} color="green" />
            <MetricCard icon={<Clock />} title="Long Pauses" value={results.long_pauses.length} subtitle="Strategic breaks" color="yellow" />
        </div>

        <PaceChart segments={results.pacing_segments} />
        <FillerWords fillerWords={results.filler_words} />
        <AIFeedback feedback={results.ai_feedback} />
        <TranscriptSection transcript={results.transcript} duration={results.duration} />
        </div>
    );
}
