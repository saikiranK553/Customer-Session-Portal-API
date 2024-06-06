package com.maveric.customerSessionPortal.entity;


import com.maveric.customerSessionPortal.dto.SessionResponseDto;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor
@Component
@EqualsAndHashCode
public class AppResponse {
    private String message;
    private HttpStatus httpStatus;
    private SessionResponseDto sessionResponseDto;

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public SessionResponseDto getSessionResponseDto() {
        return sessionResponseDto;
    }

    public void setSessionResponseDto(SessionResponseDto sessionResponseDto) {
        this.sessionResponseDto = sessionResponseDto;
    }
}
