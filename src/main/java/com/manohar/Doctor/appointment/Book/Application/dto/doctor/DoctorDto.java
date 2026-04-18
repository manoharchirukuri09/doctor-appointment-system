package com.manohar.Doctor.appointment.Book.Application.dto.doctor;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {

    private Long id;

    // Flattened from User entity
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String profileImage;

    // Doctor-specific fields
    private String speciality;
    private String degree;
    private String experience;
    private String about;
    private BigDecimal consultationFee;
    private String address;
    private Boolean available;
}
