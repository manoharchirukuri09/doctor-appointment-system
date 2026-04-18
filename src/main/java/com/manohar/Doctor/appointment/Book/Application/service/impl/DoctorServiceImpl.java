package com.manohar.Doctor.appointment.Book.Application.service.impl;

import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.UpdateDoctorRequest;
import com.manohar.Doctor.appointment.Book.Application.exception.ResourceNotFoundException;
import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.AppointmentStatus;
import com.manohar.Doctor.appointment.Book.Application.model.enums.PaymentStatus;
import com.manohar.Doctor.appointment.Book.Application.repository.AppointmentRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.DoctorRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import com.manohar.Doctor.appointment.Book.Application.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
// Ensure class name matches exactly: DoctorServiceImpl
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDto> getAllDoctors(String speciality) {
        log.info("Fetching all doctors with speciality: {}", speciality);
        List<Doctor> doctors = (speciality != null && !speciality.isBlank())
                ? doctorRepository.searchBySpeciality(speciality)
                : doctorRepository.findByAvailableTrue();

        return doctors.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDto getDoctorById(Long id) {
        log.info("Fetching doctor details for ID: {}", id);
        return doctorRepository.findById(id)
                .map(this::mapToDto)
                // Use the constructor that takes String and Long
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
    }

    @Override
    @Transactional
    public DoctorDto updateProfile(String email, UpdateDoctorRequest request) {
        User user = findUserByEmail(email);

        // Fetch or Create logic to prevent ResourceNotFoundException
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseGet(() -> {
                    log.info("No doctor profile found for {}, creating one.", email);
                    return Doctor.builder()
                            .user(user)
                            .speciality("General")
                            .available(true)
                            .totalEarnings(BigDecimal.ZERO)
                            .build();
                });

        // Update User info & Cloudinary Image
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            user.setProfileImage(request.getProfileImage());
        }
        userRepository.save(user);

        // Update Doctor info
        if (request.getDegree() != null) doctor.setDegree(request.getDegree());
        if (request.getExperience() != null) doctor.setExperience(request.getExperience());
        if (request.getAbout() != null) doctor.setAbout(request.getAbout());
        if (request.getAddress() != null) doctor.setAddress(request.getAddress());
        if (request.getConsultationFee() != null) doctor.setConsultationFee(request.getConsultationFee());
        if (request.getAvailable() != null) doctor.setAvailable(request.getAvailable());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("Doctor profile updated successfully for: {}", email);

        return mapToDto(updatedDoctor);
    }

    @Override
    public DoctorDashboardDto getDashboard(String email) {
        User user = findUserByEmail(email);
        Doctor doctor = findDoctorByUser(user);

        return DoctorDashboardDto.builder()
                .totalEarnings(appointmentRepository.sumEarningsByDoctorAndPaymentStatus(doctor, PaymentStatus.SUCCESS))
                .totalAppointments(appointmentRepository.countByDoctor(doctor))
                .completedAppointments(appointmentRepository.countByDoctorAndStatus(doctor, AppointmentStatus.COMPLETED))
                .pendingAppointments(appointmentRepository.countByDoctorAndStatus(doctor, AppointmentStatus.PENDING))
                .cancelledAppointments(appointmentRepository.countByDoctorAndStatus(doctor, AppointmentStatus.CANCELLED))
                .totalPatients(appointmentRepository.countDistinctPatientsByDoctor(doctor))
                .build();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Doctor findDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found. Please update your profile first."));
    }

    public DoctorDto mapToDto(Doctor doctor) {
        User u = doctor.getUser();
        return DoctorDto.builder()
                .id(doctor.getId())
                .userId(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .profileImage(u.getProfileImage())
                .speciality(doctor.getSpeciality())
                .degree(doctor.getDegree())
                .experience(doctor.getExperience())
                .about(doctor.getAbout())
                .consultationFee(doctor.getConsultationFee())
                .address(doctor.getAddress())
                .available(doctor.getAvailable())
                .build();
    }
}