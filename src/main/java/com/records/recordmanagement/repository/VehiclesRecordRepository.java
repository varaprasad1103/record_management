package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.VehicleRecords;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiclesRecordRepository extends JpaRepository<VehicleRecords, Long> {
}
