import { useState, useEffect, useCallback } from 'react';
import { Play, Square, Clock, AlertCircle } from 'lucide-react';
import { WorkSession } from '../types';
import { sessionApi } from '../services/api';

interface AdminPanelProps {
    activeSession: WorkSession | null;
    onSessionStart: (session: WorkSession) => void;
    onSessionStop: (session: WorkSession) => void;
}

export default function AdminPanel({ activeSession, onSessionStart, onSessionStop }: AdminPanelProps) {
    const [description, setDescription] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate elapsed time from backend startTime
    const calculateElapsedTime = useCallback((startTime: string): number => {
        const start = new Date(startTime).getTime();
        const now = Date.now();
        return Math.floor((now - start) / 1000);
    }, []);

    // Update timer every second when session is active
    useEffect(() => {
        if (!activeSession) {
            setElapsedTime(0);
            return;
        }

        // Initialize with calculated time from backend
        setElapsedTime(calculateElapsedTime(activeSession.startTime));

        const interval = setInterval(() => {
            setElapsedTime(calculateElapsedTime(activeSession.startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession, calculateElapsedTime]);

    // Format seconds to HH:MM:SS
    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds]
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    const handleStart = async () => {
        if (!description.trim()) {
            setError('Please enter a task description');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const session = await sessionApi.startSession(description.trim());
            onSessionStart(session);
            setDescription('');
        } catch (err) {
            setError('Failed to start session. Please try again.');
            console.error('Start session error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStop = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const session = await sessionApi.stopSession();
            onSessionStop(session);
        } catch (err) {
            setError('Failed to stop session. Please try again.');
            console.error('Stop session error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                </div>
            )}

            {!activeSession ? (
                /* Idle State - Show input and start button */
                <div className="space-y-4">
                    <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-400 mb-2">
                            What are you working on?
                        </label>
                        <input
                            id="task-description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                            placeholder="e.g., Designing Website, Code Review..."
                            className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:border-accent 
                         focus:ring-1 focus:ring-accent transition-all"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleStart}
                        disabled={isLoading || !description.trim()}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 
                       bg-accent hover:bg-accent-hover disabled:bg-accent/50 
                       disabled:cursor-not-allowed rounded-xl font-semibold text-white 
                       transition-all duration-200 glow-orange"
                    >
                        <Play className="w-5 h-5" />
                        {isLoading ? 'Starting...' : 'Start Timer'}
                    </button>
                </div>
            ) : (
                /* Active State - Show timer and stop button */
                <div className="space-y-6">
                    {/* Current Task */}
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Currently working on</p>
                        <p className="text-lg font-medium text-white">{activeSession.description}</p>
                    </div>

                    {/* Digital Clock Display */}
                    <div className="text-center py-6">
                        <div className="timer-display text-6xl lg:text-7xl font-bold gradient-text">
                            {formatTime(elapsedTime)}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Started at {new Date(activeSession.startTime).toLocaleTimeString()}
                        </p>
                    </div>

                    {/* Stop Button */}
                    <button
                        onClick={handleStop}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 
                       bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 
                       disabled:cursor-not-allowed rounded-xl font-semibold text-white 
                       transition-all duration-200"
                    >
                        <Square className="w-5 h-5" />
                        {isLoading ? 'Stopping...' : 'Stop Timer'}
                    </button>
                </div>
            )}
        </div>
    );
}
