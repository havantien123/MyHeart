// OpenCV lấy intensity
package com.health.backend.service;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.Scalar;
import org.opencv.imgproc.Imgproc;

public class PpgExtractor {

    /**
     * Lấy intensity trung bình từ frame camera
     * @param frame ảnh đầu vào (OpenCV Mat)
     * @return intensity trung bình (double)
     */
    public static double extractIntensity(Mat frame) {
        if (frame == null || frame.empty()) {
            return 0.0;
        }

        // B1: chuyển ảnh sang không gian màu YCrCb (Y = độ sáng)
        Mat ycrcb = new Mat();
        Imgproc.cvtColor(frame, ycrcb, Imgproc.COLOR_BGR2YCrCb);

        // B2: tách kênh Y (độ sáng)
        java.util.List<Mat> channels = new java.util.ArrayList<>();
        Core.split(ycrcb, channels);
        Mat yChannel = channels.get(0);

        // B3: tính trung bình intensity của kênh Y
        Scalar meanScalar = Core.mean(yChannel);
        double intensity = meanScalar.val[0];

        // Giải phóng bộ nhớ
        ycrcb.release();
        yChannel.release();
        for (Mat c : channels) {
            c.release();
        }

        return intensity;
    }
}

