package com.tracker.repository;

import com.tracker.entity.WorkSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkSessionRepository extends JpaRepository<WorkSession, Long> {

    /**
     * Find the currently active session (where endTime is null)
     */
    @Query("SELECT ws FROM WorkSession ws WHERE ws.endTime IS NULL")
    Optional<WorkSession> findActiveSession();

    /**
     * Check if there's any active session
     */
    @Query("SELECT COUNT(ws) > 0 FROM WorkSession ws WHERE ws.endTime IS NULL")
    boolean hasActiveSession();

    /**
     * Get all sessions ordered by start time descending (newest first)
     */
    List<WorkSession> findAllByOrderByStartTimeDesc();

    /**
     * Get all completed sessions (for history)
     */
    @Query("SELECT ws FROM WorkSession ws WHERE ws.endTime IS NOT NULL ORDER BY ws.startTime DESC")
    List<WorkSession> findCompletedSessions();
}
