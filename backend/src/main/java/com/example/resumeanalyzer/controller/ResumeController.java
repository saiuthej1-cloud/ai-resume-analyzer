package com.example.resumeanalyzer.controller;

import com.example.resumeanalyzer.model.Resume;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ResumeController {

    // In-memory storage
    private final List<Resume> resumeStore = new ArrayList<>();

    /**
     * POST /api/resumes/add
     * Upload a new resume as JSON
     */
    @PostMapping("/add")
    public ResponseEntity<?> addResume(@RequestBody Resume resume) {
        try {
            if (resume.getName() == null || resume.getName().isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Name is required"));
            }
            if (resume.getEmail() == null || resume.getEmail().isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Email is required"));
            }
            if (resume.getSkills() == null || resume.getSkills().isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Skills are required"));
            }

            resumeStore.add(resume);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Resume added successfully",
                            "resume", resume
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add resume: " + e.getMessage()));
        }
    }

    /**
     * GET /api/resumes/all
     * Retrieve all uploaded resumes
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllResumes() {
        try {
            return ResponseEntity.ok(Map.of(
                    "count", resumeStore.size(),
                    "resumes", resumeStore
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve resumes: " + e.getMessage()));
        }
    }

    /**
     * GET /api/resumes/{id}
     * Get a single resume by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable String id) {
        Optional<Resume> resume = resumeStore.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();

        if (resume.isPresent()) {
            return ResponseEntity.ok(resume.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Resume not found with id: " + id));
        }
    }

    /**
     * DELETE /api/resumes/{id}
     * Delete a resume by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable String id) {
        boolean removed = resumeStore.removeIf(r -> r.getId().equals(id));

        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Resume not found with id: " + id));
        }
    }

    /**
     * GET /api/resumes/health
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "AI Resume Analyzer",
                "totalResumes", resumeStore.size()
        ));
    }
}
