/*
package com.records.recordmanagement.controller;

import com.records.recordmanagement.model.User;
import com.records.recordmanagement.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    */
/*@PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }
*//*

    @PostMapping
    public User saveCustomer(@RequestBody User customer) {
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<User> getAllCustomers() {
        return customerRepository.findAll();
    }
    @PutMapping("/{id}")
    public User updateCustomer(@PathVariable Long id, @RequestBody User updated) {
        User c = customerRepository.findById(id).orElseThrow();
        c.setName(updated.getName());
        c.setPhone(updated.getPhone());
        c.setAddress(updated.getAddress());
        c.setNotes(updated.getNotes());
        return customerRepository.save(c);
    }
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
    }


}
*/
