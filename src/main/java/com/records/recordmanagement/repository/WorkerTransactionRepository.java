package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.WorkerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkerTransactionRepository extends JpaRepository<WorkerTransaction, Long> {
    List<WorkerTransaction> findByWorkerName(String workerName);

    List<WorkerTransaction> findByDate(String date);

    List<WorkerTransaction> findByType(String type);

    @Query("SELECT SUM(w.amount) FROM WorkerTransaction w WHERE w.workerName = :name")
    Double getTotalPaidToWorker(String name);

}
