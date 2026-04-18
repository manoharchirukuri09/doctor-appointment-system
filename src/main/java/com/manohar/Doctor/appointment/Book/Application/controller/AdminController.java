package com.manohar.Doctor.appointment.Book.Application.controller;

import com.manohar.Doctor.appointment.Book.Application.dto.admin.AdminDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.common.ApiResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.AddDoctorRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.user.UserProfileDto;
import com.manohar.Doctor.appointment.Book.Application.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /**
     * Fetch aggregated statistics for the Admin Dashboard.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboard() {
        log.info("Admin fetching dashboard statistics");
        AdminDashboardDto dashboard = adminService.getDashboard();
        return ResponseEntity.ok(
                ApiResponse.success("Dashboard data retrieved", dashboard));
    }

    /**
     * Onboard a new doctor into the system.
     */
    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorDto>> addDoctor(
            @Valid @RequestBody AddDoctorRequest request) {
        log.info("Admin adding new doctor: {}", request.getEmail());
        DoctorDto doctor = adminService.addDoctor(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor profile created successfully", doctor));
    }

    /**
     * Get all doctors (Active & Inactive) for management.
     * Note: Ensure AdminService.getAllDoctors() is @Transactional to prevent LazyInitializationException.
     */
    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors() {
        log.info("Admin fetching comprehensive doctor list");
        List<DoctorDto> doctors = adminService.getAllDoctors();
        return ResponseEntity.ok(
                ApiResponse.success("Successfully retrieved all doctors", doctors));
    }

    /**
     * Toggle the availability status of a doctor.
     */
    @PatchMapping("/doctors/{id}/toggle") // Changed to PATCH as it's a partial update
    public ResponseEntity<ApiResponse<DoctorDto>> toggleDoctorAvailability(
            @PathVariable Long id) {
        log.info("Admin toggling availability for doctor ID: {}", id);
        DoctorDto doctor = adminService.toggleDoctorAvailability(id);
        return ResponseEntity.ok(
                ApiResponse.success("Availability status updated", doctor));
    }

    /**
     * Fetch all registered patients.
     */
    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getAllPatients() {
        log.info("Admin fetching patient records");
        List<UserProfileDto> patients = adminService.getAllPatients();
        return ResponseEntity.ok(
                ApiResponse.success("Successfully retrieved all patients", patients));
    }
}