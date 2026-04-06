import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FacilityFilterBar from "../../components/facilities/FacilityFilterBar";
import FacilityTable from "../../components/facilities/FacilityTable";
import { Facility, FacilityStatus, FacilityType } from "../../types";

interface FacilityFilters {
  name: string;
  location: string;
  facilityType: string;
  status: string;
  minCapacity: string;
}

const initialFilters: FacilityFilters = {
  name: "",
  location: "",
  facilityType: "",
  status: "",
  minCapacity: ""
};

const FacilityListPage: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacilityFilters>(initialFilters);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/facilities");
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            (errorData && (errorData.message || JSON.stringify(errorData.details))) ||
              "Failed to load facilities"
          );
        }

        const data = await response.json();
        setFacilities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load facilities");
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const matchesName = facility.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesLocation = facility.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      const matchesType = filters.facilityType
        ? facility.facilityType === filters.facilityType
        : true;
      const matchesStatus = filters.status
        ? facility.status === filters.status
        : true;
      const matchesCapacity = filters.minCapacity
        ? facility.capacity >= parseInt(filters.minCapacity, 10)
        : true;

      return (
        matchesName &&
        matchesLocation &&
        matchesType &&
        matchesStatus &&
        matchesCapacity
      );
    });
  }, [facilities, filters]);

  const handleFilterChange = (field: keyof FacilityFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleAdd = () => {
    navigate("/facilities/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/facilities/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
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
      setError(err instanceof Error ? err.message : "Failed to delete facility");
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>Facilities & Assets</h1>
        <button onClick={handleAdd} className="btn">
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
