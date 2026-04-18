package com.manohar.Doctor.appointment.Book.Application.dto.appointment;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {

    private Long id;

    // Patient info (flattened)
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String patientImage;

    // Doctor info (flattened)
    private Long doctorId;
    private String doctorName;
    private String doctorEmail;
    private String doctorSpeciality;
    private String doctorImage;

    // Slot details
    private LocalDate slotDate;
    private String slotTime;

    // Status
    private String status;               // PENDING / CONFIRMED / CANCELLED / COMPLETED
    private String paymentStatus;        // PENDING / SUCCESS / FAILED

    // Amount
    private BigDecimal amount;

    // Timestamps
    private LocalDateTime bookedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime completedAt;
}
