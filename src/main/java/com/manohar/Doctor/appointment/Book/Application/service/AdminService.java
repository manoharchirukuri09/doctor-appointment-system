package com.manohar.Doctor.appointment.Book.Application.service;



import com.manohar.Doctor.appointment.Book.Application.dto.admin.AdminDashboardDto;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.AddDoctorRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.doctor.DoctorDto;
import com.manohar.Doctor.appointment.Book.Application.dto.user.UserProfileDto;

import java.util.List;

public interface AdminService {

    AdminDashboardDto getDashboard();

    DoctorDto addDoctor(AddDoctorRequest request);

    DoctorDto toggleDoctorAvailability(Long doctorId);

    List<DoctorDto> getAllDoctors();

    List<UserProfileDto> getAllPatients();
}