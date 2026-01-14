package com.records.recordmanagement.service;

import com.records.recordmanagement.model.DestinationDispatch;
import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.model.VehicleRecords;
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

    public DestinationDispatchService(
            DestinationDispatchRepository destinationDispatchRepository,
            VehiclesRecordRepository vehiclesRecordRepository,
            SourceDispatchRepository sourceDispatchRepository) {
        this.destinationDispatchRepository = destinationDispatchRepository;
        this.vehiclesRecordRepository = vehiclesRecordRepository;
        this.sourceDispatchRepository = sourceDispatchRepository;
    }

    @Transactional
    public DestinationDispatch saveDestination(DestinationDispatch dispatch) {

        // 🔴 Validate sourceDispatch
        if (dispatch.getSourceDispatch() == null ||
                dispatch.getSourceDispatch().getId() == null) {
            throw new RuntimeException("SourceDispatch ID is required");
        }

        // ✅ ALWAYS fetch SourceDispatch from DB
        SourceDispatch source = sourceDispatchRepository
                .findById(dispatch.getSourceDispatch().getId())
                .orElseThrow(() -> new RuntimeException("SourceDispatch not found"));

        // 1️⃣ Calculate destination total
        double destinationAmount = dispatch.getQuantity() * dispatch.getRate();
        dispatch.setTotalAmount(destinationAmount);

        // 2️⃣ Attach managed source
        dispatch.setSourceDispatch(source);

        // 3️⃣ Save destination
        DestinationDispatch savedDestination =
                destinationDispatchRepository.save(dispatch);

        // 4️⃣ Create VehicleRecords entry
        VehicleRecords record = new VehicleRecords();
        record.setSourceDispatch(source);
        record.setDestinationDispatch(savedDestination);
        record.setDate(savedDestination.getDate());
        record.setVehicleNo(savedDestination.getVehicleNo());
        record.setSourceAmount(source.getTotalAmount());
        record.setDestinationAmount(destinationAmount);
        record.setProfit(destinationAmount - source.getTotalAmount());
        record.setCustomerName(savedDestination.getDestinationName());
        record.setPoNumber(savedDestination.getPoNumber());

        vehiclesRecordRepository.save(record);

        return savedDestination;
    }
}
