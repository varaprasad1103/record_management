package com.records.recordmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "source_dispatch")
public class SourceDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relationship to Ricemill (MANDATORY)
    @ManyToOne
    @JoinColumn(name = "ricemill_id", nullable = false)
    private RiceMill riceMill;

    private LocalDate date;
    private String vehicleNo;

    private Double quantity;
    private Double rate;
    private Double totalAmount;

    public SourceDispatch() {
    }
    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RiceMill getRiceMill() {
        return riceMill;
    }

    public void setRiceMill(RiceMill riceMill) {
        this.riceMill = riceMill;
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

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
