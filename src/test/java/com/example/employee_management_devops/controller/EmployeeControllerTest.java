package com.example.employee_management_devops.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.employee_management_devops.entity.Employee;
import com.example.employee_management_devops.service.EmployeeService;


@ExtendWith(MockitoExtension.class)
 class EmployeeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private Employee employee;

    private ObjectMapper objectMapper;


    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(employeeController)
                .build();

        objectMapper = new ObjectMapper();

        employee = new Employee();

        employee.setId(1L);
        employee.setName("John");
        employee.setEmail("john@gmail.com");
        employee.setDepartment("IT");
        employee.setSalary(50000.0);
    }


    // ------------------------------------------------
    // 1. CREATE EMPLOYEE
    // ------------------------------------------------

    @Test
    void testCreateEmployee() throws Exception {

        when(employeeService.saveEmployee(any(Employee.class)))
                .thenReturn(employee);

        mockMvc.perform(
                post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(employee))
        )
        .andExpect(status().isCreated());
    }


    // ------------------------------------------------
    // 2. GET ALL EMPLOYEES
    // ------------------------------------------------

    @Test
    void testGetAllEmployees() throws Exception {

        Employee employee2 = new Employee();

        employee2.setId(2L);
        employee2.setName("David");
        employee2.setEmail("david@gmail.com");
        employee2.setDepartment("HR");
        employee2.setSalary(45000.0);

        when(employeeService.getAllEmployees())
                .thenReturn(Arrays.asList(employee, employee2));

        mockMvc.perform(
                get("/api/employees")
        )
        .andExpect(status().isOk());
    }


    // ------------------------------------------------
    // 3. GET EMPLOYEE BY ID - FOUND
    // ------------------------------------------------

    @Test
    void testGetEmployeeById() throws Exception {

        when(employeeService.getEmployeeById(1L))
                .thenReturn(Optional.of(employee));

        mockMvc.perform(
                get("/api/employees/1")
        )
        .andExpect(status().isOk());
    }


    // ------------------------------------------------
    // 4. GET EMPLOYEE BY ID - NOT FOUND
    // ------------------------------------------------

    @Test
    void testGetEmployeeByIdNotFound() throws Exception {

        when(employeeService.getEmployeeById(99L))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                get("/api/employees/99")
        )
        .andExpect(status().isNotFound());
    }


    // ------------------------------------------------
    // 5. UPDATE EMPLOYEE - SUCCESS
    // ------------------------------------------------

    @Test
    void testUpdateEmployee() throws Exception {

        Employee updatedEmployee = new Employee();

        updatedEmployee.setId(1L);
        updatedEmployee.setName("John Updated");
        updatedEmployee.setEmail("johnupdated@gmail.com");
        updatedEmployee.setDepartment("Finance");
        updatedEmployee.setSalary(60000.0);

        when(employeeService.updateEmployee(
                any(Long.class),
                any(Employee.class)
        ))
        .thenReturn(updatedEmployee);

        mockMvc.perform(
                put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedEmployee))
        )
        .andExpect(status().isOk());
    }


    // ------------------------------------------------
    // 6. UPDATE EMPLOYEE - NOT FOUND
    // ------------------------------------------------

    @Test
    void testUpdateEmployeeNotFound() throws Exception {

        Employee updatedEmployee = new Employee();

        updatedEmployee.setName("Unknown");
        updatedEmployee.setEmail("unknown@gmail.com");
        updatedEmployee.setDepartment("IT");
        updatedEmployee.setSalary(50000.0);

        when(employeeService.updateEmployee(
                any(Long.class),
                any(Employee.class)
        ))
        .thenThrow(new RuntimeException(
                "Employee not found with id: 99"
        ));

        mockMvc.perform(
                put("/api/employees/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedEmployee))
        )
        .andExpect(status().isNotFound());
    }


    // ------------------------------------------------
    // 7. DELETE EMPLOYEE - SUCCESS
    // ------------------------------------------------

    @Test
    void testDeleteEmployee() throws Exception {

        when(employeeService.getEmployeeById(1L))
                .thenReturn(Optional.of(employee));

        doNothing()
                .when(employeeService)
                .deleteEmployee(1L);

        mockMvc.perform(
                delete("/api/employees/1")
        )
        .andExpect(status().isNoContent());
    }


    // ------------------------------------------------
    // 8. DELETE EMPLOYEE - NOT FOUND
    // ------------------------------------------------

    @Test
    void testDeleteEmployeeNotFound() throws Exception {

        when(employeeService.getEmployeeById(99L))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                delete("/api/employees/99")
        )
        .andExpect(status().isNotFound());
    }
}