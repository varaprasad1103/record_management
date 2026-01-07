package com.records.recordmanagement.repository;


import com.records.recordmanagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer, Long>{
}
