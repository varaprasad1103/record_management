package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.DestinationDispatch;
import com.records.recordmanagement.repository.DestinationDispatchRepository;
import com.records.recordmanagement.service.DestinationDispatchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destination-dispatch")
@CrossOrigin(origins = "http://localhost:3000")
public class DestinationDispatchController {

    private final DestinationDispatchService destinationDispatchService;
    private final DestinationDispatchRepository destinationDispatchRepository;

    public DestinationDispatchController(
            DestinationDispatchService destinationDispatchService,
            DestinationDispatchRepository destinationDispatchRepository) {
        this.destinationDispatchService = destinationDispatchService;
        this.destinationDispatchRepository = destinationDispatchRepository;
    }

    @PostMapping
    public DestinationDispatch create(@RequestBody DestinationDispatch dispatch) {
        return destinationDispatchService.saveDestination(dispatch);
    }

    @GetMapping
    public List<DestinationDispatch> getAll() {
        return destinationDispatchRepository.findAll();
    }
}
