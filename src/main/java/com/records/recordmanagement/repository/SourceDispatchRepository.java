package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.SourceDispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SourceDispatchRepository extends JpaRepository<SourceDispatch, Long> {

    List<SourceDispatch> findByRiceMillId(Long riceMillId);
    boolean existsByRiceMillId(Long riceMillId);

    @Query("select sum(s.totalAmount) from SourceDispatch s where s.riceMill.id = :id")
    Double getTotalDispatch(@Param("id") Long id);
}
