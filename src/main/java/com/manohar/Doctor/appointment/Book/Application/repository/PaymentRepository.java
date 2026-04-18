package com.manohar.Doctor.appointment.Book.Application.repository;


import com.manohar.Doctor.appointment.Book.Application.model.Appointment;
import com.manohar.Doctor.appointment.Book.Application.model.Payment;
import com.manohar.Doctor.appointment.Book.Application.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ── Lookup by Razorpay IDs ────────────────────────────────────
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    // ── Lookup by appointment ─────────────────────────────────────
    Optional<Payment> findByAppointment(Appointment appointment);

    Optional<Payment> findByAppointmentId(Long appointmentId);

    // ── Check if appointment already has a successful payment ─────
    boolean existsByAppointmentAndStatus(Appointment appointment, PaymentStatus status);
}
