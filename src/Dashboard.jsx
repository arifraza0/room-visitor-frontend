import { useEffect, useState } from "react";

function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Fetch visitors
  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/visitors`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVisitors(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Mark Exit
  const handleExit = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/visitors/${id}/exit`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Visitor exit recorded successfully!");
        fetchVisitors();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Exit update nahi ho raha!");
    }
  };

  // Delete Visitor
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this visitor?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
     `${import.meta.env.VITE_API_URL}/api/visitors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Visitor deleted successfully!");
        fetchVisitors();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Visitor delete nahi ho raha!");
    }
  };

  // Load visitors
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Today's date
  const today = new Date();

  // Currently inside
  const insideVisitors = visitors.filter(
    (visitor) => visitor.status === "Inside"
  );

  // Today's visitors
  const todayVisitors = visitors.filter((visitor) => {
    const entryDate = new Date(visitor.entryTime);

    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });

  // Date filter
  const dateFilteredVisitors = visitors.filter((visitor) => {
    const entryDate = new Date(visitor.entryTime);

    if (dateFilter === "all") {
      return true;
    }

    if (dateFilter === "today") {
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    }

    if (dateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      return (
        entryDate.getDate() === yesterday.getDate() &&
        entryDate.getMonth() === yesterday.getMonth() &&
        entryDate.getFullYear() === yesterday.getFullYear()
      );
    }

    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      return entryDate >= sevenDaysAgo && entryDate <= today;
    }

    return true;
  });

  // Search filter
  const filteredVisitors = dateFilteredVisitors.filter(
    (visitor) => {
      const text = search.toLowerCase();

      return (
        visitor.name.toLowerCase().includes(text) ||
        visitor.mobile.includes(text) ||
        visitor.purpose.toLowerCase().includes(text) ||
        (visitor.organization &&
          visitor.organization.toLowerCase().includes(text)) ||
        (visitor.personToMeet &&
          visitor.personToMeet.toLowerCase().includes(text))
      );
    }
  );

  return (
    <div className="dashboard">

      <h1>Visitor Dashboard</h1>

      {/* Statistics */}
      <div className="stats">

        <div className="card">
          <h3>Total Visitors</h3>
          <h2>{visitors.length}</h2>
        </div>

        <div className="card">
          <h3>Today's Visitors</h3>
          <h2>{todayVisitors.length}</h2>
        </div>

        <div className="card">
          <h3>Currently Inside</h3>
          <h2>{insideVisitors.length}</h2>
        </div>

        <div className="card">
          <h3>Exited</h3>
          <h2>
            {visitors.length - insideVisitors.length}
          </h2>
        </div>

      </div>

      {/* Date Filter */}
      <div style={{ marginBottom: "20px" }}>

        <label
          style={{
            fontWeight: "bold",
            marginRight: "10px"
          }}
        >
          Filter by Date:
        </label>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
        >
          <option value="all">All Visitors</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 Days</option>
        </select>

      </div>

      {/* Search */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search by name, mobile or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Table */}
      <h2>Visitors</h2>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Organization</th>
              <th>Purpose</th>
              <th>Person To Meet</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredVisitors.length === 0 ? (

              <tr>
                <td colSpan="9">
                  No visitors found
                </td>
              </tr>

            ) : (

              filteredVisitors.map((visitor) => (

                <tr key={visitor._id}>

                  <td>{visitor.name}</td>

                  <td>{visitor.mobile}</td>

                  <td>
                    {visitor.organization || "-"}
                  </td>

                  <td>{visitor.purpose}</td>

                  <td>
                    {visitor.personToMeet || "-"}
                  </td>

                  <td>
                    {new Date(
                      visitor.entryTime
                    ).toLocaleString()}
                  </td>

                  <td>
                    {visitor.exitTime
                      ? new Date(
                          visitor.exitTime
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <span className="status">
                      {visitor.status}
                    </span>
                  </td>

                  <td>

                    {/* View */}
                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedVisitor(visitor)
                      }
                    >
                      View
                    </button>

                    {/* Exit */}
                    <button
                      className="exit-btn"
                      onClick={() =>
                        handleExit(visitor._id)
                      }
                      disabled={
                        visitor.status === "Exited"
                      }
                    >
                      {visitor.status === "Exited"
                        ? "Exited"
                        : "Mark Exit"}
                    </button>

                    {/* Delete */}
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(visitor._id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Visitor Details Modal */}
      {selectedVisitor && (

        <div className="modal">

          <div className="modal-content">

            <h2>Visitor Details</h2>

            <p>
              <strong>Name:</strong>{" "}
              {selectedVisitor.name}
            </p>

            <p>
              <strong>Mobile:</strong>{" "}
              {selectedVisitor.mobile}
            </p>

            <p>
              <strong>Organization:</strong>{" "}
              {selectedVisitor.organization || "-"}
            </p>

            <p>
              <strong>Purpose:</strong>{" "}
              {selectedVisitor.purpose}
            </p>

            <p>
              <strong>Person To Meet:</strong>{" "}
              {selectedVisitor.personToMeet || "-"}
            </p>

            <p>
              <strong>Entry Time:</strong>{" "}
              {new Date(
                selectedVisitor.entryTime
              ).toLocaleString()}
            </p>

            <p>
              <strong>Exit Time:</strong>{" "}
              {selectedVisitor.exitTime
                ? new Date(
                    selectedVisitor.exitTime
                  ).toLocaleString()
                : "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedVisitor.status}
            </p>

            <button
              className="enter-btn"
              onClick={() =>
                setSelectedVisitor(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;