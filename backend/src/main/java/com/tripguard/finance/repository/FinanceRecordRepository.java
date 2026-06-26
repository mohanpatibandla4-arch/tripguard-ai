package com.tripguard.finance.repository;

import com.tripguard.finance.entity.FinanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FinanceRecordRepository extends JpaRepository<FinanceRecord, UUID> {
}
