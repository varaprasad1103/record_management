/*
package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.VehicleRecord;
import com.records.recordmanagement.repository.VehicleRecordRepository;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @PutMapping("/{id}")
    public VehicleRecord updateRecord(@PathVariable Long id, @RequestBody VehicleRecord updated) {
        return vehicleRecordRepository.findById(id)
                .map(record -> {
                    record.setCustomerName(updated.getCustomerName());
                    record.setVehicleNo(updated.getVehicleNo());
                    record.setTokenNo(updated.getTokenNo());
                    record.setDate(updated.getDate());
                    record.setRate(updated.getRate());
                    record.setQuantity(updated.getQuantity());

                    if (updated.getRate() != null && updated.getQuantity() != null) {
                        record.setTotal(updated.getRate() * updated.getQuantity());
                    }

                    return vehicleRecordRepository.save(record);
                })
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }
    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable Long id) {
        vehicleRecordRepository.deleteById(id);
    }

    @GetMapping("/vehicle/{vehicleNo}")
    public List<VehicleRecord> searchByVehicle(@PathVariable String vehicleNo) {
        return vehicleRecordRepository.findByVehicleNo(vehicleNo);
    }

    @GetMapping("/date/{date}")
    public List<VehicleRecord> searchByDate(@PathVariable String date) {
        return vehicleRecordRepository.findByDate(date);
    }

    @GetMapping("/customer/{name}")
    public List<VehicleRecord> searchByCustomer(@PathVariable String name) {
        return vehicleRecordRepository.findByCustomerName(name);
    }
    @GetMapping("/totals/{date}")
    public Map<String, Double> getTotalsByDate(@PathVariable String date) {
        Map<String, Double> result = new HashMap<>();
        result.put("totalQty", vehicleRecordRepository.getTotalQtyByDate(date));
        result.put("totalAmount", vehicleRecordRepository.getTotalAmountByDate(date));
        return result;
    }

}
*/
