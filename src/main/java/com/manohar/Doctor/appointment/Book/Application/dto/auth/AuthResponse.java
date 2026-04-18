package com.manohar.Doctor.appointment.Book.Application.dto.auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String role;           // ADMIN / DOCTOR / PATIENT
    private Long userId;
    private String name;
    private String email;
    private String profileImage;
}
