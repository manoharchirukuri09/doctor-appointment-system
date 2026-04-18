package com.manohar.Doctor.appointment.Book.Application.service;


import com.manohar.Doctor.appointment.Book.Application.dto.auth.AuthResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.auth.LoginRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}