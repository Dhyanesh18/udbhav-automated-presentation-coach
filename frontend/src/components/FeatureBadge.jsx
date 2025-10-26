export default function FeatureBadge({ icon, text }) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition">
        {icon}
        <span className="text-sm font-medium">{text}</span>
        </div>
    );
}
