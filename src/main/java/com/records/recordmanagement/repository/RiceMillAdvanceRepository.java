package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.RiceMillAdvance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RiceMillAdvanceRepository
        extends JpaRepository<RiceMillAdvance, Long> {

    List<RiceMillAdvance> findByRiceMillId(Long id);

    @Query("select sum(a.amount) from RiceMillAdvance a where a.riceMill.id = :id")
    Double getTotalAdvance(@Param("id") Long id);
}
