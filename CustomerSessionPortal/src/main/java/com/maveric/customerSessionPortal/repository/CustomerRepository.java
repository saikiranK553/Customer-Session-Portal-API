package com.maveric.customerSessionPortal.repository;

import com.maveric.customerSessionPortal.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {}
