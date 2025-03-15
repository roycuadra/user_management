import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load users'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editId) {
        // Update existing user
        await axios.put(`http://localhost:5000/api/users/${editId}`, form);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
        setEditId(null);
      } else {
        // Add new user
        await axios.post("http://localhost:5000/api/users", form);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: editId ? 'Failed to update user' : 'Failed to add user'
      });
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`http://localhost:5000/api/users/${id}`);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted.',
            timer: 1500,
            showConfirmButton: false
          });
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete user'
          });
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <div className="container mx-auto mt-4" style={{ maxWidth: "800px" }}>
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">{editId ? "Edit User" : "Add New User"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary float-end"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : editId ? "Update User" : "Add User"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Users</h3>
              
              {isLoading && users.length === 0 ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-muted text-center my-3">No users found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;