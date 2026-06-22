package com.landed.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID>, JpaSpecificationExecutor<JobApplication> {
    List<JobApplication> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<JobApplication> findByIdAndUserId(UUID id, UUID userId);
    int countByResumeVersionResumeId(UUID resumeId);
}
