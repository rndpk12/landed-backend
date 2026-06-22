package com.landed.application;

import com.landed.application.dto.ApplicationRequest;
import com.landed.application.dto.ApplicationResponse;
import com.landed.common.exception.ResourceNotFoundException;
import com.landed.user.User;
import com.landed.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class JobApplicationService {
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository applicationRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ApplicationResponse create(String email, ApplicationRequest request) {
        User user = requireUser(email);
        JobApplication application = new JobApplication(user, clean(request.company()), clean(request.role()),
                blankToNull(request.jobUrl()), request.status(), blankToNull(request.notes()), request.appliedDate());
        return ApplicationResponse.from(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAll(String email) {
        User user = requireUser(email);
        return applicationRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(ApplicationResponse::from)
                .toList();
    }

    @Transactional
    public ApplicationResponse update(String email, UUID id, ApplicationRequest request) {
        User user = requireUser(email);
        JobApplication application = requireOwnedApplication(id, user.getId());
        application.update(clean(request.company()), clean(request.role()), blankToNull(request.jobUrl()),
                request.status(), blankToNull(request.notes()), request.appliedDate());
        return ApplicationResponse.from(application);
    }

    @Transactional
    public void delete(String email, UUID id) {
        User user = requireUser(email);
        applicationRepository.delete(requireOwnedApplication(id, user.getId()));
    }

    private User requireUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private JobApplication requireOwnedApplication(UUID id, UUID userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private String clean(String value) {
        return value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
