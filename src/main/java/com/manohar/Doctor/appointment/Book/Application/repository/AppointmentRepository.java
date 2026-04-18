package com.manohar.Doctor.appointment.Book.Application.repository;

import com.manohar.Doctor.appointment.Book.Application.model.Appointment;
import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.AppointmentStatus;
import com.manohar.Doctor.appointment.Book.Application.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Eagerly load doctor→user and patient on every appointment query
    // to prevent LazyInitializationException in mapToDto()
    String APPOINTMENT_GRAPH = "javax.persistence.fetchgraph";

    // ── Single appointment fetch (used by cancel/accept/complete) ──
    @Override
    @NonNull
    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    Optional<Appointment> findById(@NonNull Long id);

    // ── Patient queries ───────────────────────────────────────────
    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findByPatientOrderByBookedAtDesc(User patient);

    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findByPatientAndStatusOrderByBookedAtDesc(User patient, AppointmentStatus status);

    // ── Doctor queries ────────────────────────────────────────────
    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findByDoctorOrderBySlotDateAscSlotTimeAsc(Doctor doctor);

    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findByDoctorAndStatusOrderBySlotDateAsc(Doctor doctor, AppointmentStatus status);

    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findByDoctorAndSlotDate(Doctor doctor, LocalDate slotDate);

    // ── Slot conflict check (before booking) ──────────────────────
    boolean existsByDoctorAndSlotDateAndSlotTime(Doctor doctor,
                                                 LocalDate slotDate,
                                                 String slotTime);

    // ── Admin: all appointments ───────────────────────────────────
    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    List<Appointment> findAllByOrderByBookedAtDesc();

    // ── Count queries (dashboard stats) ──────────────────────────
    long countByDoctor(Doctor doctor);

    long countByStatus(AppointmentStatus status);

    long countByDoctorAndStatus(Doctor doctor, AppointmentStatus status);

    // ── Distinct patients for a doctor ────────────────────────────
    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor = :doctor")
    long countDistinctPatientsByDoctor(@Param("doctor") Doctor doctor);

    // ── Doctor total earnings (sum of PAID appointments) ──────────
    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM Appointment a " +
            "WHERE a.doctor = :doctor AND a.paymentStatus = :paymentStatus")
    BigDecimal sumEarningsByDoctorAndPaymentStatus(@Param("doctor") Doctor doctor,
                                                   @Param("paymentStatus") PaymentStatus paymentStatus);

    // ── Admin: total revenue ──────────────────────────────────────
    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM Appointment a WHERE a.paymentStatus = 'SUCCESS'")
    BigDecimal sumTotalRevenue();

    // ── Upcoming appointments for a doctor ────────────────────────
    @EntityGraph(attributePaths = {"doctor", "doctor.user", "patient"})
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor " +
            "AND a.slotDate >= :today AND a.status = 'CONFIRMED' " +
            "ORDER BY a.slotDate ASC, a.slotTime ASC")
    List<Appointment> findUpcomingByDoctor(@Param("doctor") Doctor doctor,
                                           @Param("today") LocalDate today);
}
