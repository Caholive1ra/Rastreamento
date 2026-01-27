import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, RefreshCw, LogOut, BarChart3 } from 'lucide-react';
import AdminPanel from '../components/AdminPanel';
import { WorkSession, Stats } from '../types';
import { sessionApi, authApi, getUserRole } from '../services/api';

export default function AdminDashboard() {
    const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch all data from API
    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [activeSessionData, sessionsData, statsData] = await Promise.all([
                sessionApi.getActiveSession(),
                sessionApi.getAllSessions(),
                sessionApi.getStats(),
            ]);
            setActiveSession(activeSessionData);
            setSessions(sessionsData);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to connect to server. Make sure the backend is running on port 8080.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial data load and role verification
    useEffect(() => {
        const role = getUserRole();
        if (role !== 'ADMIN') {
            if (role === 'CLIENT') {
                navigate('/client');
            } else {
                navigate('/login');
            }
            return;
        }
        fetchData();
    }, [fetchData, navigate]);

    // Handle session start
    const handleSessionStart = (session: WorkSession) => {
        setActiveSession(session);
        setSessions(prev => [session, ...prev]);
    };

    // Handle session stop
    const handleSessionStop = (session: WorkSession) => {
        setActiveSession(null);
        setSessions(prev => prev.map(s => s.id === session.id ? session : s));
        // Refresh stats after stopping
        sessionApi.getStats().then(setStats).catch(console.error);
    };

    const handleLogout = () => {
        authApi.logout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <Timer className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white">Retainer Dashboard</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchData}
                                className="p-2 text-gray-400 hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                                title="Refresh data"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Admin Panel */}
                    <AdminPanel
                        activeSession={activeSession}
                        onSessionStart={handleSessionStart}
                        onSessionStop={handleSessionStop}
                    />

                    {/* Stats Overview */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-accent" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Stats Overview</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Hours Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Hours Worked</span>
                                    <span className="font-medium text-white">
                                        {stats?.totalHoursWorked.toFixed(1) || 0}h / {stats?.contractedHours || 60}h
                                    </span>
                                </div>
                                <div className="h-3 bg-dark-lighter rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(((stats?.totalHoursWorked || 0) / (stats?.contractedHours || 60)) * 100, 100)}%`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Session Count */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-lighter rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Total Sessions</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {sessions.filter(s => s.endTime).length}
                                    </p>
                                </div>
                                <div className="bg-dark-lighter rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Status</p>
                                    <p className={`text-lg font-bold mt-1 ${activeSession ? 'text-green-400' : 'text-gray-500'}`}>
                                        {activeSession ? '🟢 Active' : '⚪ Idle'}
                                    </p>
                                </div>
                            </div>

                            {/* Recent Sessions */}
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-3">Recent Sessions</p>
                                <div className="space-y-2">
                                    {sessions.filter(s => s.endTime).slice(0, 3).map(session => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg"
                                        >
                                            <span className="text-sm text-white truncate flex-1 mr-2">
                                                {session.description}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(session.startTime).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                    {sessions.filter(s => s.endTime).length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No sessions yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-dark-border mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-xs text-gray-600">
                        Retainer Dashboard MVP • Built with Spring Boot & React
                    </p>
                </div>
            </footer>
        </div>
    );
}
