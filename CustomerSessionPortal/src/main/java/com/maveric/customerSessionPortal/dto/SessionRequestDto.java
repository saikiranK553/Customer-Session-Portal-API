package com.maveric.customerSessionPortal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Component
@Data
@EqualsAndHashCode(of = "sessionId")
public class SessionRequestDto {

  private Long sessionId;
  @NotBlank(message = "Session Name required")
  private String sessionName;
  @NotNull(message = "Customer ID required")
  private Long customerId;
  @NotBlank(message = "Remarks are required")
  private String remarks;
  @NotNull(message = "Created By Manager Not found")
  private String createdBy;

}
