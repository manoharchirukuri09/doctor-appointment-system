package com.manohar.Doctor.appointment.Book.Application.dto.user;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profileImage;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}