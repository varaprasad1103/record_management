package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.RiceMill;
import com.records.recordmanagement.model.RiceMillAdvance;
import com.records.recordmanagement.repository.RiceMillAdvanceRepository;
import com.records.recordmanagement.repository.RiceMillRepository;
import com.records.recordmanagement.repository.SourceDispatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ricemills")
@CrossOrigin(origins = "http://localhost:3000")
public class RiceMillController {

    private final RiceMillRepository riceMillRepository;
    private final SourceDispatchRepository sourceDispatchRepository;
    private final RiceMillAdvanceRepository advanceRepository;

    public RiceMillController(RiceMillRepository riceMillRepository,
                              SourceDispatchRepository sourceDispatchRepository,
                              RiceMillAdvanceRepository advanceRepository) {
        this.riceMillRepository = riceMillRepository;
        this.sourceDispatchRepository = sourceDispatchRepository;
        this.advanceRepository = advanceRepository;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {

        if (sourceDispatchRepository.existsByRiceMillId(id)) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete RiceMill with transactions");
        }

        riceMillRepository.deleteById(id);
        return ResponseEntity.ok("RiceMill deleted successfully");
    }

    @GetMapping("/{id}/balance")
    public Double getBalance(@PathVariable Long id){

        Double adv = advanceRepository.getTotalAdvance(id);
        Double dispatch = sourceDispatchRepository.getTotalDispatch(id);

        return (dispatch == null ? 0 : dispatch) - (adv == null ? 0 : adv);
    }

    // ===== ADVANCE ENDPOINTS (consolidated here) =====

    @PostMapping("/{id}/advance")
    public RiceMillAdvance addAdvance(@PathVariable Long id,
                                      @RequestBody RiceMillAdvance advance){

        RiceMill mill = riceMillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RiceMill not found"));

        advance.setRiceMill(mill);
        return advanceRepository.save(advance);
    }

    @GetMapping("/{id}/advances")
    public List<RiceMillAdvance> getAdvances(@PathVariable Long id){
        return advanceRepository.findByRiceMillId(id);
    }
}