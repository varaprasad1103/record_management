package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.DestinationDispatch;
import com.records.recordmanagement.service.DestinationDispatchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/destination-dispatch")
public class DestinationDispatchController {

    private final DestinationDispatchService destinationDispatchService;

    public DestinationDispatchController(DestinationDispatchService destinationDispatchService) {
        this.destinationDispatchService = destinationDispatchService;
    }

    @PostMapping
    public DestinationDispatch create(@RequestBody DestinationDispatch dispatch) {
        return destinationDispatchService.saveDestination(dispatch);
    }
}
