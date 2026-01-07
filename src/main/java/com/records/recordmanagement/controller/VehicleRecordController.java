package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.VehicleRecord;
import com.records.recordmanagement.repository.VehicleRecordRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle-records")
public class VehicleRecordController {

    private final VehicleRecordRepository vehicleRecordRepository;

    public VehicleRecordController(VehicleRecordRepository vehicleRecordRepository) {
        this.vehicleRecordRepository = vehicleRecordRepository;
    }

    @PostMapping
    public VehicleRecord createRecord(@RequestBody VehicleRecord record) {

        // auto-calculate total
        if (record.getRate() != null && record.getQuantity() != null) {
            record.setTotal(record.getRate() * record.getQuantity());
        }

        return vehicleRecordRepository.save(record);
    }

    @GetMapping
    public List<VehicleRecord> getAllRecords() {
        return vehicleRecordRepository.findAll();
    }
}
