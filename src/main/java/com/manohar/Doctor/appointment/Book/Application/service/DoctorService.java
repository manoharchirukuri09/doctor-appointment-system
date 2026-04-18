package com.manohar.Doctor.appointment.Book.Application.service;

import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.UpdateDoctorRequest;
import java.util.List;

public interface DoctorService {


    List<DoctorDto> getAllDoctors(String speciality);

    DoctorDto getDoctorById(Long id);

    // This method now handles the "Find or Create" logic and image URL mapping
    DoctorDto updateProfile(String email, UpdateDoctorRequest request);

    DoctorDashboardDto getDashboard(String email);
}