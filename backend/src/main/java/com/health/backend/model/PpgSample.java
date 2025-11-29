package com.health.backend.model;

public class PpgSample {
    private double intensity;
    private long timestamp;

    public PpgSample(double intensity, long timestamp) {
        this.intensity = intensity;
        this.timestamp = timestamp;
    }

    // Getter & Setter
    public double getIntensity() { return intensity; }
    public void setIntensity(double intensity) { this.intensity = intensity; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}

