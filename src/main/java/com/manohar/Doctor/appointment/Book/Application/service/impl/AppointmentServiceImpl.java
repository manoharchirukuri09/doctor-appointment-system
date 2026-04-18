package com.manohar.Doctor.appointment.Book.Application.service.impl;


import com.manohar.Doctor.appointment.Book.Application.dto.appointment.AppointmentDto;
import com.manohar.Doctor.appointment.Book.Application.dto.appointment.BookAppointmentRequest;
import com.manohar.Doctor.appointment.Book.Application.exception.BadRequestException;
import com.manohar.Doctor.appointment.Book.Application.exception.ResourceNotFoundException;
import com.manohar.Doctor.appointment.Book.Application.model.Appointment;
import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.AppointmentStatus;
import com.manohar.Doctor.appointment.Book.Application.repository.AppointmentRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.DoctorRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import com.manohar.Doctor.appointment.Book.Application.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    // ── Book appointment ──────────────────────────────────────────
    @Override
    @Transactional
    public AppointmentDto bookAppointment(String patientEmail,
                                          BookAppointmentRequest request) {
        User patient = findUserByEmail(patientEmail);
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", request.getDoctorId()));

        if (!doctor.getAvailable()) {
            throw new BadRequestException("Doctor is not available for appointments");
        }

        // Slot conflict check
        boolean slotTaken = appointmentRepository.existsByDoctorAndSlotDateAndSlotTime(
                doctor, request.getSlotDate(), request.getSlotTime());
        if (slotTaken) {
            throw new BadRequestException(
                    "Slot " + request.getSlotTime() + " on " + request.getSlotDate() + " is already booked");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .slotDate(request.getSlotDate())
                .slotTime(request.getSlotTime())
                .amount(doctor.getConsultationFee())  // snapshot fee at booking time
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment booked: patient={} doctor={} slot={} {}",
                patientEmail, doctor.getUser().getEmail(),
                request.getSlotDate(), request.getSlotTime());

        return mapToDto(saved);
    }

    // ── Patient: my appointments ──────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDto> getPatientAppointments(String patientEmail) {
        User patient = findUserByEmail(patientEmail);
        return appointmentRepository
                .findByPatientOrderByBookedAtDesc(patient)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ── Doctor: my appointments ───────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDto> getDoctorAppointments(String doctorEmail) {
        User user = findUserByEmail(doctorEmail);
        Doctor doctor = findDoctorByUser(user);
        return appointmentRepository
                .findByDoctorOrderBySlotDateAscSlotTimeAsc(doctor)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ── Cancel (patient or doctor can cancel) ─────────────────────
    @Override
    @Transactional
    public AppointmentDto cancelAppointment(Long appointmentId, String email) {
        Appointment appointment = findAppointmentById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Completed appointments cannot be cancelled");
        }
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BadRequestException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(LocalDateTime.now());

        log.info("Appointment {} cancelled by {}", appointmentId, email);
        return mapToDto(appointmentRepository.save(appointment));
    }

    // ── Doctor: accept ────────────────────────────────────────────
    @Override
    @Transactional
    public AppointmentDto acceptAppointment(Long appointmentId, String doctorEmail) {
        Appointment appointment = findAppointmentById(appointmentId);
        validateDoctorOwnership(appointment, doctorEmail);

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only PENDING appointments can be accepted");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        log.info("Appointment {} accepted by doctor {}", appointmentId, doctorEmail);
        return mapToDto(appointmentRepository.save(appointment));
    }

    // ── Doctor: complete ──────────────────────────────────────────
    @Override
    @Transactional
    public AppointmentDto completeAppointment(Long appointmentId, String doctorEmail) {
        Appointment appointment = findAppointmentById(appointmentId);
        validateDoctorOwnership(appointment, doctorEmail);

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new BadRequestException("Only CONFIRMED appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setCompletedAt(LocalDateTime.now());

        // Update doctor total earnings
        Doctor doctor = appointment.getDoctor();
        if (appointment.getAmount() != null) {
            doctor.setTotalEarnings(
                    doctor.getTotalEarnings().add(appointment.getAmount()));
            doctorRepository.save(doctor);
        }

        log.info("Appointment {} completed by doctor {}", appointmentId, doctorEmail);
        return mapToDto(appointmentRepository.save(appointment));
    }

    // ── Admin: all appointments ───────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAllByOrderByBookedAtDesc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ── Private helpers ───────────────────────────────────────────
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Doctor findDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    private Appointment findAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }

    private void validateDoctorOwnership(Appointment appointment, String doctorEmail) {
        String appointmentDoctorEmail = appointment.getDoctor().getUser().getEmail();
        if (!appointmentDoctorEmail.equals(doctorEmail)) {
            throw new BadRequestException("You are not authorized to manage this appointment");
        }
    }

    public AppointmentDto mapToDto(Appointment a) {
        User patient = a.getPatient();
        User doctorUser = a.getDoctor().getUser();
        Doctor doctor = a.getDoctor();

        return AppointmentDto.builder()
                .id(a.getId())
                // Patient
                .patientId(patient.getId())
                .patientName(patient.getName())
                .patientEmail(patient.getEmail())
                .patientPhone(patient.getPhone())
                .patientImage(patient.getProfileImage())
                // Doctor
                .doctorId(doctor.getId())
                .doctorName(doctorUser.getName())
                .doctorEmail(doctorUser.getEmail())
                .doctorSpeciality(doctor.getSpeciality())
                .doctorImage(doctorUser.getProfileImage())
                // Slot
                .slotDate(a.getSlotDate())
                .slotTime(a.getSlotTime())
                // Status
                .status(a.getStatus().name())
                .paymentStatus(a.getPaymentStatus().name())
                .amount(a.getAmount())
                // Timestamps
                .bookedAt(a.getBookedAt())
                .cancelledAt(a.getCancelledAt())
                .completedAt(a.getCompletedAt())
                .build();
    }
}