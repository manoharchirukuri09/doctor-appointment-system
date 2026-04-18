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
public class DoctorDashboardDto {

    private BigDecimal totalEarnings;
    private long totalAppointments;
    private long completedAppointments;
    private long pendingAppointments;
    private long cancelledAppointments;
    private long totalPatients;          // distinct patients served
}
