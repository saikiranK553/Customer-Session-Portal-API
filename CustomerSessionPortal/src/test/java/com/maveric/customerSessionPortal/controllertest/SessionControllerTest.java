package com.maveric.customerSessionPortal.controllertest;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.maveric.customerSessionPortal.constant.Message;
import com.maveric.customerSessionPortal.controller.SessionController;
import com.maveric.customerSessionPortal.dto.FlagArchiveSession;
import com.maveric.customerSessionPortal.dto.Response;
import com.maveric.customerSessionPortal.dto.SessionRequestDto;
import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import com.maveric.customerSessionPortal.entity.AppResponse;
import com.maveric.customerSessionPortal.entity.SessionStatus;
import com.maveric.customerSessionPortal.exception.SessionException;
import com.maveric.customerSessionPortal.service.SessionService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private MockMvc mockMvc;

    @Mock
    private ModelMapper mapper;

    @Mock
    private AppResponse appResponse;

    @Mock
    private SessionRequestDto sessionRequestDto;

    @Mock
    private SessionResponseDto sessionResponseDto;

    @Mock
    private Response response;

    @Spy
    @InjectMocks
    private SessionController sessionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired

    private WebApplicationContext context;

    @BeforeEach
    public void setUp() {

        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();

    }

    @Test
    void testCreateSession() {

        SessionRequestDto sessionRequestDto = new SessionRequestDto();
        sessionRequestDto.setSessionName("Sample Session");
        sessionRequestDto.setSessionId(1L);
        sessionRequestDto.setCreatedBy("John Doe");
        sessionRequestDto.setCustomerId(2L);
        sessionRequestDto.setRemarks("Some remarks");

        SessionResponseDto sessionResponseDto = new SessionResponseDto();
        sessionResponseDto.setSessionId(1L);
        sessionResponseDto.setSessionName("Sample Session");
        sessionResponseDto.setCustomerName("John Doe");
        sessionResponseDto.setRemarks("Some remarks");
        sessionResponseDto.setCreatedBy("John Doe");
        sessionResponseDto.setCreatedOn(LocalDateTime.now());
        sessionResponseDto.setUpdatedOn(LocalDateTime.now());
        sessionResponseDto.setStatus(SessionStatus.A);
        sessionResponseDto.setFlagArchiveSession(FlagArchiveSession.Y);

        when(sessionService.createsession(sessionRequestDto)).thenReturn(sessionResponseDto);
        ResponseEntity<AppResponse> responseEntity = sessionController.createSession(sessionRequestDto);

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        AppResponse appResponse = responseEntity.getBody();
        assertNotNull(appResponse);
        assertEquals("Session created", appResponse.getMessage());
        assertEquals(HttpStatus.CREATED, appResponse.getHttpStatus());
        assertEquals(sessionResponseDto, appResponse.getSessionResponseDto());
        verify(sessionService, times(1)).createsession(sessionRequestDto);

    }

    @Test
    void testUpdateSession() {
        Long sessionId = 2L;
        SessionRequestDto sessionRequestDto = new SessionRequestDto();
        SessionResponseDto sessionResponseDto = new SessionResponseDto();
        AppResponse appResponse = new AppResponse();

        when(sessionService.updateSession(String.valueOf(sessionId), sessionRequestDto)).thenReturn(sessionResponseDto);

        ResponseEntity<AppResponse> result = sessionController.updateSession(String.valueOf(sessionId), sessionRequestDto);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(Message.UPDATED, result.getBody().getMessage());
        assertEquals(HttpStatus.OK, result.getBody().getHttpStatus());
        assertEquals(sessionResponseDto, result.getBody().getSessionResponseDto());
        verify(sessionService, times(1)).updateSession(String.valueOf(sessionId), sessionRequestDto);

    }

    @Test
    void testUpdateSession_ApiRequestException() {
        String sessionId = "session123";
        SessionRequestDto sessionRequestDTO = mock(SessionRequestDto.class);
        doThrow(new SessionException("No session found")).when(sessionService).updateSession(sessionId, sessionRequestDTO);
        Assertions.assertThrows(SessionException.class, () -> sessionController.updateSession(sessionId, sessionRequestDTO));
        verify(appResponse, never()).setMessage("Session Updated");
        verify(appResponse, never()).setHttpStatus(HttpStatus.OK);
    }

    @Test
    void testDeleteSessionAndMoveToHistory() {
        Long sessionId = 2L;

        ResponseEntity<String> expectedResponse = ResponseEntity.ok("Session deleted and moved to history.");
        doNothing().when(sessionService).deleteSessionAndMoveToHistory(sessionId);
        ResponseEntity<String> actualResponse = sessionController.deleteSessionAndMoveToHistory(sessionId);
        assertEquals(expectedResponse, actualResponse);
        verify(sessionService, times(1)).deleteSessionAndMoveToHistory(sessionId);
    }

    @Test
    void testArchiveSession_Success() {

        Long sessionId = 3L;
        AppResponse successResponse = new AppResponse();
        successResponse.setMessage("Session archived");
        successResponse.setHttpStatus(HttpStatus.OK);
        when(sessionService.archiveSession(String.valueOf(sessionId))).thenReturn(successResponse);
        ResponseEntity<AppResponse> responseEntity = sessionController.archiveSession(String.valueOf(sessionId));
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

        AppResponse appResponse = responseEntity.getBody();
        assertNotNull(appResponse);
        assertEquals("Session archived", appResponse.getMessage());
        assertEquals(HttpStatus.OK, appResponse.getHttpStatus());
        verify(sessionService, times(1)).archiveSession(String.valueOf(sessionId));
    }


}
