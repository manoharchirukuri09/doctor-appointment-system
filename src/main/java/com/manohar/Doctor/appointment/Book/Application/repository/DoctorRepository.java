package com.manohar.Doctor.appointment.Book.Application.repository;

import com.manohar.Doctor.appointment.Book.Application.model.Doctor;
import com.manohar.Doctor.appointment.Book.Application.model.User;
import org.springframework.data.jpa.repository.EntityGraph; // Import this
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // This is the key fix for your Admin Panel
    // It forces Hibernate to load the linked User data immediately
    @Override
    @EntityGraph(attributePaths = {"user"})
    List<Doctor> findAll();

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"user"})
    Optional<Doctor> findById(@NonNull Long id);

    // Add it here too so the "Available Doctors" list doesn't crash either
    @EntityGraph(attributePaths = {"user"})
    List<Doctor> findByAvailableTrue();

    // ... your existing methods
    @EntityGraph(attributePaths = {"user"})
    Optional<Doctor> findByUser(User user);
    @EntityGraph(attributePaths = {"user"})
    Optional<Doctor> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    List<Doctor> findBySpeciality(String speciality);

    // Eagerly fetch user in search to avoid LazyInitializationException
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE LOWER(d.speciality) LIKE LOWER(CONCAT('%', :speciality, '%'))")
    List<Doctor> searchBySpeciality(@Param("speciality") String speciality);

    @Query("SELECT d FROM Doctor d JOIN d.user u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> searchByDoctorName(@Param("name") String name);

    long countByAvailableTrue();
    boolean existsByUser(User user);
}