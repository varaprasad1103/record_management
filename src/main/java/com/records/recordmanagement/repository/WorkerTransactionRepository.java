package com.records.recordmanagement.repository;

import com.records.recordmanagement.model.WorkerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerTransactionRepository extends JpaRepository<WorkerTransaction, Long> {
}
