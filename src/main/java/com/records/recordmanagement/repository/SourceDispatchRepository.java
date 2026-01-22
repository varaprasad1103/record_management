package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.SourceDispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SourceDispatchRepository extends JpaRepository<SourceDispatch, Long> {

    // ✅ Only return non-dispatched records for specific rice mill
    @Query("SELECT s FROM SourceDispatch s WHERE s.riceMill.id = :riceMillId AND s.isDispatched = false")
    List<SourceDispatch> findByRiceMillId(@Param("riceMillId") Long riceMillId);

    // ✅ NEW: Get ALL records for a rice mill (both dispatched and non-dispatched)
    @Query("SELECT s FROM SourceDispatch s WHERE s.riceMill.id = :riceMillId")
    List<SourceDispatch> findAllByRiceMillId(@Param("riceMillId") Long riceMillId);

    // ✅ NEW: Get all non-dispatched records
    List<SourceDispatch> findByIsDispatchedFalse();

    boolean existsByRiceMillId(Long riceMillId);

    @Query("select sum(s.totalAmount) from SourceDispatch s where s.riceMill.id = :id")
    Double getTotalDispatch(@Param("id") Long id);
}