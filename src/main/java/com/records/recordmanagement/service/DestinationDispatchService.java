package com.records.recordmanagement.service;

import com.records.recordmanagement.model.DestinationDispatch;
import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.model.VehicleRecords;
import com.records.recordmanagement.repository.DestinationDispatchRepository;
import com.records.recordmanagement.repository.VehiclesRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DestinationDispatchService {

    private final DestinationDispatchRepository destinationDispatchRepository;
    private final VehiclesRecordRepository vehiclesRecordRepository;

    public DestinationDispatchService(
            DestinationDispatchRepository destinationDispatchRepository,
            VehiclesRecordRepository vehiclesRecordRepository) {
        this.destinationDispatchRepository = destinationDispatchRepository;
        this.vehiclesRecordRepository = vehiclesRecordRepository;
    }

    @Transactional
    public DestinationDispatch saveDestination(DestinationDispatch dispatch) {

        // 1️⃣ Calculate destination total
        double destinationAmount = dispatch.getQuantity() * dispatch.getRate();
        dispatch.setTotalAmount(destinationAmount);

        // 2️⃣ Save destination first
        DestinationDispatch savedDestination =
                destinationDispatchRepository.save(dispatch);

        // 3️⃣ Get source info
        SourceDispatch source = dispatch.getSourceDispatch();
        double sourceAmount = source.getTotalAmount();

        // 4️⃣ Create VehicleRecord
        VehicleRecords record = new VehicleRecords();
        record.setSourceDispatch(source);
        record.setDestinationDispatch(savedDestination);
        record.setDate(savedDestination.getDate());
        record.setVehicleNo(savedDestination.getVehicleNo());
        record.setSourceAmount(sourceAmount);
        record.setDestinationAmount(destinationAmount);
        record.setProfit(destinationAmount - sourceAmount);
        record.setCustomerName(savedDestination.getDestinationName());
        record.setPoNumber(savedDestination.getPoNumber());

        vehiclesRecordRepository.save(record);

        return savedDestination;
    }
}
