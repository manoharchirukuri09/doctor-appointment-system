package com.manohar.Doctor.appointment.Book.Application.service;



import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.VerifyPaymentRequest;

public interface PaymentService {

    CreateOrderResponse createOrder(CreateOrderRequest request, String patientEmail);

    String verifyPayment(VerifyPaymentRequest request);
}