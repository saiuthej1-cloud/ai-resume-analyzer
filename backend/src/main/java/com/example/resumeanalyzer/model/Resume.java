package com.example.resumeanalyzer.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Resume {

    private String id;
    private String name;
    private String email;
    private String skills;
    private String experience;
    private String education;
    private String summary;
    private LocalDateTime uploadedAt;

    // Default constructor
    public Resume() {
        this.id = UUID.randomUUID().toString();
        this.uploadedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Resume(String name, String email, String skills, String experience, String education, String summary) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.email = email;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
        this.summary = summary;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
