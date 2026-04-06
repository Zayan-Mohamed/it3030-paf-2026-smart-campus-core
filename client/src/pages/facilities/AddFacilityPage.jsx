import React, { useState } from "react";
import FacilityForm from "../../components/facilities/FacilityForm";

const AddFacilityPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    facilityType: "",
    location: "",
    capacity: "",
    status: "",
    imageUrl: "",
    amenities: "",
    availableFrom: "",
    availableTo: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
    alert("Facility created successfully");
  };

  return (
    <div>
      <h1>Add Facility</h1>
      <FacilityForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create Facility"
      />
    </div>
  );
};

export default AddFacilityPage;