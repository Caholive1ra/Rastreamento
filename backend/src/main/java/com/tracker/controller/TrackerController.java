package com.tracker.controller;

import com.tracker.entity.WorkSession;
import com.tracker.service.TrackerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class TrackerController {

    private final TrackerService trackerService;

    /**
     * GET /api/sessions - Returns all sessions (history)
     */
    @GetMapping
    public ResponseEntity<List<WorkSession>> getAllSessions() {
        return ResponseEntity.ok(trackerService.getAllSessions());
    }

    /**
     * GET /api/sessions/active - Returns the current running session or 204 No
     * Content
     */
    @GetMapping("/active")
    public ResponseEntity<WorkSession> getActiveSession() {
        return trackerService.getActiveSession()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * POST /api/sessions/start - Start a new timer
     * Body: {"description": "string"}
     */
    @PostMapping("/start")
    public ResponseEntity<?> startSession(@Valid @RequestBody StartSessionRequest request) {
        try {
            WorkSession session = trackerService.startSession(request.description());
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/sessions/stop - Stop the current timer
     */
    @PostMapping("/stop")
    public ResponseEntity<?> stopSession() {
        try {
            WorkSession session = trackerService.stopSession();
            return ResponseEntity.ok(session);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/sessions/stats - Get statistics (total hours worked)
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        double totalHours = trackerService.getTotalHoursWorked();
        return ResponseEntity.ok(Map.of(
                "totalHoursWorked", Math.round(totalHours * 100.0) / 100.0,
                "contractedHours", 60));
    }

    /**
     * Request DTO for starting a session
     */
    public record StartSessionRequest(String description) {
    }
}
