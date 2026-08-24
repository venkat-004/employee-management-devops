import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8081/api/employees";

function App() {
  const [activeAction, setActiveAction] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // ADD EMPLOYEE
  // ==============================

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const employee = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        salary: Number(formData.salary),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      setMessage("Employee added successfully! ✅");

      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to add employee ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GET ALL EMPLOYEES
  // ==============================

  const handleGetEmployees = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();

      setEmployees(data);
      setActiveAction("get");

      setMessage(
        `${data.length} employee(s) retrieved successfully! ✅`
      );
    } catch (error) {
      console.error(error);
      setMessage("Failed to get employees ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UPDATE EMPLOYEE
  // ==============================

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      setMessage("Please enter Employee ID ❌");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const employee = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        salary: Number(formData.salary),
      };

      const response = await fetch(
        `${API_URL}/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      setMessage("Employee updated successfully! ✅");

      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update employee ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE EMPLOYEE
  // ==============================

  const handleDeleteEmployee = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      setMessage("Please enter Employee ID ❌");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Employee ID ${formData.id}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/${formData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setMessage("Employee deleted successfully! ✅");

      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete employee ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESET FORM
  // ==============================

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      department: "",
      salary: "",
    });
  };

  // ==============================
  // SHOW ADD FORM
  // ==============================

  const showAddForm = () => {
    resetForm();
    setMessage("");
    setActiveAction("add");
    setEmployees([]);
  };

  // ==============================
  // SHOW UPDATE FORM
  // ==============================

  const showUpdateForm = () => {
    resetForm();
    setMessage("");
    setActiveAction("update");
    setEmployees([]);
  };

  // ==============================
  // SHOW DELETE FORM
  // ==============================

  const showDeleteForm = () => {
    resetForm();
    setMessage("");
    setActiveAction("delete");
    setEmployees([]);
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            E
          </div>

          <div>
            <h1>
              Employee Management
            </h1>

            <p>
              Spring Boot + React + MySQL
            </p>
          </div>

        </div>

        <div className="connection-status">
          <span></span>
          Backend Connected
        </div>

      </header>


      {/* MAIN */}

      <main className="container">

        <section className="hero">

          <div>

            <p className="eyebrow">
              EMPLOYEE SYSTEM
            </p>

            <h2>
              Manage Employees
              <br />
              <span>Effortlessly.</span>
            </h2>

            <p className="hero-text">
              Add, view, update and delete employee
              records directly through your database.
            </p>

          </div>

        </section>


        {/* FOUR BUTTONS */}

        <section className="operations">

          <button
            className={`operation-card add ${
              activeAction === "add" ? "selected" : ""
            }`}
            onClick={showAddForm}
          >

            <div className="operation-icon">
              ＋
            </div>

            <div>
              <h3>
                Add Employee
              </h3>

              <p>
                Create a new employee
              </p>
            </div>

          </button>


          <button
            className={`operation-card get ${
              activeAction === "get" ? "selected" : ""
            }`}
            onClick={handleGetEmployees}
          >

            <div className="operation-icon">
              ≡
            </div>

            <div>
              <h3>
                Get All Employees
              </h3>

              <p>
                View all employees
              </p>
            </div>

          </button>


          <button
            className={`operation-card update ${
              activeAction === "update" ? "selected" : ""
            }`}
            onClick={showUpdateForm}
          >

            <div className="operation-icon">
              ✎
            </div>

            <div>
              <h3>
                Update Employee
              </h3>

              <p>
                Modify employee details
              </p>
            </div>

          </button>


          <button
            className={`operation-card delete ${
              activeAction === "delete" ? "selected" : ""
            }`}
            onClick={showDeleteForm}
          >

            <div className="operation-icon">
              🗑
            </div>

            <div>
              <h3>
                Delete Employee
              </h3>

              <p>
                Remove an employee
              </p>
            </div>

          </button>

        </section>


        {/* MESSAGE */}

        {message && (

          <div
            className={`message ${
              message.includes("❌")
                ? "error"
                : "success"
            }`}
          >
            {message}
          </div>

        )}


        {/* ADD FORM */}

        {activeAction === "add" && (

          <section className="panel">

            <div className="panel-header">

              <div className="panel-number">
                01
              </div>

              <div>
                <h2>
                  Add New Employee
                </h2>

                <p>
                  Enter the employee details below.
                </p>
              </div>

            </div>


            <form
              className="employee-form"
              onSubmit={handleAddEmployee}
            >

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="employee@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select department
                    </option>

                    <option value="Engineering">
                      Engineering
                    </option>

                    <option value="HR">
                      HR
                    </option>

                    <option value="Finance">
                      Finance
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Sales">
                      Sales
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Salary
                  </label>

                  <input
                    type="number"
                    name="salary"
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <button
                className="primary-btn"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Adding..."
                  : "Add Employee →"}

              </button>

            </form>

          </section>

        )}


        {/* GET EMPLOYEES */}

        {activeAction === "get" && (

          <section className="panel">

            <div className="panel-header">

              <div className="panel-number">
                02
              </div>

              <div>
                <h2>
                  All Employees
                </h2>

                <p>
                  Employee records retrieved from MySQL.
                </p>
              </div>

              <div className="employee-count">
                {employees.length} Employees
              </div>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>EMPLOYEE</th>
                    <th>EMAIL</th>
                    <th>DEPARTMENT</th>
                    <th>SALARY</th>
                  </tr>

                </thead>

                <tbody>

                  {employees.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="empty"
                      >
                        No employees found
                      </td>
                    </tr>

                  ) : (

                    employees.map(
                      (employee) => (

                        <tr key={employee.id}>

                          <td>
                            <span className="id-badge">
                              #{employee.id}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {employee.name}
                            </strong>
                          </td>

                          <td>
                            {employee.email}
                          </td>

                          <td>
                            <span className="department-badge">
                              {employee.department}
                            </span>
                          </td>

                          <td>
                            <strong>
                              ₹
                              {Number(
                                employee.salary || 0
                              ).toLocaleString("en-IN")}
                            </strong>
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* UPDATE FORM */}

        {activeAction === "update" && (

          <section className="panel">

            <div className="panel-header">

              <div className="panel-number">
                03
              </div>

              <div>
                <h2>
                  Update Employee
                </h2>

                <p>
                  Enter the employee ID and new details.
                </p>
              </div>

            </div>


            <form
              className="employee-form"
              onSubmit={handleUpdateEmployee}
            >

              <div className="form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="number"
                  name="id"
                  placeholder="Enter employee ID"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter updated name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter updated email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select department
                    </option>

                    <option value="Engineering">
                      Engineering
                    </option>

                    <option value="HR">
                      HR
                    </option>

                    <option value="Finance">
                      Finance
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Sales">
                      Sales
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Salary
                  </label>

                  <input
                    type="number"
                    name="salary"
                    placeholder="Enter updated salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <button
                className="primary-btn update-btn"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Updating..."
                  : "Update Employee →"}

              </button>

            </form>

          </section>

        )}


        {/* DELETE FORM */}

        {activeAction === "delete" && (

          <section className="panel delete-panel">

            <div className="panel-header">

              <div className="panel-number">
                04
              </div>

              <div>
                <h2>
                  Delete Employee
                </h2>

                <p>
                  Enter the ID of the employee you want to remove.
                </p>
              </div>

            </div>


            <form
              className="delete-form"
              onSubmit={handleDeleteEmployee}
            >

              <div className="delete-warning">
                <span>
                  ⚠
                </span>

                <div>
                  <strong>
                    This action cannot be undone.
                  </strong>

                  <p>
                    The employee will be permanently
                    removed from the database.
                  </p>
                </div>

              </div>


              <div className="form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="number"
                  name="id"
                  placeholder="Enter employee ID"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />

              </div>


              <button
                className="delete-btn"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Deleting..."
                  : "Delete Employee →"}

              </button>

            </form>

          </section>

        )}

      </main>


      {/* FOOTER */}

      <footer>
        <span>
          Employee Management System
        </span>

        <span>
          React • Spring Boot • MySQL
        </span>
      </footer>

    </div>
  );
}

export default App;