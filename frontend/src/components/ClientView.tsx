import { useMemo } from 'react';
import { BarChart3, Clock, Calendar, Circle } from 'lucide-react';
import { WorkSession, Stats } from '../types';

interface ClientViewProps {
    sessions: WorkSession[];
    activeSession: WorkSession | null;
    stats: Stats | null;
}

export default function ClientView({ sessions, activeSession, stats }: ClientViewProps) {
    // Calculate progress percentage
    const progressPercentage = useMemo(() => {
        if (!stats) return 0;
        return Math.min((stats.totalHoursWorked / stats.contractedHours) * 100, 100);
    }, [stats]);

    // Group sessions by day
    const groupedSessions = useMemo(() => {
        const completedSessions = sessions.filter(s => s.endTime !== null);
        const groups: Record<string, WorkSession[]> = {};

        completedSessions.forEach(session => {
            const date = new Date(session.startTime);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let label: string;
            if (date.toDateString() === today.toDateString()) {
                label = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                label = 'Yesterday';
            } else {
                label = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                });
            }

            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(session);
        });

        return groups;
    }, [sessions]);

    // Format duration from session
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
        return `${minutes}m`;
    };

    // Format time range
    const formatTimeRange = (session: WorkSession): string => {
        const start = new Date(session.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const end = session.endTime
            ? new Date(session.endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
            : 'now';
        return `${start} - ${end}`;
    };

    return (
        <div className="space-y-6">
            {/* Status Badge */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Circle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Status</h2>
                </div>

                {activeSession ? (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div>
                            <p className="font-medium text-green-400">🟢 Online</p>
                            <p className="text-sm text-gray-400">{activeSession.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-500/10 border border-gray-500/30 rounded-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                        </span>
                        <p className="font-medium text-gray-400">⚪ Offline</p>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Monthly Progress</h2>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Hours Worked</span>
                        <span className="font-medium text-white">
                            {stats?.totalHoursWorked.toFixed(1) || 0}h / {stats?.contractedHours || 60}h
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-dark-lighter rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    <p className="text-xs text-gray-500 text-right">
                        {progressPercentage.toFixed(1)}% of contracted hours
                    </p>
                </div>
            </div>

            {/* Session History */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Session History</h2>
                </div>

                {Object.keys(groupedSessions).length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">No sessions recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSessions).map(([day, daySessions]) => (
                            <div key={day}>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">{day}</h3>
                                <div className="space-y-2">
                                    {daySessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg border border-dark-border/50 hover:border-dark-border transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-accent rounded-full" />
                                                <div>
                                                    <p className="font-medium text-white text-sm">{session.description}</p>
                                                    <p className="text-xs text-gray-500">{formatTimeRange(session)}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-mono text-accent">
                                                {formatDuration(session)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
