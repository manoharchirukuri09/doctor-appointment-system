package com.manohar.Doctor.appointment.Book.Application.controller;


import com.manohar.Doctor.appointment.Book.Application.dto.appointment.AppointmentDto;
import com.manohar.Doctor.appointment.Book.Application.dto.appointment.BookAppointmentRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.common.ApiResponse;
import com.manohar.Doctor.appointment.Book.Application.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ── PATIENT ───────────────────────────────────────────────────

    // POST /api/appointments/book
    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookAppointmentRequest request) {

        AppointmentDto appointment =
                appointmentService.bookAppointment(userDetails.getUsername(), request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", appointment));
    }

    // GET /api/appointments/patient
    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getPatientAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<AppointmentDto> appointments =
                appointmentService.getPatientAppointments(userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Appointments fetched successfully", appointments));
    }

    // PUT /api/appointments/{id}/cancel    — patient or doctor can cancel
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentDto>> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppointmentDto appointment =
                appointmentService.cancelAppointment(id, userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", appointment));
    }

    // ── DOCTOR ────────────────────────────────────────────────────

    // GET /api/appointments/doctor
    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getDoctorAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<AppointmentDto> appointments =
                appointmentService.getDoctorAppointments(userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Appointments fetched successfully", appointments));
    }

    // PUT /api/appointments/{id}/accept
    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentDto>> acceptAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppointmentDto appointment =
                appointmentService.acceptAppointment(id, userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success("Appointment accepted successfully", appointment));
    }

    // PUT /api/appointments/{id}/complete
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentDto>> completeAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppointmentDto appointment =
                appointmentService.completeAppointment(id, userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success("Appointment completed successfully", appointment));
    }

    // ── ADMIN ─────────────────────────────────────────────────────

    // GET /api/appointments/all
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAllAppointments() {

        List<AppointmentDto> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(
                ApiResponse.success("All appointments fetched successfully", appointments));
    }
}