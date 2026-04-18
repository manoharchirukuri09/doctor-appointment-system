package com.manohar.Doctor.appointment.Book.Application.service.impl;


import com.manohar.Doctor.appointment.Book.Application.config.JwtUtil;
import com.manohar.Doctor.appointment.Book.Application.dto.auth.AuthResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.auth.LoginRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.auth.RegisterRequest;
import com.manohar.Doctor.appointment.Book.Application.exception.BadRequestException;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.repository.UserRepository;
import com.manohar.Doctor.appointment.Book.Application.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ── Register ──────────────────────────────────────────────────
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .isActive(true)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: {} [{}]", saved.getEmail(), saved.getRole());

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());

        return buildAuthResponse(saved, token);
    }

    // ── Login ─────────────────────────────────────────────────────
    @Override
    public AuthResponse login(LoginRequest request) {

        // Spring Security validates credentials and throws BadCredentialsException if wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());

        return buildAuthResponse(user, token);
    }

    // ── Helper ────────────────────────────────────────────────────
    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .build();
    }
}
