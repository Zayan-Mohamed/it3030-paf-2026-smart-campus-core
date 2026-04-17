package com.smartcampus.api.dto.incident;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class IncidentCommentResponse {
    Long id;
    Long incidentId;
    Long authorId;
    String authorName;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean canEdit;
    boolean canDelete;
}