package com.maveric.customerSessionPortal.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_history")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SessionHistory {


    @Id
    private Long sessionId;
    @Column(name = "Session_Name")
    private String sessionName;
    @Column(name = "Customer_Id")
    private Long customerId;
    @Column(name = "Remarks")
    private String remarks;
    @Column(name = "created_By")
    private String createdBy;
    @Column(name = "Created_On")
    private LocalDateTime createdOn;
    @Column(name = "Deleted_On")
    private LocalDateTime deletedOn;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private SessionStatus status;

}
