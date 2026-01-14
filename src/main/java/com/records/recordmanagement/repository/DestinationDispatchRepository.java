package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.DestinationDispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationDispatchRepository extends JpaRepository<DestinationDispatch, Long> {
    List<DestinationDispatch> findBySourceDispatchId(Long sourceId);
}
