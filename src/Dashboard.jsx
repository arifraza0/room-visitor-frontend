
import { useEffect, useState } from "react";

function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/visitors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleExit = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/visitors/${id}/exit`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    fetchVisitors();
  }, []);

  const today = new Date();

  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const insideVisitors = visitors.filter(
    (visitor) => visitor.status === "Inside"
  );

  const todayVisitors = visitors.filter((visitor) => {
    const entryDate = new Date(visitor.entryTime);
    return isSameDate(entryDate, today);
  });

  const dateFilteredVisitors = visitors.filter((visitor) => {
    const entryDate = new Date(visitor.entryTime);

    if (dateFilter === "all") {
      return true;
    }

    if (dateFilter === "today") {
      return isSameDate(entryDate, today);
    }

    if (dateFilter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      return isSameDate(entryDate, yesterday);
    }

    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return entryDate >= sevenDaysAgo && entryDate <= today;
    }

    return true;
  });

  const filteredVisitors = dateFilteredVisitors.filter((visitor) => {
    const text = search.toLowerCase();

    return (
      visitor.name?.toLowerCase().includes(text) ||
      visitor.mobile?.includes(text) ||
      visitor.purpose?.toLowerCase().includes(text) ||
      visitor.organization?.toLowerCase().includes(text) ||
      visitor.personToMeet?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="dashboard">

      <div className="dashboard-heading">
        <div>
          <h1>Visitor Dashboard</h1>
          <p>Manage and monitor all room visitors</p>
        </div>
      </div>
      <button
  className="refresh-btn"
  onClick={fetchVisitors}
>
  🔄 Refresh
</button>

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
          <h2>{visitors.length - insideVisitors.length}</h2>
        
        </div>

      </div>

      <div className="dashboard-controls">

        <div className="date-filter">
          <label>Filter by Date</label>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Visitors</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>

       <input
  className="search-box"
  type="text"
  placeholder="Search visitor..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      </div>

      <div className="visitor-list-heading">
        <h2>Visitor Records</h2>
        <span>{filteredVisitors.length} records</span>
      </div>

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
                <td colSpan="9" className="no-data">
                  No visitors found
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr key={visitor._id}>

                  <td>
                    <strong>{visitor.name}</strong>
                  </td>

                  <td>{visitor.mobile}</td>

                  <td>
                    {visitor.organization || "-"}
                  </td>

                  <td>{visitor.purpose}</td>

                  <td>
                    {visitor.personToMeet || "-"}
                  </td>

                  <td>
                    {new Date(visitor.entryTime).toLocaleString()}
                  </td>

                  <td>
                    {visitor.exitTime
                      ? new Date(visitor.exitTime).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={
                        visitor.status === "Inside"
                          ? "status status-inside"
                          : "status status-exited"
                      }
                    >
                      {visitor.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() => setSelectedVisitor(visitor)}
                    >
                      View
                    </button>

                    <button
                      className="exit-btn"
                      onClick={() => handleExit(visitor._id)}
                      disabled={visitor.status === "Exited"}
                    >
                      {visitor.status === "Exited"
                        ? "Exited"
                        : "Mark Exit"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(visitor._id)}
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

      {selectedVisitor && (
        <div
          className="modal"
  //       <div
  // className="modal-overlay"
          onClick={() => setSelectedVisitor(null)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

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
              onClick={() => setSelectedVisitor(null)}
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
