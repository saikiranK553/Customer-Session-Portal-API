package com.maveric.customerSessionPortal.service.impl;

import com.maveric.customerSessionPortal.dto.FlagArchiveSession;
import com.maveric.customerSessionPortal.dto.SessionRequestDto;
import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import com.maveric.customerSessionPortal.entity.*;
import com.maveric.customerSessionPortal.exception.SessionException;
import com.maveric.customerSessionPortal.repository.CustomerRepository;
import com.maveric.customerSessionPortal.repository.SessionHistoryRepository;
import com.maveric.customerSessionPortal.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;



@ExtendWith(SpringExtension.class)
@SpringBootTest
@ContextConfiguration()
 class ServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private SessionHistoryRepository sessionHistoryRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SessionRequestDto sessionRequestDto;

    @Mock
    private Session session;

    @Mock
    private Optional<Session> sessionOptional;

    @Mock
    private SessionResponseDto sessionResponseDto;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private SessionHistory sessionHistory;

    @Mock
    private AppResponse appResponse;
    @Value("${maximum.dormant.days}")
    private int maximumDormantDays;

//    @Spy
//    @InjectMocks
    private SessionServiceImpl sessionService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        sessionService = new SessionServiceImpl(maximumDormantDays,sessionRepository,modelMapper);
    }

    @Test
    void createSession_Success() {
        when(modelMapper.map(sessionRequestDto,Session.class)).thenReturn(session);
        when(sessionRepository.save(session)).thenReturn(session);
        when(modelMapper.map(session,SessionResponseDto.class)).thenReturn(sessionResponseDto);
        SessionResponseDto result = sessionService.createsession(sessionRequestDto);
        assertEquals(sessionResponseDto,result);
        verify(sessionRepository).save(session);
    }

    @Test

    void deleteSessionAndMoveToHistory_Success(){
        Long sessionToDeleteId = 1L;

        Session sessionToDelete = new Session();
        sessionToDelete.setSessionId(sessionToDeleteId);
        sessionToDelete.setStatus(SessionStatus.A);

        SessionHistory mappedSessionHistory = new SessionHistory();
        mappedSessionHistory.setSessionId(sessionToDeleteId);
        mappedSessionHistory.setStatus(SessionStatus.D);

        when(sessionRepository.findById(sessionToDeleteId)).thenReturn(Optional.of(sessionToDelete));
        when(modelMapper.map(sessionToDelete, SessionHistory.class)).thenReturn(mappedSessionHistory);

        sessionService.deleteSessionAndMoveToHistory(sessionToDeleteId);

        verify(sessionHistoryRepository, times(1)).save(mappedSessionHistory);
        assertEquals(SessionStatus.D, sessionToDelete.getStatus());
    }


    @Test
    void testArchiveSession_Success() {
        Long sessionId = 1L;

        Session session = new Session();
        session.setSessionId(sessionId);
        session.setStatus(SessionStatus.A);

        when(sessionRepository.findById(Long.valueOf(sessionId))).thenReturn(Optional.of(session));

        AppResponse response = sessionService.archiveSession(String.valueOf(sessionId));
        verify(sessionRepository, times(1)).save(session);
        assertEquals(SessionStatus.X, session.getStatus());
        assertEquals("ARCHIVED", response.getMessage());
        assertEquals(HttpStatus.OK, response.getHttpStatus());
    }


    @Test

    void testGetSessions() throws SessionException {
        Session session1 = new Session(/* ... */);
        Session session2 = new Session(/* ... */);
        List<Session> sessions = Arrays.asList(session1, session2);

        when(sessionRepository.findByStatus(any())).thenReturn(sessions);
        when(modelMapper.map(any(Session.class), eq(SessionResponseDto.class)))
                .thenReturn(new SessionResponseDto());

        Pageable pageable = PageRequest.of(0, 10);
        Page<SessionResponseDto> expectedPage = new PageImpl<>(Arrays.asList(new SessionResponseDto()));
        Page<SessionResponseDto> result = sessionService.getSessions(SessionStatus.A, pageable, "sessionId", "asc");
        verify(sessionRepository, times(1)).findByStatus((SessionStatus.A));
        verify(modelMapper, times(sessions.size())).map(any(Session.class), eq(SessionResponseDto.class));

        assertEquals(expectedPage.getContent().size(), result.getContent().size());
    }

    @Test
    void testUpdateSession_Success() {
        Long sessionId = 1L;
        Long customerId = 1L;

        SessionRequestDto sessionRequestDto = new SessionRequestDto();
        sessionRequestDto.setCustomerId(customerId);
        sessionRequestDto.setSessionName("Updated Session Name");
        sessionRequestDto.setRemarks("Updated remarks");
        sessionRequestDto.setCreatedBy("Updated User");

        Session session = new Session();
        session.setSessionId(Long.valueOf(sessionId));

        Customer customer = new Customer();
        customer.setId(customerId);

        Session updatedSession = new Session();
        updatedSession.setSessionId(Long.valueOf(sessionId));
        updatedSession.setSessionName("Updated Session Name");
        updatedSession.setRemarks("Updated remarks");
        updatedSession.setCreatedBy("Updated User");
        updatedSession.setCustomer(customer);
        updatedSession.setUpdatedOn(LocalDateTime.now());

        SessionResponseDto expectedResponseDto = new SessionResponseDto();
        expectedResponseDto.setSessionId(Long.valueOf(sessionId));
        expectedResponseDto.setSessionName("Updated Session Name");
        expectedResponseDto.setRemarks("Updated remarks");
        expectedResponseDto.setCreatedBy("Updated User");
        expectedResponseDto.setCustomerName(String.valueOf(customer));
        expectedResponseDto.setUpdatedOn(LocalDateTime.now());
        expectedResponseDto.setFlagArchiveSession(FlagArchiveSession.N);

        when(sessionRepository.findById(Long.valueOf(sessionId))).thenReturn(Optional.of(session));
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(sessionRepository.save(session)).thenReturn(updatedSession);
        when(modelMapper.map(updatedSession, SessionResponseDto.class)).thenReturn(expectedResponseDto);

        SessionResponseDto responseDto = sessionService.updateSession(String.valueOf(sessionId), sessionRequestDto);

        verify(sessionRepository, times(1)).findById(Long.valueOf(sessionId));
        verify(customerRepository, times(1)).findById(customerId);
        verify(sessionRepository, times(1)).save(session);
        verify(modelMapper, times(1)).map(updatedSession, SessionResponseDto.class);

        assertEquals(expectedResponseDto, responseDto);
    }


}













