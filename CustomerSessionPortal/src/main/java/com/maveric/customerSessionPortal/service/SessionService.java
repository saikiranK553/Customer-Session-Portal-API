package com.maveric.customerSessionPortal.service;

import com.maveric.customerSessionPortal.dto.SessionRequestDto;
import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import com.maveric.customerSessionPortal.entity.AppResponse;
import com.maveric.customerSessionPortal.entity.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SessionService {

    SessionResponseDto createsession(SessionRequestDto sessionDto);

    Page<SessionResponseDto> getSessions(SessionStatus status, Pageable pageable,String sortBy, String sortDir);

    void deleteSessionAndMoveToHistory(Long sessionToDelete);

    SessionResponseDto updateSession(String sessionId, SessionRequestDto sessionRequestDTO);

    AppResponse archiveSession(String sessionId);

}
