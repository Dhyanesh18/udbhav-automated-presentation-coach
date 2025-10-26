import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function PaceChart({ segments }) {
    if (!segments || segments.length === 0) return null;

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Speaking Pace Over Time
        </h3>

        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={segments}>
            <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.7)' }}
            />

            <YAxis
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Words/Minute', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
            />

            <Tooltip
                contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                }}
            />

            <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Min', fill: '#10b981' }} />
            <ReferenceLine y={160} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Max', fill: '#10b981' }} />

            <Area type="monotone" dataKey="wpm" stroke="#a855f7" strokeWidth={3} fill="url(#colorWpm)" />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    );
}
