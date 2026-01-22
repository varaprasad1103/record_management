package com.records.recordmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_record")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class VehicleRecords{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Link to SourceDispatch
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_dispatch_id", nullable = false)
    @JsonIgnoreProperties({"riceMill"})
    private SourceDispatch sourceDispatch;

    // 🔗 Link to DestinationDispatch
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_dispatch_id", nullable = false)
    @JsonIgnoreProperties({"vehicleRecords", "customer"})
    private DestinationDispatch destinationDispatch;

    private LocalDate date;

    private String vehicleNo;

    private Double sourceAmount;

    private Double destinationAmount;

    private Double profit;

    private String customerName;

    private String poNumber;

    public VehicleRecords() {
    }

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SourceDispatch getSourceDispatch() {
        return sourceDispatch;
    }

    public void setSourceDispatch(SourceDispatch sourceDispatch) {
        this.sourceDispatch = sourceDispatch;
    }

    public DestinationDispatch getDestinationDispatch() {
        return destinationDispatch;
    }

    public void setDestinationDispatch(DestinationDispatch destinationDispatch) {
        this.destinationDispatch = destinationDispatch;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public Double getSourceAmount() {
        return sourceAmount;
    }

    public void setSourceAmount(Double sourceAmount) {
        this.sourceAmount = sourceAmount;
    }

    public Double getDestinationAmount() {
        return destinationAmount;
    }

    public void setDestinationAmount(Double destinationAmount) {
        this.destinationAmount = destinationAmount;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPoNumber() {
        return poNumber;
    }

    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }
}