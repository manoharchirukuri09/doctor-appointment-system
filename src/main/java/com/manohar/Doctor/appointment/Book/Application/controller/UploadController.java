package com.manohar.Doctor.appointment.Book.Application.controller;


import com.manohar.Doctor.appointment.Book.Application.dto.common.ApiResponse;
import com.manohar.Doctor.appointment.Book.Application.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    // POST /api/upload/image
    // multipart/form-data: key = "file", value = image file
    // optional query param: folder (e.g. "doctors" or "patients")
    @PostMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "doc-appointment") String folder) {

        String imageUrl = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", imageUrl));
    }
}