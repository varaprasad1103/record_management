package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.service.SourceDispatchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/source-dispatch")
public class SourceDispatchController {

    private final SourceDispatchService sourceDispatchService;

    public SourceDispatchController(SourceDispatchService sourceDispatchService) {
        this.sourceDispatchService = sourceDispatchService;
    }

    @PostMapping
    public SourceDispatch create(@RequestBody SourceDispatch dispatch) {
        return sourceDispatchService.saveSourceDispatch(dispatch);
    }
}
