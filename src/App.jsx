import { useState } from "react";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    organization: "",
    purpose: "",
    personToMeet: ""
  });

  const [page, setPage] = useState("entry");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/visitors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Visitor saved successfully!");

        setFormData({
          name: "",
          mobile: "",
          organization: "",
          purpose: "",
          personToMeet: ""
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Backend se connection nahi ho raha!");
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  return (
    <div>

      {/* Header */}
      <div className="header">
        <h1>Room Visitor Management System</h1>
        <p>Visitor Entry Portal</p>
      </div>

      {/* Navbar */}
      <div className="navbar">

        <button onClick={() => setPage("entry")}>
          Visitor Entry
        </button>

        <button onClick={() => setPage("admin")}>
          Admin Dashboard
        </button>

      </div>

      {/* Visitor Entry */}
      {page === "entry" && (
        <div className="entry-section">

          <div className="form-card">

            <h2>Visitor Entry</h2>

            <p className="form-subtitle">
              Please enter your details before entering the room.
            </p>

            <form onSubmit={handleSubmit}>

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  setFormData({
                    ...formData,
                    mobile: value
                  });
                }}
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />

              <label>College / Organization</label>

              <input
                type="text"
                name="organization"
                placeholder="Enter college or organization"
                value={formData.organization}
                onChange={handleChange}
              />

              <label>Purpose of Visit</label>

              <input
                type="text"
                name="purpose"
                placeholder="Why are you visiting?"
                value={formData.purpose}
                onChange={handleChange}
                required
              />

              <label>Person to Meet</label>

              <input
                type="text"
                name="personToMeet"
                placeholder="Enter person's name"
                value={formData.personToMeet}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="enter-btn"
              >
                Enter Room
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Admin Section */}
      {page === "admin" && !isAdminLoggedIn && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {page === "admin" && isAdminLoggedIn && (
        <>
          <Dashboard />

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <button
              className="delete-btn"
              onClick={() => {
                localStorage.removeItem("token");
                setIsAdminLoggedIn(false);
                setPage("entry");
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default App;