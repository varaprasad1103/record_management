package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.WorkerTransaction;
import com.records.recordmanagement.repository.WorkerTransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/worker-transactions")
public class WorkerTransactionController {

    private final WorkerTransactionRepository workerTransactionRepository;

    public WorkerTransactionController(WorkerTransactionRepository workerTransactionRepository) {
        this.workerTransactionRepository = workerTransactionRepository;
    }

    @PostMapping
    public WorkerTransaction createTransaction(@RequestBody WorkerTransaction transaction) {
        return workerTransactionRepository.save(transaction);
    }

    @GetMapping
    public List<WorkerTransaction> getAllTransactions() {
        return workerTransactionRepository.findAll();
    }
}
