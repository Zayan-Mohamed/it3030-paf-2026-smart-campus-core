import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacilityFilterBar from "../../components/facilities/FacilityFilterBar";
import FacilityTable from "../../components/facilities/FacilityTable";

const FacilityListPage = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    facilityType: "",
    status: "",
    minCapacity: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/facilities");
      if (!response.ok) {
        throw new Error("Failed to load facilities");
      }

      const data = await response.json();
      setFacilities(data || []);
      setFilteredFacilities(data || []);
    } catch (err) {
      setError(err?.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    let filtered = [...facilities];

    if (filters.name) {
      filtered = filtered.filter((facility) =>
        (facility.name || "").toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((facility) =>
        (facility.location || "").toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.facilityType) {
      filtered = filtered.filter((facility) =>
        facility.facilityType === filters.facilityType
      );
    }

    if (filters.status) {
      filtered = filtered.filter((facility) =>
        facility.status === filters.status
      );
    }

    if (filters.minCapacity) {
      const minCapacity = parseInt(filters.minCapacity, 10);

      if (!isNaN(minCapacity)) {
        filtered = filtered.filter((facility) =>
          Number(facility.capacity || 0) >= minCapacity
        );
      }
    }

    setFilteredFacilities(filtered);
  }, [facilities, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      location: "",
      facilityType: "",
      status: "",
      minCapacity: ""
    });
  };

  const handleEdit = (id) => {
    navigate(`/facilities/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/facilities/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData && (errorData.message || JSON.stringify(errorData.details))) ||
            "Failed to delete facility"
        );
      }

      setFacilities((prev) => prev.filter((facility) => facility.id !== id));
    } catch (err) {
      setError(err?.message || "Failed to delete facility");
    }
  };

  const handleAdd = () => {
    navigate("/facilities/new");
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>Facilities & Assets</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Facility
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <FacilityFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="loading">Loading facilities...</div>
      ) : (
        <FacilityTable
          facilities={filteredFacilities}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FacilityListPage;