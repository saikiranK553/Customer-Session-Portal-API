package com.maveric.customerSessionPortal.dto;

import com.maveric.customerSessionPortal.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionResponseDto {

    private Long sessionId;
    private String sessionName;
    private String customerName;
    private String remarks;
    private String createdBy;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private SessionStatus status;
    private FlagArchiveSession flagArchiveSession;

}
