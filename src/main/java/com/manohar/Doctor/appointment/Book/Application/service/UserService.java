package com.manohar.Doctor.appointment.Book.Application.service;



import com.manohar.Doctor.appointment.Book.Application.dto.user.UpdateProfileRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.user.UserProfileDto;

public interface UserService {

    UserProfileDto getProfile(String email);

    UserProfileDto updateProfile(String email, UpdateProfileRequest request);
}