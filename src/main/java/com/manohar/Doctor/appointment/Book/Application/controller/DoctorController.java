package com.manohar.Doctor.appointment.Book.Application.controller;


import com.manohar.Doctor.appointment.Book.Application.dto.common.ApiResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.UpdateDoctorRequest;
import com.manohar.Doctor.appointment.Book.Application.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    // GET /api/doctors                     — public (all or filter by speciality)
    // GET /api/doctors?speciality=Cardiology
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) String speciality) {

        List<DoctorDto> doctors = doctorService.getAllDoctors(speciality);
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched successfully", doctors));
    }

    // GET /api/doctors/{id}                — public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {

        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor fetched successfully", doctor));
    }

    // GET /api/doctors/dashboard           — DOCTOR only
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorDashboardDto>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {

        DoctorDashboardDto dashboard = doctorService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard fetched successfully", dashboard));
    }

    // PUT /api/doctors/profile             — DOCTOR only
    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorDto>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateDoctorRequest request) {

        DoctorDto updated = doctorService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}