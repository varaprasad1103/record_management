package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.RiceMill;
import com.records.recordmanagement.repository.RiceMillRepository;
import com.records.recordmanagement.repository.SourceDispatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ricemills")
@CrossOrigin(origins = "http://localhost:3000")
public class RiceMillController {

    private final RiceMillRepository riceMillRepository;
    private final SourceDispatchRepository sourceDispatchRepository;

    public RiceMillController(RiceMillRepository riceMillRepository,
                              SourceDispatchRepository sourceDispatchRepository) {
        this.riceMillRepository = riceMillRepository;
        this.sourceDispatchRepository = sourceDispatchRepository;
    }

    @PostMapping
    public RiceMill create(@RequestBody RiceMill riceMill) {
        return riceMillRepository.save(riceMill);
    }

    @GetMapping
    public List<RiceMill> getAll() {
        return riceMillRepository.findAll();
    }

    @GetMapping("/{id}")
    public RiceMill getById(@PathVariable Long id) {
        return riceMillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RiceMill not found"));
    }

    @PutMapping("/{id}")
    public RiceMill update(@PathVariable Long id, @RequestBody RiceMill updated) {
        return riceMillRepository.findById(id)
                .map(r -> {
                    r.setLocation(updated.getLocation());
                    r.setAdvanceAmount(updated.getAdvanceAmount());
                    r.setBalanceAmount(updated.getBalanceAmount());
                    return riceMillRepository.save(r);
                })
                .orElseThrow(() -> new RuntimeException("RiceMill not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (sourceDispatchRepository.existsByRiceMillId(id)) {
            throw new RuntimeException("Cannot delete RiceMill with transactions");
        }
        riceMillRepository.deleteById(id);
    }
}
