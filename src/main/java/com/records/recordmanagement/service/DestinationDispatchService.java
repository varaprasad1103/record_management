package com.records.recordmanagement.service;

import com.records.recordmanagement.model.DestinationCompany;
import com.records.recordmanagement.model.DestinationDispatch;
import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.model.VehicleRecords;
import com.records.recordmanagement.repository.DestinationCompanyRepository;
import com.records.recordmanagement.repository.DestinationDispatchRepository;
import com.records.recordmanagement.repository.SourceDispatchRepository;
import com.records.recordmanagement.repository.VehiclesRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DestinationDispatchService {

    private final DestinationDispatchRepository destinationDispatchRepository;
    private final VehiclesRecordRepository vehiclesRecordRepository;
    private final SourceDispatchRepository sourceDispatchRepository;
    private final DestinationCompanyRepository destinationCompanyRepository;

    public DestinationDispatchService(
            DestinationDispatchRepository destinationDispatchRepository,
            VehiclesRecordRepository vehiclesRecordRepository,
            SourceDispatchRepository sourceDispatchRepository,
            DestinationCompanyRepository destinationCompanyRepository) {
        this.destinationDispatchRepository = destinationDispatchRepository;
        this.vehiclesRecordRepository = vehiclesRecordRepository;
        this.sourceDispatchRepository = sourceDispatchRepository;
        this.destinationCompanyRepository = destinationCompanyRepository;
    }

    @Transactional
    public DestinationDispatch saveDestination(DestinationDispatch dispatch) {

        // Validate sourceDispatch
        if (dispatch.getSourceDispatch() == null ||
                dispatch.getSourceDispatch().getId() == null) {
            throw new RuntimeException("SourceDispatch ID is required");
        }

        // Validate destinationCompany
        if (dispatch.getDestinationCompany() == null ||
                dispatch.getDestinationCompany().getId() == null) {
            throw new RuntimeException("Destination Company ID is required");
        }

        // Fetch SourceDispatch from DB
        SourceDispatch source = sourceDispatchRepository
                .findById(dispatch.getSourceDispatch().getId())
                .orElseThrow(() -> new RuntimeException("SourceDispatch not found"));

        // Check if already dispatched
        if (source.getIsDispatched()) {
            throw new RuntimeException("This source dispatch has already been dispatched");
        }

        // Fetch DestinationCompany from DB
        DestinationCompany company = destinationCompanyRepository
                .findById(dispatch.getDestinationCompany().getId())
                .orElseThrow(() -> new RuntimeException("Destination Company not found"));

        // Calculate destination total
        double destinationAmount = dispatch.getQuantity() * dispatch.getRate();
        dispatch.setTotalAmount(destinationAmount);

        // Attach managed entities
        dispatch.setSourceDispatch(source);
        dispatch.setDestinationCompany(company);

        // Save destination
        DestinationDispatch savedDestination = destinationDispatchRepository.save(dispatch);

        // Create VehicleRecords entry
        VehicleRecords record = new VehicleRecords();
        record.setSourceDispatch(source);
        record.setDestinationDispatch(savedDestination);
        record.setDate(savedDestination.getDate());
        record.setVehicleNo(savedDestination.getVehicleNo());
        record.setSourceAmount(source.getTotalAmount());
        record.setDestinationAmount(destinationAmount);
        record.setProfit(destinationAmount - source.getTotalAmount());
        record.setCustomerName(company.getName());
        record.setPoNumber(savedDestination.getPoNumber());

        vehiclesRecordRepository.save(record);

        // Mark source as dispatched
        source.setIsDispatched(true);
        sourceDispatchRepository.save(source);

        return savedDestination;
    }
}