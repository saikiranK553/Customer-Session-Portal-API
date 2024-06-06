package com.maveric.customerSessionPortal.repository;

import com.maveric.customerSessionPortal.entity.SessionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionHistoryRepository extends JpaRepository<SessionHistory, Long> {}
