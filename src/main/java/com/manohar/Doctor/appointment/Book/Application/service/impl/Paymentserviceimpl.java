package com.manohar.Doctor.appointment.Book.Application.service.impl;


import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderRequest;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.CreateOrderResponse;
import com.manohar.Doctor.appointment.Book.Application.dto.payment.VerifyPaymentRequest;
import com.manohar.Doctor.appointment.Book.Application.exception.BadRequestException;
import com.manohar.Doctor.appointment.Book.Application.exception.ResourceNotFoundException;
import com.manohar.Doctor.appointment.Book.Application.model.Appointment;
import com.manohar.Doctor.appointment.Book.Application.model.Payment;
import com.manohar.Doctor.appointment.Book.Application.model.enums.PaymentStatus;
import com.manohar.Doctor.appointment.Book.Application.repository.AppointmentRepository;
import com.manohar.Doctor.appointment.Book.Application.repository.PaymentRepository;
import com.manohar.Doctor.appointment.Book.Application.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class Paymentserviceimpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    // ── Create Razorpay order ─────────────────────────────────────
    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request, String patientEmail) {

        Appointment appointment = appointmentRepository
                .findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment", request.getAppointmentId()));

        // Prevent duplicate payment
        boolean alreadyPaid = paymentRepository.existsByAppointmentAndStatus(
                appointment, PaymentStatus.SUCCESS);
        if (alreadyPaid) {
            throw new BadRequestException("This appointment is already paid");
        }

        try {
            // Razorpay expects amount in paise (1 INR = 100 paise)
            long amountInPaise = appointment.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "appt_" + appointment.getId());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String orderId = razorpayOrder.get("id");

            // Save payment record as PENDING
            Payment payment = Payment.builder()
                    .appointment(appointment)
                    .razorpayOrderId(orderId)
                    .amount(appointment.getAmount())
                    .currency("INR")
                    .status(PaymentStatus.PENDING)
                    .build();
            paymentRepository.save(payment);

            log.info("Razorpay order created: {} for appointment: {}",
                    orderId, appointment.getId());

            return CreateOrderResponse.builder()
                    .orderId(orderId)
                    .amount(appointment.getAmount())
                    .currency("INR")
                    .razorpayKeyId(razorpayKeyId)
                    .appointmentId(appointment.getId())
                    .doctorName(appointment.getDoctor().getUser().getName())
                    .patientName(appointment.getPatient().getName())
                    .build();

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage());
            throw new BadRequestException("Payment initialization failed: " + e.getMessage());
        }
    }

    // ── Verify Razorpay payment (HMAC-SHA256) ─────────────────────
    @Override
    @Transactional
    public String verifyPayment(VerifyPaymentRequest request) {

        String generatedSignature = generateHmacSignature(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpayKeySecret
        );

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            log.warn("Payment signature mismatch for order: {}", request.getRazorpayOrderId());
            throw new BadRequestException("Payment verification failed: invalid signature");
        }

        // Update Payment record
        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment record not found for order: " + request.getRazorpayOrderId()));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Update Appointment payment status
        Appointment appointment = payment.getAppointment();
        appointment.setPaymentStatus(
                com.manohar.Doctor.appointment.Book.Application.model.enums.PaymentStatus.SUCCESS);
        appointmentRepository.save(appointment);

        log.info("Payment verified successfully for appointment: {}", appointment.getId());
        return "Payment verified successfully";
    }

    // ── HMAC-SHA256 signature generation ─────────────────────────
    private String generateHmacSignature(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes());

            // Convert bytes to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            throw new BadRequestException("Signature generation failed: " + e.getMessage());
        }
    }
}