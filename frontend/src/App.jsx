import { useState } from 'react';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an audio file first");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulated AI analysis
    setTimeout(() => {
      setResults({
        clarity_score: 8.5,
        total_fillers: 7,
        words_per_minute: 145,
        pace_feedback: "Optimal",
        long_pauses: [12, 45],
        pacing_segments: [
          { time: 0, wpm: 130 },
          { time: 10, wpm: 145 },
          { time: 20, wpm: 155 },
          { time: 30, wpm: 140 },
          { time: 40, wpm: 150 },
          { time: 50, wpm: 142 }
        ],
        filler_words: { "um": 3, "uh": 2, "like": 2 },
        ai_feedback:
          "Great job! Your presentation shows strong clarity and confidence...",
        transcript:
          "Hello everyone, thank you for joining today's presentation...",
        duration: 58
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <HeroSection />
      <UploadSection
        file={file}
        loading={loading}
        error={error}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
      />
      {results && <ResultsSection results={results} />}
      <Footer />
    </div>
  );
}

export default App;
