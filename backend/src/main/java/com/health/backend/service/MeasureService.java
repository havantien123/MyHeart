package com.health.backend.service;

import com.health.backend.model.MeasureSession;
import com.health.backend.model.PpgSample;
import com.health.backend.repository.MeasureSessionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.opencv.core.Mat;

import java.util.List;
import java.util.Optional;

@Service
public class MeasureService {

    @Autowired
    private MeasureSessionRepo measureSessionRepo;

    public MeasureSession startSession(String userId) {
        MeasureSession session = new MeasureSession(userId);
        return measureSessionRepo.save(session);
    }

    public void addFrame(String sessionId, Mat frame, long timestamp) {
        Optional<MeasureSession> sessionOpt = measureSessionRepo.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            System.err.println("[SERVICE] Session not found: " + sessionId);
            return;
        }

        MeasureSession session = sessionOpt.get();

        double intensity = PpgExtractor.extractIntensity(frame);
        PpgSample sample = new PpgSample(intensity, timestamp);

        session.getSamples().add(sample);
        measureSessionRepo.save(session);

        System.out.println("[SERVICE] Sample added: sessionId=" + sessionId + ", ts=" + timestamp + ", intensity=" + intensity + ", samples=" + session.getSamples().size());
    }

    public double finishSession(String sessionId) {
        Optional<MeasureSession> sessionOpt = measureSessionRepo.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            System.err.println("[SERVICE] Finish failed, session not found: " + sessionId);
            return 0.0;
        }

        MeasureSession session = sessionOpt.get();
        double bpm = PpgProcessor.calculateBpm(session.getSamples());
        session.setResultBpm(bpm);
        measureSessionRepo.save(session);

        System.out.println("[SERVICE] Finish: sessionId=" + sessionId + ", samples=" + session.getSamples().size() + ", bpm=" + bpm);
        return bpm;
    }

    public List<MeasureSession> getSessionsByUser(String userId) {
        return measureSessionRepo.findByUserId(userId);
    }
}
