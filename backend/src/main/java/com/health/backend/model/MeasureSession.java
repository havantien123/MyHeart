package com.health.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "measure_sessions")
public class MeasureSession {

    @Id
    private String id;
    private final String userId;
    private final List<PpgSample> samples = new ArrayList<>();
    private Double resultBpm;

    public MeasureSession(String userId) {
        this.userId = userId;
    }

    // Getter & Setter
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public List<PpgSample> getSamples() { return samples; }
    public Double getResultBpm() { return resultBpm; }

    public void setResultBpm(Double resultBpm) { this.resultBpm = resultBpm; }
}

