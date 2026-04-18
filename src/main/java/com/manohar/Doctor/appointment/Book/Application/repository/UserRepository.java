package com.manohar.Doctor.appointment.Book.Application.repository;

import com.manohar.Doctor.appointment.Book.Application.model.User;
import com.manohar.Doctor.appointment.Book.Application.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ── Auth ──────────────────────────────────────────────────────
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // ── Admin queries ─────────────────────────────────────────────
    List<User> findByRole(Role role);

    long countByRole(Role role);

    // ── Active users ──────────────────────────────────────────────
    List<User> findByRoleAndIsActiveTrue(Role role);

    // ── Search by name (case-insensitive) ─────────────────────────
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> searchByName(String name);
}
