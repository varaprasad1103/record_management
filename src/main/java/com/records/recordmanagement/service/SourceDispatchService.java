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

    @Transactional
    public SourceDispatch saveSourceDispatch(SourceDispatch dispatch) {

        RiceMill riceMill = dispatch.getRiceMill();

        double total = dispatch.getTotalAmount();
        double advance = riceMill.getAdvanceAmount();
        double balance = riceMill.getBalanceAmount();

        if (advance >= total) {
            riceMill.setAdvanceAmount(advance - total);
        } else {
            double pending = total - advance;
            riceMill.setBalanceAmount(balance + pending);
            riceMill.setAdvanceAmount(0.0);
        }

        // Save updated ricemill first
        riceMillRepository.save(riceMill);

        // Save source dispatch
        return sourceDispatchRepository.save(dispatch);
    }
}
