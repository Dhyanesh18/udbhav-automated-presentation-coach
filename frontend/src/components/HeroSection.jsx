import { Sparkles, Mic, TrendingUp, Award } from 'lucide-react';
import FeatureBadge from './FeatureBadge';

export default function HeroSection() {
    return (
        <section className="relative px-4 pt-20 pb-32 text-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">AI-Powered Speech Analysis</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Master Your<br />Presentation Skills
            </h1>

            <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload your speech recording and get instant AI-powered insights on clarity, pacing, and confidence. Your personal presentation coach.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
            <FeatureBadge icon={<Mic className="w-4 h-4" />} text="Real-time Analysis" />
            <FeatureBadge icon={<TrendingUp className="w-4 h-4" />} text="Advanced Metrics" />
            <FeatureBadge icon={<Award className="w-4 h-4" />} text="AI Coaching" />
            </div>
        </div>
        </section>
    );
}
