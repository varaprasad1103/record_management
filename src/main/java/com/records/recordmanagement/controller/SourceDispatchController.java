package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.service.SourceDispatchService;
import com.records.recordmanagement.repository.SourceDispatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/source-dispatch")
@CrossOrigin(origins = "http://localhost:3000")
public class SourceDispatchController {

    private final SourceDispatchService sourceDispatchService;
    private final SourceDispatchRepository sourceDispatchRepository;

    public SourceDispatchController(SourceDispatchService sourceDispatchService,
                                    SourceDispatchRepository sourceDispatchRepository) {
        this.sourceDispatchService = sourceDispatchService;
        this.sourceDispatchRepository = sourceDispatchRepository;
    }

    // ✅ CREATE
    @PostMapping
    public SourceDispatch create(@RequestBody SourceDispatch dispatch) {
        return sourceDispatchService.saveSourceDispatch(dispatch);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public SourceDispatch update(@PathVariable Long id,
                                 @RequestBody SourceDispatch updated) {
        return sourceDispatchService.update(id, updated);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        sourceDispatchRepository.deleteById(id);
    }

    // ✅ LIST ALL (only non-dispatched) - for Source Dispatch page
    @GetMapping
    public List<SourceDispatch> getAll() {
        return sourceDispatchRepository.findByIsDispatchedFalse();
    }

    // ✅ LIST BY RICEMILL (only non-dispatched) - for adding to destination
    @GetMapping("/ricemill/{id}")
    public List<SourceDispatch> getByRiceMill(@PathVariable Long id) {
        return sourceDispatchRepository.findByRiceMillId(id);
    }

    // ✅ NEW: LIST ALL RECORDS BY RICEMILL (including dispatched) - for Rice Mill Details page
    @GetMapping("/ricemill/{id}/all")
    public List<SourceDispatch> getAllByRiceMill(@PathVariable Long id) {
        return sourceDispatchRepository.findAllByRiceMillId(id);
    }
}