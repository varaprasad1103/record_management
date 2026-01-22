package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.VehicleRecords;
import com.records.recordmanagement.repository.VehiclesRecordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vehicle-records")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleRecordsController {

    private final VehiclesRecordRepository vehiclesRecordRepository;

    public VehicleRecordsController(VehiclesRecordRepository vehiclesRecordRepository) {
        this.vehiclesRecordRepository = vehiclesRecordRepository;
    }

    // ✅ LIST ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<VehicleRecords> records = vehiclesRecordRepository.findAll();
            System.out.println("✅ Successfully fetched " + records.size() + " vehicle records");
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            System.err.println("❌ Error fetching vehicle records:");
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // ✅ FILTER BY DATE
    @GetMapping("/date/{date}")
    public List<VehicleRecords> getByDate(@PathVariable String date) {
        return vehiclesRecordRepository.findByDate(LocalDate.parse(date));
    }

    // ✅ FILTER BY DATE RANGE
    @GetMapping("/range")
    public List<VehicleRecords> getByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        return vehiclesRecordRepository.findByDateBetween(
                LocalDate.parse(start),
                LocalDate.parse(end)
        );
    }

    // ✅ FILTER BY VEHICLE NO
    @GetMapping("/vehicle/{vehicleNo}")
    public List<VehicleRecords> getByVehicle(@PathVariable String vehicleNo) {
        return vehiclesRecordRepository.findByVehicleNo(vehicleNo);
    }
}