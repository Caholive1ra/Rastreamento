package com.tracker.service;

import com.tracker.entity.WorkSession;
import com.tracker.repository.WorkSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TrackerService {

    private final WorkSessionRepository repository;

    /**
     * Get all sessions ordered by start time (newest first)
     */
    public List<WorkSession> getAllSessions() {
        return repository.findAllByOrderByStartTimeDesc();
    }

    /**
     * Get the currently active session if any
     */
    public Optional<WorkSession> getActiveSession() {
        return repository.findActiveSession();
    }

    /**
     * Start a new work session
     * 
     * @throws IllegalStateException if a session is already active
     */
    public WorkSession startSession(String description) {
        if (repository.hasActiveSession()) {
            throw new IllegalStateException("A session is already running. Stop it before starting a new one.");
        }

        WorkSession session = WorkSession.builder()
                .description(description)
                .startTime(LocalDateTime.now())
                .build();

        return repository.save(session);
    }

    /**
     * Stop the currently active session
     * 
     * @throws IllegalStateException if no session is active
     */
    public WorkSession stopSession() {
        WorkSession activeSession = repository.findActiveSession()
                .orElseThrow(() -> new IllegalStateException("No active session to stop."));

        activeSession.setEndTime(LocalDateTime.now());
        return repository.save(activeSession);
    }

    public double getTotalHoursWorked() {
        return repository.findCompletedSessions().stream()
                .mapToLong(WorkSession::getDurationSeconds)
                .sum() / 3600.0;
    }
}
