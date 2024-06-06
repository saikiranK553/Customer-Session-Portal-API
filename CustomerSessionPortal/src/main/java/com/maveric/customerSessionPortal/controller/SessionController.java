package com.maveric.customerSessionPortal.controller;

import com.maveric.customerSessionPortal.constant.Message;
import com.maveric.customerSessionPortal.dto.SessionRequestDto;
import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import com.maveric.customerSessionPortal.entity.AppResponse;
import com.maveric.customerSessionPortal.entity.SessionStatus;
import com.maveric.customerSessionPortal.exception.SessionException;
import com.maveric.customerSessionPortal.service.SessionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@Slf4j
@RequestMapping("/sessions")
@Validated
@CrossOrigin(origins = "http://localhost:4200")
public class SessionController {

  @Autowired
  private SessionService sessionService;

  /**
   * Creates a new session based on the provided session data.
   * @param sessionDto The data for the new session. Must not be null and should pass validation.
   * @return A ResponseEntity containing the response data, HTTP status, and headers.
   */
  @PostMapping()
  public ResponseEntity<AppResponse> createSession(
          @RequestBody @Valid SessionRequestDto sessionDto) {
    SessionResponseDto sessionResponseDto = sessionService.createsession(sessionDto);
    AppResponse appResponse = new AppResponse();
    appResponse.setMessage(Message.CREATED);
    appResponse.setHttpStatus(HttpStatus.CREATED);
    appResponse.setSessionResponseDto(sessionResponseDto);
    log.info(appResponse.toString());
    return new ResponseEntity<>(appResponse, HttpStatus.CREATED);
  }

  /**
   * Retrieve sessions based on the provided status and pagination.
   *
   * @param status The status of the sessions to retrieve. Should be one of "A" or "X".
   * @param page   The page number for pagination. Default is 0.
   * @param size   The number of items per page for pagination. Default is 10.
   * @return A ResponseEntity containing a paginated list of SessionResponseDto objects.
   * Returns HTTP status OK if successful, or BAD_REQUEST if the provided status is invalid.
   */

  @GetMapping("/status/{status}")
  @ResponseBody
  public ResponseEntity<Page<SessionResponseDto>> getSessions(
          @PathVariable String status,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "SessionId") String sortBy,
          @RequestParam(defaultValue = "desc") String sortDir) {

    Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(sortDir), sortBy);
    Page<SessionResponseDto> sessionResponsePage =
            sessionService.getSessions(SessionStatus.valueOf(status), pageable, sortBy, sortDir);

    return new ResponseEntity<>(sessionResponsePage, HttpStatus.OK);
  }

  /**
   * Delete a session and move it to the history.
   * @param sessionId The ID of the session to be deleted and moved to history.
   * @return A ResponseEntity with a message indicating the success of the operation.
   * Returns HTTP status NOT_FOUND if the sessionId is null.
   */

  @DeleteMapping("/{sessionId}")
  @ResponseBody
  public ResponseEntity<String> deleteSessionAndMoveToHistory(@PathVariable Long sessionId) {

    if (Objects.isNull(sessionId)) {
      return ResponseEntity.notFound().build();
    }

    sessionService.deleteSessionAndMoveToHistory(sessionId);

    return ResponseEntity.ok(Message.DELETED);
  }

  /**
   * Updates a session with the provided session ID and new session data.
   *
   * @param sessionId The unique identifier of the session to be updated.
   * @param sessionRequestDTO The data containing the updates for the session.
   * @return A ResponseEntity containing an AppResponse with information about the updated session.
   * @throws SessionException if there is an issue with the API request.
   * @throws ServiceException if there is a service-level issue while trying to update the session.
   */
  @PutMapping("/{sessionId}")
  public ResponseEntity<AppResponse> updateSession(@PathVariable String sessionId, @RequestBody @Valid SessionRequestDto sessionRequestDTO) {
    try {
      SessionResponseDto sessionResponseDTO = sessionService.updateSession(sessionId,sessionRequestDTO);

      if (Objects.isNull(sessionId)) {
        return ResponseEntity.notFound().build();
      }
      AppResponse appResponse=new AppResponse();
      appResponse.setMessage(Message.UPDATED);
      appResponse.setHttpStatus(HttpStatus.OK);
      appResponse.setSessionResponseDto(sessionResponseDTO);

      return ResponseEntity.status(HttpStatus.OK).body(appResponse);
    } catch (SessionException e) {
      throw new SessionException(e.getMessage());
    } catch (ServiceException e) {
      throw new ServiceException(e.getMessage());
    }

  }


  /**
   * Archives a session based on the provided session ID.
   *
   * @param sessionId The unique identifier of the session to be archived.
   * @return A ResponseEntity containing an AppResponse with information about the archived session.
   * @throws SessionException if there is an issue with the API request.
   * @throws ServiceException if there is a service-level issue while trying to archive the session.
   */

  @PostMapping("/archive/{sessionId}")
  public ResponseEntity<AppResponse> archiveSession(@PathVariable String sessionId) {
    try {
      AppResponse response = sessionService.archiveSession(sessionId);
      return new ResponseEntity<>(response, response.getHttpStatus());
    } catch (ServiceException e) {
      AppResponse errorResponse = new AppResponse();
      errorResponse.setMessage(Message.ERROR + e.getMessage());
      errorResponse.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return new ResponseEntity<>(errorResponse, errorResponse.getHttpStatus());
    }
  }


}
