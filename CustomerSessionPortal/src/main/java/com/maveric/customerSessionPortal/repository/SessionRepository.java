package com.maveric.customerSessionPortal.repository;

import com.maveric.customerSessionPortal.entity.Session;
import com.maveric.customerSessionPortal.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByStatus(SessionStatus status);

}
