import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail, Lock, User } from 'lucide-react';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        if (isLogin) {
            await login(formData.email, formData.password);
        } else {
            await register(formData.name, formData.email, formData.password);
        }
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                AI Presentation Coach
            </h1>
            <p className="text-purple-200">Perfect your public speaking with AI</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex gap-2 mb-6">
                <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-xl font-semibold transition ${
                    isLogin ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'
                }`}
                >
                Login
                </button>
                <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-xl font-semibold transition ${
                    !isLogin ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'
                }`}
                >
                Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                    <div className="relative">
                    <User className="absolute left-3 top-3 text-purple-300" size={20} />
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                        placeholder="Your name"
                    />
                    </div>
                </div>
                )}

                <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-purple-300" size={20} />
                    <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="you@example.com"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-purple-300" size={20} />
                    <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="••••••••"
                    />
                </div>
                </div>

                {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">
                    {error}
                </div>
                )}

                <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white disabled:opacity-50 transition hover:shadow-xl hover:scale-105"
                >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Please wait...</span>
                    </div>
                ) : (
                    <span>{isLogin ? 'Login' : 'Create Account'}</span>
                )}
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}