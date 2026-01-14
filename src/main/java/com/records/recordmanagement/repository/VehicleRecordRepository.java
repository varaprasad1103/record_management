/*
package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.VehicleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehicleRecordRepository extends JpaRepository<VehicleRecord, Long> {


    List<VehicleRecord> findByVehicleNo(String vehicleNo);

    List<VehicleRecord> findByDate(String date);

    List<VehicleRecord> findByCustomerName(String customerName);

    @Query("SELECT SUM(v.quantity) FROM VehicleRecord v WHERE v.date = :date")
    Double getTotalQtyByDate(String date);

    @Query("SELECT SUM(v.totalAmount) FROM VehicleRecord v WHERE v.date = :date")
    Double getTotalAmountByDate(String date);
}
*/
