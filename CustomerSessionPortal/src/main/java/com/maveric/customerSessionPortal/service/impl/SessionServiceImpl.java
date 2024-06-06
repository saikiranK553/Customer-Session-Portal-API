package com.maveric.customerSessionPortal.service.impl;

import com.maveric.customerSessionPortal.constant.Message;
import com.maveric.customerSessionPortal.dto.FlagArchiveSession;
import com.maveric.customerSessionPortal.dto.SessionRequestDto;
import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import com.maveric.customerSessionPortal.entity.*;
import com.maveric.customerSessionPortal.exception.CustomerNotFoundException;
import com.maveric.customerSessionPortal.exception.SessionException;
import com.maveric.customerSessionPortal.repository.CustomerRepository;
import com.maveric.customerSessionPortal.repository.SessionHistoryRepository;
import com.maveric.customerSessionPortal.repository.SessionRepository;
import com.maveric.customerSessionPortal.service.SessionService;
import jakarta.transaction.Transactional;
import org.hibernate.service.spi.ServiceException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private SessionHistoryRepository sessionHistoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AppResponse appResponse;

    private final int maximumDormantDays;

    @Autowired
    public SessionServiceImpl(@Value("${maximumDormantDays}") int maximumDormantDays,SessionRepository sessionRepository, ModelMapper modelMapper) {
        this.maximumDormantDays = maximumDormantDays;
        this.sessionRepository = sessionRepository;
        this.modelMapper = modelMapper;
    }

    /**
     * Creates a new session based on the provided session request data.
     *
     * @param sessionRequestDto The data containing the details of the new session to be created.
     * @return The response containing information about the created session.
     * @throws NullPointerException if the associated customer for the session is not found.
     */

    @Override

    public SessionResponseDto createsession(SessionRequestDto sessionRequestDto) {
        try {
            Session createSession = modelMapper.map(sessionRequestDto, Session.class);
            Customer customer = customerRepository.findById(sessionRequestDto.getCustomerId())
                    .orElseThrow(() -> new CustomerNotFoundException(Message.CUSTOMER_NOT_FOUND));

            createSession.setCustomer(customer);
            createSession.setCreatedOn(LocalDateTime.now());
            createSession.setUpdatedOn(LocalDateTime.now());
            createSession.setStatus(SessionStatus.A);
            Session savedSession = sessionRepository.save(createSession);
            return modelMapper.map(savedSession, SessionResponseDto.class);

        } catch (CustomerNotFoundException e) {
            throw new ServiceException(Message.NOT_CREATED + e.getMessage());
        }
    }

    /**
     * Retrieves a paginated list of sessions based on the provided session status.
     *
     * @param status   The status of the sessions to retrieve.
     * @param pageable The pagination configuration for the result.
     * @return A paginated list of SessionResponseDto containing information about the sessions.
     */
    @Override
    public Page<SessionResponseDto>getSessions(SessionStatus status, Pageable pageable, String sortBy, String sortDir) throws SessionException{
        List<Session> sessions = sessionRepository.findByStatus(status);
        SessionStatus sessionStatus;
        if ("A".equalsIgnoreCase(String.valueOf(status))) {
            sessionStatus = SessionStatus.A;
        } else if ("X".equalsIgnoreCase(String.valueOf(status))) {
            sessionStatus = SessionStatus.X;
        }
        else {
            throw new SessionException(Message.SESSION_NOT_FOUND);
        }
        Page<SessionResponseDto> responseDto =
                new PageImpl<>(
                        sessions.stream()
                                .map(session -> modelMapper.map(session, SessionResponseDto.class))
                                .collect(Collectors.toList()),
                        pageable,
                        sessions.size());
        for (SessionResponseDto dto : responseDto.getContent()) {
            LocalDateTime updatedOn = dto.getUpdatedOn();
            LocalDateTime achievableDate = updatedOn.plusDays(maximumDormantDays);
            if (achievableDate.isBefore(LocalDateTime.now())){
                dto.setFlagArchiveSession(FlagArchiveSession.Y);
            }
            else {
                dto.setFlagArchiveSession(FlagArchiveSession.N);
            }

        }
        List<SessionResponseDto> sessionResponseDtos = sessions.stream()
                .map(session -> modelMapper.map(session, SessionResponseDto.class))
                .collect(Collectors.toList());
        Comparator<SessionResponseDto> sessionResponseDtoComparator;
        if ("desc".equalsIgnoreCase(sortDir)) {
            sessionResponseDtoComparator = Comparator.comparing(SessionResponseDto::getSessionId).reversed();
        } else {
            sessionResponseDtoComparator = Comparator.comparing(SessionResponseDto::getSessionId);
        }

        sessionResponseDtos.sort(sessionResponseDtoComparator);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sessionResponseDtos.size());
        List<SessionResponseDto> pagedSessionResponseDtos = sessionResponseDtos.subList(start, end);
        return new PageImpl<>(pagedSessionResponseDtos, pageable, sessionResponseDtos.size());

    }

    /**
     * Updates a session with the provided session ID and session request data.
     *
     * @param sessionId         The ID of the session to be updated.
     * @param sessionRequestDTO The data containing the updates for the session.
     * @return A SessionResponseDto containing information about the updated session.
     * @throws SessionException if the session or associated customer is not found.
     * @throws ServiceException    if there is a service-level issue while trying to update the session.
     */
    @Override
    public SessionResponseDto updateSession(String sessionId, SessionRequestDto sessionRequestDTO) {
        try {
            Session session = sessionRepository.findById(Long.valueOf(sessionId))
                    .orElseThrow(() -> new SessionException(Message.SESSION_NOT_FOUND));
            Customer customer = customerRepository.findById(sessionRequestDTO.getCustomerId())
                    .orElseThrow(() -> new SessionException(Message.CUSTOMER_NOT_FOUND));

            Session updatedSession = modelMapper.map(sessionRequestDTO, Session.class); // Use modelMapper to convert DTO to Session entity
            updatedSession.setSessionId((session.getSessionId())); // Make sure to set the ID from the existing session
            updatedSession.setCustomer(customer);
            updatedSession.setUpdatedOn(LocalDateTime.now());
            Session savedSession = sessionRepository.save(updatedSession);
            SessionResponseDto sessionResponseDTO = modelMapper.map(savedSession, SessionResponseDto.class);
            sessionResponseDTO.setFlagArchiveSession(FlagArchiveSession.N);
            return sessionResponseDTO;

        } catch (ServiceException e) {
            throw new ServiceException(e.getMessage());
        }
    }

    /**
     * Archives a session with the provided session ID.
     *
     * @param sessionId The ID of the session to be archived.
     * @return An AppResponse indicating the successful archiving of the session.
     * @throws SessionException if the session to archive is not found.
     * @throws ServiceException    if there is a service-level issue while trying to archive the session.
     */
    @Override
    public AppResponse archiveSession(String sessionId) {
        try {
            Session session = sessionRepository.findById(Long.valueOf(sessionId))
                    .orElseThrow(() -> new SessionException(Message.SESSION_NOT_FOUND));

            if (session.getCreatedOn() == null) {

                throw new ServiceException(Message.DATEMISSING);
            }

            if (session.getStatus()==SessionStatus.A) {
                session.setStatus(SessionStatus.X);
                sessionRepository.save(session);

                AppResponse response = new AppResponse();
                response.setMessage(Message.ARCHIVED);
                response.setHttpStatus(HttpStatus.OK);
                return response;
            } else {
                AppResponse response = new AppResponse();
                response.setMessage(Message.NONARCHIVABLE);
                response.setHttpStatus(HttpStatus.OK);
                return response;
            }

        } catch (NumberFormatException e) {
            throw new RuntimeException(Message.CONFIGERROR, e);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage());
        }

    }

    /**
     * Deletes a session by moving it to session history before deletion.
     *
     * @param sessionToDeleteId The ID of the session to be deleted and moved to history.
     * @throws ServiceException if there is an issue while performing the delete and move operation.
     */

    @Override
    @Transactional
    public void deleteSessionAndMoveToHistory(Long sessionToDeleteId) {

        Optional<Session> session = sessionRepository.findById(sessionToDeleteId);
        Session sessionToDelete = new Session();
        if(session.isPresent())
         sessionToDelete = session.get();
        else
            throw new SessionException(Message.SESSION_NOT_FOUND);
        sessionToDelete.setStatus(SessionStatus.D);
        SessionHistory sessionHistory = modelMapper.map(sessionToDelete, SessionHistory.class);
        sessionHistoryRepository.save(sessionHistory);
    }

}