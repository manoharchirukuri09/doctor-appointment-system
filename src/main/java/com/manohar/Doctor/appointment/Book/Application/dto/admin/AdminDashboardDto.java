package com.manohar.Doctor.appointment.Book.Application.dto.admin;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {

    private long totalDoctors;
    private long activeDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private BigDecimal totalRevenue;
}
