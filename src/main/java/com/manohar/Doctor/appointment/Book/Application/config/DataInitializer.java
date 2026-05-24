package com.manohar.Doctor.appointment.Book.Application.config;

import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.Role;
import com.manohar.Doctor.appointment.Book.Application.repository.DoctorRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking and seeding demo credentials...");

        // 1. Seed Admin
        seedAdmin();

        // 2. Seed Patients
        seedPatient("Alice Green", "patient1@gmail.com", "patient123", "9123456780");
        seedPatient("Bob Brown", "patient2@gmail.com", "patient123", "9123456781");

        // 3. Seed Doctors
        seedDoctor(
                "Dr. John Doe",
                "doctor1@gmail.com",
                "doctor123",
                "9876543210",
                "Cardiologist",
                "MBBS, MD",
                "10 years",
                "Dr. John Doe is a leading Cardiologist with over 10 years of experience.",
                "123 Health Ave, Medical District",
                BigDecimal.valueOf(500.0)
        );

        seedDoctor(
                "Dr. Sarah Smith",
                "doctor2@gmail.com",
                "doctor123",
                "9876543211",
                "Dermatologist",
                "MBBS, DDVL",
                "8 years",
                "Dr. Sarah Smith is a highly recommended dermatologist.",
                "456 Skin Care Blvd, Suite 10",
                BigDecimal.valueOf(400.0)
        );

        log.info("Demo credentials seeding check completed.");
    }

    private void seedAdmin() {
        String email = "admin@gmail.com";
        if (!userRepository.existsByEmail(email)) {
            User admin = User.builder()
                    .name("System Admin")
                    .email(email)
                    .password(passwordEncoder.encode("admin@523247"))
                    .phone("8919409440")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded Admin: {}", email);
        } else {
            log.debug("Admin already exists, skipping.");
        }
    }

    private void seedPatient(String name, String email, String password, String phone) {
        if (!userRepository.existsByEmail(email)) {
            User patient = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .phone(phone)
                    .role(Role.PATIENT)
                    .isActive(true)
                    .build();
            userRepository.save(patient);
            log.info("Seeded Patient: {}", email);
        } else {
            log.debug("Patient {} already exists, skipping.", email);
        }
    }

    private void seedDoctor(
            String name,
            String email,
            String password,
            String phone,
            String speciality,
            String degree,
            String experience,
            String about,
            String address,
            BigDecimal consultationFee
    ) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .phone(phone)
                    .role(Role.DOCTOR)
                    .isActive(true)
                    .build();
            User savedUser = userRepository.save(user);

            Doctor doctor = Doctor.builder()
                    .user(savedUser)
                    .speciality(speciality)
                    .degree(degree)
                    .experience(experience)
                    .about(about)
                    .address(address)
                    .consultationFee(consultationFee)
                    .available(true)
                    .totalEarnings(BigDecimal.ZERO)
                    .build();
            doctorRepository.save(doctor);
            log.info("Seeded Doctor: {} ({})", email, speciality);
        } else {
            log.debug("Doctor {} already exists, skipping.", email);
        }
    }
}
