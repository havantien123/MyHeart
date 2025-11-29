// xử lý tín hiệu, tính BPM
package com.health.backend.service;

import com.health.backend.model.PpgSample;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;

import java.util.List;

public class PpgProcessor {

    /**
     * Hàm tính BPM từ danh sách mẫu intensity
     * @param samples danh sách mẫu intensity (PPG)
     * @return BPM (beats per minute)
     */
    public static double calculateBpm(List<PpgSample> samples) {
        if (samples == null || samples.size() < 10) {
            return 0.0; // dữ liệu quá ít, không tính được
        }

        // B1: lấy intensity theo thời gian
        double[] intensities = samples.stream()
                .mapToDouble(PpgSample::getIntensity)
                .toArray();

        long[] timestamps = samples.stream()
                .mapToLong(PpgSample::getTimestamp)
                .toArray();

        // B2: lọc tín hiệu cơ bản (ví dụ: loại bỏ giá trị bất thường)
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (double val : intensities) {
            stats.addValue(val);
        }
        double mean = stats.getMean();
        double std = stats.getStandardDeviation();

        // loại bỏ outlier
        double[] filtered = java.util.Arrays.stream(intensities)
                .filter(val -> Math.abs(val - mean) < 2 * std)
                .toArray();

        // B3: tìm số lần "đỉnh" (peak) trong tín hiệu
        int peakCount = 0;
        for (int i = 1; i < filtered.length - 1; i++) {
            if (filtered[i] > filtered[i - 1] && filtered[i] > filtered[i + 1]) {
                peakCount++;
            }
        }

        // B4: tính thời gian đo (ms → phút)
        long durationMs = timestamps[timestamps.length - 1] - timestamps[0];
        double durationMinutes = durationMs / 60000.0;

        if (durationMinutes <= 0) {
            return 0.0;
        }

        // B5: BPM = số peak / thời gian đo (phút)
        double bpm = peakCount / durationMinutes;
        return bpm;
    }
}

