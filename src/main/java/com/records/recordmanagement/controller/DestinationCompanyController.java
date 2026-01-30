package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.DestinationCompany;
import com.records.recordmanagement.repository.DestinationCompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destination-companies")
@CrossOrigin(origins = "http://localhost:3000")
public class DestinationCompanyController {

    private final DestinationCompanyRepository destinationCompanyRepository;

    public DestinationCompanyController(DestinationCompanyRepository destinationCompanyRepository) {
        this.destinationCompanyRepository = destinationCompanyRepository;
    }

    // CREATE
    @PostMapping
    public DestinationCompany create(@RequestBody DestinationCompany company) {
        return destinationCompanyRepository.save(company);
    }

    // GET ALL
    @GetMapping
    public List<DestinationCompany> getAll() {
        return destinationCompanyRepository.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public DestinationCompany getById(@PathVariable Long id) {
        return destinationCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        destinationCompanyRepository.deleteById(id);
        return ResponseEntity.ok("Company deleted successfully");
    }
}