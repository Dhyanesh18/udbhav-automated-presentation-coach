import { useState } from 'react';
import { Plus, Folder, Clock } from 'lucide-react';

export default function SessionsSidebar({ sessions, activeSession, onSelectSession, onCreateSession }) {
  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const handleCreate = () => {
    if (sessionName.trim()) {
      onCreateSession(sessionName);
      setSessionName('');
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/20 h-full overflow-y-auto">
        <div className="p-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-purple-800 to-violet-500 rounded-xl font-semibold text-white hover:shadow-xl transition"
          >
            <Plus size={20} />
            New Session
          </button>
        </div>

        <div className="px-4 pb-4 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                activeSession?.id === session.id
                  ? 'bg-purple-600/30 border border-purple-500/50'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder size={20} className="text-purple-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{session.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={12} />
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Session</h3>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Session name (e.g., 'Team Meeting Practice')"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-linear-to-r from-purple-900 to-violet-600 rounded-xl font-semibold hover:shadow-xl transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}