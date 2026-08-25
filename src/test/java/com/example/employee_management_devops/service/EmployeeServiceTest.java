package com.example.employee_management_devops.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.employee_management_devops.entity.Employee;
import com.example.employee_management_devops.repository.EmployeeRepository;

@ExtendWith(MockitoExtension.class)
 class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee();

        employee.setId(1L);
        employee.setName("John");
        employee.setEmail("john@gmail.com");
        employee.setDepartment("IT");
        employee.setSalary(50000.0);
    }

    // Test 1: Create Employee
    @Test
    void testSaveEmployee() {

        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.saveEmployee(employee);

        assertEquals(employee, result);

        verify(employeeRepository).save(employee);
    }

    // Test 2: Get All Employees
    @Test
    void testGetAllEmployees() {

        Employee employee2 = new Employee();

        employee2.setId(2L);
        employee2.setName("David");
        employee2.setEmail("david@gmail.com");
        employee2.setDepartment("HR");
        employee2.setSalary(45000.0);

        List<Employee> employees = Arrays.asList(employee, employee2);

        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getName());
        assertEquals("David", result.get(1).getName());

        verify(employeeRepository).findAll();
    }

    // Test 3: Get Employee By ID
    @Test
    void testGetEmployeeById() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        Optional<Employee> result = employeeService.getEmployeeById(1L);

        assertTrue(result.isPresent());
        assertEquals("John", result.get().getName());
        assertEquals("john@gmail.com", result.get().getEmail());

        verify(employeeRepository).findById(1L);
    }

    // Test 4: Update Employee
    @Test
    void testUpdateEmployee() {

        Employee updatedEmployee = new Employee();

        updatedEmployee.setName("John Updated");
        updatedEmployee.setEmail("johnupdated@gmail.com");
        updatedEmployee.setDepartment("Finance");
        updatedEmployee.setSalary(60000.0);

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(employeeRepository.save(employee))
                .thenReturn(employee);

        Employee result = employeeService.updateEmployee(1L, updatedEmployee);

        assertEquals("John Updated", result.getName());
        assertEquals("johnupdated@gmail.com", result.getEmail());
        assertEquals("Finance", result.getDepartment());
        assertEquals(60000.0, result.getSalary());

        verify(employeeRepository).findById(1L);
        verify(employeeRepository).save(employee);
    }

    // Test 5: Update Employee When ID Does Not Exist
    @Test
    void testUpdateEmployeeNotFound() {

        when(employeeRepository.findById(99L))
                .thenReturn(Optional.empty());

        try {
            employeeService.updateEmployee(99L, employee);
        } catch (RuntimeException e) {
            assertEquals("Employee not found with id: 99", e.getMessage());
        }

        verify(employeeRepository).findById(99L);
    }

    // Test 6: Delete Employee
    @Test
    void testDeleteEmployee() {

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).deleteById(1L);
    }
}
