package com.manohar.Doctor.appointment.Book.Application.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.manohar.Doctor.appointment.Book.Application.exception.BadRequestException;
import com.manohar.Doctor.appointment.Book.Application.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    // ── Upload image ──────────────────────────────────────────────
    @Override
    public String uploadImage(MultipartFile file, String folder) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty or null");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder",          folder != null ? folder : "doc-appointment",
                            "resource_type",   "image",
                            "transformation",  "q_auto,f_auto"   // auto quality + format
                    )
            );

            String secureUrl = (String) result.get("secure_url");
            log.info("Image uploaded to Cloudinary: {}", secureUrl);
            return secureUrl;

        } catch (IOException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage());
            throw new BadRequestException("Image upload failed: " + e.getMessage());
        }
    }

    // ── Delete image by public ID ─────────────────────────────────
    @Override
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted from Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Cloudinary delete failed: {}", e.getMessage());
            throw new BadRequestException("Image delete failed: " + e.getMessage());
        }
    }
}