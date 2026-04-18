package com.manohar.Doctor.appointment.Book.Application.controller;


import com.manohar.Doctor.appointment.Book.Application.dto.common.ApiResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.VerifyPaymentRequest;
import com.manohar.Doctor.appointment.Book.Application.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments/create-order      — PATIENT only
    @PostMapping("/create-order")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request) {

        CreateOrderResponse order =
                paymentService.createOrder(request, userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Payment order created successfully", order));
    }

    // POST /api/payments/verify            — PATIENT only
    @PostMapping("/verify")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<String>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {

        String result = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}