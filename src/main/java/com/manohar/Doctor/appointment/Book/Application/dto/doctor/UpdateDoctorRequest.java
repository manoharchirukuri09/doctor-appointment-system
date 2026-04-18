package com.manohar.Doctor.appointment.Book.Application.dto.doctor;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDoctorRequest {
    private String name;
    private String phone;
    private String profileImage; // This holds the Cloudinary URL
    private String degree;
    private String experience;
    private String about;
    private String address;

    @DecimalMin(value = "0.0", message = "Fee must be positive")
    private BigDecimal consultationFee;

    private Boolean available;

    // Note: Removed the hardcoded getSpeciality() returning null
    // to avoid accidental database overwrites.
}