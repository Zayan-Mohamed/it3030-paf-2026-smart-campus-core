package com.smartcampus.api.repository;

import com.smartcampus.api.model.Incident;
import com.smartcampus.api.model.IncidentComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentCommentRepository extends JpaRepository<IncidentComment, Long> {
    List<IncidentComment> findByIncidentOrderByCreatedAtAsc(Incident incident);
}