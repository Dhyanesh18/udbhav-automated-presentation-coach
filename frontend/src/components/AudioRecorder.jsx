import { useState, useRef } from 'react';
import { Mic, Square, Upload } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
            chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            setAudioBlob(blob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        // Timer
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearInterval(timerRef.current);
        }
    };

    const handleUpload = () => {
        if (audioBlob) {
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete(file);
        setAudioBlob(null);
        setRecordingTime(0);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center pb-25 mb-10">
        <h2 className="text-3xl font-bold mb-3 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Record Your Presentation
        </h2>
        <p className="text-purple-200 mb-8">Practice live and get instant AI feedback</p>

        <div className="flex flex-col items-center gap-6">
            {!isRecording && !audioBlob && (
            <button
                onClick={startRecording}
                className="group relative"
            >
                <div className="absolute inset-0 bg-linear-to-r from-red-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative w-32 h-32 bg-linear-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-105 transition cursor-pointer">
                <Mic size={48} className="text-white" />
                </div>
            </button>
            )}

            {isRecording && (
            <div className="space-y-4">
                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Mic size={48} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-red-400">{formatTime(recordingTime)}</div>
                <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition"
                >
                <Square size={20} />
                Stop Recording
                </button>
            </div>
        )}

        {audioBlob && !isRecording && (
            <div className="space-y-4">
                <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <p className="text-green-400 mb-2">✓ Recording Complete</p>
                <p className="text-sm text-gray-300">Duration: {formatTime(recordingTime)}</p>
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mt-4" />
                </div>
                <div className="flex gap-3">
                <button
                    onClick={() => {
                    setAudioBlob(null);
                    setRecordingTime(0);
                    }}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition"
                >
                    Discard
                </button>
                <button
                    onClick={handleUpload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-xl transition"
                >
                    <Upload size={20} />
                    Analyze
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}