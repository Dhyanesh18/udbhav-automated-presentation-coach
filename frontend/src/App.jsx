import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import SessionsSidebar from './components/SessionsSidebar';
import RecordingHistory from './components/RecordingHistory';
import Footer from './components/Footer';
import LoginRegister from './components/LoginRegister';
import AudioRecorder from './components/AudioRecorder';
import { LogOut } from 'lucide-react';

function MainApp() {
  const { user, logout, token, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [recordMode, setRecordMode] = useState('upload');

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    if (activeSession) {
      fetchRecordings(activeSession.id);
    }
  }, [activeSession]);

  const handleRecordingComplete = (recordedFile) => {
    setFile(recordedFile);
    setError(null);
    setResults(null);
    // Auto-upload the recording
    handleUploadFile(recordedFile);
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSessions(data);
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const fetchRecordings = async (sessionId) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/recordings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRecordings(data);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
    }
  };

  const handleCreateSession = async (name) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const newSession = await response.json();
      setSessions([newSession, ...sessions]);
      setActiveSession(newSession);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleUploadFile = async (fileToUpload = file) => {
    if (!fileToUpload) {
      setError("Please select an audio file first");
      return;
    }

    if (!activeSession) {
      setError("Please select or create a session first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch(`/api/sessions/${activeSession.id}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      fetchRecordings(activeSession.id);
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginRegister />;
  }

  return (
    <div className="h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col overflow-hidden">
      {/* Navbar - Full Width */}
      <nav className="w-full bg-slate-900/50 backdrop-blur-xl border-b border-white/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              AI
            </div>
            <div>
              <span className="text-xl font-bold">Presentation Coach</span>
              {activeSession && (
                <p className="text-sm text-purple-300">Session: {activeSession.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-purple-200">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition text-red-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SessionsSidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          onCreateSession={handleCreateSession}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {!activeSession ? (
              <div className="max-w-2xl mx-auto text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Welcome to AI Presentation Coach!</h2>
                <p className="text-purple-200 mb-6">Create a session to start practicing your presentations</p>
              </div>
            ) : (
              <>
                <HeroSection />
                
                {/* Tab Selector */}
                <div className="mb-6">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setRecordMode('upload')}
                      className={`px-6 py-3 rounded-xl font-semibold transition ${
                        recordMode === 'upload'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setRecordMode('record')}
                      className={`px-6 py-3 rounded-xl font-semibold transition ${
                        recordMode === 'record'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Live Recording
                    </button>
                  </div>
                </div>

                {recordMode === 'upload' ? (
                  <UploadSection
                    file={file}
                    loading={loading}
                    error={error}
                    handleFileChange={handleFileChange}
                    handleUpload={handleUploadFile}
                  />
                ) : (
                  <AudioRecorder 
                    onRecordingComplete={handleRecordingComplete}
                    loading={loading}
                  />
                )}

                {results && (
                  <div className="mb-8">
                    <ResultsSection results={results} />
                  </div>
                )}

                <RecordingHistory recordings={recordings} />
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;