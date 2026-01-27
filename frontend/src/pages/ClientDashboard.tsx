import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, Calendar, Circle, LogOut } from 'lucide-react';
import { WorkSession, Stats } from '../types';
import { sessionApi, authApi, getUserRole } from '../services/api';
import logo from '../../assets/logo.png';

export default function ClientDashboard() {
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch data on mount
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
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Verify role
        const role = getUserRole();
        if (role !== 'CLIENT' && role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData, navigate]);

    // Calculate progress percentage
    const progressPercentage = useMemo(() => {
        if (!stats) return 0;
        return Math.min((stats.totalHoursWorked / stats.contractedHours) * 100, 100);
    }, [stats]);

    // Group sessions by date for the log
    const groupedSessions = useMemo(() => {
        const completedSessions = sessions.filter(s => s.endTime !== null);
        const groups: Record<string, WorkSession[]> = {};

        completedSessions.forEach(session => {
            const date = new Date(session.startTime);
            const label = date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long'
            });

            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(session);
        });

        return groups;
    }, [sessions]);

    // Format duration
    const formatDuration = (session: WorkSession): string => {
        if (!session.endTime) return '--:--';
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        const totalMinutes = Math.floor((end - start) / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}min`;
    };

    const handleLogout = () => {
        authApi.logout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="Daniela Laurentino Advocacia"
                                className="w-14 h-14 object-contain rounded-xl"
                            />
                            <div>
                                <h1 className="font-bold text-lg text-white">
                                    Gestão de Horas
                                </h1>
                                <p className="text-sm text-orange-500 font-medium">
                                    Daniela Laurentino Advocacia
                                </p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/30">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6">
                    {/* Status Card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Circle className="w-5 h-5 text-orange-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Status Atual</h2>
                        </div>

                        {activeSession ? (
                            <div className="flex items-center gap-4 p-5 bg-green-500/5 border border-green-500/20 rounded-xl">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                                <div>
                                    <p className="font-semibold text-green-400 text-lg">🟢 ONLINE</p>
                                    <p className="text-gray-400 mt-1">{activeSession.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                                <span className="relative flex h-4 w-4">
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-gray-500"></span>
                                </span>
                                <p className="font-semibold text-gray-400 text-lg">⚪ OFFLINE</p>
                            </div>
                        )}
                    </div>

                    {/* Monthly Progress */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-orange-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Consumo Mensal</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Big numbers */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-orange-500">
                                        {stats?.totalHoursWorked.toFixed(1) || '0.0'}
                                        <span className="text-xl text-gray-400 font-normal ml-1">horas</span>
                                    </p>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    de {stats?.contractedHours || 60} horas contratadas
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>

                            <p className="text-xs text-gray-500 text-right">
                                {progressPercentage.toFixed(1)}% consumido
                            </p>
                        </div>
                    </div>

                    {/* Session Log */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-orange-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Registro de Sessões</h2>
                        </div>

                        {Object.keys(groupedSessions).length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500">Nenhuma sessão registrada ainda</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-800">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Data</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Descrição</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Duração</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(groupedSessions).map(([day, daySessions]) => (
                                            daySessions.map((session, idx) => (
                                                <tr
                                                    key={session.id}
                                                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                                >
                                                    <td className="py-4 px-4">
                                                        {idx === 0 ? (
                                                            <span className="text-sm text-gray-300 capitalize">{day}</span>
                                                        ) : null}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-white">{session.description}</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className="text-sm font-mono text-orange-500 font-medium">
                                                            {formatDuration(session)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-xs text-gray-600">
                        Sistema de Gestão de Horas • Daniela Laurentino Advocacia
                    </p>
                </div>
            </footer>
        </div>
    );
}
