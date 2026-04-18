package com.manohar.Doctor.appointment.Book.Application.service.impl;

import com.manohar.Doctor.appointment.Book.Application.dto.admin.AdminDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.AddDoctorRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.user.UserProfileDto;
import com.manohar.Doctor.appointment.Book.Application.exception.BadRequestException;
import com.manohar.Doctor.appointment.Book.Application.exception.ResourceNotFoundException;
import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.AppointmentStatus;
import com.manohar.Doctor.appointment.Book.Application.model.enums.Role;
import com.manohar.Doctor.appointment.Book.Application.repository.AppointmentRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.DoctorRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import com.manohar.Doctor.appointment.Book.Application.service.AdminService;
import com.manohar.Doctor.appointment.Book.Application.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    // Use the Interface here to prevent circular dependency issues
    private final DoctorService doctorService;

    @Override
    public AdminDashboardDto getDashboard() {
        return AdminDashboardDto.builder()
                .totalDoctors(userRepository.countByRole(Role.DOCTOR))
                .activeDoctors(doctorRepository.countByAvailableTrue())
                .totalPatients(userRepository.countByRole(Role.PATIENT))
                .totalAppointments(appointmentRepository.count())
                .pendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING))
                .completedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED))
                .cancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED))
                .totalRevenue(appointmentRepository.sumTotalRevenue())
                .build();
    }

    @Override
    @Transactional
    public DoctorDto addDoctor(AddDoctorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .profileImage(request.getProfileImage())
                .role(Role.DOCTOR)
                .isActive(true)
                .build();
        User savedUser = userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(savedUser)
                .speciality(request.getSpeciality())
                .degree(request.getDegree())
                .experience(request.getExperience())
                .about(request.getAbout())
                .address(request.getAddress())
                .consultationFee(request.getConsultationFee())
                .available(true)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        log.info("New doctor added by admin: {}", savedUser.getEmail());

        // Cast to implementation only if necessary, or better,
        // move mapToDto to a Mapper component or the Interface.
        return ((DoctorServiceImpl) doctorService).mapToDto(savedDoctor);
    }

    @Override
    @Transactional
    public DoctorDto toggleDoctorAvailability(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", doctorId));

        doctor.setAvailable(!doctor.getAvailable());
        Doctor updated = doctorRepository.save(doctor);

        return ((DoctorServiceImpl) doctorService).mapToDto(updated);
    }

    @Override
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doc -> ((DoctorServiceImpl) doctorService).mapToDto(doc))
                .toList();
    }

    @Override
    public List<UserProfileDto> getAllPatients() {
        return userRepository.findByRole(Role.PATIENT)
                .stream()
                .map(this::mapToUserDto)
                .toList();
    }

    private UserProfileDto mapToUserDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}