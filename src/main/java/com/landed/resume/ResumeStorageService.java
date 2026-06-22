package com.landed.resume;

import com.landed.common.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ResumeStorageService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "txt");
    private final Path root;

    public ResumeStorageService(@Value("${app.storage.resume-directory}") String directory) {
        this.root = Path.of(directory).toAbsolutePath().normalize();
    }

    @PostConstruct
    void initialize() {
        try {
            Files.createDirectories(root);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not initialize resume storage", exception);
        }
    }

    public StoredFile store(byte[] bytes, String originalFilename) {
        if (bytes.length == 0) throw new BadRequestException("Resume file cannot be empty");
        String filename = sanitizeFilename(originalFilename);
        String extension = extension(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Supported resume formats are PDF, DOCX, and TXT");
        }
        String key = UUID.randomUUID() + "." + extension;
        Path target = resolve(key);
        try {
            Files.write(target, bytes, StandardOpenOption.CREATE_NEW);
            return new StoredFile(key, filename, extension);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not store resume file", exception);
        }
    }

    public Resource load(String key) {
        try {
            Path path = resolve(key);
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new IllegalStateException("Stored resume file is unavailable");
            }
            return resource;
        } catch (MalformedURLException exception) {
            throw new IllegalStateException("Stored resume path is invalid", exception);
        }
    }

    public void delete(String key) {
        try {
            Files.deleteIfExists(resolve(key));
        } catch (IOException exception) {
            throw new IllegalStateException("Could not delete stored resume", exception);
        }
    }

    private Path resolve(String key) {
        Path path = root.resolve(key).normalize();
        if (!path.startsWith(root)) throw new IllegalArgumentException("Invalid storage key");
        return path;
    }

    private String sanitizeFilename(String value) {
        if (value == null || value.isBlank()) throw new BadRequestException("Resume filename is required");
        String filename = Path.of(value).getFileName().toString().replaceAll("[\\r\\n\\t]", "_");
        if (filename.length() > 255) throw new BadRequestException("Resume filename is too long");
        return filename;
    }

    private String extension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    public record StoredFile(String key, String originalFilename, String extension) { }
}
