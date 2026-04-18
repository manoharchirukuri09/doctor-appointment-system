package com.manohar.Doctor.appointment.Book.Application.service.impl;


import com.manohar.Doctor.appointment.Book.Application.dto.user.UpdateProfileRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.user.UserProfileDto;
import com.manohar.Doctor.appointment.Book.Application.exception.ResourceNotFoundException;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import com.manohar.Doctor.appointment.Book.Application.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // ── Get profile ───────────────────────────────────────────────
    @Override
    public UserProfileDto getProfile(String email) {
        User user = findUserByEmail(email);
        return mapToDto(user);
    }

    // ── Update profile ────────────────────────────────────────────
    @Override
    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        User user = findUserByEmail(email);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }
        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            user.setProfileImage(request.getProfileImage());
        }

        User updated = userRepository.save(user);
        log.info("Profile updated for user: {}", email);
        return mapToDto(updated);
    }

    // ── Helpers ───────────────────────────────────────────────────
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private UserProfileDto mapToDto(User user) {
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