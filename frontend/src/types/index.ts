export interface WorkSession {
    id: number;
    description: string;
    startTime: string;
    endTime: string | null;
}

export interface Stats {
    totalHoursWorked: number;
    contractedHours: number;
}

export interface StartSessionRequest {
    description: string;
}
