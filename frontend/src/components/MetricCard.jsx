export default function MetricCard({ icon, title, value, subtitle, color }) {
    const colorClasses = {
        green: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30',
        yellow: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30',
        red: 'from-red-500/20 to-pink-500/20 border-red-400/30'
    };

    const iconColorClasses = {
        green: 'text-emerald-400',
        yellow: 'text-yellow-400',
        red: 'text-red-400'
    };

    return (
        <div className={`group relative bg-linear-to-br ${colorClasses[color]} backdrop-blur-xl border rounded-3xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}>
        <div className={`${iconColorClasses[color]} mb-3`}>
            {icon}
        </div>
        <p className="text-sm font-medium text-purple-200 mb-2">{title}</p>
        <p className="text-4xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-xs text-purple-300">{subtitle}</p>}
        </div>
    );
}
