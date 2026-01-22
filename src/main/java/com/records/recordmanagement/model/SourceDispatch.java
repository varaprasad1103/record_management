package com.records.recordmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "source_dispatch")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SourceDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relationship to Ricemill (MANDATORY)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ricemill_id", nullable = false)
    @JsonIgnoreProperties({"sourceDispatches", "advances"})
    private RiceMill riceMill;

    private LocalDate date;
    private String vehicleNo;

    private Double quantity;
    private Double rate;
    private Double totalAmount;

    @Column(name = "is_dispatched", nullable = false)
    private Boolean isDispatched = false;

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

    public Boolean getIsDispatched() {
        return isDispatched;
    }

    public void setIsDispatched(Boolean isDispatched) {
        this.isDispatched = isDispatched;
    }
}