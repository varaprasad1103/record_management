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
    @PutMapping("/{id}")
    public WorkerTransaction updateTransaction(@PathVariable Long id, @RequestBody WorkerTransaction updated) {
        return workerTransactionRepository.findById(id)
                .map(t -> {
                    t.setWorkerName(updated.getWorkerName());
                    t.setDate(updated.getDate());
                    t.setType(updated.getType());
                    t.setAmount(updated.getAmount());
                    t.setDescription(updated.getDescription());
                    return workerTransactionRepository.save(t);
                })
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        workerTransactionRepository.deleteById(id);
    }
    @GetMapping("/worker/{name}")
    public List<WorkerTransaction> searchByWorker(@PathVariable String name) {
        return workerTransactionRepository.findByWorkerName(name);
    }

    @GetMapping("/date/{date}")
    public List<WorkerTransaction> searchByDate(@PathVariable String date) {
        return workerTransactionRepository.findByDate(date);
    }

    @GetMapping("/type/{type}")
    public List<WorkerTransaction> searchByType(@PathVariable String type) {
        return workerTransactionRepository.findByType(type);
    }

    @GetMapping("/total/worker/{name}")
    public Double getTotalPaid(@PathVariable String name) {
        return workerTransactionRepository.getTotalPaidToWorker(name);
    }

}
