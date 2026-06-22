package com.landed.application;

import com.landed.application.dto.ApplicationRequest;
import com.landed.application.dto.ApplicationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@SecurityRequirement(name = "bearerAuth")
public class JobApplicationController {
    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an application")
    public ApplicationResponse create(Authentication authentication,
                                      @Valid @RequestBody ApplicationRequest request) {
        return applicationService.create(authentication.getName(), request);
    }

    @GetMapping
    @Operation(summary = "Get all applications owned by the current user")
    public List<ApplicationResponse> getAll(Authentication authentication) {
        return applicationService.getAll(authentication.getName());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an application owned by the current user")
    public ApplicationResponse update(Authentication authentication, @PathVariable UUID id,
                                      @Valid @RequestBody ApplicationRequest request) {
        return applicationService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an application owned by the current user")
    public void delete(Authentication authentication, @PathVariable UUID id) {
        applicationService.delete(authentication.getName(), id);
    }
}
