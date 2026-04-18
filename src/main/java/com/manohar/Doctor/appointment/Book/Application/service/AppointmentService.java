package com.manohar.Doctor.appointment.Book.Application.service;


import com.manohar.Doctor.appointment.Book.Application.dto.appointment.AppointmentDto;
import com.manohar.Doctor.appointment.Book.Application.dto.appointment.BookAppointmentRequest;

import java.util.List;

public interface AppointmentService {

    AppointmentDto bookAppointment(String patientEmail, BookAppointmentRequest request);

    List<AppointmentDto> getPatientAppointments(String patientEmail);

    List<AppointmentDto> getDoctorAppointments(String doctorEmail);

    AppointmentDto cancelAppointment(Long appointmentId, String email);

    AppointmentDto acceptAppointment(Long appointmentId, String doctorEmail);

    AppointmentDto completeAppointment(Long appointmentId, String doctorEmail);

    List<AppointmentDto> getAllAppointments();   // admin
}