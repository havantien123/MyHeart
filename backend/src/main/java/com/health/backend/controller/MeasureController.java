package com.health.backend.controller;

import com.health.backend.model.MeasureSession;
import com.health.backend.service.MeasureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.core.MatOfByte;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/measure")
public class MeasureController {

    @Autowired
    private MeasureService measureService;

    // Bắt đầu phiên đo
    @PostMapping("/start")
    public MeasureSession startMeasure(@RequestParam String userId) {
        MeasureSession session = measureService.startSession(userId);
        System.out.println("[START] sessionId=" + session.getId() + ", userId=" + userId);
        return session;
    }

    // Nhận frame ảnh từ frontend
    @PostMapping("/frame")
    public String addFrame(@RequestParam String sessionId,
                           @RequestParam long timestamp,
                           @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            System.err.println("[FRAME] Empty file for sessionId=" + sessionId);
            return "No file";
        }

        // Đọc ảnh trực tiếp từ bytes (tránh lỗi path, quyền)
        byte[] bytes = file.getBytes();
        MatOfByte mob = new MatOfByte(bytes);
        Mat frame = Imgcodecs.imdecode(mob, Imgcodecs.IMREAD_COLOR);

        if (frame == null || frame.empty()) {
            System.err.println("[FRAME] Failed to decode image, sessionId=" + sessionId + ", size=" + bytes.length);
            return "Decode failed";
        }

        measureService.addFrame(sessionId, frame, timestamp);

        // Giải phóng
        frame.release();
        mob.release();

        System.out.println("[FRAME] OK sessionId=" + sessionId + ", ts=" + timestamp + ", bytes=" + bytes.length);
        return "Frame processed";
    }

    // Kết thúc phiên đo và trả về BPM
    @PostMapping("/finish")
    public double finishMeasure(@RequestParam String sessionId) {
        double bpm = measureService.finishSession(sessionId);
        System.out.println("[FINISH] sessionId=" + sessionId + ", bpm=" + bpm);
        return bpm;
    }

    // Lấy lịch sử theo userId
    @GetMapping("/sessions/{userId}")
    public List<MeasureSession> getSessionsByUser(@PathVariable String userId) {
        List<MeasureSession> sessions = measureService.getSessionsByUser(userId);
        System.out.println("[HISTORY] userId=" + userId + ", count=" + sessions.size());
        return sessions;
    }
}
