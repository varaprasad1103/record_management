package com.records.recordmanagement.service;

import com.records.recordmanagement.model.RiceMill;
import com.records.recordmanagement.model.SourceDispatch;
import com.records.recordmanagement.repository.RiceMillRepository;
import com.records.recordmanagement.repository.SourceDispatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SourceDispatchService {

    private final SourceDispatchRepository sourceDispatchRepository;
    private final RiceMillRepository riceMillRepository;

    public SourceDispatchService(SourceDispatchRepository sourceDispatchRepository,
                                 RiceMillRepository riceMillRepository) {
        this.sourceDispatchRepository = sourceDispatchRepository;
        this.riceMillRepository = riceMillRepository;
    }

    public SourceDispatch update(Long id, SourceDispatch updated) {
        return sourceDispatchRepository.findById(id)
                .map(d -> {

                    // ✅ Prevent updating already dispatched records
                    if (d.getIsDispatched()) {
                        throw new RuntimeException("Cannot update a dispatched record");
                    }

                    double oldTotal = d.getTotalAmount();

                    double newTotal = updated.getQuantity() * updated.getRate();

                    RiceMill riceMill = riceMillRepository.findById(
                            updated.getRiceMill().getId()
                    ).orElseThrow(() -> new RuntimeException("RiceMill not found"));

                    double advance = riceMill.getAdvanceAmount();
                    double balance = riceMill.getBalanceAmount();

                    double diff = newTotal - oldTotal;

                    if (diff > 0) {
                        if (advance >= diff) {
                            riceMill.setAdvanceAmount(advance - diff);
                        } else {
                            riceMill.setBalanceAmount(balance + (diff - advance));
                            riceMill.setAdvanceAmount(0.0);
                        }
                    } else if (diff < 0) {
                        riceMill.setAdvanceAmount(advance + Math.abs(diff));
                    }

                    riceMillRepository.save(riceMill);

                    d.setDate(updated.getDate());
                    d.setVehicleNo(updated.getVehicleNo());
                    d.setQuantity(updated.getQuantity());
                    d.setRate(updated.getRate());
                    d.setTotalAmount(newTotal);
                    d.setRiceMill(riceMill);

                    return sourceDispatchRepository.save(d);
                })
                .orElseThrow(() -> new RuntimeException("Dispatch not found"));
    }

    @Transactional
    public SourceDispatch saveSourceDispatch(SourceDispatch dispatch) {

        // 1️⃣ Calculate total
        double total = dispatch.getQuantity() * dispatch.getRate();
        dispatch.setTotalAmount(total);

        // 2️⃣ Always fetch RiceMill from DB
        Long riceMillId = dispatch.getRiceMill().getId();

        RiceMill riceMill = riceMillRepository.findById(riceMillId)
                .orElseThrow(() -> new RuntimeException("RiceMill not found"));

        double advance = riceMill.getAdvanceAmount();
        double balance = riceMill.getBalanceAmount();

        // 3️⃣ Adjust financials
        if (advance >= total) {
            riceMill.setAdvanceAmount(advance - total);
        } else {
            double pending = total - advance;
            riceMill.setBalanceAmount(balance + pending);
            riceMill.setAdvanceAmount(0.0);
        }

        // 4️⃣ Save RiceMill safely
        riceMillRepository.save(riceMill);

        // 5️⃣ Attach managed RiceMill to dispatch
        dispatch.setRiceMill(riceMill);

        // ✅ Set as not dispatched by default
        dispatch.setIsDispatched(false);

        // 6️⃣ Save dispatch
        return sourceDispatchRepository.save(dispatch);
    }
}