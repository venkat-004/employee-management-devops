package com.example.employee_management_devops.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.employee_management_devops.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}