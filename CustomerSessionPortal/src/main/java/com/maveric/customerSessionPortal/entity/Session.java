package com.maveric.customerSessionPortal.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "session_seq")
@SequenceGenerator(name = "session_seq", sequenceName = "session_seq", allocationSize = 1)

private Long sessionId;
    @Column(name = "Session_Name")
    private String sessionName;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;
    @Column(name = "Remarks")
    private String remarks;
    @Column(name = "created_By")
    private String createdBy;
    @Column(name = "Created_On")
    @CreatedDate
    private LocalDateTime createdOn;
    @Column(name = "Updated_On")
    @CreatedDate
    private LocalDateTime updatedOn;
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private SessionStatus status;

    @PrePersist
    protected void onCreate() {
        createdOn = LocalDateTime.now();
        updatedOn = LocalDateTime.now();
        status = SessionStatus.A;
    }



}

