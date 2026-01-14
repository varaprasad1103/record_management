package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.VehicleRecords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VehiclesRecordRepository extends JpaRepository<VehicleRecords, Long> {
    List<VehicleRecords> findByDate(LocalDate date);

    List<VehicleRecords> findByVehicleNo(String vehicleNo);

    List<VehicleRecords> findByDateBetween(LocalDate start, LocalDate end);
}
