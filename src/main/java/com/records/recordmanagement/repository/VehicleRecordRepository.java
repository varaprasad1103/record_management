package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.VehicleRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRecordRepository extends JpaRepository<VehicleRecord, Long> {
}
