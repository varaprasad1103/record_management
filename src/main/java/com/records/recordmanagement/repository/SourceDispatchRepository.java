package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.SourceDispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SourceDispatchRepository extends JpaRepository<SourceDispatch, Long> {

    List<SourceDispatch> findByRiceMillId(Long riceMillId);
    boolean existsByRiceMillId(Long riceMillId);

}
