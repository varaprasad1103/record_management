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

    // ✅ LIST ALL
    @GetMapping
    public List<SourceDispatch> getAll() {
        return sourceDispatchRepository.findAll();
    }

    // ✅ LIST BY RICEMILL
    @GetMapping("/ricemill/{id}")
    public List<SourceDispatch> getByRiceMill(@PathVariable Long id) {
        return sourceDispatchRepository.findByRiceMillId(id);
    }
}
