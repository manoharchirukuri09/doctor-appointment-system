package com.manohar.Doctor.appointment.Book.Application.dto.appointment;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookAppointmentRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Slot date is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDate slotDate;

    @NotBlank(message = "Slot time is required")
    private String slotTime;             // e.g. "10:00 AM"
}
