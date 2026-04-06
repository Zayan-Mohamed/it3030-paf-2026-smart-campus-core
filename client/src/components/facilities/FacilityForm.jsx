import React, { useState } from "react";

const FacilityForm = ({ formData, onChange, onSubmit, submitLabel }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    onChange(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.facilityType) {
      newErrors.facilityType = "Facility type is required";
    }
    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    if (!formData.imageUrl?.trim()) {
      newErrors.imageUrl = "Image URL is required";
    }
    if (!formData.amenities?.trim()) {
      newErrors.amenities = "Amenities is required";
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = "Available from time is required";
    }
    if (!formData.availableTo) {
      newErrors.availableTo = "Available to time is required";
    }

    // Time validation
    if (formData.availableFrom && formData.availableTo) {
      if (formData.availableFrom >= formData.availableTo) {
        newErrors.availableTo = "Available to time must be after available from time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        {errors.name && <span>{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        {errors.description && <span>{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="facilityType">Facility Type</label>
        <select
          id="facilityType"
          value={formData.facilityType || ""}
          onChange={(e) => handleInputChange("facilityType", e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="CONFERENCE_ROOM">CONFERENCE_ROOM</option>
          <option value="LABORATORY">LABORATORY</option>
          <option value="SPORTS_HALL">SPORTS_HALL</option>
          <option value="AUDITORIUM">AUDITORIUM</option>
          <option value="STUDY_ROOM">STUDY_ROOM</option>
          <option value="COMPUTER_LAB">COMPUTER_LAB</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.facilityType && <span>{errors.facilityType}</span>}
      </div>

      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={formData.location || ""}
          onChange={(e) => handleInputChange("location", e.target.value)}
        />
        {errors.location && <span>{errors.location}</span>}
      </div>

      <div>
        <label htmlFor="capacity">Capacity</label>
        <input
          type="number"
          id="capacity"
          value={formData.capacity || ""}
          onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
        />
        {errors.capacity && <span>{errors.capacity}</span>}
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status || ""}
          onChange={(e) => handleInputChange("status", e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </select>
        {errors.status && <span>{errors.status}</span>}
      </div>

      <div>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          value={formData.imageUrl || ""}
          onChange={(e) => handleInputChange("imageUrl", e.target.value)}
        />
        {errors.imageUrl && <span>{errors.imageUrl}</span>}
      </div>

      <div>
        <label htmlFor="amenities">Amenities</label>
        <input
          type="text"
          id="amenities"
          value={formData.amenities || ""}
          onChange={(e) => handleInputChange("amenities", e.target.value)}
        />
        {errors.amenities && <span>{errors.amenities}</span>}
      </div>

      <div>
        <label htmlFor="availableFrom">Available From</label>
        <input
          type="time"
          id="availableFrom"
          value={formData.availableFrom || ""}
          onChange={(e) => handleInputChange("availableFrom", e.target.value)}
        />
        {errors.availableFrom && <span>{errors.availableFrom}</span>}
      </div>

      <div>
        <label htmlFor="availableTo">Available To</label>
        <input
          type="time"
          id="availableTo"
          value={formData.availableTo || ""}
          onChange={(e) => handleInputChange("availableTo", e.target.value)}
        />
        {errors.availableTo && <span>{errors.availableTo}</span>}
      </div>

      <button type="submit">{submitLabel}</button>
    </form>
  );
};

export default FacilityForm;