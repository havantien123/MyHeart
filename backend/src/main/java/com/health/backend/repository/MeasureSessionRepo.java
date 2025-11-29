package com.health.backend.repository;

import com.health.backend.model.MeasureSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeasureSessionRepo extends MongoRepository<MeasureSession, String> {
    List<MeasureSession> findByUserId(String userId);
}
